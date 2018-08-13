$(function () {
    document.getElementById('climateSERVSelectAOI').onchange = function () {

        if ($('#loadGeoJsonDialog').dialog('instance')) { $('#loadGeoJsonDialog').dialog('close'); }
        map.getLayer("areaPicker").setVisibility(false);
        cleardrawnassets();

        if ($('#getInfoToggle').prop("checked")) {
            $('#getInfoToggle').prop("checked", false);
            getInfoToggle(false);
        }
    }
});
$(function () {
    document.getElementById('climateSERVSelectType').onchange = function () {
        openSelectedPanel();
    }
});
$(function () {
    $.ajax({
        url: 'https://climateserv.servirglobal.net/chirps/getClimateScenarioInfo/',
        type: "get",
        cache: false,
        async: true,
        crossDomain: true,
        success: function (data, status, error) {
            cInfo = JSON.parse(data);
            ClimateModelInfo = JSON.parse(cInfo.climate_DataTypeCapabilities[0].current_Capabilities);
            buildClimateModelRange(cInfo.climate_DataTypeCapabilities);
            //processClimateModelInfo(data);
        },
        error: function (data, status, error) {
            console.log('error', data, status, error);
        }
    });
});
function select_dataType_Changed(theOptionValue) {

    if (theOptionValue == "ClimateModel") {
        $('#defaultDataForm').hide();
        $('#climateModelForm').show("slow", function () {
            // Animation complete.
        });
        selectedDataType = theOptionValue;
    }
    else if (theOptionValue == "xx") {
        $('#climateModelForm').hide();
        $('#defaultDataForm').hide();
        selectedDataType = null;
    }
    else {
        $('#climateModelForm').hide();
        $('#defaultDataForm').show("slow", function () {
            // Animation complete.
        });
        selectedDataType = theOptionValue;
    }
}


function buildClimateModelRange(capabilitiesArray) {
    var caps = JSON.parse(cInfo.climate_DataTypeCapabilities[0].current_Capabilities);
    var startDate = new Date(caps.startDateTime.replaceAll('_', '-'));
    var endDate = new Date(caps.endDateTime.replaceAll('_', '-'));
    addOptionsToEnsemble(caps.ensemble, startDate, endDate);
}
function addOptionsToEnsemble(which, sDate, eDate) {
    //sDate.setHours(eDate.getHours());
    for (var i = sDate; i <= eDate; i.setDate(i.getDate() + 1)) {
        var month = (i.getUTCMonth() + 1).toString().length < 2 ? '0' + (i.getUTCMonth() + 1) : (i.getUTCMonth() + 1);
        var date = (i.getUTCDate() + 1).toString().length < 2 ? '0' + (i.getUTCDate() + 1) : (i.getUTCDate() + 1);
        $('#forecastRangeFrommenu').append($('<option>', {
            value: month + '-' + date + '-' + i.getUTCFullYear(),
            text: (i.getUTCMonth() + 1) + '-' + i.getUTCDate() + '-' + i.getUTCFullYear()
        }));
        $('#forecastRangeTomenu').append($('<option>', {
            value: month + '-' + date + '-' + i.getUTCFullYear(),
            text: (i.getUTCMonth() + 1) + '-' + i.getUTCDate() + '-' + i.getUTCFullYear()
        }));
    }
}

function submitJob() {
    if (preFlightCheck()) {
        $('#page-cover').show();
        if ($('#ismobile').is(':visible')) {
            toggleParam('close', null);
            setPanelTitle('');
        }
        var url;
        var req_Data;
        if (currentType == 'rainfall') {
            url = 'https://climateserv.servirglobal.net/chirps/submitMonthlyRainfallAnalysisRequest/?';
            req_Data =
                {
                    'custom_job_type': 'monthly_rainfall_analysis',
                    'seasonal_start_date': ClimateModelInfo.startDateTime,
                    'seasonal_end_date': ClimateModelInfo.endDateTime
                };
        }
        else if (currentType == 'data') {
            url = 'https://climateserv.servirglobal.net/chirps/submitDataRequest/?';
            req_Data =
                {
                    'datatype': selectedDataType == 'ClimateModel' ? parseInt($('#ensemblemenu').val()) + parseInt($('#variablemenu').val()) : selectedDataType,
                    'begintime': selectedDataType == 'ClimateModel' ? $('#forecastRangeFrommenu').val().replaceAll('-', '/') : $.datepicker.formatDate('mm/dd/yy', $('#datepickerbegin').datepicker('getDate')),
                    'endtime': selectedDataType == 'ClimateModel' ? $('#forecastRangeTomenu').val().replaceAll('-', '/') : $.datepicker.formatDate('mm/dd/yy', $('#datepickerend').datepicker('getDate')),
                    'intervaltype': 0,
                    'operationtype': $('#operationmenu').val(),
                    'dateType_Category': selectedDataType == 'ClimateModel' ? 'ClimateModel' : 'default',
                    'isZip_CurrentDataType': false
                };
        }
        if (url) {
            if (selectFeatureEnabled) {
                req_Data['layerid'] = $('#selectFeatureTypeRequest').val();
                req_Data['featureids'] = activeFeatures;
            }
            else if (jsonfeatures) {
                req_Data['geometry'] = JSON.stringify(JSON.parse(ourpolygon).features[0].geometry);
            }
            else {
                mycoodrs = [gwebMercatorUtils.webMercatorToGeographic(AOIGeometery).rings[0]];
                req_Data['geometry'] = JSON.stringify({
                    'type': 'Polygon',
                    'coordinates': mycoodrs
                });
            }
            $.ajax({
                url: url,
                type: "get",
                data: req_Data,
                async: true,
                crossDomain: true
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log('fail');
                rData = jqXHR;
                console.warn(jqXHR + textStatus + errorThrown);
                $('#page-cover').hide();
            }).done(function (data, _textStatus, _jqXHR) {
                if (data.errMsg) {
                    console.log('error');
                    rData = data;
                    console.warn(data.errMsg);

                } else {
                    rData = data;
                    try {

                        getStatusUpdate(JSON.parse(data)[0])
                    }
                    catch (e) {
                        $('#page-cover').hide();
                    }
                }
            });
        }
    }
    else {
        return;
    }

}
function preFlightCheck() {
    var passed = false;
    var hasAOI = false;
    var hasParameters = false;
    // 1) check to make sure AOI is selected
    hasAOI = AOIGeometery == null ? false : true;
    if (!hasAOI) {
        hasAOI = activeFeatures == '' ? false : true;
    }
    if (!hasAOI) {
        hasAOI = ourpolygon == '' ? false : true;
    }
    // 2) check parameters exist
    if (currentType == 'none') {
        hasParameters = false;
    }
    else if (currentType == 'rainfall') {
        hasParameters = true;
    }
    else if (currentType == 'data') {
        if (selectedDataType != null && $("#datepickerbegin").datepicker().val()) {
            hasParameters = true;
        }
        else if (selectedDataType == 'ClimateModel') {
            hasParameters = true;
        }
    }



    if (hasAOI && hasParameters) {
        return true;
    }
    else {
        if (!hasAOI) {
            alert('Please select an AOI first!');
        }
        else {
            alert('You must select all parameters before you submit the job.');
        }
        return false;
    }

}

function getStatusUpdate(which) {
    $.ajax(
        {
            url: 'https://climateserv.servirglobal.net/chirps/getDataRequestProgress/?',
            type: "get",
            data: { 'id': which },
            jsonpCallback: 'successCallback',
            async: true,
            crossDomain: true,
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                document.getElementById("myBar").style.width = JSON.parse(result)[0] + '%';
                if (JSON.parse(result)[0] != 100) {
                    if (JSON.parse(result)[0] == -1 && stopIt == 5) {
                        stopIt = 0;
                    }
                    else {
                        stopIt++;
                        window.setTimeout(function () { getStatusUpdate(which); }, 250);
                    }
                }
                else {
                    getDataFromRequest(which);
                }
                console.log(result);


            },
            error: function (request, error) {
                try {
                    console.log("Agriserv, Check Job Status: Got an error when communicating with the server.  Error Message: " + error);
                }
                catch (exerrr) { }

            },
            successCallback: function () {

            }
        });
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function getDataFromRequest(which) {
    $.ajax(
        {
            url: 'https://climateserv.servirglobal.net/chirps/getDataFromRequest/?',
            type: "get",
            data: { 'id': which },
            jsonpCallback: 'successCallback',
            async: true,
            crossDomain: true,
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (result) {
                $('#page-cover').hide();
                if (currentType == 'data') {
                    myreturn = JSON.parse(result);
                    var processedData = preprocessData(JSON.parse(result).data);
                    $('.esriPopupWrapper').height('auto');
                    map.infoWindow.setTitle($('#typemenu :selected').text());
                    //
                    map.infoWindow.show();
                    chartData(processedData);
                    adjustInfoWindow();
                }
                else if (currentType == 'rainfall') {
                    myreturn = JSON.parse(result.replaceAll('NaN', '"NaN"'));
                    //alert('check return data');
                    graphable_obj = build_MonthlyRainFall_Analysis_Graphable_Object(myreturn);
                    seriesOptions = [];
                    var SeasonalFcstAvg = [];
                    var LongTermAverage = [];
                    var _25thPercentile = [];
                    var _75thPercentile = [];

                    for (var i = 0; i < graphable_obj.length; i++) {
                        var mData = [Date.UTC(graphable_obj[i].Month_Year.split('-')[1], ((graphable_obj[i].Month_Year.split('-')[0] * 1) - 1)), graphable_obj[i].Monthly_Rainfall_mm];
                        switch (graphable_obj[i].data_series_type) {
                            case 'SeasonalFcstAvg':
                                SeasonalFcstAvg.push(mData);
                                break;
                            case 'LongTermAverage':
                                LongTermAverage.push(mData);
                                break;
                            case '25thPercentile':
                                _25thPercentile.push(mData);
                                break;
                            case '75thPercentile':
                                _75thPercentile.push(mData);
                                break;
                        }
                    }
                    seriesOptions.push({
                        data: SeasonalFcstAvg,
                        name: 'SeasonalFcstAvg',
                        marker: { symbol: 'circle' }
                    });
                    seriesOptions.push({
                        data: LongTermAverage,
                        name: 'LongTermAverage',
                        marker: { symbol: 'circle' }
                    });
                    seriesOptions.push({
                        data: _25thPercentile,
                        name: '25thPercentile',
                        marker: { symbol: 'circle' }
                    });
                    seriesOptions.push({
                        data: _75thPercentile,
                        name: '75thPercentile',
                        marker: { symbol: 'circle' }
                    });
                    map.infoWindow.show();
                    map.infoWindow.setTitle('Monthly Rainfall Analysis');
                    createChart_For_MonthlyAnalysis_Types(seriesOptions);
                }
            },
            error: function (request, error) {
                try {
                    console.log("Agriserv, Get data from Request: Got an error when communicating with the server.  Error Message: " + error);
                }
                catch (exErrAjax_ErrorReporting) { }
                $('#page-cover').hide();
            },
            successCallback: function () {

            }
        });
}
function get_current_year() {
    var current_year = new Date().getFullYear();
    return current_year;
}
function get_next_year() {
    var next_year = get_current_year() + 1;
    return next_year;
}
function make_category_axis_sorting_array_for_MonthlyAnalysis_Types() {
    var return_array = [];

    // Current Year Months
    return_array.push("Jan" + "-" + get_current_year());
    return_array.push("Feb" + "-" + get_current_year());
    return_array.push("Mar" + "-" + get_current_year());
    return_array.push("Apr" + "-" + get_current_year());
    return_array.push("May" + "-" + get_current_year());
    return_array.push("June" + "-" + get_current_year());
    return_array.push("July" + "-" + get_current_year());
    return_array.push("Aug" + "-" + get_current_year());
    return_array.push("Sept" + "-" + get_current_year());
    return_array.push("Oct" + "-" + get_current_year());
    return_array.push("Nov" + "-" + get_current_year());
    return_array.push("Dec" + "-" + get_current_year());

    // Next Year's Months
    return_array.push("Jan" + "-" + get_next_year());
    return_array.push("Feb" + "-" + get_next_year());
    return_array.push("Mar" + "-" + get_next_year());
    return_array.push("Apr" + "-" + get_next_year());
    return_array.push("May" + "-" + get_next_year());
    return_array.push("June" + "-" + get_next_year());
    return_array.push("July" + "-" + get_next_year());
    return_array.push("Aug" + "-" + get_next_year());
    return_array.push("Sept" + "-" + get_next_year());
    return_array.push("Oct" + "-" + get_next_year());
    return_array.push("Nov" + "-" + get_next_year());
    return_array.push("Dec" + "-" + get_next_year());

    return return_array;
}
function createChart_For_MonthlyAnalysis_Types(chart_data) {



    Highcharts.chart('container', {
        chart: {
            panning: true,
            zoomType: 'x'
        },
        mapNavigation: {
            enabled: true,
            enableButtons: false
        },
        title: {
            text: 'Monthly Rainfall Analysis'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area or scroll to zoom in' : 'Pinch the chart to zoom in'
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: "rgba(255,255,255,0)",
            borderRadius: 0,
            shadow: true,
            useHTML: true,
            backgroundColor: "rgba(255,255,255,1)",
            //formatter: function () {
            //    return '<div class="tooltop">' + this.point.name + '<br />' + '<b>' + Highcharts.numberFormat(this.y).replace(",", " ") + ' Kč [' + Highcharts.numberFormat(this.percentage, 2) + '%]</b></div>';
            //}
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 30 * 24 * 3600 * 1000,
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%b \'%y',
                year: '%Y'
            }
        },
        yAxis: {
            title: {
                text: getLabelByType()
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },

        series: chart_data
    });
}

// MONTHLY ANALYSIS SUPPORT METHODS         START

// These two are set by the monthly analysis 'submit data request'
// var monthlyRainfallAnalysis_Start_Date = "";  // expected format is:
// var monthlyRainfallAnalysis_End_Date = "";

function get_Year_From_YYYY_MM_DD_String(YYYY_MM_DD_String) {
    //str.split("_");
    var yearPart = (YYYY_MM_DD_String.split("_")[0] * 1);
    var monthPart = (YYYY_MM_DD_String.split("_")[1] * 1);
    var dayPart = (YYYY_MM_DD_String.split("_")[2] * 1);
    //var retDate = new Date(yearPart, monthPart - 1, dayPart);
    //return retDate;
    return yearPart;
}

function get_Month_From_YYYY_MM_DD_String(YYYY_MM_DD_String) {
    //str.split("_");
    var yearPart = (YYYY_MM_DD_String.split("_")[0] * 1);
    var monthPart = (YYYY_MM_DD_String.split("_")[1] * 1);
    var dayPart = (YYYY_MM_DD_String.split("_")[2] * 1);
    //var retDate = new Date(yearPart, monthPart - 1, dayPart);
    //return retDate;
    return monthPart;
}

// monthNumberString is a value between "1" and "12"  ("1" == Jan)
function get_category_month_name_for_monthNumberString(monthNumberString) {
    if (monthNumberString == "1") { return "Jan"; }
    if (monthNumberString == "2") { return "Feb"; }
    if (monthNumberString == "3") { return "Mar"; }
    if (monthNumberString == "4") { return "Apr"; }
    if (monthNumberString == "5") { return "May"; }
    if (monthNumberString == "6") { return "June"; }
    if (monthNumberString == "7") { return "July"; }
    if (monthNumberString == "8") { return "Aug"; }
    if (monthNumberString == "9") { return "Sept"; }
    if (monthNumberString == "10") { return "Oct"; }
    if (monthNumberString == "11") { return "Nov"; }
    if (monthNumberString == "12") { return "Dec"; }
    return "unknown";
}

// Gets the list of Index items that contain Seasonal_Forecast data
function monthlyRainfall_Analysis__Get_SeasonalForecast_IndexList(raw_data_obj) {
    var ret_index_list = [];
    for (var i = 0; i < raw_data_obj.MonthlyAnalysisOutput.dataset_info_list.length; i++) {
        var current_DatasetItem = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[i];
        if (current_DatasetItem.out_subTypeName == "SEASONAL_FORECAST") {
            ret_index_list.push(i);
        }
    }
    return ret_index_list;
}
// Gets the index which contains CHIRPS data
function monthlyRainfall_Analysis__Get_Chirps_Index(raw_data_obj) {
    for (var i = 0; i < raw_data_obj.MonthlyAnalysisOutput.dataset_info_list.length; i++) {
        var current_DatasetItem = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[i];
        if (current_DatasetItem.out_subTypeName == "CHIRPS_REQUEST") {
            return i;
        }
    }
    return -1;
}



// Compute a monthly average of all seasonal forecast datasets for any given month.
// Usage Examples
// monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, "1"); // Seasonal Forecase Ensemebles average of averages for JAN
// monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, "2"); // Seasonal Forecase Ensemebles average of averages for FEB
// monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, "5"); // Seasonal Forecase Ensemebles average of averages for MAY
function monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, monthString) {

    braw.push(raw_data_obj);

    var month_index = (monthString * 1) - 1;

    // Get the full list of averages for all ensembles for a given month
    var indexList_for_SeasonalForecast_Datasets = monthlyRainfall_Analysis__Get_SeasonalForecast_IndexList(raw_data_obj);
    var singleMonth_SeasonalForecast_List_Of_Averages = [];  // List of all the averages for March (for example) for ALL ensembles.
    for (var i = 0; i < indexList_for_SeasonalForecast_Datasets.length; i++) {
        var current_dataset_index = indexList_for_SeasonalForecast_Datasets[i];
        var theAverage = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[current_dataset_index].avg_percentiles_dataLines[month_index].col02_MonthlyAverage == "nan" ? 0 : raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[current_dataset_index].avg_percentiles_dataLines[month_index].col02_MonthlyAverage;
        var col02_MonthlyAverage = theAverage * 1;
        singleMonth_SeasonalForecast_List_Of_Averages.push(col02_MonthlyAverage);
        // raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[0].avg_percentiles_dataLines[2] // March
        //avg_percentiles_dataLines
    }
    monthlies.push(singleMonth_SeasonalForecast_List_Of_Averages);
    // Compute the average of all the averages.
    var sum_of_averages = 0;
    var itemCount = 0;
    for (var j = 0; j < singleMonth_SeasonalForecast_List_Of_Averages.length; j++) {
        sum_of_averages = sum_of_averages + singleMonth_SeasonalForecast_List_Of_Averages[j];
        itemCount = itemCount + 1;
    }

    // don't divide by 0!
    if (itemCount < 1) { itemCount = 1 }
    var finalAverage = (sum_of_averages / itemCount);

    return finalAverage;

}


// Gets the LongTermAverage value from the CHIRPS dataset for any given month.
// monthlyRainfall_Analysis__Get_Chirps_LongTermAverage_ForMonth(raw_data_obj, "5");  // MAY, ChirpsDataset - Col02_MonthlyAvg
function monthlyRainfall_Analysis__Get_Chirps_LongTermAverage_ForMonth(raw_data_obj, monthString) {
    var month_index = (monthString * 1) - 1;
    var chirps_dataset_index = monthlyRainfall_Analysis__Get_Chirps_Index(raw_data_obj);
    var col02_MonthlyAverage = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[chirps_dataset_index].avg_percentiles_dataLines[month_index].col02_MonthlyAverage * 1;
    return col02_MonthlyAverage;
}

// Gets the LongTermAverage value from the CHIRPS dataset for any given month.
// monthlyRainfall_Analysis__Get_Chirps_25thPercentile_ForMonth(raw_data_obj, "5");  // MAY, ChirpsDataset - Col03_25thPercentile
function monthlyRainfall_Analysis__Get_Chirps_25thPercentile_ForMonth(raw_data_obj, monthString) {
    var month_index = (monthString * 1) - 1;
    var chirps_dataset_index = monthlyRainfall_Analysis__Get_Chirps_Index(raw_data_obj);
    var col03_25thPercentile = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[chirps_dataset_index].avg_percentiles_dataLines[month_index].col03_25thPercentile * 1;
    return col03_25thPercentile;
}

// Gets the LongTermAverage value from the CHIRPS dataset for any given month.
// monthlyRainfall_Analysis__Get_Chirps_75thPercentile_ForMonth(raw_data_obj, "5");  // MAY, ChirpsDataset - Col04_75thPercentile
function monthlyRainfall_Analysis__Get_Chirps_75thPercentile_ForMonth(raw_data_obj, monthString) {
    var month_index = (monthString * 1) - 1;
    var chirps_dataset_index = monthlyRainfall_Analysis__Get_Chirps_Index(raw_data_obj);
    var col04_75thPercentile = raw_data_obj.MonthlyAnalysisOutput.dataset_info_list[chirps_dataset_index].avg_percentiles_dataLines[month_index].col04_75thPercentile * 1;
    return col04_75thPercentile;
}

// Build the data object that is ready to be graphed for MonthlyRainfallAnalysis
function build_MonthlyRainFall_Analysis_Graphable_Object(raw_data_obj) {

    var ret_dataLines_List = [];


    // Definitions of Data
    // LongTermAverage  (CHIRPS, 50th percentile for each month)

    // Need a controlling mechanism (so we know which Months to use)
    // Setup the Values to submit to the server.
    var seasonal_start_month = "1";  // "1" is Jan
    var seasonal_end_month = "12";   // "12" is Dec
    var monthlyRainfall_Start_Year = 2012;   // Only need this for the x axis on the chart.
    var is_range_in_same_year = true; // Has an affect on how the data is looked up.
    try {
        //var single_climate_model_capabiliites = JSON.parse(climateModelInfo.climate_DataTypeCapabilities[0].current_Capabilities);

        var seasonal_end_date = ClimateModelInfo.endDateTime; //"2017_10_28";

        var year_start = ClimateModelInfo.startDateTime.split('_')[0];
        var year_end = ClimateModelInfo.endDateTime.split('_')[0];
        if (year_start == year_end) { is_range_in_same_year = true; } else { is_range_in_same_year = false; }
        monthlyRainfall_Start_Year = year_start;

        seasonal_start_month = ClimateModelInfo.startDateTime.split('_')[1];
        seasonal_end_month = ClimateModelInfo.endDateTime.split('_')[1];

    }
    catch (err_Getting_Dates_From_Climate_Model_Capabilities) {
        //console.log("Exception hit");

        seasonal_start_month = "1";  // "1" is Jan
        seasonal_end_month = "12";   // "12" is Dec
    }

    // Note, it is possible that the months span over multiple years.

    // Convert Years to numbers
    seasonal_start_month_num = seasonal_start_month * 1;
    seasonal_end_month_num = seasonal_end_month * 1;

    // Need to build the list of months to use in the for loop (months in order so nov, dec, (year 2) jan, feb,.. etc)
    var month_string_list = [];  // looks like this ["2", "3", "4", etc]  or [ "11", "12", "1", "2", etc]  when done.
    var current_month_num = seasonal_start_month_num;
    var current_year_num = monthlyRainfall_Start_Year;

    // Creating a new way to tell what number is next?


    // Always the same year
    // TODO! Code Improvement // The better way to refactor this to remove all the duplicate code is to make a list of objects (kind of like the 'month_string_list' thing above) and use that as the iterator.
    // Also that object should contain definitions for what to pass into the labels....
    for (var aMonth = 1; aMonth < 13; aMonth++) {
        if (is_range_in_same_year == true) {
            // Always the same year
            // if(current_month_num <= seasonal_end_month_num)  // Just does all 12 months for my example dataset
            //if( (current_month_num <= seasonal_end_month_num) && (aMonth >= current_month_num) )
            if (current_month_num <= seasonal_end_month_num) {

                // Process this month, convert back to a string
                var current_Month_String = current_month_num + "";
                var currentMonth_CurrentSeasonalForecast_Average_Value = monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_LongTermAverage_Value = monthlyRainfall_Analysis__Get_Chirps_LongTermAverage_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_25thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_25thPercentile_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_75thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_75thPercentile_ForMonth(raw_data_obj, current_Month_String);

                var current_Month_Name = get_category_month_name_for_monthNumberString(current_Month_String);
                var current_Year_as_String = current_year_num + ""; //monthlyRainfall_Start_Year + "";
                var current_Month_Year_Value = current_Month_String + "-" + current_Year_as_String;   // (Expecting "May" + "-" + 2017)  (to turn into "May-2017")

                // CREATE THE OBJECTS (DATA LINES)
                //
                // Would normally create like this,     some_object = { prop_name:value, prop2_name:value_2 } but I don't know if the dimple chart can handle that type.
                //
                // SEASONAL FORECAST - Only one type of these - SeasonalFcstAvg
                var data_line_object__SeasonalFcstAvg = [];
                data_line_object__SeasonalFcstAvg['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__SeasonalFcstAvg['data_series_type'] = "SeasonalFcstAvg";
                data_line_object__SeasonalFcstAvg['Monthly_Rainfall_mm'] = currentMonth_CurrentSeasonalForecast_Average_Value; //30.510046690142;

                // CHIRPS - LongTermAverage - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_LongTermAverage = [];
                data_line_object__Chirps_LongTermAverage['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_LongTermAverage['data_series_type'] = "LongTermAverage";
                data_line_object__Chirps_LongTermAverage['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_LongTermAverage_Value; // 22.222046690142;

                // CHIRPS - 25thPercentile - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_25thPercentile = [];
                data_line_object__Chirps_25thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_25thPercentile['data_series_type'] = "25thPercentile";
                data_line_object__Chirps_25thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_25thPercentile_Value; // 11.111046690142;

                // CHIRPS - 75thPercentile - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_75thPercentile = [];
                data_line_object__Chirps_75thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_75thPercentile['data_series_type'] = "75thPercentile";
                data_line_object__Chirps_75thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_75thPercentile_Value; // 33.333046690142;


                ret_dataLines_List.push(data_line_object__SeasonalFcstAvg);
                ret_dataLines_List.push(data_line_object__Chirps_LongTermAverage);
                ret_dataLines_List.push(data_line_object__Chirps_25thPercentile);
                ret_dataLines_List.push(data_line_object__Chirps_75thPercentile);

                //alert("Was working with 'monthlyRainfall_Start_Year' ");

                // Increment the month.
                current_month_num = current_month_num + 1;
            }
        }
        else {
            // Not always the same year..
            if (current_year_num == monthlyRainfall_Start_Year) {
                // We are still within the first year.

                // Process this month, convert back to a string
                var current_Month_String = current_month_num + "";
                var currentMonth_CurrentSeasonalForecast_Average_Value = monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_LongTermAverage_Value = monthlyRainfall_Analysis__Get_Chirps_LongTermAverage_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_25thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_25thPercentile_ForMonth(raw_data_obj, current_Month_String);
                var currentMonth_CurrentCHIRPS_75thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_75thPercentile_ForMonth(raw_data_obj, current_Month_String);

                var current_Month_Name = get_category_month_name_for_monthNumberString(current_Month_String);
                var current_Year_as_String = current_year_num + ""; //monthlyRainfall_Start_Year + "";
                var current_Month_Year_Value = current_Month_Name + "-" + current_Year_as_String;   // (Expecting "May" + "-" + 2017)  (to turn into "May-2017")

                // CREATE THE OBJECTS (DATA LINES)
                //
                // Would normally create like this,     some_object = { prop_name:value, prop2_name:value_2 } but I don't know if the dimple chart can handle that type.
                //
                // SEASONAL FORECAST - Only one type of these - SeasonalFcstAvg
                var data_line_object__SeasonalFcstAvg = [];
                data_line_object__SeasonalFcstAvg['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__SeasonalFcstAvg['data_series_type'] = "SeasonalFcstAvg";
                data_line_object__SeasonalFcstAvg['Monthly_Rainfall_mm'] = currentMonth_CurrentSeasonalForecast_Average_Value; //30.510046690142;

                // CHIRPS - LongTermAverage - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_LongTermAverage = [];
                data_line_object__Chirps_LongTermAverage['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_LongTermAverage['data_series_type'] = "LongTermAverage";
                data_line_object__Chirps_LongTermAverage['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_LongTermAverage_Value; // 22.222046690142;

                // CHIRPS - 25thPercentile - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_25thPercentile = [];
                data_line_object__Chirps_25thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_25thPercentile['data_series_type'] = "25thPercentile";
                data_line_object__Chirps_25thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_25thPercentile_Value; // 11.111046690142;

                // CHIRPS - 75thPercentile - Only one type of these - SeasonalFcstAvg
                var data_line_object__Chirps_75thPercentile = [];
                data_line_object__Chirps_75thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                data_line_object__Chirps_75thPercentile['data_series_type'] = "75thPercentile";
                data_line_object__Chirps_75thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_75thPercentile_Value; // 33.333046690142;


                ret_dataLines_List.push(data_line_object__SeasonalFcstAvg);
                ret_dataLines_List.push(data_line_object__Chirps_LongTermAverage);
                ret_dataLines_List.push(data_line_object__Chirps_25thPercentile);
                ret_dataLines_List.push(data_line_object__Chirps_75thPercentile);


                // Increment things
                current_month_num = current_month_num + 1;
                // Check for year change
                if (current_month_num > 12) {
                    // Time to change the year.
                    current_month_num = 1; // Forcing set to Jan
                    current_year_num = current_year_num + 1; // Increasing the year.
                }
            }
            else {
                // We are now in the second year. (Need to make sure we don't do months we don't need or want in the result data...)
                if (current_month_num <= seasonal_end_month_num) {

                    // Process this month, convert back to a string
                    var current_Month_String = current_month_num + "";
                    var currentMonth_CurrentSeasonalForecast_Average_Value = monthlyRainfall_Analysis__Compute_SeasonalForecast_Average_ForMonth(raw_data_obj, current_Month_String);
                    var currentMonth_CurrentCHIRPS_LongTermAverage_Value = monthlyRainfall_Analysis__Get_Chirps_LongTermAverage_ForMonth(raw_data_obj, current_Month_String);
                    var currentMonth_CurrentCHIRPS_25thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_25thPercentile_ForMonth(raw_data_obj, current_Month_String);
                    var currentMonth_CurrentCHIRPS_75thPercentile_Value = monthlyRainfall_Analysis__Get_Chirps_75thPercentile_ForMonth(raw_data_obj, current_Month_String);

                    var current_Month_Name = get_category_month_name_for_monthNumberString(current_Month_String);
                    var current_Year_as_String = current_year_num + ""; //monthlyRainfall_Start_Year + "";
                    var current_Month_Year_Value = current_Month_Name + "-" + current_Year_as_String;   // (Expecting "May" + "-" + 2017)  (to turn into "May-2017")

                    // CREATE THE OBJECTS (DATA LINES)
                    //
                    // Would normally create like this,     some_object = { prop_name:value, prop2_name:value_2 } but I don't know if the dimple chart can handle that type.
                    //
                    // SEASONAL FORECAST - Only one type of these - SeasonalFcstAvg
                    var data_line_object__SeasonalFcstAvg = [];
                    data_line_object__SeasonalFcstAvg['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                    data_line_object__SeasonalFcstAvg['data_series_type'] = "SeasonalFcstAvg";
                    data_line_object__SeasonalFcstAvg['Monthly_Rainfall_mm'] = currentMonth_CurrentSeasonalForecast_Average_Value; //30.510046690142;

                    // CHIRPS - LongTermAverage - Only one type of these - SeasonalFcstAvg
                    var data_line_object__Chirps_LongTermAverage = [];
                    data_line_object__Chirps_LongTermAverage['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                    data_line_object__Chirps_LongTermAverage['data_series_type'] = "LongTermAverage";
                    data_line_object__Chirps_LongTermAverage['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_LongTermAverage_Value; // 22.222046690142;

                    // CHIRPS - 25thPercentile - Only one type of these - SeasonalFcstAvg
                    var data_line_object__Chirps_25thPercentile = [];
                    data_line_object__Chirps_25thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                    data_line_object__Chirps_25thPercentile['data_series_type'] = "25thPercentile";
                    data_line_object__Chirps_25thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_25thPercentile_Value; // 11.111046690142;

                    // CHIRPS - 75thPercentile - Only one type of these - SeasonalFcstAvg
                    var data_line_object__Chirps_75thPercentile = [];
                    data_line_object__Chirps_75thPercentile['Month_Year'] = current_Month_Year_Value; // "May-17"; //TEMP_ITEM_4['date'] = "May-17";
                    data_line_object__Chirps_75thPercentile['data_series_type'] = "75thPercentile";
                    data_line_object__Chirps_75thPercentile['Monthly_Rainfall_mm'] = currentMonth_CurrentCHIRPS_75thPercentile_Value; // 33.333046690142;


                    ret_dataLines_List.push(data_line_object__SeasonalFcstAvg);
                    ret_dataLines_List.push(data_line_object__Chirps_LongTermAverage);
                    ret_dataLines_List.push(data_line_object__Chirps_25thPercentile);
                    ret_dataLines_List.push(data_line_object__Chirps_75thPercentile);

                    // Increment things
                    current_month_num = current_month_num + 1;

                }
            }
        }
    }

    return ret_dataLines_List;
}

function adjustInfoWindow() {
    if (!$('.esriPopupWrapper').isFullyVisible()) {
        $('.esriPopup.esriPopupVisible').css('top', 0); $('.esriPopupWrapper').css('top', 0);
    }
    if ($('.esriPopupWrapper').offset().top < $('#navbar3').height()) {
        $('.esriPopup.esriPopupVisible').css('top', 0); $('.esriPopupWrapper').css('top', 0);
    }
}
jQuery.fn.isFullyVisible = function () {

    var win = $("#map");

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var elemtHeight = this.height();// Get the full height of current element
    elemtHeight = Math.round(elemtHeight);// Round it to whole humber

    var bounds = this.offset();// Coordinates of current element
    bounds.top = bounds.top + elemtHeight;
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

}

function preprocessData(data) {

    var processedData = data.map((val, index, arr) => {
        var operation = $('#operationmenu').val();
        var nulledData;
        if (operation == 0) {
            nulledData = val.value.max < -9000 ? null : val.value.max;
        }
        else if (operation == 1) {
            nulledData = val.value.min < -9000 ? null : val.value.min;
        }
        else if (operation == 5) {
            nulledData = val.value.avg < -9000 ? null : val.value.avg;
        }
        if (isAboveZeroDataType()) {
            var abovezero = nulledData != null && nulledData < 0 ? 0 : nulledData;
            return [val.epochTime * 1000, abovezero];
        }
        else {
            return [val.epochTime * 1000, nulledData];
        }
    });
    outData = processedData;
    return processedData;
}
function isAboveZeroDataType() {
    switch (selectedDataType) {
        case 0:
            return false;
            break;
        case 1:
        case 2:
        case 5:
        case 28:
            return true;
            break;
        case 26:
            return 'Average_IMERG_1_Day(1 mm/day)';
            break;
        case 29:
        case 33:
            return false;
            break;
        case 31:
        case 32:
            return false;
            break;
        default:
            return false;
            break;
    }
}
function chartData(data) {
    Highcharts.chart('container', {
        chart: {
            panning: true,
            zoomType: 'x'
        },
        mapNavigation: {
            enabled: true,
            enableButtons: false
        },
        title: {
            text: $('#typemenu :selected').text()
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area or scroll to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: getLabelByType()
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgb(200, 241, 155)'],
                        [1, Highcharts.Color('rgb(200, 241, 155)').setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2,
                    fillColor: '#00acec'
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: $('#typemenu :selected').text(),
            data: data
        }]
    });
}
function getLabelByType() {
    switch (selectedDataType) {
        case 0:
            return 'Average_CHIRPS_Rainfall(mm/day)';
            break;
        case 1:
        case 2:
        case 5:
        case 28:
            return 'Average';
            break;
        case 26:
            return 'Average_IMERG_1_Day(1 mm/day)';
            break;
        case 29:
        case 33:
            return 'Average';
            break;
        case 31:
        case 32:
            return 'mm/day';
            break;
        default:
            return 'Average';
            break;
    }

}

function giveContentPaneID() {
    var chartpane = $('.contentPane');
    if (chartpane.length == 0) {
        window.setTimeout(function () { giveContentPaneID(); }, 500);
    }
    else {
        chartpane[0].id = 'container';
        $('.esriPopupWrapper').draggable({ handle: "div.titlePane" });
        $("#container.contentPane").css('max-height', ($("#map").height() - 50));
    }
}

$.datepicker._gotoToday = function (id) {
    $(id).datepicker('setDate', new Date()).datepicker('hide').blur().change();
};




function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $('.toasty').fadeIn(400).delay(3000).fadeOut(400);
    var f = evt.dataTransfer.files[0]; // FileList object.

    // files is a FileList of File objects. List some properties.

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (f) {
        return function (e) {
            setPolygonWithGeoJSON(e.target.result);
            $("#loadGeoJsonDialog").dialog("close");
        };
    })(f);
    reader.readAsText(f);
}

function readFile(evt) {
    var files = evt.target.files;
    var file = files[0];
    $('.toasty').fadeIn(400).delay(3000).fadeOut(400);
    var reader = new FileReader();
    reader.onload = function (e) {
        setPolygonWithGeoJSON(e.target.result);
        $("#loadGeoJsonDialog").dialog("close");
    }
    reader.readAsText(file)
}

//Function to handle drag and drop.
function handleDragOver(evt) {
    $('#drop_zone').css('background', 'rgba(231, 255, 198, 1)');

    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function handleDragOut(evty) {
    $('#drop_zone').css('background', 'rgba(0, 172, 236, 0.1411764705882353)');
}

function setPolygonWithGeoJSON(result) {
    ourpolygon = result;

    map.graphics.add(new ggraphic(new gPolygon(ArcgisToGeojsonUtils.geojsonToArcGIS(JSON.parse(result))[0].geometry), gsymbol));

}
window.onload = function () {
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener("dragleave", handleDragOut, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    document.getElementById('file').addEventListener('change', readFile, false);

}