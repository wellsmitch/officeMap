layui.use(['slider', 'upload'], function () {
    var slider = layui.slider;
    var gisService, maplayers = [];
    var spatialQueryOneTool;

    if (!!subjectInfo) {
        gisService = new GisService({layui: layui}, subjectInfo.mapInfo, subjectInfo.mapInterFace);

        gisService.createMap({
            map: 'map',
            coordinate: 'mouseCoordinateSpan',
            zoom: 'mapLevelSpan'
        });

        if (subjectInfo.layerInfoList && subjectInfo.layerInfoList.length > 0) {
            subjectInfo.layerInfoList.forEach(function (item) {
                Object.assign(item, item.layerInfo, item.property);
                maplayers.push(item);
            })
        }
        spatialQueryOneTool = new SpatialQueryOneTool(gisService, {});
        var toolBar = new ToolBar(gisService, {
            ZoomIn: true,
            ZoomOut: true,
            layersFun: maplayers,
            featureQuery: {},
            reSite: true,
            treasureArea: true,
            treasureLine: true,
            rollingShutter: true,
            multiScreenT: true,
            bufferAnalysis: true,
            clear: {
                show: true,
                click: function () {
                    gisService.clearAllFeature();
                }
            },
            search: {
                placeholder: "请输入兴趣点名称",
                queryType: "poi"
            },
            select: function (event) {
                var xy = event.coordinate;
                var x = xy[0], y = xy[1];
                for (var requestId in listenerSelectPositionMap) {
                    var callback = listenerSelectPositionMap[requestId];
                    callback(xy);
                }
            }
        });

        window.getGisService = function () {
            return gisService;
        }
        window.gisService = gisService;
        window.maplayers = maplayers;
        window.spatialQueryOneTool = spatialQueryOneTool;
        window.parent && window.parent.mapLoadEnd && window.parent.mapLoadEnd();
    }
})

var listenerSelectPositionMap = {};

var mapService = {
    drawFeature: function (params) {
        gisService.drawFeature(params);
    },
    removeFeature: function (params) {
        gisService.removeFeature(params.layer, params.mappingId);
    },
    selectPolygon: function (params) {
        gisService.setFeatureStyle(params.layer, params.mappingId, layerStyle.select2())
    },
    unSelectPolygon: function (params) {
        gisService.setFeatureStyle(params.layer, params.mappingId, layerStyle.upload())
    },
    fixedPosition: function (params) {
        gisService.fixedPosition(params.layer, params.mappingId);
    },
    insertFeature: function (data, callback, onError) {
        gisService.insertFeature(params, callback, onError);
    },
    deleteFeature: function (xmbh, callback, onError) {
        gisService.deleteFeature(params, callback);
    },
    addLayer: function (layer) {
        for (var i = 0; i < maplayers.length; i++) {
            if (maplayers[i].id == layer.id) {
                return;
            }
        }
        maplayers.push(layer);
    },
    addLayers: function (layers) {
        var that = this;
        layers.forEach(function (layer) {
            that.addLayer(layer);
        })
    },
    removeLayer: function (layer) {
        for (var i = 0; i < maplayers.length; i++) {
            if (maplayers[i].id == layer.id) {
                maplayers.splice(i, 1);
                break;
            }
        }
    },
    removeLayers: function (layers) {
        var that = this;
        layers.forEach(function (layer) {
            that.removeLayer(layer);
        })
    },
    setCookie: function (params) {
        window.sessionStorage.setItem(params.key, params.value);
        $.cookie(params.key, params.value);
    },
    query: function (params, callback) {
        gisService.queryFeature(params, function (data) {
            if (callback && typeof callback === "function") {
                callback(data);
            }
        });
    },
    dealSpatialQueryData: function (params) {
        spatialQueryOneTool.dealSpatialQueryData(params);
    },
    bubbleStyle: function (params) {
        gisService.setBubbleStyle(params);
    },
    reSiteFun: function () {
        gisService.reSiteFun();
    },
    removeAllFeature: function (params) {
        gisService.removeAllFeature(params);
    },
    clearFun: function () {
        gisService.getAllLayer().forEach(function (layer) {
            gisService.removeAllFeature(layer);
        });
        gisService.clearFun();
    },
    drawBubblePoint: function (params) {
        gisService.drawBubblePoint(params);
    },
    listenerSelectPosition: function (param, callback) {
        listenerSelectPositionMap[param.requestId] = callback;
    },
    unListenerSelectPosition: function (param) {
        delete listenerSelectPositionMap[param.requestId];
    }
};


function receiveMessage(event) {
    var data = event.data;
    var requestId = data.requestId;
    var method = data.method;
    var params = data.params;
    if (typeof mapService[method] === 'function') {
        var result = mapService[method](params, function (data) {
            event.source.postMessage({success: true, requestId: requestId, data: data}, event.origin);
        }, function (error) {
            event.source.postMessage({success: false, requestId: requestId, error: error}, event.origin);
        });
    }
}

window.addEventListener("message", receiveMessage, false);


var layerStyle = {
    upload: function () {
        return new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: '#aa3300'//'#1269d3'
            }),
            //边线颜色
            stroke: new ol.style.Stroke({
                color: '#ffcc33',//'#ff0000',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    },
    select: function () {
        return new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: '#4C8BF4'//'#1269d3'
            }),
            //边线颜色
            stroke: new ol.style.Stroke({
                color: '#ffcc33',//'#ff0000',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    },
    select2: function (feature) {
        return [
            new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: '#A33271'//'#1269d3'
                })
            }),
            new ol.style.Style({
                overflow: false,
                //边线颜色
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',//'#ff0000',
                    width: 2
                }),
                image: new ol.style.Icon({
                    anchorOrigin: 'bottom-left',
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: basePath + '/static/image/fixPosition.png'
                }),
                geometry: function (feature) {
                    var coordinates = feature.getGeometry().getCoordinates()[0];
                    return feature.getGeometry().getInteriorPoint();
                }
            })];
    },
    analysis: function (textParam) {
        return new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgba(0, 255, 0, 0.5)'
            }),
            //边线颜色
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#33ccff'
                })
            }),
            text: new ol.style.Text({
                //位置
                textAlign: 'center',
                //基准线
                textBaseline: 'middle',
                //文字样式
                font: 'normal 14px 微软雅黑',
                //文本内容
                text: textParam,
                //文本填充样式（即文字颜色）
                fill: new ol.style.Fill({color: '#aa3300'}),
                stroke: new ol.style.Stroke({color: '#ffcc33', width: 2})
            })
        })
    },
    spatialQuery: function styleFunction(text) {
        return new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: '#aa3300'//'#1269d3'
            }),
            //边线颜色
            stroke: new ol.style.Stroke({
                color: '#ffcc33',//'#ff0000',
                width: 2
            }),
            text: new ol.style.Text({
                text: text + "",
                fill: new ol.style.Fill({
                    color: "#cd0500",
                    opacity: 1
                }),
                stroke: new ol.style.Stroke({
                    color: "#dd942e",
                    width: 3
                }),
                font: " 14px SimHei"
            })
        });
    }
};
