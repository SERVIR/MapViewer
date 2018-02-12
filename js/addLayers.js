

var acc = document.getElementsByClassName("data_expandable");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var panel = this.nextElementSibling;



        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }

    });
}
// index.html loose javascript (mostly map and map interaction items in here)

var show_CHIRPS_Custom_GIS_Labels = false;  // KS Refactor Design 2016 Override // Setting this to false hides the functionality which grabs the custom CHIRPS server's Labels (some base maps have their own labels which is why we may need this)
var selectedFeatures = [];
var selectedLayer = 0;
var wmsbaseURL = "http://localhost/";
var polygonIsDefined = false;
var centerOfMap;
var zoomLevel = 4;
var clickEnabled = false;
var currentStringPolygon = "";

//Define projections to be used
var proj4326 = ol.proj.get('EPSG:4326');
var proj3857 = ol.proj.get('EPSG:3857');
var proj102100 = ol.proj.get('EPSG:102100');

//Define layers in a layer array for adding to mao
var tileLayers = [];
var hLayers = [];
var layerNames = [];
var layerIds = [];
var showLabel = false;
var hLayerURL = baseWMSurl + '&SERVICE=WMS&VERSION=1.1.1';

//Source Layer for the Vector being drawn by the user
var source = new ol.source.Vector();

//Actual OpenLayers Vector layer that is being drawn
var vectorLayer = new ol.layer.Vector(
{
    source: source,
    style: new ol.style.Style(
    {
        fill: new ol.style.Fill(
        {
            // color: 'rgba(204, 251, 255, 0.6)'
            // KS Refactor Design 2016 Override // New Color for Polygon on Map
            color: 'rgba(0, 176, 255, 0.8)' // '#00b0ff90' 

        }),
        stroke: new ol.style.Stroke(
        {
            // color: '#00ccff',
            // KS Refactor Design 2016 Override // New Color for Polygon on Map
            color: '#224466', //'#00b0ff', //'#00ccff',
            width: 2 // 5
        }),
        image: new ol.style.Circle(
        {
            radius: 15,
            fill: new ol.style.Fill(
            {
                color: 'rgba(0, 176, 255, 0.8)' //'#00ccff'
            })
        })
    })
});

// Info for New Layers
// var wmsBaseUrl = "http://climateserv.servirglobal.net/cgi-bin/servirmap_102100?";
// 
// Change 'proj4326' to 'proj3857'

// Source for Base Layer (OPENLAYERS.source.WMTS)

// // KS Refactor Design 2016 Override // Attempting to Change the base map layer
// var sourceBase = new ol.source.TileWMS( { url: 'https://ahocevar.com/geoserver/wms', params: {'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'} } );

// variable, 'sourceBase' is the openlayers base map reference used in other parts of the code.
// https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/WMTS/1.0.0/WMTSCapabilities.xml

// sourceBase_ESRI_TOPO
var sourceBase = new ol.source.WMTS(
{
    //crossOrigin: 'anonymous',         // // KS Refactor Design 2016 Override // This should enable screenshot export around the CORS issue with Canvas.
    url: "https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/WMTS/",
    layer: "World_Topo_Map",
    format: "image/jpeg",
    matrixSet: "EPSG:3857", //"EPSG3857",
    tileGrid: new ol.tilegrid.WMTS(
    {
        origin: [-20037508.3428, 20037508.3428], // [ -2.0037508342787E7, 2.0037508342787E7 ]  //[-180, 90],
        resolutions: [
            156543.03392800014, // 0 // 0.5625,
            78271.51696399994,  // 1 // 0.28125,
            39135.75848200009,  // 2 // 0.140625,
            19567.87924099992,  // 3 // 0.0703125,
            9783.93962049996,   // 4 // 0.03515625,
            4891.96981024998,   // 5 // 0.017578125,
            2445.98490512499,   // 6 // 0.0087890625,
            1222.992452562495,  // 7 // 0.00439453125,
            611.4962262813797,  // 8 // 0.002197265625
            305.74811314055756, // 9 //
            152.87405657041106, // 10
            76.43702828507324,  // 11
            38.21851414253662,  // 12
            19.10925707126831,  // 13
            9.554628535634155,  // 14
            4.77731426794937,   // 15
            2.388657133974685,  // 16
            1.1943285668550503, // 17
            0.5971642835598172, // 18
            0.29858214164761665, // 19
            0.14929107082380833, // 20
            0.07464553541190416, // 21
            0.03732276770595208, // 22
            0.01866138385297604, // 23
        ],
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        tileSize: 256
    })
});

// Original Base Map
//var sourceBase = new ol.source.WMTS(
var sourceBase_Original = new ol.source.WMTS(
{
    //crossOrigin: 'anonymous',         // // KS Refactor Design 2016 Override // This should enable screenshot export around the CORS issue with Canvas.
    url: "//map1{a-c}.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?",
    layer: "BlueMarble_ShadedRelief_Bathymetry",
    format: "image/jpeg",
    matrixSet: "EPSG4326_500m",
    tileGrid: new ol.tilegrid.WMTS(
    {
        origin: [-180, 90],
        resolutions: [
            0.5625,
            0.28125,
            0.140625,
            0.0703125,
            0.03515625,
            0.017578125,
            0.0087890625,
            0.00439453125,
            0.002197265625
        ],
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        tileSize: 512
    })
});

// Base Layer (OPENLAYERS.layer.Tile
var baseLayer = new ol.layer.Tile(
{
    source: sourceBase
});

//Base layer for map
//            var baseLayer = new ol.layer.Tile({
//                source: new ol.source.TileWMS({
//                    url: 'http://gmrt.marine-geo.org/cgi-bin/mapserv?map=/public/mgg/web/gmrt.marine-geo.org/htdocs/services/map/wms_merc.map',
//                    params: {
//                        'LAYERS': 'topo'
//                    }
//                })
//            });



// Openlayers View
var view = new ol.View(
{
    center: mapParams.center,
    zoom: mapParams.zoom,
    projection: 'EPSG:3857' //'EPSG:3857' //EPSG:4326'  // KS Refactor Design 2016 // Changing Map Layers from 4326 to 3857
});

//Create map for the display of the data  
var map = new ol.Map(
{
    target: 'map',
    layers: [baseLayer],
    controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
    view: view

});


// Add a new layer to the map
function addLayer(layerName, layerid, visible) {
    // Create a new 'OPENLAYERS.layer.Tile
    var tileLayer = new ol.layer.Tile(
    {
        source: new ol.source.TileWMS((
        {
            //crossOrigin: 'anonymous',         // // KS Refactor Design 2016 Override // This should enable screenshot export around the CORS issue with Canvas.
            url: hLayerURL,
            params: { 'LAYERS': layerid, 'TILED': true, },
            serverType: 'mapserv'
        }))
    });

    //Define country level map layer
    var tileLayerh = new ol.layer.Tile(
    {
        source: new ol.source.TileWMS((
        {
            //crossOrigin: 'anonymous',         // // KS Refactor Design 2016 Override // This should enable screenshot export around the CORS issue with Canvas.
            url: hLayerURL,
            params: { 'LAYERS': layerid + '_highlight', 'TILED': true },
            serverType: 'mapserv'
        }))
    });

    tileLayer.setVisible(visible);
    tileLayerh.setVisible(false);
    tileLayers.push(tileLayer);
    hLayers.push(tileLayerh);
    layerNames.push(layerName);
    layerIds.push(layerid);
    redoLayers();
}

var gLayers = [];
function addLayersUI() {
    var layerarr = [];
    var x = 0;
    var idArr = [];
    var catArr = [];
    var nameArr = [];

    for (var c = 0; c < layerArray.length; c++) {
        var ll = new ol.layer.Tile({

            source: new ol.source.TileWMS({
                url: layerArray[c].url,
                params: {
                    'LAYERS': layerArray[c].layers, 'TILED': true, 'srs': 'EPSG:3857'
                },
                serverType: 'mapserv'
            })
        });
        idArr.push(layerArray[c].id);
        catArr.push(layerArray[c].category);
        nameArr.push(layerArray[c].name);
        layerarr.push(ll);
    }

    layerarr.forEach(function (layer) {
        x++;
        layerName = idArr[x - 1];
        var input = document.createElement("input");
        input.type = "range";
        input.className = "css-class-name";
        input.id = layerName + "_op";
        input.min = 0;
        input.max = 1;
        input.step = 0.1;
        input.value = 1;
        input.onchange = function () {

            layer.setOpacity(input.value);

        };
        layer.setVisible(false);
        var str = layerName;
        var n = str.replace(/\s/g, '');
        var container = document.getElementById("toggle");
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "checkBox" + n;
        checkbox.value = n;
        checkbox.id = "check";
        checkbox.checked = false;
        checkbox.onchange = function () {
            layer.setVisible(this.checked);
        };

        var iDiv = document.createElement('div');
        iDiv.className = nameArr[x - 1];
        iDiv.id = idArr[x - 1];
        iDiv.style.display = "block";
        var labelh = document.createElement('label')
        labelh.htmlFor = catArr[x - 1];
        labelh.className = "expandables";
        labelh.style.cursor = "pointer";
        labelh.onclick = function () {
            var panel = $(this).siblings();
            for (var i = 0; i < panel.length; i++) {

                if (panel[i].style.display == "block") {
                    panel[i].style.display = "none";
                } else {
                    panel[i].style.display = "block";
                }
            }

        };
        labelh.onmouseover = function () {
            labelh.style.filter = "contrast(450%)";
            labelh.style.textDecoration = "underline";

        };
        labelh.onmouseout = function () {
            labelh.style.filter = "contrast(100%)";
            labelh.style.textDecoration = "none";

        };
        labelh.style.fontSize = "x-large";
        labelh.style.paddingBottom = "5px";
        labelh.style.color = "steelblue";
        labelh.appendChild(document.createTextNode(catArr[x - 1]));
        var label = document.createElement('a')
        label.setAttribute("href", "#");

        label.style.width = "225px";
        label.innerHTML = nameArr[x - 1];
        label.style.paddingLeft = "5px";
        label.style.paddingBottom = "10px";
        label.style.paddingTop = "10px";
        label.style.color = "peru";
        label.style.display = "inline-block";

        label.style.fontSize = "large";
        var time = document.createElement('a');
        time.setAttribute("href", "#");
        time.id = "time" + n;
        time.style.paddingLeft = "15px";
        time.innerHTML = '<img src="img/main/time.png" width="20 height="20"/>';
        time.onclick = function () {
            time.classList.toggle("active");

            if (time.classList.contains("active")) {
                time.style.opacity = 0.5;
                var iden = this.parentNode.id;

                for (var d = 0; d < idArr.length; d++) {
                    if (idArr[d] == iden) {
                        turl = layerArray[d].url;
                        tlyr = layerArray[d].layers;
                        currLayer = layer;
                        setTime();
                    }
                }

            }
            else { time.style.opacity = 1; }

        };
        time.style.position = "absolute";
        time.style.paddingTop = "10px";
        time.style.paddingRight = "15px";
        time.style.paddingLeft = "0px";
        var catDiv = document.createElement('div');

        if (container.getElementsByClassName(catArr[x - 1]).length == 0) {
            catDiv.className = catArr[x - 1];
            catDiv.appendChild(labelh);
            container.appendChild(catDiv);
        }
        else {
            catDiv = document.getElementsByClassName(catArr[x - 1])[0];
        }

        var menus = document.createElement('div');
        var menucon = document.createElement('div');
        var str = layerName;
        var n = str.replace(/\s/g, '');
        menus.className = "menu" + n;

        menucon.id = "mc" + n;
        var inf = document.createElement('a');
        inf.setAttribute("href", "#");
        inf.id = "btn" + n;
        inf.style.paddingLeft = "15px";
        inf.innerHTML = '<img src="img/info.png" width="20 height="20"/>';
        inf.onclick = function () {
            var iden = this.parentNode.parentNode.parentNode.id;

            for (var i = 0; i < idArr.length; i++) {
                if (idArr[i] == iden) {
                    document.getElementById("provider_url").innerHTML = layerArray[i].url;
                    document.getElementById("legend_url").src = layerArray[i].legend_url;
                    document.getElementById("provider_url").style.wordWrap = "break-word";
                    document.getElementById("layer_name").innerHTML = layerArray[i].name;
                    document.getElementById("layer_desc").innerHTML = layerArray[i].description;

                }
            }
            document.getElementById("detail_popup").style.display = "block";
        }
        menucon.style.display = "none";
        menucon.style.background = $("#chg").val();
        menucon.style.padding = "10px";
        menucon.style.color = "#fff";
        label.onclick = function () {
            $("#mc" + n).slideToggle();
            menus.style.display = "";
            return false;
        };

        menucon.appendChild(input);
        menucon.appendChild(inf);

        menus.appendChild(menucon);

        iDiv.appendChild(checkbox);
        iDiv.appendChild(label);
        var iden = this.id;


        if (layerArray[x - 1].timeseries == "yes")
            iDiv.appendChild(time);



        iDiv.appendChild(menus);

        catDiv.appendChild(iDiv);
        gLayers[0] = layer;
        map.addLayer(layer);
    })
    //  gLayers[0] = layer;
    //  map.addLayer(layerarr);


}




function setMapType(type) {

    //to add it again to position 0 (layerName is the variable name you assigned the layer to
    var sources = {
        urls: ["https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/WMTS/",
                "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/WMTS/",
                "https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/WMTS",
                "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"],
        layers: ["World_Topo_Map", "World_Dark_Gray_Base", "World_Light_Gray_Base", "orthographic"],
        id: ["topo", "dark", "light", "orthographic"]
    };
    for (var i = 0; i < sources.id.length; i++) {
        if (type == sources.id[i]) {
            if (type == "dark" || type == "orthographic") {
                maptype = "dark";

            }
            else {
                maptype = "";
            }

            changeIcon(maptype, "#b_image", "map", "green");

            changeIcon(maptype, "#l_image", "layer", "");
            changeIcon(maptype, "#d_image", "download", "");
            var sourceMap = new ol.source.WMTS(
            {
                //crossOrigin: 'anonymous',         // // KS Refactor Design 2016 Override // This should enable screenshot export around the CORS issue with Canvas.
                url: sources.urls[i],
                layer: sources.layers[i],
                format: "image/jpeg",
                matrixSet: "EPSG:3857", //"EPSG3857",
                tileGrid: new ol.tilegrid.WMTS(
                {
                    origin: [-20037508.3428, 20037508.3428], // [ -2.0037508342787E7, 2.0037508342787E7 ]  //[-180, 90],
                    resolutions: [
                        156543.03392800014, // 0 // 0.5625,
                        78271.51696399994,  // 1 // 0.28125,
                        39135.75848200009,  // 2 // 0.140625,
                        19567.87924099992,  // 3 // 0.0703125,
                        9783.93962049996,   // 4 // 0.03515625,
                        4891.96981024998,   // 5 // 0.017578125,
                        2445.98490512499,   // 6 // 0.0087890625,
                        1222.992452562495,  // 7 // 0.00439453125,
                        611.4962262813797,  // 8 // 0.002197265625
                        305.74811314055756, // 9 //
                        152.87405657041106, // 10
                        76.43702828507324,  // 11
                        38.21851414253662,  // 12
                        19.10925707126831,  // 13
                        9.554628535634155,  // 14
                        4.77731426794937,   // 15
                        2.388657133974685,  // 16
                        1.1943285668550503, // 17
                        0.5971642835598172, // 18
                        0.29858214164761665, // 19
                        0.14929107082380833, // 20
                        0.07464553541190416, // 21
                        0.03732276770595208, // 22
                        0.01866138385297604, // 23
                    ],
                    matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    tileSize: 256
                })
            });
            baseLayer.setSource(sourceMap);
            break;
        }
    }

}

//function addLayerSMAP() {
//    var url_smap = 'http://servirglobal-gis.stage.nasawestprime.com/arcgis/rest/services/Global/SoilMoisture/MapServer';


//    var layer_smap = new ol.layer.Tile({

//        source: new ol.source.TileArcGISRest({
//            url: url_smap
//        })
//    });
//    gLayers[1]=layer_smap;
//    map.addLayer(layer_smap);

//}


// Forces openlayers to Redraw all the layers??  (maybe required on an update of somekind?) 
// Right now this is only used by 'addLayer', so perhaps at the end of adding a layer this needs to be done to update something related to openlayers.. 
function redoLayers() {
    var layers = map.getLayers();
    layers.clear();
    layers.push(baseLayer);
    for (i in tileLayers) {
        layers.push(tileLayers[i]);
    }
    for (i in hLayers) {
        layers.push(hLayers[i]);
    }
    layers.push(vectorLayer);
}



// Respond to user clicking on the page.. Gets the coordinate of where the user clicked and passes that on to 
function respondToClicks(evt) {
    // KS Refactor Design 2016 // Changing Map Layers from 4326 to 3857 
    //var url =  tileLayers[selectedLayer].getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 'EPSG:4326',{'INFO_FORMAT': 'json'});
    var url = tileLayers[selectedLayer].getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 'EPSG:102100', { 'INFO_FORMAT': 'json' });
    if (url) {
        //console.log(url);
        processClickPoint(url);
    }
}

// Create drawing interaction layer. This layer will contain the actual drawing of the polygon
var draw = new ol.interaction.Draw(
{
    source: source,
    type: "Polygon"
});


// NOTE: THIS FUNCTION FIRES WHEN A POLYGON IS DRAWN OR A GEOJSON WAS UPLOADED... (both of those processes push through the vector feature infrastructure located here.
//Setup callback so that when polygon defined it can be processed. This function will process the polygon
source.on("change", function (e) {
    geoJson = new ol.format.GeoJSON();
    features = source.getFeatures();
    if (features.length > 0) {
        geom = features[0].getGeometry();
        // KS Refactor Design 2016 // Changing Map Layers from 4326 to 3857
        //output = geoJson.writeGeometry(geom, {dataProjection: proj4326, featureProjection: proj4326});
        //output = geoJson.writeGeometry(geom, {dataProjection: proj3857, featureProjection: proj3857});
        output = geoJson.writeGeometry(geom, { dataProjection: proj102100, featureProjection: proj102100 });


        ///set polygon to got to server 
        //console.log('source.on("change", function (e), WAS CALLLED ');
        currentStringPolygon = JSON.stringify(output);
        setPolygonIsDefined(true);
        disableCustomPolygonDrawing();
        //zoomToPolygon();     // This zooms into the center of the polygon.

        // KS Refactor Design 2016, we ONLY want this to fire if the user was just drawing a polygon, not when a geoJSON was uploaded..
        if (stateSwitchManagement_PolyDraw_or_GeoJSONUpload__IsPolyDraw == true) {
            end_UserPolygonDrawing(); // KS Refactor Design 2016 // This used to be the hook from the 'Done Drawing' button.  Now it is chained to this event. (the event of the polygon being closed.
        }

    }
});

// Get GeoJSON from a polygon
function getCurrentPolygonAsGeoJson() {
    geoJson = new ol.format.GeoJSON();
    feature = source.getFeatures();
    // KS Refactor Design 2016 // Changing Map Layers from 4326 to 3857
    //output = geoJson.writeFeatures(feature, {dataProjection: proj4326, featureProjection: proj4326});
    //output = geoJson.writeFeatures(feature, {dataProjection: proj3857, featureProjection: proj3857});
    output = geoJson.writeFeatures(feature, { dataProjection: proj102100, featureProjection: proj102100 });

    ///set polygon to got to server 
    return JSON.stringify(output);

}

function updateSelectedHighlightedLayer() {
    hLayers[selectedLayer].getSource().setUrl(hLayerURL + "&feat_ids=" + selectedFeatures.join());
}



// Show label?? (not sure what label we are toggling here?)
function toggleLabel() {
    var appended = "";

    if (showLabel === false) {
        showLabel = true;
        // KS Refactor Design 2016 // Shortcut to turnning on and off the country layer functionality.
        //tileLayers[0].setVisible(false); // Turn the layer on (without breaking the feature selection functionality)

        if (show_CHIRPS_Custom_GIS_Labels == true) {
            appended = "_label";
        }
        else {
            appended = "";
        }
    }
    else {
        showLabel = false;

        // KS Refactor Design 2016 // Shortcut to turnning on and off the country layer functionality.
        //tileLayers[0].setVisible(true); // Turn the layer on (without breaking the feature selection functionality)

        appended = "";
    }

    for (i = 0; i < tileLayers.length; i++) {
        var param = tileLayers[i].getSource().getParams();
        param.LAYERS = layerIds[i] + appended;
        tileLayers[i].getSource().updateParams(param);
    }
}


// Process Click Point 
function processClickPoint(url) {
    $("#geometry_edit_button").text("Modify Location");
    url = url + "&callback=?";
    $.ajax(
    {
        type: "GET",
        url: url,
        async: 'true',
        jsonpCallback: 'successCallback',
        dataType: 'jsonp',
        success: function (result) {
            value = result["data"];
            if (selectedFeatures.indexOf(value) != -1) {
                index = selectedFeatures.indexOf(value);
                delete selectedFeatures[index];
            }
            else {
                selectedFeatures.push(value);
            }
            if (selectedFeatures.length > 0) {
                enableCreateGraphLink();
            }
            updateSelectedHighlightedLayer();
        },
        error: function (error) {
            console.log("Got error" + error);
        },
        successCallback: function () {

        },
    });
}

// Zoom the map to the polygon
function zoomToPolygon() {
    var geomExtent = source.getExtent();
    var newCenter = [(geomExtent[0] + geomExtent[2]) / 2.0, (geomExtent[1] + geomExtent[3]) / 2.0];
    view.setCenter(newCenter);
}

//Function to enable custom drawing of polygons.
function enableCustomPolygonDrawing() {
    if (clickEnabled === true) {
        disableFeatureSelection();
    }
    map.addInteraction(draw);
}

//Function to disable custom polygon drawing.
function disableCustomPolygonDrawing() {
    map.removeInteraction(draw);
}

// Set Selection Layer
function setSelectionLayer(layer_num) {
    if (layer_num != selectedLayer) {
        selectedFeatures = [];
    }
    tileLayers[selectedLayer].setVisible(false);
    hLayers[selectedLayer].setVisible(false);
    selectedLayer = layer_num;
    tileLayers[selectedLayer].setVisible(true);
    hLayers[selectedLayer].setVisible(true);
    updateSelectedHighlightedLayer();
}

//Enable selecting of a single feature on the map.
function enableFeatureSelection() {
    if (clickEnabled === false) {
        map.on('singleclick', respondToClicks);
        selectedFeatures = [];
        clickEnabled = true;
    }
}

//Disable selecting of a single feature on the map.
function disableFeatureSelection() {
    map.un('singleclick', respondToClicks);
    selectedFeatures = [];
    hLayers[selectedLayer].setVisible(false);
    clickEnabled = false;
}

//Clear the polygon from the layer.
function clearPolygon() {
    source.clear();
    currentStringPolygon = "";
    setPolygonIsDefined(false);
    disableCustomPolygonDrawing();
}

//Function that given a geojson entry can add it to the map.
function setPolygonWithGeoJSON(text) {
    //alert(text);
    // KS Refactor Design 2016 // Adding a filter to convert the GeoJSON from 4326 to 102100 (the google projection) // GeoJSONs are to be in LatLngs..
    // GeoJSON Example (Example of the 'text' variable) 
    // {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[13.710937500000009,14.008696370634652],[76.99218749999999,14.51978004632609],[78.22265624999999,-5.17848208852287],[14.238281249999995,-4.828259746866976],[13.710937500000009,14.008696370634652]]]}}]}
    text = convert_PolygonString_To_102100_ForSystemInput(text);
    //alert(text);

    geoJson = new ol.format.GeoJSON();
    // KS Refactor Design 2016 // Changing Map Layers from 4326 to 3857
    //feature = geoJson.readFeatures(text, {dataProjection: proj4326, featureProjection: proj4326});
    //feature = geoJson.readFeatures(text, {dataProjection: proj3857, featureProjection: proj3857});
    feature = geoJson.readFeatures(text, { dataProjection: proj102100, featureProjection: proj102100 });

    vectorLayer.getSource().clear();
    vectorLayer.getSource().addFeature(feature[0]);
    centerOfNewPoly = calculateCenterOfGeom(feature[0].getGeometry());
}

//Calculate the center of a geometry in order to center the map.
function calculateCenterOfGeom(geom) {
    extent = geom.getExtent();
    xcenter = (extent[2] + extent[0]) / 2.0;
    ycenter = (extent[1] + extent[3]) / 2.0;
    return [xcenter, ycenter];
}

//If a user wants to load a GeoJSON file this handles the file selection.
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var f = evt.dataTransfer.files[0]; // FileList object.

    // files is a FileList of File objects. List some properties.

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (f) {
        return function (e) {
            setPolygonWithGeoJSON(e.target.result);
            //$("#loadGeoJsonDialog").dialog("close");  // KS Refactor Design 2016 Override // Dialog is no longer part of the page.
            set_GeoJSON_File_Upload_Indicator("GeoJSON Loaded.  Please visually verify the area on the map.");
        };
    })(f);
    reader.readAsText(f);
}

//Function to handle drag and drop.
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    //set_GeoJSON_File_Upload_Indicator("File is being dragged over... now drop!");  // KS Refactor Design 2016 Override // If we want to put a message that the file is being dragged over but not yet dropped?
}






// REMEMBER, THIS CODE HERE EXECUTES AS SOON AS THE BROWSER REACHES IT.... NOT GOOD TIMES.
//
//Setup of initial dialogs and closes or opens them based on initial state.
$(function () {
    // Moving some code to the Design2016 js file to account for async unpredictability. (The code moved will execute on doc ready instead of at this point in the interpreting)
    //    checkMaintenanceMode();
    //    getParameterTypes();
    //    getFeatureLayers();
    //    // KS Refactor 2015 // Set up for Climate Model Infos
    //    getClimateModelInfo();
    //    // KS Refactor for Imerg and Smap, // Get info for these datasets
    //    getCapabilitiesForDataset(26);  // Imerg 1 Day
    //    //getCapabilitiesForDataset(27);  // Smap

    $("#progressdialog").dialog();
    $("#progressdialog").dialog("close");
    $("#editordialog").dialog();
    $("#editordialog").dialog("close");
    $("#polygondialog").dialog();
    $("#polygondialog").dialog("close");
    $("#chartdialog").dialog();
    $("#chartdialog").dialog("close");
    $("#selectAreaDialog").dialog();
    $("#selectAreaDialog").dialog("close");
    $("#chooseAreaMethodDialog").dialog();
    $("#chooseAreaMethodDialog").dialog("close");
    $("#loadGeoJsonDialog").dialog();
    $("#loadGeoJsonDialog").dialog("close");
    $("#selectInformationDialog").dialog();
    $("#selectInformationDialog").dialog("close");
    $("#cancelbutton").click(function () {
        closeNewEditorDialog();
    });

    $("#datepickerbegin").datepicker();
    $("#datepickerend").datepicker();
    $('#selectlayer').change(function () {
        var count = 0;
        $("#selectlayer option").each(function () {
            tileLayers[count].setVisible(this.selected);
            ++count;
        });
    });
    $('#showLabels').change(function () {
        toggleLabel();
    });

    $('#selectmenu').change(function () {
        start_UserFeatureSelection();
        g_Dimmer_Current_HideTime = 10;
        hide_Content_Dimmer();
        g_Dimmer_Current_HideTime = 500;
        // KS Refactor Design 2016 Override // Handler for dropdown change.. changes the Select Area UI and Map State based on the choice.
        selectArea_SelectAreasBy_Dropdown_Changed_Event();

        var value;
        var count = -1;
        $("#selectmenu option").each(function () {
            if (this.selected) {
                value = count;
            }
            ;
            ++count;
        });

        setSelectionLayer(value);
        enableFeatureSelection();

    });

    //Setup the drop zone for the geojson

});

// REMEMBER, THIS CODE HERE EXECUTES AS SOON AS THE BROWSER REACHES IT.... NOT GOOD TIMES.
//
$(function () {
    $("ul#top_menu").sidebar({
        position: "top",
        open: "click"
    });
});

// REMEMBER, THIS CODE HERE EXECUTES AS SOON AS THE BROWSER REACHES IT.... NOT GOOD TIMES.
// 
//Setup spinner value
var spinner = $("#spinner").spinner();


function popAreaMenu() {
    $("ul#top_menu").sidebar("close");
    $("#chooseAreaMethodDialog").dialog();
}
function popGraphMenu() {
    $("ul#top_menu").sidebar("close");
    openNewEditorDialog();
}

// This is the function that resizes the map's height based on the viewport state.
function fixContentHeight() {
    var viewHeight = $(window).height();                                           // console.log("viewHeight: " + viewHeight);
    var header = $("div[data-role='header']:visible:visible");                     // console.log("header.outerHeight() " + header.outerHeight());
    var footer = $("div[data-role='footer']:visible:visible");                     // console.log("footer.outerHeight() " + footer.outerHeight());
    //var navbar = $("div[data-role='navbar']:visible:visible");                      console.log("navbar.outerHeight() " + navbar.outerHeight());
    //var content = $("div[data-role='content']:visible:visible");                    console.log("content.outerHeight() " + content.outerHeight());
    //var contentHeight = viewHeight - header.outerHeight() - navbar.outerHeight();   console.log("contentHeight " + contentHeight);
    var contentHeight = viewHeight - header.outerHeight() - footer.outerHeight();  // console.log("contentHeight " + contentHeight);
    $('#map').height(contentHeight);
    map.updateSize();
}

// Event Handler for window.onload
window.onload = function () {
    fixContentHeight();
    setPolygonIsDefined(false);
    var dropZone = document.getElementById('drop_zone');
    //alert("PUT THE DROPZONE BACK IN THE PAGE!! THIS IS RELATED TO GEOJSON ADDING..");
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
}

// Event Handler for window.onresize
// KS Design 2016 Refactor // NOTE, THIS METHOD IS DUPLICATED INSIDE design2016
window.onresize = function (event) {
    fixContentHeight();
};

function setPolygonIsDefined(value) {
    polygonIsDefined = value;
    if (polygonIsDefined === false) {
        disableCreateGraphLink();
        closeNewEditorDialog();
        $("#geometry_edit_button").text("Create Location");
    }
    else {
        enableCreateGraphLink();
        //zoomToPolygon();  // This zooms and Centers on the polygon.. we don't want that any longer...
        $("#geometry_edit_button").text("Modify Location");
    }
}

function disableCreateGraphLink() {
    $('#creategraphlink').addClass('disabled');
}
function enableCreateGraphLink() {
    $('#creategraphlink').removeClass('disabled');
}

function setupBaseFeatureSelection() {
    if (selectedLayer == 0) {
        setSelectionLayer(selectedLayer);
        enableFeatureSelection();
    }
}
var about_modal = document.getElementById('aboutus_modal');
var btn = document.getElementById("aboutus_link");
var span = document.getElementsByClassName("aboutus_close")[0];
btn.onclick = function () {
    about_modal.style.display = "block";
}
span.onclick = function () {
    about_modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == about_modal) {
        about_modal.style.display = "none";
    }
}