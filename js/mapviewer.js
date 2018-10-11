var map;
var mapInfo;
var myLayers = [];
var gcreateLayerFromObject;
var gcreateCSERVLayerFromObject;
var needinfo;
var gbasemaps;
var infoTemplate;
var gactivateTool;
var AOIGeometery = null;
var gWMSLayer;
var gprojection;
var gSpatialReference;
var gjsonUtils;
var ggraphic;
var gsymbol;
var gPolygon;
function BillyZ_Layer(objectName, layerName, loadingid, visible, url, layers) {
    this.objectName = objectName;
    this.layerName = layerName;
    this.loadingid = loadingid;
    this.visible = visible;
    this.url = url;
    this.layers = layers;
}
require([

    "dojo/parser",
    "dojo/ready",
    "dojo/_base/array",
    "dojo/_base/Color",
    "dojo/dom-style",
    "dojo/query",
    "esri/config",
    "esri/InfoTemplate",
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ImageParameters",
    "esri/request",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/geometry/Polygon",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/ClassBreaksRenderer",
    "esri/geometry/projection",
    "esri/geometry/coordinateFormatter",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/SpatialReference",
    "esri/geometry/Point",
    "esri/geometry/webMercatorUtils",

    "extras/ClusterLayer",
    "esri/layers/WMSLayer",
    'esri/layers/WMSLayerInfo',
    "esri/config",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/toolbars/draw",
    "esri/tasks/geometry",
    "esri/layers/FeatureLayer",
    "esri/arcgis/utils",
    "esri/geometry/jsonUtils",
    "esri/toolbars/navigation",

    "dojo/domReady!"


],
    function (parser, ready, arrayUtils, Color, domStyle, query, esriConfig, InfoTemplate,
        Map, ArcGISDynamicMapServiceLayer, ImageParameters, esriRequest, Graphic, Extent, Polygon, //basemaps,
        SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, ClassBreaksRenderer, projection, coordinateFormatter,
        GraphicsLayer, graphic, SpatialReference, point, webMercatorUtils,
        ClusterLayer,  WMSLayer, WMSLayerInfo, esriConfig, ArcGISTiledMapServiceLayer, Draw, geometry, FeatureLayer,
         arcgisUtils, jsonUtils) {
        map = new Map("map", { basemap: "topo", logo: false });
        gwebMercatorUtils = webMercatorUtils;
        gWMSLayer = WMSLayer;
        gjsonUtils = jsonUtils;
        ggraphic = graphic;
        gPolygon = Polygon;
        fullextent(); map.setZoom(3);
        map.on("load", createToolbar);
        infoTemplate = new InfoTemplate();

            gsymbol = new SimpleFillSymbol();

        const projectionPromise = projection.load();
        coordinateFormatter.load();
        gprojection = projection;
        gSpatialReference = SpatialReference;
        function activateTool(which) {
            var tool = which; //this.label.toUpperCase().replace(/ /g, "_");
          
            toolbar.activate(Draw[tool]);
           // map.hideZoomSlider();
        }
        gactivateTool = activateTool;
        function createToolbar(themap) {
            toolbar = new Draw(map);
            toolbar.on("draw-end", addToMap);
        }

        function addToMap(evt) {
            var symbol;
            gsymbol = symbol;
            toolbar.deactivate();
            map.showZoomSlider();
            switch (evt.geometry.type) {
                case "point":
                case "multipoint":
                    symbol = new SimpleMarkerSymbol();
                    break;
                case "polyline":
                    symbol = new SimpleLineSymbol();
                    break;
                default:
                    symbol = new SimpleFillSymbol();
                    break;
            }
            map.graphics.clear();
            var graphic = new Graphic(evt.geometry, symbol);
            AOIGeometery = evt.geometry;
            graphic.id = 'userpoly';
            map.graphics.add(graphic);
            console.log('going to close panel');
            if ($('#ismobile').is(':visible')) {
                console.log('trying to close panel');
                panelToggler('download-panel', document.getElementById('adownload-panel'), 'Data Tools', true);
                console.log('panel should be closed');
            }
            else {
                console.log('it thinks ismobile is not visible');
            }

        }

        function createLayerFromObject(layerObject) {
            dojo.declare(layerObject.objectName, esri.layers.DynamicMapServiceLayer, {
                constructor: function () {
                    //var loading = dom.byId(layerObject.loadingid);
                    this.initialExtent = this.fullExtent = map.Extent; //new esri.geometry.Extent({ "xmin": -16476154.32, "ymin": 2504688.54, "xmax": -6457400.14, "ymax": 7514065.62, "spatialReference": { "wkid": 102100 } });
                    this.spatialReference = new esri.SpatialReference({ wkid: 3857 });
                    this.loaded = true;
                    this.onLoad(this);
                    this.on("update-start", function () {
                        isLayerLoading = true;
                        //esri.show(loading);
                    });
                    this.on("update-end", function () {
                        isLayerLoading = false;
                        //esri.hide(loading);
                    });
                }
            });
            needinfo = layerObject;
            var theObject = eval(layerObject.objectName);
            var theInstance = new theObject();
            theInstance.id = layerObject.layerName;
            theInstance.setOpacity(1);
            theInstance.setVisibility(layerObject.visible);
            var layers = layerObject.layers;
            var split = layers.split(',');
            var style = '';
            for (var i = 0; i < split.length; i++) {
                style += 'default,'
            }
            theInstance.styles = style.slice(0, -1);
            theInstance.url = layerObject.url;
            
            theInstance.getImageUrl = function (extent, width, height, callback) {
                var params = {
                    request: "GetMap",
                    transparent: true,
                    format: "image/png",
                    bgcolor: "0xffffff",
                    version: "1.3.0",
                    layers: layerObject.layers, // LayerIDs[currentLayer],//"26,43,60,77", //"CREST_QPF_Rain",
                    styles: '',
                    exceptions: "application/vnd.ogc.se_xml",
                    //time: span,//"2015-11-30T00:00:01.000Z/2015-12-01T00:00:01.000Z", //"2014-04-02T09:00:00.000Z",
                    //changing values
                    bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
                    crs: 'EPSG:' + (extent.spatialReference.latestWkid != null ? extent.spatialReference.latestWkid : extent.spatialReference.wkid),
                    srs: 'EPSG:' + (extent.spatialReference.latestWkid != null ? extent.spatialReference.latestWkid : extent.spatialReference.wkid), //'EPSG:3857'
                    width: width,
                    height: height
                }
                var theLayer = completeLayerList.find(function (x) { if (x.id === layerObject.layerName) { return x; } });
                var theURLParams = theLayer.params ? theLayer.params.trim() + '&' : ''
                callback(this.url + '?' + theURLParams + dojo.objectToQuery(params));
            };
            myLayers.push(theInstance);
            map.addLayer(myLayers[myLayers.length - 1]);
        }

        function createCSERVLayerFromObject(layerObject) {
            dojo.declare(layerObject.objectName, esri.layers.DynamicMapServiceLayer, {
                constructor: function () {
                    //var loading = dom.byId(layerObject.loadingid);
                    this.initialExtent = this.fullExtent = map.Extent; //new esri.geometry.Extent({ "xmin": -16476154.32, "ymin": 2504688.54, "xmax": -6457400.14, "ymax": 7514065.62, "spatialReference": { "wkid": 102100 } });
                    this.spatialReference = new esri.SpatialReference({ wkid: 3857 });
                    this.loaded = true;
                    this.onLoad(this);
                    this.on("update-start", function () {
                        isLayerLoading = true;
                        //esri.show(loading);
                    });
                    this.on("update-end", function () {
                        isLayerLoading = false;
                        //esri.hide(loading);
                    });
                }
            });
            needinfo = layerObject;
            var theObject = eval(layerObject.objectName);
            var theInstance = new theObject();
            theInstance.id = layerObject.layerName;
            theInstance.setOpacity(1);
            theInstance.setVisibility(layerObject.visible);
            var layers = layerObject.layers;
            var split = layers.split(',');
            var style = '';
            for (var i = 0; i < split.length; i++) {
                style += 'default,'
            }
            theInstance.styles = style.slice(0, -1);
            theInstance.url = layerObject.url;
            theInstance.getImageUrl = function (extent, width, height, callback) {
                var params = {
                    service: 'WMS',
                    request: "GetMap",
                    transparent: true,
                    format: "image/png",
                    bgcolor: "0xffffff",
                    version: "1.3.0",
                    layers: layerObject.layers, // LayerIDs[currentLayer],//"26,43,60,77", //"CREST_QPF_Rain",
                    styles: '',
                    //time: span,//"2015-11-30T00:00:01.000Z/2015-12-01T00:00:01.000Z", //"2014-04-02T09:00:00.000Z",
                    //changing values
                    bbox: extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax,
                    crs: 'EPSG:102100',
                    srs: 'EPSG:102100', //' + (extent.spatialReference.latestWkid != null ? extent.spatialReference.latestWkid : extent.spatialReference.wkid), //'EPSG:3857'
                    width: width,
                    height: height
                }
                callback(this.url + '?' + dojo.objectToQuery(params));
            };
            myLayers.push(theInstance);
            map.addLayer(myLayers[myLayers.length - 1]);
        }


        gcreateCSERVLayerFromObject = createCSERVLayerFromObject;
        gcreateLayerFromObject = createLayerFromObject;

        /**
         * **Utility functions
         */
        var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        window.addEventListener(orientationEvent, function () { orientationChanged(); }, false);
        lyrOpacityFlag = false;
        removeDynMapListener();
        function orientationChanged() { if (map) { map.reposition(); map.resize(); } }
        function removeDynMapListener() {
            if (window.DeviceMotionEvent) {
                var threshhold = 20;
                var xPTA, yPTA, zPTA, xPostTA, yPostTA, zPostTA = 0;
                window.addEventListener('devicemotion', function (e) {
                    xPTA = e.acceleration.x;
                    yPTA = e.acceleration.y; zPTA = e.acceleration.z;
                });
                setInterval(function () {
                    var change = Math.abs(xPTA - xPostTA + yPTA - yPostTA + zPTA - zPostTA);
                    if (change > threshhold) { fullextent() }
                    xPostTA = xPTA; yPostTA = yPTA; zPostTA = zPTA;
                }, 150);
            } else { /*alert("DeviceMotion is currently not supported on this hardware.");*/ }
        }
        map.on("click", getFeatureInfo);
        gcreateCSERVLayerFromObject(new BillyZ_Layer("my.areaPicker", "areaPicker", "loadingdiv", false, "https://climateserv.servirglobal.net/cgi-bin/servirmap_102100", "country"));
    });

function fullextent() {
    map.setExtent(new esri.geometry.Extent(-13951897.898832941, -6785794.611636344, 13951897.898832941, 11255790.048565581, new esri.SpatialReference({ wkid: 3857 })));
}