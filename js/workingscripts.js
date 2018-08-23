/****************************
* Variables
****************************/
var theEndMoment;
var isPanelOpen = false;
var activePanel;
var resizetimer;
var activeMenu;
var currentLayer;
var currentTimeSpan;
var completeLayerList = [];
var infoEnabled = false;
var theLatestTime;
var animatetimeout;
var currentDate;
var onlyOne = true;
var firstShowing = true;
var activeFeatures = '';
var currentAction = 'none';
var selectFeatureEnabled = false;
var jsonfeatures = false;
var currentType = 'none';
var selectedDataType = null;
var cInfo;
var ClimateModelInfo;
var mycoodrs;
var stopIt = 0;
var myreturn;
var graphable_obj;
var seriesOptions;
var monthlies = [];
var braw = [];
var outData;
var ourpolygon = '';
var projectedPoint;
var db;


firebase.initializeApp(config);
db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

/****************************
* touch swipe setup
****************************/
$(function () {
    $('.right-panels').css('height', $(window).height() - $('#nav-wrapper').height() + 'px');
    var start = null;
    document.getElementById('panelTitle').addEventListener("touchstart", function (event) {
        if (event.touches.length === 1) {
            //just one finger touched
            start = event.touches.item(0).clientX;
        } else {
            //a second finger hit the screen, abort the touch
            start = null;
        }
    });
    document.getElementById('panelTitle').addEventListener("touchend", function (event) {
        var offset = 100;//at least 100px are a swipe
        if (start) {
            //the only finger that hit the screen left it
            var end = event.changedTouches.item(0).clientX;

            if (end > start + offset) {
                //a left -> right swipe
                if (isPanelOpen == "layers-panel") {
                    panelToggler('info-panel', document.getElementById('ainfo-panel'), 'Information', true);
                    //switch to basemaps
                }
                else if (isPanelOpen == "maps-panel") {
                    //switch to Data Tools
                    panelToggler('layers-panel', document.getElementById('alayers-panel'), 'Data Layers', true);
                }
                else if (isPanelOpen == "download-panel") {
                    //switch to info

                    panelToggler('maps-panel', document.getElementById('amaps-panel'), 'Base Maps', true);
                }
                else if (isPanelOpen == "info-panel") {
                    //switch to layers-panel
                    panelToggler('download-panel', document.getElementById('adownload-panel'), 'Data Tools', true);

                }
            }
            if (end < start - offset) {
                //a right -> left swipe
                if (isPanelOpen == "layers-panel") {
                    panelToggler('maps-panel', document.getElementById('amaps-panel'), 'Base Maps', true);
                    //switch to basemaps
                }
                else if (isPanelOpen == "maps-panel") {
                    //switch to Data Tools
                    panelToggler('download-panel', document.getElementById('adownload-panel'), 'Data Tools', true);
                }
                else if (isPanelOpen == "download-panel") {
                    //switch to info
                    panelToggler('info-panel', document.getElementById('ainfo-panel'), 'Information', true);
                }
                else if (isPanelOpen == "info-panel") {
                    //switch to layers-panel
                    panelToggler('layers-panel', document.getElementById('alayers-panel'), 'Data Layers', true);
                }
            }
        }
    });

});

/****************************
* layer search setup
****************************/
$(function () {
    $.expr[':'].nocasecontains = function (a, i, m) {
        return $(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };
});
$(function () {
    try {
        $('.searchbox-input').on('keyup', function () {
            expandAll();
            var filter = $(this).val(); // get the value of the input, which we filter on
            $('.right-panels #accordion').find(".cblabel:not(:nocasecontains(" + filter + "))").parent().parent().css('display', 'none');
            $('.right-panels #accordion').find(".cblabel:nocasecontains(" + filter + ")").parent().parent().css('display', 'block');
            var thepanels = $('.rcpanel');
            for (var i = 0; i < thepanels.length; i++) {
                if ($(thepanels[i]).children().filter(function () {
                    return $(this).css('display') == 'block';
                }).length > 0) {
                    $(thepanels[i]).parent().show();
                }
                else {
                    $(thepanels[i]).parent().hide();
                }

            }
        });
    }
    catch (e) { }
    try {
        loadmylayers();
    }
    catch (e) { }
    try {
        addExpandIcons();
    } catch (e) { }

});

/****************************
* timeslider setup
****************************/
$(function () {
    theEndMoment = moment().add(6, 'months').format('YYYY-MM-DD');
});

$(function () {
    document.getElementById('activeTimelineLayer').onchange = function () {
        var e = document.getElementById("activeTimelineLayer");
        currentLayer = e.options[e.selectedIndex].value;
        var theLayer = completeLayerList.find(function (x) { if (x.id === currentLayer) { return x; } });
        updateTimeline(moment.utc(theLayer.startDate), moment.utc(theLayer.endDate));

        var withinRange = currentDate >= theLayer.startDate && currentDate <= theLayer.endDate;
        if (withinRange) {
            pickDate(currentDate);
        }
        else {
            pickDate(theLayer.endDate);
        }
    }
});
$(function () {

    var items = new vis.DataSet([
        { id: 'A', content: 'Hindcast', start: '2002-01-01', end: moment().subtract(7, 'days').format('YYYY-MM-DD'), type: 'background' },
        { id: 'B', content: 'Forecast', start: moment().format('YYYY-MM-DD'), end: theEndMoment, type: 'background', className: 'negative' }
    ]);

    var container = document.getElementById('visualization');
    /* These options set the start and end dates as well as the max and min range of the timeline*/
    var options = {
        start: '2016-01-01',
        end: moment().add(3, 'months').format('YYYY-MM-DD'),
        selectable: true,
        min: new Date(2002, 0, 1),
        max: new Date(theEndMoment),
        zoomMin: 86400000 * 7 
    };

    timeline = new vis.Timeline(container, items, options);

    timeline.on('click', function (properties) {

        pickDate(properties);
    });
    timeline.on('rangechanged', function (properties) {
        adjustDateLabelPosition();

    });

});

$(function () {
    $("#datepickerbegin").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd",
        onSelect: function (date) {
            var dt2 = $('#datepickerend');
            var minDate = $(this).datepicker('getDate');
            dt2.datepicker('setDate', minDate);
            dt2.datepicker('option', 'minDate', minDate);
        }
    });
    $("#datepickerend").datepicker({
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd"
    });
});


$(function () {
    resizeUI();
});

$(function () {
    giveContentPaneID();
});

function setupFixMap() {
    if (map) {
        map.on("resize", fixMap);
    }
    else {
        window.setTimeout(setupFixMap, 250);
    }
}

function toggleParam(which, el) {
    $(activePanel).removeClass('active');
    if (el === null) {
        $(activeMenu).parent().removeClass('active');
        activeMenu = null;
    }
    if (isPanelOpen === false) {
        $('#right-panel').animate({ left: '0px' }, 1000);
        $('#map').animate({ width: $('#map').width() - 413 + 'px' }, 1000);
        $('#navtoolHolder').animate({ width: $('#map_root').width() - 413 + 'px' }, 1000);
        $('#navtoolHolder').css('right', '0px');
        $('.panel-close').css('visibility', 'hidden');
        $('#right-panel').addClass('openpanel', 1000, function () { $('.panel-close').css('visibility', 'visible'); });
        $('.panel-close').addClass('openpanel');
        isPanelOpen = which;
        $('#' + which).show();
        $(el).addClass('active');
        activePanel = el;
    }
    else if (which === isPanelOpen || which === 'close') {
        $('#map').animate({ width: 100 + '%' }, 850);
        $('#navtoolHolder').animate({ width: 100 + '%' }, 850);
        $('#right-panel').removeClass('openpanel', 850);
        $('.panel-close').css('visibility', 'hidden');
        $('.panel-close').removeClass('openpanel');
        $('#right-panel').animate({ 'left': '-413px' }, 850, function () {
            $('#map').animate({ width: 100 + '%' }, 850);
            if (which === 'close') {
                $('#' + isPanelOpen).hide();
                isPanelOpen = false;
            }
            $('.panel-close').css('visibility', 'visible');
        });

        if (which !== 'close') {
            $('#' + which).hide();
            isPanelOpen = false;
        }
    }
    else {
        $('#' + isPanelOpen).hide();
        $('#' + which).show();
        isPanelOpen = which;
        $(el).addClass('active');
        activePanel = el;
    }
}
function setPanelTitle(what) {
    if (what === '') { }
    else {
        $('#panelTitle').text(what);
    }
}

$(window).resize(function () {
    resizeUI();
});
function resizeUI() {
    resizetimer = setTimeout(fixMap, 100);
    $('#right-panel').height((window.innerHeight - $('#nav-wrapper').height()) + 'px');
    $('#right-panel').css('top', $('#nav-wrapper').height() + 'px');
    $('#map_root').height((window.innerHeight - $('#nav-wrapper').height()) + 'px');
    $('#map').height((window.innerHeight - $('#nav-wrapper').height()) + 'px');
    $('#map').css('top', $('#nav-wrapper').height() + 'px');
}
function fixMap() {
    $('#map').width($(window).width() - (parseInt($('#right-panel').css('left').replace(/[^-\d\.]/g, '')) + 413));
}

function cleanme(what) {
    return what.replace(/\s/g, '').replace(/[^a-zA-Z ]/g, "");
}
function createNewCategory(CatTitle) {
    var cleanTitle = cleanme(CatTitle);

    var htmlstring = '<div class="accordiancard card">';
    htmlstring += '<div class="card-header" id="headingOne">';
    htmlstring += ' <h5 class="mb-0">';
    htmlstring += '<button class="btn btn-link" data-toggle="collapse" data-target="#' + cleanTitle + 'body" aria-expanded="true" aria-controls="' + cleanTitle + 'body"><span class="glyphicon glyphicon-minus"></span> ';
    htmlstring += CatTitle;
    htmlstring += '  </button>';
    htmlstring += '</h5>';
    htmlstring += ' </div>';
    htmlstring += '<div class="row in rcpanel" id="' + cleanTitle + 'body" aria-labelledby="headingOne">';
    htmlstring += '</div>';
    htmlstring += ' </div>';

    var catHtml = $(htmlstring);
    $('#accordion').append(catHtml);

}

function addDataToCatagory(data, category) {
    if (!isLetter(data.id.charAt(0))) {
        data.id = 'fixedint_' + data.id;
    }
    completeLayerList.push(data);
    var clickevent = "toggleLayer('" + data.id + "');";
    var detailsevent = "loadLayerDetails('"+ data.id +"')";
    var togglebox = '<label class="cblabel"><input id="' + data.id + '" class="bzcheckbox" type="checkbox" value="' + data.id + '" onclick="' + clickevent + '">' + data.name + '</label>'
    var slider = '<div id="sliderContainer' + data.id + '"> <input type="range" name="' + data.id + 'opacity" id="' + data.id + 'opacity" value="100" min="0" max="100" step="1" style="display:none" class="slider"> <button id="details' + data.id +'" onclick="'+ detailsevent +'" style="float:right;">Details</button> </div>';
    var datahtml = '<div class="card col-sm-12 row-eq-height"><div class="card-body cooltree">' + togglebox + '<br> ' + slider + '</div></div>';
    $('#' + category + 'body').append(datahtml);

    addOpacityListener(data.id);
}
function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
}

function addExpandIcons() {
    try {
        $('.rcpanel').on('hidden.bs.collapse', function () {
            $(this).prev().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        });
    }
    catch (e) { }
    try {
        $('.rcpanel').on('shown.bs.collapse', function () {
            $(this).prev().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
        });
    }
    catch (e) { }
}

function expandAll() {
    var closedcats = $('#accordion .row:not(.in)');
    for (var i = 0; i < closedcats.length; i++) {
        $(closedcats[i]).prev().find('button').click();
    }
}
function closeAll() {
    var closedcats = $('#accordion .row.in');
    for (var i = 0; i < closedcats.length; i++) {
        $(closedcats[i]).prev().find('button').click();
    }
}
var theSnap;
function loadmylayers() {
    var docRef = db.collection("map-services").orderBy("category");
    docRef.get().then(function (querySnapshot) {
        theSnap = querySnapshot;
        querySnapshot.forEach(function (doc) {
            var moreinfo = doc.data();

            if ($('#' + cleanme(moreinfo.category) + 'body').length < 1) {
                createNewCategory(moreinfo.category);
            }
            addDataToCatagory(moreinfo, cleanme(moreinfo.category));
        });
        addExpandIcons();
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}
function loadLayerDetails(layerID) {
    var theLayer = completeLayerList.find(function (x) { if (x.id === layerID) { return x; } });
    getLegendHtml(theLayer);
    //var legendHtml = getLegendHtml(theLayer);

    //var legendText = theLayer.description + '<br> ' + legendHtml;
    //var $dialog = $('<div></div>')
    //    .html(legendText)
    //    .dialog({
    //        title: theLayer.name
    //    });
}
function openLegend(description, legendHtml, name) {
    var legendText = description + '<br> ' + legendHtml;
    var $dialog = $('<div></div>')
        .html(legendText)
        .dialog({
            title: name
        });
}

var dbuglegenddata;
function getLegendHtml(layer) {
    var url = layer.legend_url;
    var html = '';
    if (url.indexOf('f=json') > -1 || url.indexOf('f=pjson') > -1) {
        var theurl = 'https://proxy.servirglobal.net?url=' + url;
        var jqxhr = $.getJSON(theurl, function (response) {
            dbuglegenddata = response;
            var htmlString = "<table>";
            if (response != null && response.layers.length > 0) {
                for (var iCnt = 0; iCnt < response.layers.length; iCnt++) {
                    lyr = response.layers[iCnt];

                    if (lyr.legend.length > 0) {
                        var layerName = lyr.layerName;
                        htmlString += "<tr><td colspan='2' style='font-weight:bold;'>" + layerName + "</td></tr>";

                        for (var jCnt = 0; jCnt < lyr.legend.length; jCnt++) {
                            var src = url.substr(0, url.indexOf('MapServer/') + 9) + "/" + lyr.layerId + "/images/" + lyr.legend[jCnt].url;
                            var strlbl = lyr.legend[jCnt].label.replace("<Null>", "Null");
                            htmlString += "<tr><td align='left' style='padding-left:15px;'><img src=\"" + src + "\" alt ='' /></td><td align='left'>" + strlbl + "</td></tr>";
                        }
                    } else {
                        htmlString += "<tr><td colspan='2' class='tdLayerHeader' style='font-weight:bold;'>" + lyr.layerName + "</td></tr>";
                        var src = url.substr(0, url.indexOf('MapServer/') + 9) + "/" + lyr.layerId + "/images/" + lyr.legend[0].url;
                        htmlString += "<tr><td colspan='2' ><img src=\"" + src + "\" alt ='' /></td></tr>";
                    }
                }
                htmlString += "</table>";
                html = htmlString;
                openLegend(layer.description, html, layer.name);
            }
        })
            .fail(function () {
                console.log("error");
            });
    
    }
    else {
        html = '<img src="' + url + '" />';
        openLegend(layer.description, html, layer.name);
    }
    
}
function toggleLayer(layerID) {
    if (document.getElementById(layerID).checked) {
        turnOnLayer(layerID);
        //show slider
        $('#' + layerID + 'opacity').show();
        $('#details' + layerID).html("D");
        var theLayer = completeLayerList.find(function (x) { if (x.id === layerID) { return x; } });
        if (theLayer.timeseries) {
            //stop animation
            $('#activeTimelineLayer').append($('<option>', {
                id: theLayer.id + '_active',
                value: theLayer.id,
                text: theLayer.name,
                selected: true
            }));

            getCapabilitiesThenUpdateTimeline(theLayer);

            currentLayer = theLayer.id;
            $('#timeline').show();
            $('.esriControlsBR').css('bottom', '90px');
        }
    } else {
        map.getLayer(layerID).setVisibility(false);
        $('#' + layerID + 'opacity').hide();
        $('#details' + layerID).html("Details");
        var theLayer = completeLayerList.find(function (x) { if (x.id === layerID) { return x; } });
        if (theLayer.timeseries) {
            $('#' + theLayer.id + '_active').remove();
            if ($('#activeTimelineLayer').children('option').length == 0) {
                $('#timeline').hide();
                $('.esriControlsBR').css('bottom', '5px');

                $('#timeindicator').hide();
            }
        }

    }
}

function getCapabilitiesThenUpdateTimeline(which) {
    /*  get capabilities then update start and end*/

    var theurl = which.url + '?VERSION=1.1.1&REQUEST=GetCapabilities&SERVICE=WMS&';

    $.get(theurl, function (xml) {
        var jsonObj = $.xml2json(xml);
        var jsondate = jsonObj.Capability.Layer;
        if (jsondate.Layer.length) {
            theLatestTime = jsondate.Layer[0].Extent.text;// this might be different based on ur wms getinfo return.  Check the debugxml to see what was returned if this does not work
        }
        else {
            theLatestTime = jsondate.Layer.Extent.text;
        }
        /* load layer here*/
        
        var dateString;
        var splits = theLatestTime.split("/");

        var oldestDate = new Date(splits[0]);
        oldestDate.setDate(oldestDate.getUTCDate());
        oldestDateString = oldestDate.toISOString() + "/" + splits[0];

        var firstDate = new Date(splits[1]);
        firstDate.setDate(firstDate.getUTCDate());
        dateString = firstDate.toISOString() + "/" + splits[1];

        theLatestTime = dateString;
        updateTimeline(moment.utc(oldestDate), moment.utc(firstDate));
        which.startDate = oldestDate;
        which.endDate = firstDate;


        if (currentDate) {
            var withinRange = currentDate >= which.startDate && currentDate <= which.endDate;
            if (withinRange) {
                pickDate(currentDate);
            }
            else {
                pickDate(which.endDate);
            }
        }
        else {
            pickDate(firstDate);
        }
    });
}

function animateRange() {
    clearInterval(animatetimeout);
    if (!isLayerLoading) {
        animatetimeout = window.setInterval(function () {

            var thestart = moment(timeline.range.start);
            var theend = moment(timeline.range.end);  //i'll have to adjust if end is past max data
            var ndate = moment(currentDate).add(1, 'days');

            var lastdata = new DateRange(theLatestTime);

            if (moment(ndate).isAfter(theend) || moment(ndate).isAfter(lastdata.end)) {
                currentDate = new Date(timeline.range.start);
                ndate = moment(currentDate);
            }
            pickDate(ndate.toDate());
        }, 1000);
    }
    else {
        window.setTimeout('animateRange()', 250);
    }
}
function stopAnimation() {
    try {
        clearInterval(animatetimeout);
    }
    catch (e) { }
}
function gotoFirst() {
    currentDate = new Date(timeline.range.start);
    ndate = moment(currentDate);
    pickDate(ndate.toDate());
}
function gotoLast() {
    currentDate = new Date(timeline.range.end);
    ndate = moment(currentDate);
    pickDate(ndate.toDate());
}

function turnOnLayer(layerID) {
    /* short code to advanced for some browsers */
    //  var theLayer = completeLayerList.find(x => x.id === layerID);
    var theLayer = completeLayerList.find(function (x) { if (x.id === layerID) { return x; } });
    var mLayer = map.getLayer(layerID);
    if (mLayer) {
        mLayer.setVisibility(true);
        map.reorderLayer(mLayer, map.layerIds.length);
        map.reorderLayer(map.getLayer("areaPicker"), map.layerIds.length);
    }
    else {
        gcreateLayerFromObject(new BillyZ_Layer("my." + layerID, layerID, "loadingdiv", true, theLayer.url, theLayer.layers));
        map.reorderLayer(map.getLayer("areaPicker"), map.layerIds.length);
    }
}
function updateOpacity(layerID, val) {
    //var theLayer = completeLayerList.find(x => x.id === layerID);
    var theLayer = completeLayerList.find(function (x) { if (x.id === layerID) { return x; } });
    var mLayer = map.getLayer(layerID);
    if (mLayer) {
        mLayer.setOpacity(val / 100);
    }
}
function addOpacityListener(which) {
    if ($('#' + which + 'opacity').length > 0) {
        if (isIE()) {
            onRangeChange(document.getElementById(which + 'opacity'), myListener);
        }
        else {
            $('#' + which + 'opacity').on('input', function (value) {
                updateOpacity(which, $(this).val());
            });
        }
    }
    else {
        window.setTimeout(function () {
            addOpacityListener(which);
        }, 250);
    }
}
function isIE() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        return true;
    }
    else  // If another browser, return 0
    {
        //alert('otherbrowser');
    }
    return false;
}
function onRangeChange(r, f) {
    var n, c, m;
    r.addEventListener("input", function (e) { n = 1; c = e.target.value; if (c != m) f(e); m = c; });
    r.addEventListener("change", function (e) { if (!n) f(e); });
}
function myListener(evt) {
    updateOpacity(evt.srcElement.id.replace('opacity', ''), evt.srcElement.value);
}
function panelToggler(which, element, title, close) {
    toggleParam(which, element);
    setPanelTitle(title);
    closeMobileMenu();
    if (element) {
        if (activeMenu && activeMenu == element) {
            $(element).parent().removeClass('active');
            activeMenu = null;
        }
        else {
            $(element).parent().addClass('active');
            if (activeMenu) {
                $(activeMenu).parent().removeClass('active');
            }
            activeMenu = element;
        }
    }
}
function closeMobileMenu() {
    if (close && $('#ismobile').is(':visible')) {
        $('#navbar3').collapse('hide');
    }
}
function keepactive() {
    $(activeMenu).addClass('active');
    $(activeMenu).parent().addClass('active');
}
function setBaseMap(which, el) {
    if (map.getBasemap() != which) {
        $('.esriBasemapGalleryThumbnail').removeClass('selected');
        //$('.basemapholder').removeClass('selected');

        map.setBasemap(which);
        $(el).addClass('selected');
        //$(el).parent().addClass('selected');
    }
}

function updateTimeline(startDate, EndDate) {
    timeline.range.start = moment(startDate);
    timeline.range.end = EndDate;
    timeline.range.options.min = startDate;
    timeline.range.options.max = EndDate;
    timeline.redraw();
}

function pickDate(which) {
    var theDate;
    if (which.time) {
        theDate = which.time;
    }
    else {
        theDate = which;
    }
    if (onlyOne == true) {
        onlyOne = false;
        currentDate = theDate;
        $("#txtSelectedTime").text(theDate.toDateString());
        adjustDateLabelPosition();
        theDateString = moment(theDate).format('YYYY-MM-DD') + "T00:00:01.000Z/" + moment(theDate).format('YYYY-MM-DD') + "T23:59:59.000Z";
        updateMyLayer(theDateString);

        onlyOne = true;
        if (firstShowing) {
            window.setTimeout(adjustDateLabelPosition, 500);
            firstShowing = false;
            window.setTimeout(adjustDateLabelPosition, 1000);
        }
    }

}
function adjustDateLabelPosition() {
    var theTop = $("#timeline").position().top - 32;
    var theLeft;
    if ($('#ismobile').is(':visible')) {
        console.info($('#map').width());
        theLeft = $('#nav-wrapper').width() - 111 - 20;
    }
    else {
        if (currentDate) {
            theLeft = (($('#map').width() - 250) * getPercent(currentDate.getTime(), timeline.range.start, timeline.range.end)) + 200;
            if ($('#map').width() - 111 < theLeft) {
                theLeft = $('#map').width() - 111 - 20;
            }
        }
    }
    try {
        $('#timeindicator').css({ 'top': theTop, 'left': theLeft }).fadeIn('slow');
    }
    catch (e) { }
}
function updateMyLayer(span) {
    currentTimeSpan = span;
    if (!currentLayer) {
        currentLayer = "Precipitation";
    }
    if (!map) {
        /*   settimeout  */
        setTimeout(function () { updateMyLayer(span); }, 250);
    }
    else {
        var mylayer = map.getLayer(currentLayer);

        var theLayer = completeLayerList.find(function (x) { if (x.id === currentLayer.toString()) { return x; } });
        mylayer.getImageUrl = function (extent, width, height, callback) {
            var params = {
                request: "GetMap",
                transparent: true,
                format: "image/png",
                bgcolor: "ffffff",
                version: "1.3.0",
                layers: theLayer.layers,
                styles: '',
                exceptions: "application/vnd.ogc.se_xml",
                time: span,
                //changing values
                bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
                crs: 'EPSG:' + (extent.spatialReference.latestWkid != null ? extent.spatialReference.latestWkid : extent.spatialReference.wkid),
                srs: 'EPSG:' + (extent.spatialReference.latestWkid != null ? extent.spatialReference.latestWkid : extent.spatialReference.wkid), //'EPSG:3857'
                width: width,
                height: height
            };
            callback(theLayer.url + "?" + dojo.objectToQuery(params));
        };
        mylayer.refresh();
    }
}

function updateAreaPickerLayer(requestedLayer, features) {

    var mylayer = map.getLayer("areaPicker");
    map.reorderLayer(mylayer, map.layerIds.length);
    if (!features) {
        features = '';
        activeFeatures = '';
    }
    if (activeFeatures == '') {
        activeFeatures = features;
    }
    else {
        //check if features in active features already, if so remove
        var splitactive = activeFeatures.split(',');
        console.log(features);
        if (splitactive.indexOf(features.toString()) > -1) {
            splitactive.splice(splitactive.indexOf(features.toString()), 1);
            activeFeatures = splitactive.toString();
        }
        else {
            activeFeatures = activeFeatures + ',' + features;
        }
    }

    var compiledLayer = requestedLayer + ',' + requestedLayer + '_highlight';
    mylayer.getImageUrl = function (extent, width, height, callback) {
        var params = {
            request: "GetMap",
            transparent: true,
            format: "image/png",
            bgcolor: "ffffff",
            version: "1.3.0",
            layers: compiledLayer,
            styles: '',
            //changing values
            feat_ids: activeFeatures, //201, 197
            bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
            crs: 'EPSG:102100',
            srs: 'EPSG:102100',
            width: width,
            height: height
        };
        callback(mylayer.url + "?" + dojo.objectToQuery(params));
    };
    mylayer.refresh();
}

function getPercent(current, start, end) {
    return (current - start) / (end - start);
}
function getFeatureInfo(evt) {
    map.infoWindow.setContent('');
    if (infoEnabled) {
        // make call to getinfo
        var layer = completeLayerList.find(function (x) { if (x.id === map.layerIds[map.layerIds.length - 2]) { return x; } });
        if (layer) {
            var queryurl = layer.url + '?' + 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS=' + layer.layers + '&LAYERS=' + layer.layers + '&TILED=false&srs=EPSG:' + (map.extent.spatialReference.latestWkid != null ? map.extent.spatialReference.latestWkid : map.extent.spatialReference.wkid) + '&INFO_FORMAT=text/html&I=' + evt.screenPoint.x + '&J=' + evt.screenPoint.y + '&WIDTH=' + map.width + '&HEIGHT=' + map.height + '&CRS=EPSG:' + (map.extent.spatialReference.latestWkid != null ? map.extent.spatialReference.latestWkid : map.extent.spatialReference.wkid) + '&STYLES=&BBOX=' + map.extent.xmin + ', ' + map.extent.ymin + ', ' + map.extent.xmax + ', ' + map.extent.ymax;
            if (layer.timeseries) {
                queryurl += '&time=' + currentTimeSpan;
            }
            var query = encodeURIComponent(queryurl);
            $.ajax({
                url: 'https://proxy.servirglobal.net/proxy.aspx?url=' + query,
                type: "POST",
                async: true,
                crossDomain: true
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log('fail');
                rData = jqXHR;
                console.warn(jqXHR + textStatus + errorThrown);
                map.infoWindow.setContent('Layer does not currently support get feature info.');
            }).done(function (data, _textStatus, _jqXHR) {
                if (data.errMsg) {
                    console.log('error');
                    rData = data;
                    console.warn(data.errMsg);
                    map.infoWindow.setContent('Layer does not currently support get feature info.');
                } else {
                    rData = data;
                    try {
                        //puts return into a json object so i can grab out the data to format it
                        var jsonObj = $.xml2json(data);
                        var content = '';
                        if (jsonObj.body === '') {
                            content += 'There was no data returned for that point.';
                        }
                        else if (jsonObj.body.table.tbody) {
                            if (typeof jsonObj.body.table.tbody.tr[0].th === 'string') {
                                // this is a string
                                console.log(jsonObj.body.table.tbody.tr[0].th + ': ' + jsonObj.body.table.tbody.tr[1].td);
                                content += jsonObj.body.table.tbody.tr[0].th + ': ' + jsonObj.body.table.tbody.tr[1].td + '<br>';
                            }
                            else {
                                for (var i = 0; i < jsonObj.body.table.tbody.tr[0].th.length; i++) {
                                    console.log(jsonObj.body.table.tbody.tr[0].th[i] + ': ' + jsonObj.body.table.tbody.tr[1].td[i]);
                                    content += jsonObj.body.table.tbody.tr[0].th[i] + ': ' + jsonObj.body.table.tbody.tr[1].td[i] + '<br>';
                                }
                            }
                        }
                        else if (jsonObj.body.table.tr) {
                            //jsonObj.body.table.tr is the data
                            if (typeof jsonObj.body.table.tr[0].th === 'string') {
                                // this is a string
                                console.log(jsonObj.body.table.tr[0].th + ': ' + jsonObj.body.table.tr[1].td);
                                content += jsonObj.body.table.tr[0].th + ': ' + jsonObj.body.table.tr[1].td + '<br>';
                            }
                            else {
                                for (var i = 0; i < jsonObj.body.table.tr[0].th.length; i++) {
                                    console.log(jsonObj.body.table.tr[0].th[i] + ': ' + jsonObj.body.table.tr[1].td[i]);
                                    content += jsonObj.body.table.tr[0].th[i] + ': ' + jsonObj.body.table.tr[1].td[i] + '<br>';
                                }
                            }

                        }
                        else if (jsonObj.body.table.length > 1) {
                            for (var i = 0; i < jsonObj.body.table.length; i++) {
                                for (var j = 0; j < jsonObj.body.table[i].tbody.tr[0].th.length; j++) {
                                    content += jsonObj.body.table[i].tbody.tr[0].th[j] + ': ' + jsonObj.body.table[i].tbody.tr[1].td[j] + '<br>';
                                }
                            }
                        }
                        else {
                            content += 'Layer does not currently support get feature info.';
                        }
                        map.infoWindow.setContent(content);
                        adjustInfoWindow();
                    }
                    catch (e) {
                        map.infoWindow.setContent('Layer does not currently support get feature info.');
                        adjustInfoWindow();
                    }
                }
            });
            map.infoWindow.setTitle(layer.name);
        }
        else {
            map.infoWindow.setTitle('Select a layer first');
            map.infoWindow.setContent('You must turn a layer on to get the info.');
        }
        map.infoWindow.show(evt.screenPoint);
    }
    else if (selectFeatureEnabled) {
        var queryurl = 'https://climateserv.servirglobal.net/cgi-bin/servirmap_102100?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=' + $('#selectFeatureTypeRequest').val() + '&LAYERS=' + $('#selectFeatureTypeRequest').val() + '&TILED=true&INFO_FORMAT=json&I=' + evt.screenPoint.x + '&J=' + evt.screenPoint.y + '&WIDTH=' + map.width + '&HEIGHT=' + map.height + '&CRS=EPSG%3A102100&STYLES=&BBOX=' + map.extent.xmin + ', ' + map.extent.ymin + ', ' + map.extent.xmax + ', ' + map.extent.ymax + '&callback=successCallback&_=1532364874380';
        var query = encodeURIComponent(queryurl);
        $.ajax({
            url: 'https://proxy.servirglobal.net/proxy.aspx?url=' + query,
            type: "POST",
            async: true,
            crossDomain: true,
            success: function (data, status, error) {
                var splitme = data.match(/\S+/g);
                updateAreaPickerLayer($('#selectFeatureTypeRequest').val(), JSON.parse(splitme[1]).data);
            },
            error: function (data, status, error) {
                console.log('error', data, status, error);
            }
        });
    }
    else {
        map.infoWindow.hide();
        map.infoWindow.setTitle();
    }
}

function getInfoToggle(enable) {
    infoEnabled = enable;
}

function getRequestedAction() {
    selectFeatureEnabled = false;
    jsonfeatures = false;
    ourpolygon = '';
    //will need to remove polygon as well after it is added
    var e = document.getElementById("climateSERVSelectAOI");
    currentAction = e.options[e.selectedIndex].value;
    toolbar.deactivate();
    if (currentAction == 'draw') {
        $('#featureTypeRequest').hide("slow", function () {
            $('#featureTypeRequest_spacer').hide();
        });
        map.getLayer("areaPicker").setVisibility(false);
        gactivateTool('POLYGON');
        if ($('#ismobile').is(':visible')) {
            toggleParam('close', null);
            setPanelTitle('');
        }
    }
    else if (currentAction == 'choose') {
        map.reorderLayer(map.getLayer('areaPicker'), map.layerIds.length);
        selectFeatureEnabled = true;
        $('#featureTypeRequest').show("slow", function () {
            $('#featureTypeRequest_spacer').show();
        });
        removeDrawings();
        map.getLayer("areaPicker").setVisibility(true);
    } else if (currentAction == 'load') {
        jsonfeatures = true;
        $('#loadGeoJsonDialog').dialog();
    }
    else { //none option
    }
}
function cleardrawnassets() {
    removeDrawings();
    getRequestedAction();
}
function removeDrawings() {
    toolbar.deactivate();
    map.graphics.clear();
    var graphicLayerIds = map.graphicsLayerIds;
    var len = graphicLayerIds.length;
    for (var i = 0; i < len; i++) {
        var gLayer = map.getLayer(graphicLayerIds[i]);
        //clear this Layer
        gLayer.clear();
    }
    AOIGeometery = null;
}
function updateSelectFeatureTypeRequest(which) {
    updateAreaPickerLayer(which);
}

function openSelectedPanel() {
    closeTypePanels()
    var e = document.getElementById("climateSERVSelectType");
    currentType = e.options[e.selectedIndex].value;
    if (currentType == 'data') {
        openPanel('dataPanel');
    }
    else if (currentType == 'rainfall') {
        openPanel('rainfallPanel');
    }
    else {
        closeTypePanels();
    }
}

function openPanel(which) {
    $("#" + which).show("slow", function () {
        // Animation complete.
    });
}
function closeTypePanels() {
    $("#dataPanel").hide();
    $("#rainfallPanel").hide();
}
