﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Home" %>

<!doctype html>
<html lang="en">
    <head>
        <link rel="icon" href="img/main/icon.png">
<script>
    var myOpVal6 = "999";
    var urlfortimeline;
    var urlt1;
</script>
<!--        <link rel="stylesheet" href="https://openlayers.org/en/v3.0.0/css/ol.css" type="text/css">-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700,900" type="text/css" />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto Condensed" type="text/css" />
        <link rel="stylesheet" href="css/custom-theme/jquery-ui-1.10.4.custom.css" />
        <link rel="stylesheet" href="css/jquery.css" />
        <link rel="stylesheet" href="css/ol.css" />
        <link rel="stylesheet" href="css/red-glass/sidebar.css" />
        <link rel="stylesheet" href="css/servir.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="js/libs/openlayers/climateserv_ol.js" type="text/javascript"></script>
        <script src="js/libs/jquery/jquery.js"></script>
        <script src="js/libs/jqueryui/jquery-ui.js"></script>
        <script src="js/libs/d3/d3.min.js"></script>
        <script src="js/libs/jquery-timer/jquery.timer.js"></script>
        <script src="js/libs/savefig/saveSvgAsPng.js"></script>
        <script src="js/libs/dimple/dimple.v2.1.0.js"></script>
        <script src="js/libs/jquery-sidebar/jquery.sidebar.js"></script>

        <link rel="stylesheet" type="text/css" href="js/libs/semantic/dist/semantic.min.css">
        <script src="js/libs/semantic/dist/semantic.min.js"></script>
        <link rel="stylesheet" type="text/css" href="design/design2016/design2016.css">
        <script src="design/design2016/climateserv.js"></script>

        <script src="design/design2016/design2016.js"></script>
        <!-- ClimateSERV Specific Overrides -->
        <link rel="stylesheet" type="text/css" href="design/design2016/climateserv.css">
        
        <!-- FUNCTIONAL CODE FOR CLIMATESERV-->
        <script src="js/servirnasa2017.js"></script>
        <link rel="stylesheet" href="https://openlayers.org/en/v4.2.0/css/ol.css" type="text/css">
        <link href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" rel="stylesheet">

        <!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
        <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
        <script src="https://openlayers.org/en/latest/build/ol.js"></script>
        <script src="js/layerArray.js"></script>
        <script src="js/mapParams.js"></script>
    <title>Map Viewer</title>
     
        <script type="text/javascript">
            function resetAll() {
                $("#selectAction").val("xx");

                $("#selectmenu").val("xx");
                $("#operationmenu").val("xx");
                $("#typemenu").val("xx");
                $("selectData_typeOfRequest").val("xx");
                $("#stdate").hide();
                $("#eddate").hide();
                $("#datepickerbegin").hide();
                $("#datepickerend").hide();
            }
            function displayMenu() {
                if (document.getElementById("respMenu").style.display == "none")
                    document.getElementById("respMenu").style.display = "block";
                else
                    document.getElementById("respMenu").style.display = "none";

            }
          
        </script>
        <link rel="stylesheet" href="css/home.css"/>
        <script type="text/javascript" src="js/home.js"></script>
        <style>
            .timeslider {
                background-color: steelblue;
                height: 150px;
                width: 84%;
                position: absolute;
                top: 86%;
                left: 300px;
                z-index: 1;
                transition: all 1s;
                padding: 10px;
            }
                .timeslider.close {
                    padding: 0;
                    height: 0;
                }
            .timerclass {
                display: none;
            }
            #timelineDiv{
               text-align:center;
                 font-size:16px;
                 color:#f5ab63;
               
            }
            #yearslider {
                margin-top: 15px;
                width: 60%;
                height: 40px;
            }
            .timerclass.PlayORPause {
               visibility:hidden;
            }
            

       </style>

    </head>
    
    
    
<body class="servir_helper_noScroll_Vert" style="background-color:black;">
        <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer" style="color:blue"></a>
        <div id="popup-content">
            <!--<div id="popup-tab"></div>-->
        </div>
    </div>
 <div id="timelineDiv" class="timeslider close">
     <span id="info" hidden>timewhere</span>
     <label class="timerclass" id="status" style="color:white;left:32%;position:fixed;">Status: None</label>
     <label for="from" class="timerclass">From</label>
     <input type="text" id="from" name="from" class="timerclass">
     <select id="fromtime" class="time timerclass" hidden></select>
     <label for="to" class="timerclass">to</label>
     <input type="text" id="to" name="to" class="timerclass">
     <select id="totime" class="time timerclass"></select>
     <!--<button id="play" class="timerclass">Play</button>-->
    
     <!--<button id="pause" class="timerclass">Pause</button>-->
     <!--<button id="start" onclick="loadXMLDoc();">Populate dates</button>-->
     <br />
     <a id="play" class="timerclass" href="#" style="position:inherit;top:30%;"><img src="img/timeline/playbutton.png" width="40" height="40" /></a>
     <a id="pause" class="timerclass" href="#"><img src="img/timeline/pausebutton.png" width="40" height="40" /></a>
     <input id="yearslider" class="range blue timerclass" type="range" step="1" list="ticks" value="0">
     <datalist class="timerclass" id="ticks"></datalist>
     <output class="timerclass" id="rangevalue" style="color:white"></output>
 </div>
<!-- Full Page Framework -->
    <div class="ui grid servir_helper_topbotMargin_0">
    </div>
    <div class="one column row dimmable servir_helper_topbotPadding_0" data-role="content" style="background-color:#112211;"> <!-- data-role="content" -->

                <div class="ui dimmer">
                  
                </div>

                <div class="column">
                    
                    

                    <!-- Map (Container and Map) -->
                    <div id="map" class="map" style="opacity:0;">

                        <!--<select id="chg">
                            <option id="color">-Theme-</option>

                            <option id="blue_1">LightBlue</option>
                            <option id="yellow">LightYellow</option>
                            <option id="silver">Silver</option>
                            <option id="white_4">White</option>
                        </select>-->
                        <!-- style='padding-left:14px;' -->
                        <div class="content" style="position: absolute;z-index: 1;">
                            <div class="t_panel hide">
                                <a class="slide_button data" href="#" style="float:right;"><img src="img/main/hide1.png" width="30" height="30" /></a>
                                <div class="spacing"></div>
                                <label style="margin-left:20px;color:peru;">Click to expand...</label><br/>
                                <label class="data_expandable">ClimateServ</label>
                                <div class="data_panel">
                                   <label style="margin-left:40px;"><b>Select an action:</b></label>
                                <select style="color:black" class="ui dropdown servir_helper_stretchDropdown_70pct" name="selectAction" id="selectAction" onchange="doAction()">
                                    <!-- Funky, non straightforward logic in the existing jquery handler here.. follow the ID to see it. -->
                                    <option value="xx">--Start here--</option>

                                    <option value="0Ac">Draw custom polygon</option>
                                    <option value="1Ac">Choose feature on map</option>
                                    <option value="2Ac">Load GeoJson file from local system</option>
                                    <!--  <option value="3">Select by FTF ZOI</option>-->
                                </select>
                                    <label style="margin-left:40px;"><b>Select request type:</b></label>
                                        <select style="color:black;display:none;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="selectmenu" id="selectmenu">
                                            <!-- Funky, non straightforward logic in the existing jquery handler here.. follow the ID to see it. -->
                                            <option value="xx">--Select Area--</option>

                                            <option value="0">Country</option>
                                            <option value="1">Admin #1</option>
                                            <option value="2">Admin #2</option>
                                        </select>

                                        <br />

                                        <!-- [Data Type Dropdown] (?)--> <!-- Legacy Name: name="typemenu" id="typemenu" -->
                                        <select style="color:black" class="ui dropdown servir_helper_stretchDropdown_70pct" name="selectData_typeOfRequest" id="selectData_typeOfRequest" onchange="selectData_typeOfRequest_Changed(this.value)/*select_dataType_Changed(this.value)*/">
                                            <option value="xx">--Type of Request--</option>
                                            <option value="datasets">Datasets</option>
                                            <option value="monthly_analysis">Monthly Rainfall Analysis</option>
                                        </select>
                                        <!--<i id="helpIcon_SelectData_DataSource_ToolTip" class="help circle icon"></i>-->
                                        <!-- The rest of the dropdown UI's visibility is controlled based on what was selected in the 'Type of Request' box -->
                                        <div class="SelectData_Monthly_Analysis_FormContainer">
                                            <p></p>
                                            <div class="servir_text_fixedModal_subtleTitle" style="margin-left:40px;">
                                                Monthly Rainfall Analysis is derived from a combination of CHIRPS historical data and current NMME Seasonal Forecast data.
                                            </div>
                                        </div>
                                        <!-- Type of Request View State Container _ORIGINAL_ START -->
                                        <!-- Original Form with Default types and Seasonal Forecast Model types-->
                                        <!-- [Data Type Dropdown] (?)--> <!-- Legacy Name: name="typemenu" id="typemenu" -->
                                    <label id="typemenulabel" style="margin-left:40px;display:none;"><b>Select a data source:</b></label>
                                        <select style="color:black;display:none;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="typemenu" id="typemenu" onchange="select_dataType_Changed(this.value)">
                                            <option value="xx">--Data Source--</option>
                                            <option value="0">CHIRPS Rainfall</option>
                                            <option value="1">West Africa eMODIS NDVI</option>
                                            <option value="2">East Africa eMODIS NDVI</option>
                                            <option value="5">Southern Africa eMODIS NDVI</option>
                                            <option value="28">Central Asia eMODIS NDVI</option>
                                            <option value="ClimateModel">Seasonal_Forecast</option>
                                            <option value="IMERG1Day">IMERG 1 Day</option>
                                            <option value="29">ESI</option>
                                            <!--<option value="30">SMAP</option>-->

                                        </select>
                    
                                    <label id="operationmenulabel" style="margin-left:40px;display:none"><b>Select an operation:</b></label>    
                                    <select style="color:black;display:none;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="operationmenu" id="operationmenu">
                                            <option value="xx">--Calculations--</option>

                                            <option value="0">Max</option>
                                            <option value="1">Min</option>
                                            <option value="5" selected="selected">Average</option>

                                        </select>
                                        <!--<i style="color:black"  id="helpIcon_SelectData_Calculations_ToolTip" class="help circle icon" onclick="test1();"></i>-->
                                        <!-- DEFAULT: Start Date -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_Default">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;display:none;" class="servir_helper_topPadding_075rem servir_text_helper_fontWeight_600" id="stdate">Start Date:</div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- Start Date [01/01/2016 v] -->
                                                <div class="ui input"><input type="text" id="datepickerbegin" value="01/01/2016" hidden></div>
                                            </div>
                                        </div>
                                        <!-- DEFAULT: End Date -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_Default">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;display:none;" class="servir_helper_topPadding_075rem servir_text_helper_fontWeight_600" id="eddate">End Date:</div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- End Date [02/01/2016 v]-->
                                                <div class="ui input"><input type="text" id="datepickerend" value="02/01/2016" hidden></div>
                                            </div>
                                        </div>
                                        <!-- DEFAULT SelectData UI    END -->
                                        <!--<div>  Download File?  <input type="checkbox" id="toDownload" /></div>-->
                                        <!-- SeasonalForecast (Dynamic) SelectData UI   START -->
                                        <!-- SeasonalForecast: [Model Ensemble Dropdown v] (?)-->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>Select a model ensemble:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- [Model Ensemble Dropdown v] (?)-->
                                                <select class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_Ensemble_ClimateModel" id="select_Ensemble_ClimateModel" onchange="select_Ensemble_Changed(this.value)">
                                                    <option value="dynamic_PLACEHOLDER">dynamic_PLACEHOLDER</option>
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_SelectEnsemble_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- [Variable Dropdown v] (?)-->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>Select a variable:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- [Variable Dropdown v] (?)-->
                                                <select style="color:black;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_Variable_ClimateModel" id="select_Variable_ClimateModel" onchange="select_ClimateVariable_Changed(this.value, true)">
                                                    <option value="dynamic_PLACEHOLDER">dynamic_PLACEHOLDER</option>
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_SelectVariable_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Model Run Year/Month Label (?)-->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem">Current Model Run Year/Month:</div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- Model Run Year/Month Label (?)-->
                                                <div style="color:black;" class="servir_helper_topPadding_075rem">
                                                    <span id="span_ModelRunYYYYMM_ClimateModel">dynamic_PLACEHOLDER</span>
                                                </div>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_ModelRunYYYYMM_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Calculations -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>Calculations:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- [Calculations Dropdown v] (?)-->
                                                <select style="color:black;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_OperationType_ClimateModel" id="select_OperationType_ClimateModel">
                                                    <option value="0">Max</option>
                                                    <option value="1">Min</option>
                                                    <option value="5" selected="selected">Average</option>
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_Calculations_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Date Interval Dropdown -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>Date Interval:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- [Date Interval Dropdown v] (?)-->
                                                <select style="color:black;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_dateintervalmenu_ClimateModel" id="select_dateintervalmenu_ClimateModel">
                                                    <option value="0">Daily</option>
                                                    <!--
                    <option value="1">Monthly</option>
                    <option value="2">Yearly</option>
                    -->
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_Calculations_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Select Forecast Range: Max Days: 180 Label-->
                                        <div style="color:black;" class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div class="servir_helper_topPadding_075rem"><b>Select Forecast Range:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- Model Run Year/Month Label (?)-->
                                                <div class="servir_helper_topPadding_075rem">
                                                    <span id="span_MaxDays_Label">Max Days: 180</span>
                                                </div>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_ModelRunYYYYMM_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Start Date -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>From:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- From  Date [01/01/2016 F001 v] -->
                                                <select style="color:black;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_RangeFrom_ClimateModel" id="select_RangeFrom_ClimateModel" onchange="select_RangeFrom_Changed(this.value, true)">
                                                    <option value="dynamic_PLACEHOLDER">dynamic_PLACEHOLDER</option>
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_FromDate_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: End Date -->
                                        <div class="two column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="five wide right aligned column">
                                                <div style="color:black;" class="servir_helper_topPadding_075rem"><b>To:</b></div>
                                            </div>
                                            <div class="eleven wide left aligned column">
                                                <!-- From  Date [01/01/2016 F001 v] -->
                                                <select style="color:black;" class="ui dropdown servir_helper_stretchDropdown_70pct" name="select_RangeTo_ClimateModel" id="select_RangeTo_ClimateModel" onchange="select_RangeTo_Changed(this.value, true)">
                                                    <option value="dynamic_PLACEHOLDER">dynamic_PLACEHOLDER</option>
                                                </select>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_ToDate_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                        </div>
                                        <!-- SeasonalForecast: Disclaimer -->
                                        <div class="three column row servir_helper_topbotPadding_01 controlClass_selectData_Form_SeasonalForecast">
                                            <div class="one wide right aligned column"></div>
                                            <div style="color:black;" class="fourteen wide left aligned column">
                                                <div style="margin-left:40px;">
                                                    Disclaimer: This data represents a seasonal prediction and under no circumstances should be construed as a weather forecast product. It is developed primarily as a daily representation of NMME monthly forecasts and should be used for comparison against historical trends.
                                                </div>
                                                <!-- <i id="helpIcon_SelectData_Seasonal_Disclaimer_ToolTip" class="help circle icon"></i>-->
                                            </div>
                                            <div class="one wide right aligned column"></div>
                                        </div>
                                        <!-- SeasonalForecast (Dynamic) SelectData UI   END -->

                                        <div class="servir_helper_topPadding_10rem">
                                            <!-- Button: Get Data, 'CANCEL' -->
                                            <button class="ui button servir_design2016_button_grey_color servir_helper_width_112rem servir_helper_roundedCornerAll_Button" onclick="event_SelectData_ReDraw_Button_Clicked();">
                                                <div class="center">
                                                    <div class="servir_text_button_main" id="resetButton" onclick="resetAll();">RESET</div>
                                                </div>
                                            </button>
                                            <br />      <br />                             <!-- Button: Get Data, 'GET DATA' servir_helper_width_112rem -->
                                            <button class="ui button servir_design2016_button_green_color servir_helper_roundedCornerAll_Button" onclick="downloadClicked();" id="downloadData">
                                                <div class="center">
                                                    <div class="servir_text_button_main">DOWNLOAD DATA</div>
                                                </div>
                                            </button>
                                            <br /><br />
                                            <button class="ui button servir_design2016_button_green_color servir_helper_roundedCornerAll_Button" onclick="generateClicked();" id="submitTextMain">
                                                <div class="center">
                                                    <div class="servir_text_button_main">GENERATE GRAPH</div>
                                                </div>
                                            </button>
                                        </div>
</div>
                                <label class="data_expandable">Watersheds</label>
                                <div class="data_panel"></div>
                            </div>
                            <div class="t_panel_layer hide">

                                <a class="slide_button layer" href="#" style="float:right;"><img src="img/main/hide1.png" width="30" height="30" /></a>

                                <br />
                                <input type="text" id="myInput" onkeyup="search()" placeholder="Search for layers.." title="Type in a layername">
                                <br />
                                <label style="margin-left:12px;font-family:Calibri">Click layer name for opacity & more!</label>

                                <div id="toggle" style="padding: 2px 20px;color:black;"></div>
                            </div>
                            <div class="t_panel_maps hide" >
                                <a class="slide_button maps" href="#" style="float:right;"><img src="img/main/hide1.png" width="30" height="30" /></a>

                                <br />
                                <label class="steelblue">Select a map to apply<br /></label>
                                <a class="basemaps" id="topo" href="#"><img class="maps_imgs" src="img/basemaps/topo.jpg" width="250" height="200" /></a><br />World Topo<br /><div class="spacing"></div>
                                <a class="basemaps" id="light" href="#"><img class="maps_imgs" src="img/basemaps/lightgray.jpg" width="250" height="200" /></a><br/>Light<br /><div class="spacing"></div>
                                <a class="basemaps" id="dark" href="#"><img class="maps_imgs" src="img/basemaps/darktheme.jpg" width="250" height="200" /></a><br/>Dark<br /><div class="spacing"></div>
                                <a class="basemaps" id="orthographic" href="#"><img class="maps_imgs" src="img/basemaps/orthographic.jpg" width="250" height="200" /></a><br/>Orthographic<div class="spacing"></div>

                            </div>
                            <div style="color:black">
                                <div id="detail_popup" class="modal">
                                    <div class="modal-content" style="background:lightyellow;">

                                        <span onclick="document.getElementById('detail_popup').style.display = 'none'" class="close">&times;</span>
                                        <p id="dynamic_content" style="background:lightyellow;">
                                            <h1 id="layer_name" style="background:#d4d4d5;padding:20px;"></h1>
                                            <h5 id="layer_desc"></h5>
                                            <h3>Provider URL</h3>
                                            <h5 id="provider_url"></h5>
                                            <h3>LEGEND</h3>
                                            <img id="legend_url" />
                                            <h3>Metadata XML</h3>
                                            <h5 id="metadata_url"><i>--Content to be added--</i></h5>

                                        </p>
                                    </div>
                                </div>
                            </div>


                            <div style="position:fixed;top:0px;background-color:steelblue;height:90px;width:300px">
                               <div id="l_img" style="text-align:center;display:inline-block;padding:0 15px;"><a id="layer_icon" class="show" href="#"><img id="l_image" class="main_icons" src="img/main/yellowlayer.png" alt="Layers"><br /><label style="font-weight:bold;padding-left:10px;color:#f5ab63;">Layers</label></a></div>
                                <div id="b_img" style="text-align:center;display:inline-block;padding:0 15px;"><a id="basemap_icon" class="show" href="#"><img id="b_image" class="main_icons" src="img/main/yellowmap.png" alt="Maps"><br /><label style="font-weight:bold;padding-left:10px;color:#f5ab63;">BaseMaps</label></a></div>
                               <div id="d_img" style="text-align:center;display:inline-block;padding:0 15px;"><a id="data_icon" class="show" href="#"><img id="d_image" class="main_icons" src="img/main/yellowdownload.png" alt="Data"><br /><label style="font-weight:bold;padding-left:10px;color:#f5ab63;">Data</label></a></div>
                        </div>

                            <div style="margin-left:400px;" hidden>
                                <button id="play" type="button" >Play</button>
                                <button id="pause" type="button">Pause</button>
                                <span id="info"></span>
                            </div>
                            <div id="dimmer_On_Content_Placeholder"></div>


                            <!-- SubPages: How It Works Page -->
                            <div id="subPage_HowItWorks" class="servir_climateserv_subpage servir_helper_hidden">
                                <div class="ui grid">
                                    <div class="one column row">
                                        <div class="four wide column"></div>
                                        <div class="eight wide column">
                                            <div class="ui segments servir_helper_roundedCornerAll_Override">
                                                <div class="ui segment servir_helper_roundedCornerTop_Override">
                                                    <div class="ui grid">
                                                        <div class="two column row">
                                                            <div class="left aligned column">
                                                                <div class="servir_text_fixedModal_subtleTitle">HOW IT WORKS</div>
                                                            </div>
                                                            <div class="right aligned column">
                                                                <i class="close icon servir_text_fixedModal_subtleTitle servir_helper_cursor_Pointer" onclick="event_HowItWorks_TopRightX_Clicked();"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="ui center aligned segment servir_helper_roundedCornerBottom_Override">
                                                    <div class="ui grid">
                                                        <div class="three column row">
                                                            <div class="one wide column"></div>
                                                            <div class="center aligned fourteen wide column">
                                                                <div class="servir_helper_topPadding_10rem"></div>
                                                                <div class="servir_text_fixedModal_mainTitle servir_helper_topPadding_10rem">HOW IT WORKS</div>
                                                                <div class="servir_text_fixedModal_subtext servir_helper_topPadding_10rem">
                                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod.<br />
                                                                    bibendum laoreet. Proin gravida dolor sit amet lacus
                                                                </div>
                                                                <div class="servir_text_fixedModal_fieldLabel servir_helper_topPadding_10rem">
                                                                    A Story Map could go here, <br />
                                                                    Or an embedded video could go here, <br />
                                                                    and/or another embedded video could go here, <br />
                                                                    PLACEHOLDER for Learning Center: TODO: Find out what 'tabs' need to be moved into here.. (This is from the meeting notes doc), <br />
                                                                </div>
                                                                <div class="servir_helper_topPadding_10rem">
  
                                                                    <button class="ui button servir_design2016_button_green_color servir_helper_width_132rem servir_helper_roundedCornerAll_Button" onclick="event_HowItWorksPage_GetStarted_Button_Clicked();">
                                                                        <div class="content servir_design2016_button_semiWide">
                                                                            <div class="center">
                                                                                <div class="servir_text_button_main">GET STARTED</div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div class="one wide column"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="four wide column"></div>
                                    </div>
                                </div>
                            </div>


                            <!-- SubPages: Progress Page (Aka "JobProgress") -->
                            <div id="subPage_JobProgress" class="servir_climateserv_subpage servir_helper_hidden">
                                <div class="ui grid">
                                    <div class="one column row">
                                        <!--<div class="four wide column"></div>-->
                                        <div class="sixteen wide column">
                                            <div class="ui segments servir_helper_roundedCornerAll_Override servir_popup_jobProgress_fixedWidth">
                                                <div class="ui segment servir_helper_roundedCornerTop_Override">
                                                    <div class="ui grid">
                                                        <div class="two column row">
                                                            <div class="left aligned column">
                                                                <div class="servir_text_fixedModal_subtleTitle">PROGRESS</div>
                                                            </div>
                                                            <div class="right aligned column">
                                                                <i class="close icon servir_text_fixedModal_subtleTitle servir_helper_cursor_Pointer" onclick="event_Progress_TopRightX_Clicked();"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="ui center aligned segment servir_helper_roundedCornerBottom_Override">
                                                    <div class="ui grid">
                                                        <div class="three column row">
                                                            <div class="one wide column"></div>
                                                            <div class="center aligned fourteen wide column">
                                                                <div class="servir_helper_topPadding_10rem"></div>
                                                                <div class="servir_text_fixedModal_mainTitle servir_helper_topPadding_10rem">PROGRESS</div>
                                                                <div class="servir_text_fixedModal_subtext servir_helper_topPadding_10rem">
                                                                    <!-- Sub Text here, Maybe a message about what happens when the progress is complete..-->
                                                                </div>
                                                                <br />
                                                                <div class="servir_helper_topPadding_10rem">
                                                                    <div class="ui indicating progress" data-value="-1" data-total="100" id="div_UI_Progress_Bar">
                                                                        <div class="bar"><div class="progress"></div></div>
                                                                    </div>
                                                                    <br />
                                                                    <div id="progresslabel" class="servir_text_fixedModal_fieldLabel">Waiting...</div> <!-- Legacy ID: progresslabel -->
                                                                    <br />
                                                                    <div id="requestId" class="servir_text_fixedModal_subtext">Job ID: (Waiting...)</div> <!-- Legacy ID: requestId -->
                                                                    <br />
                                                                    <div id="downloadFileURL" class="servir_text_fixedModal_fieldLabel"></div> <!-- Legacy ID: downloadFileURL -->
                                                                </div>
                                                            </div>
                                                            <div class="one wide column"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="four wide column"></div>-->
                                    </div>
                                </div>
                            </div>


                            <!-- SubPages: Chart UI (Aka "ChartUI") -->
                            <div id="subPage_ChartUI" class="servir_climateserv_subpage servir_helper_hidden">
                                <div class="ui grid">
                                    <div class="one column row">
                                        <!--<div class="one wide column"></div>-->
                                        <div class="sixteen wide column">
                                            <!-- fourteen -->
                                            <div class="ui segments servir_helper_roundedCornerAll_Override servir_popup_chartUI_fixedWidth">
                                                <div class="ui segment servir_helper_roundedCornerTop_Override">
                                                    <div class="ui grid">
                                                        <div class="two column row">
                                                            <div class="left aligned column">
                                                                <div class="servir_text_fixedModal_subtleTitle">CHART</div>
                                                            </div>
                                                            <div class="right aligned column">
                                                                <a href="javascript:void(0);" class="iconResponsive" onclick="displayMenu()">&#9776;</a>
                                                                <div id="respMenu" style="z-index:40;margin-top:4vw;margin-left:30vw;position:absolute;right:0;" class="icon-content">
                                                                    <a class="chart_menu" href="#" onclick="event_ChartUI_Button_StartOver_Clicked();"><b>Start Over</b> </a>
                                                                    <a class="chart_menu" href="#" onclick="event_ChartUI_Button_Back_Clicked();"><b>Change Parameters</b></a>
                                                                    <a class="chart_menu" href="#" onclick="event_ChartUI_Button_ExportToPolygon_Clicked();"><b>Export Polygon</b></a>

                                                                    <a class="chart_menu" href="#" onclick="event_ChartUI_Button_ExportToPNG_Clicked();"><b>Export To PNG</b></a>

                                                                    <a class="chart_menu" href="#" onclick="event_ChartUI_Button_ExportToCSV_Clicked();"><b>Export To CSV</b></a>
                                                                </div>

                                                                <i class="close icon servir_text_fixedModal_subtleTitle servir_helper_cursor_Pointer" onclick="event_ChartUI_TopRightX_Clicked();"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="ui center aligned segment servir_helper_roundedCornerBottom_Override">
                                                    <div class="ui grid">
                                                        <div class="three column row servir_helper_topPadding_0">
                                                            <div class="one wide column"></div>
                                                            <div class="center aligned fourteen wide column">
                                                                <div class="servir_helper_topPadding_0"></div> <!-- servir_helper_topPadding_10rem -->
                                                                <!--
                                            <div id="chartUI_Title" class="servir_text_fixedModal_mainTitle servir_helper_topPadding_10rem">CHART</div>
                                            -->
                                                                <div class="servir_text_fixedModal_subtext servir_helper_topPadding_10rem">
                                                                    <!-- Sub Text here, Maybe a message about what happens when the progress is complete..-->
                                                                </div>
                                                                <!-- <br /> -->

                                                                <div id="chartUI_AdjustableMinHeightDiv" class="">
                       
                                                                    <div id="chartUI_Loading_Popup" class="servir_helper_hidden" style="position:absolute; color:black; background-color: #dddddd; padding: 2rem; border-radius: 15px; opacity: 0.9; top: 50px; left: 25%; width: 50%;">
                                                                        <div id="chartUI_Loading_Title">LOADING CHART</div>
                                                                        <br />
                                                                        <div class="ui active progress" id="chartUI_ChartLoading_ProgressBar">
                                                                            <div class="bar">
                                                                                <div class="progress" style="display:none;"></div>
                                                                            </div>
                                                                        </div>
                                                                        <div id="chartUI_Loading_Message">Plotting: 12345 data points.</div>
                                                                        <br />
                                                                        (Note: There may be a delay for rendering and resizing charts with a large number of data points.<br />
                                                                    </div>
                                                                    <!-- Legacy Chart -->
                                                                    <div id="chartWindow" style="margin-bottom: -5rem; display:none;"></div>


                                                                    <div class="ui grid">
                                                                        <div class="one column row one column row servir_helper_topbotMargin_0 servir_helper_topbotPadding_01">
                                                                            <div class="center aligned sixteen wide column">
                                                                                <span id="chartUI_ChartCreatedDate_Label" class="servir_text_fixedModal_subtext">Chart created on: </span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="one column row">
                                                                            <div class="center aligned sixteen wide column">
                                                                                <!-- [Start Over] Button Classes: servir_buttonHelper_customPadding servir_helper_width_112rem -->
                                                                                <button id='chartUI_ButtonContainer_Back' class="ui button servir_buttonHelper_customShape_chart1 servir_design2016_button_grey_color servir_helper_roundedCornerAll_Button" onclick="event_ChartUI_Button_StartOver_Clicked();">
                                                                                    <div class="content servir_design2016_button_narrow">
                                                                                        <div class="center">
                                                                                            <div class="servir_text_button_main servir_helper_fontSize_Override_14px">Start Over</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                                &nbsp;
                                                                                <!-- [Back] servir_buttonHelper_customPadding servir_helper_width_142rem -->
                                                                                <button id='chartUI_ButtonContainer_Back' class="ui button servir_buttonHelper_customShape_chart2 servir_design2016_button_grey_color servir_helper_roundedCornerAll_Button" onclick="event_ChartUI_Button_Back_Clicked();">
                                                                                    <div class="content servir_design2016_button_narrow">
                                                                                        <div class="center">
                                                                                            <div class="servir_text_button_main servir_helper_fontSize_Override_14px">Change Parameters</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                                &nbsp;
                                                                                <!-- [Export Polygon] servir_design2016_button_grey_color,   newer:: servir_buttonHelper_customPadding  servir_helper_width_112rem -->
                                                                                <button id='chartUI_ButtonContainer_ExportPolygon' class="ui button servir_buttonHelper_customShape_chart3 servir_design2016_button_chartgreen_color servir_helper_roundedCornerAll_Button" onclick="event_ChartUI_Button_ExportToPolygon_Clicked();">
                                                                                    <div class="content servir_design2016_button_narrow">
                                                                                        <div class="center">
                                                                                            <div class="servir_text_button_main_09Text servir_helper_fontSize_Override_14px">Export Polygon</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                                &nbsp;
                                                                                <!-- [Export to PNG] servir_design2016_button_grey_color,    newer: servir_buttonHelper_customPadding servir_helper_width_112rem -->
                                                                                <button id='chartUI_ButtonContainer_ExportToPNG' class="ui button servir_buttonHelper_customShape_chart4 servir_design2016_button_chartgreen_color servir_helper_roundedCornerAll_Button" onclick="event_ChartUI_Button_ExportToPNG_Clicked();">
                                                                                    <div class="content servir_design2016_button_narrow">
                                                                                        <div class="center">
                                                                                            <div class="servir_text_button_main servir_helper_fontSize_Override_14px">Export To PNG</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>
                                                                                &nbsp;
                                                                                <!-- [Export to CSV] servir_design2016_button_grey_color,   newer: servir_buttonHelper_customPadding servir_helper_width_112rem -->
                                                                                <button id='chartUI_ButtonContainer_ExportToCSV' class="ui button servir_buttonHelper_customShape_chart5 servir_design2016_button_chartgreen_color servir_helper_roundedCornerAll_Button" onclick="event_ChartUI_Button_ExportToCSV_Clicked();">
                                                                                    <div class="content servir_design2016_button_narrow">
                                                                                        <div class="center">
                                                                                            <div class="servir_text_button_main servir_helper_fontSize_Override_14px">Export To CSV</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </button>




                                                                                <!-- Alternative layout (no screenshot), logo to the right -->
                                                                                &nbsp;
                                                                                <!-- Logo(s) container -->
                                                                                <div id="logo-servir" style='position:absolute; right:-2em; bottom:-2em;padding-bottom:30px;'>
                                                                                    <img style="width:60px; height:60px;padding-left:20px;" src="img/Servir_Logo_Full_Color_Stacked2.jpg">
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                     

                                                                    </div>


                                                                </div>

                                                            </div>
                                                            <div class="one wide column"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="one wide column"></div>-->
                                    </div>
                                </div>
                            </div>

                            <!-- Another Sub Page Container could go at this level. -->

                        </div>
                        <div class='servir_topMap_Message_Container servir_helper_hidden' id='div_MapMessageContainer'>
                            <div class="ui yellow message servir_helper_hidden" id='div_MapMessage_AnotherMessage'>
                                <div class="header">
                                    Show Another Message Here. Click done when finished.&nbsp;&nbsp;&nbsp; <button class="ui blue button" onclick=''>CUSTOM HTML</button>
                                </div>
                            </div>
                            <div class="ui yellow message servir_helper_hidden" id='div_MapMessage_DrawPolygon'>
                                <div class="header">
                                    Draw a closed polygon on the map.
                                    <!-- Hide the Done Drawing button ( 'end_UserPolygonDrawing()' is now chained to the event of a closed polygon being defined.
                Click done when finished.&nbsp;&nbsp;&nbsp;
                <button class="ui blue button" onclick='end_UserPolygonDrawing();'>DONE DRAWING</button>
                -->
                                </div>
                            </div>
                            <div class="ui yellow message servir_helper_hidden" id='div_MapMessage_SelectFeatures'>
                                <div class="header">
                                    Select features on the map. Click done when finished.&nbsp;&nbsp;&nbsp; <button class="ui blue button" onclick='end_UserFeatureSelection();'>DONE SELECTING</button>
                                </div>
                            </div>
                            <div class="ui yellow message servir_helper_hidden" id='div_MapMessage_GeoJSONUpload'>
                                <div class="header">
                                    Upload GeoJSON file. Click done when finished.&nbsp;&nbsp;&nbsp;
                                    <br />
                                    <br />
                                    <div class="stitched_drop" style="height:150px" id="drop_zone">
                                        <center>
                                            <img style="vertical-align: middle;" src="img/browser-upload.png">
                                            <font size="3">Drop GeoJSON file here</font>
                                        </center>
                                    </div>
                                    <div id="GeoJSON_File_Upload_Indicator">No data loaded.</div>
                                    <br />
                                    <br />
                                    <button class="ui blue button" onclick='end_UserGeoJSONUpload();'>DONE UPLOADING</button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            
			<!-- Refactor: Removing the side bar and pusher parts
			</div> --><!-- End of pusher div -->
        
		<!-- Refactor: Removing the side bar and pusher parts
		</div> --> <!-- End of content section sidebar container -->
        
    </div>

    <div id="aboutus_modal" class="aboutus_modal">

        <!-- Modal content -->
        <div class="about-modal-content">
            <span class="aboutus_close">&times;</span>
            <h2>About (Organization name)</h2>
            <h4><i>Some info about organization and the application...</i></h4>
        </div>

    </div>
    <div class="footer">
        <img src="img/footer/servir_global_logo.png" style="float:left;padding-top:5px" />
        <img src="img/footer/NASA_logo21.png" width="30" height="30" style="float:right;padding-top:10px" />
        <img src="img/footer/USAID1.png" width="60" height="30" style="float:right;padding-top:10px" />
        <a href="#" id="aboutus_link"style="float:right;padding-top:10px;padding-right:10px;color:darkblue">About Us</a>
   
    </div>

   
<div id="popup_SelectData_DataSource_ToolTip" class="ui inverted popup servir_helper_width_215rem">    
  <div class="servir_tooltip_header">CHIRPS Rainfall</div>
  <div class="servir_tooltip_body">Climate Hazards group IR Precipitation with Stations (CHIRPS).</div>
  <br />
  <div class="servir_tooltip_header">eMODIS NDVI</div>
  <div class="servir_tooltip_body">MODIS-derived Normalized Difference Vegetation Index (eMODIS NDVI).  NDVI datasets for the following regions are available: West Africa, East Africa, Southern Africa, and Central Asia</div>
  <br />
  <div class="servir_tooltip_header">Seasonal Forecast</div>
  <div class="servir_tooltip_body">North American Multi-Model Ensemble (NMME).  Up to 180 day forecast models available.  This dataset supports download capabilities.</div>
  <br />
  <div class="servir_tooltip_header">IMERG 1 Day</div>
  <div class="servir_tooltip_body">1 Day rainfall accumulations product from the Integrated Multi-satellitE Retrievals (IMERG) for Global Precipitation Mission (GPM).</div>
</div>

<!-- GetData_OperationType_ToolTip -->
<div id="popup_SelectData_Calculations_ToolTip" class="ui inverted popup servir_helper_width_215rem">    
  <div class="servir_tooltip_header">Min</div>
  <div class="servir_tooltip_body">The minimum value found for all data in a given geographical selected area for each time interval in the date range.  Sometimes for large area selections, a value of 0 will be returned for every date.  If this happens, try selecting a smaller area.</div>
  <!--<div class="servir_tooltip_link" onclick="alert('hook me up to something!!');">Learn more</div>-->
  <br />
  <div class="servir_tooltip_header">Max</div>
  <div class="servir_tooltip_body">The maximum value found for all data in a given geographical selected area for each time interval in the selected date range.</div>
  <br />
  <div class="servir_tooltip_header">Average</div>
  <div class="servir_tooltip_body">The average value for the entire geographical selected area for each time interval in the selected date range.</div>
  <br />
  <div class="servir_tooltip_header">Download</div>
  <div class="servir_tooltip_body">Some datasets support the option to download a zip file of clipped raw data.  The format of data download is a single zip file which contains a set of geotif files for each time interval in the date selected range.</div>
</div>
    <div id="popup_SelectData_DataSource_ToolTip1"> </div>
    <div id="popup_SelectData_Calculations_ToolTip1"> </div>
<script src="js/timeline.js"></script>
<script type="text/javascript" src="js/addLayers.js"></script>
<script type="text/javascript" src="js/timelineGenerator.js"></script>
<script>
    
 
  
    
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-27020636-4', 'auto');
    ga('send', 'pageview');

  
</script>
</body>
</html>