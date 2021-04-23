(function () {
    zy.util.provide("zy.gis.Service");
    window.GisService = zy.gis.Service = function (obj, mapInfo, interfaceInfo) {
        this.layui = obj.layui;
        this.mapInfo = Object.assign({}, mapInfo);
        this.layerStyle = layerStyle;
        //122为测试环境，正式环境需删除这一行
        // if(interfaceInfo && interfaceInfo.serverIp == '10.0.0.122'){interfaceInfo.serverIp = '10.0.0.114'};

        this.interfaceInfo = Object.assign({}, interfaceInfo);
        this.tempLayersObj = {};
        this.tempLayers = {};
        this.olLayers = {};
        this.ZIndex = 300;
        this.init();
        //分屏功能增加参数
        this.sourceVectorOfTreasure = obj.sourceVectorOfTreasure;
    };

    GisService.prototype.init = function () {
        // jQuery.getScript(basePath + "/static/lib/gis/jsts.min.js");

        // 加载地图层级参数
        var maxResolution = this.mapInfo.maxResolution;
        var resolutions = [];
        var matrixIds = [];
        for (var z = 0; z <= 19; z++) {
            resolutions[z] = maxResolution / Math.pow(2, z);
            matrixIds[z] = z;
        }
        this.mapInfo.resolutions = resolutions;
        this.mapInfo.matrixIds = matrixIds;

    };
    /**
     * 创建地图
     * @param target
     * @returns {ol.Map}
     */
    GisService.prototype.createMap = function (params, mapInfo) {
        var that = this;
        if (!params.map) {
            console.error("map参数为空");
            return null;
        }
        if (mapInfo) {
            Object.assign(this.mapInfo, mapInfo);
        }
        mapInfo = this.mapInfo;
        var projection = ol.proj.get(mapInfo.localProjection);
        var mapView = new ol.View({
            center: [mapInfo.viewCenterX, mapInfo.viewCenterY],
            zoom: mapInfo.initZoom,
            maxZoom: mapInfo.maxZoom,
            minZoom: mapInfo.minZoom,
            projection: projection
        });
        this.map = map = new ol.Map({
            target: params.map,
            view: mapView,
            controls: ol.control.defaults({
                attribution: false,
                zoom: false
            }),
            interactions: ol.interaction.defaults({
                pinchRotate: false // 移动端禁止地图旋转
            })
        });
        // 距离单位
        var scaleLineControl = new ol.control.ScaleLine({
            units: "metric"
        });
        map.addControl(scaleLineControl);
        map.addControl(new ol.control.FullScreen())

        if (params.coordinate) {
            // x y 坐标显示
            var mousePositionControl = new ol.control.MousePosition({
                target: params.coordinate,
                projection: mapInfo.localProjection,
                className: '',
                undefinedHTML: "&nbsp;"
            });
            map.addControl(mousePositionControl);
        }

        if (params.zoom) {
            var htmlObj = typeof params.zoom == 'string' ? $("#" + params.zoom) : $(params.zoom);
            map.getView().on('change:resolution', function () {
                htmlObj.html("当前显示级数：第&nbsp;&nbsp;&nbsp;&nbsp;" + map.getView().getZoom() + "&nbsp;&nbsp;&nbsp;&nbsp;级");
            });
        }

        //默认创建行政区划图层
        if (!!this.mapInfo.baseLayerUrl) {
            this.addLayer({
                loadType: 'wmts',
                loadUrl: this.mapInfo.baseLayerUrl,
                layer: this.mapInfo.baseLayerName
            });
        }

        //this.canvasContextmenu();
        // this.mapHover(map.viewport_);
        // 地图容器的dom
        this.mapCondiv = map.viewport_;
        var that = this;
        map.on('click', function (event) {
            if (that.currEvent) {
                that.currEvent(event);
                // that.zoomFun()
            }
            var xy = event.coordinate;
            console.log(xy);

        });

        // 初始化时候创建高亮图层
        this.highLightLayer = this.createHighLightLayer();
        this.helpTooltipElement = document.createElement('div');

        //创建图例按钮
        this.loadLegend();


        this.treasureLineFunInit();
        return map;
    };

    GisService.prototype.loadLegend = function () {
        var that = this;
        var $legend = $("<div class=\"maplegend\" class=\"overflow\">\n" +
            "        <img class=\"fl\" src=" + basePath + "/static/image/legend_hover.png alt=\"\">\n" +
            "        <div class=\"fl\">图例</div>\n" +
            "    </div>\n" +
            "    <div class=\"legendlist\"></div>");
        $(this.mapCondiv).parent().append($legend);

        $legend.parent().find('div.maplegend').eq(0).on('click', function () {
            var $legendlist = $legend.parent().find('div.legendlist').eq(0);
            if ($legendlist.is(":hidden")) {
                if (that.tempLayers && Object.keys(that.tempLayers).length > 0) {
                    var temp = {}, legendUrl = [];
                    for (var key in that.tempLayers) {
                        if (that.tempLayers[key].legendUrl && that.tempLayers[key].show) {
                            var url = that.tempLayers[key].legendUrl;
                            if (!temp[url]) {
                                temp[that.tempLayers[key].name] = url;
                            }
                        }
                    }
                    var str = "";
                    for (var key in temp) {
                        var tt = "<div><p style='padding-left:12px;font-size: 16px;margin-bottom: 6px;'>" + key + "</p><div style='border-top:1px solid #b9b4b4;'><img style='width:400px;' src='" + basePath + temp[key] + "'></div></div>"
                        str += tt;
                    }
                    str = (!!str) ? str : "<div><p style='padding-left:12px;font-size: 16px;margin-bottom: 6px;'>暂无图例</p></div>";
                    $legendlist.html(str);
                } else {
                    $legendlist.html("<div><p style='padding-left:12px;font-size: 16px;margin-bottom: 6px;'>暂无图例</p></div>");
                }
            }
            $legendlist.toggle()
        })
    };

    /**
     * 创建分屏地图
     * @param target
     * @returns {ol.Map}
     */
    GisService.prototype.createFPMap = function (params, mapInfo) {
        if (params.length < 0) {
            console.error("map参数为空");
            return null;
        }
        if (mapInfo) {
            Object.assign(this.mapInfo, mapInfo);
        }
        mapInfo = this.mapInfo;
        var projection = ol.proj.get(mapInfo.localProjection);
        var mapView = new ol.View({
            center: [mapInfo.viewCenterX, mapInfo.viewCenterY],
            zoom: mapInfo.initZoom,
            maxZoom: mapInfo.maxZoom,
            minZoom: mapInfo.minZoom,
            projection: projection
        });

        var maps = [];
        for (var i = 0; i < params.length; i++) {
            var map = new ol.Map({
                target: params[i].map,
                view: mapView,
                controls: ol.control.defaults({
                    attribution: false,
                    zoom: false
                }),
                interactions: ol.interaction.defaults({
                    pinchRotate: false // 移动端禁止地图旋转
                })
            });
            // 距离单位
            var scaleLineControl = new ol.control.ScaleLine({
                units: "metric"
            });
            map.addControl(scaleLineControl);
            map.addControl(new ol.control.FullScreen())

            if (params[i].coordinate) {
                // x y 坐标显示
                var mousePositionControl = new ol.control.MousePosition({
                    target: params[i].coordinate,
                    projection: mapInfo.localProjection,
                    className: '',
                    undefinedHTML: "&nbsp;"
                });
                map.addControl(mousePositionControl);
            }

            if (params[i].zoom) {
                var htmlObj = typeof params[i].zoom == 'string' ? $("#" + params[i].zoom) : $(params[i].zoom);
                map.getView().on('change:resolution', function () {
                    htmlObj.html("当前显示级数：第&nbsp;&nbsp;&nbsp;&nbsp;" + map.getView().getZoom() + "&nbsp;&nbsp;&nbsp;&nbsp;级");
                });
            }

            //默认创建行政区划图层
            if (!!this.mapInfo.baseLayerUrl) {
                this.addWmtsLayer({
                    loadUrl: this.mapInfo.baseLayerUrl,
                    layer: this.mapInfo.baseLayerName
                }, map);
            }
            maps.push(map);
        }


        // 地图容器的dom
        /*this.mapCondiv = map.viewport_;
        var that = this;
        map.on('click', function (event) {
            if (that.currEvent) {
                that.currEvent(event);
                // that.zoomFun()
            }
            var xy = event.coordinate;
            console.log(xy);

        });*/

        return maps;
    };

    GisService.prototype.getMap = function () {
        return this.map;
    };

    GisService.prototype.getView = function () {
        return this.getMap().getView();
    };

    /**
     * 获取当前地图大小
     * @returns {*}
     */
    GisService.prototype.getMapSize = function () {
        return this.getMap().getSize();
    };

    /**
     * 获取当前视图范围
     * @returns {*}
     */
    GisService.prototype.getViewBound = function () {
        return this.getView().calculateExtent(this.getMapSize());
    };

    /**
     * 设置当前视力范围
     * @param extent
     * @returns {*}
     */
    GisService.prototype.setViewBound = function (extent) {
        return this.getView().fit(extent, this.getMapSize());
    };

    /**
     * 创建高亮图层 并返回
     * @returns {ol.layer.Vector|ol.layer.Vector}
     */
    GisService.prototype.createHighLightLayer = function () {
        var that = this;
        var map = this.getMap();
        this.highLightLayer = null;
        if (this.highLightLayer == null) {
            this.highLightLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: []
                }),
                zIndex: 10000
            });
            map.addLayer(that.highLightLayer);
        }
        return this.highLightLayer
    };

    /**
     * 添加临时高亮图层
     * @returns {string} layerId
     */
    GisService.prototype.addHighLightLayer = function () {
        var that = this;
        var layerId = that.generateUUID();
        that.addTempLayer({
            layer: layerId, vector: new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: []
                }),
                zIndex: 1
            })
        });
        return layerId;
    }

    /**
     * 闪烁定位
     */
    GisService.prototype.twinkle = function (data, count) {
        var that = this;
        if (data && data.length == 0) {
            return;
        }
        var style = that.getFeatureStyle(data[0]);
        setTimeout(function () {
            data.forEach(function (item) {
                that.setFeatureStyle(item, that.getDefaultStyleSelector().analysis());
            });
            setTimeout(function () {
                data.forEach(function (item) {
                    that.setFeatureStyle(item, style);
                });
                if (count > 0) {
                    that.twinkle(data, --count);
                }
            }, 500);
        }, 500);
    },

        /**
         * 添加wmts图层
         * @param params
         * @returns {ol.layer.Tile}
         */
        GisService.prototype.addWmtsLayer = function (params, virmap) {
            var url = params.loadUrl;
            // url = url.replace("10.0.0.122:6160", "172.16.103.143:8080/mapgis");
            // url = url.replace("10.0.0.122:6163", "172.16.103.143:8080/mapgis");
            // url = url.replace("10.0.0.114:6160", "172.16.103.143:8080/mapgis");
            // url = url.replace("10.0.0.114:6164", "172.16.103.143:8080/mapgis");
            if (url.indexOf('?') == -1) {
                url += "?";
            } else {
                url += "&";
            }
            url += "sessionId=" + getSessionId();
            url += "&id=" + (params.id || "");
            var that = this;
            var baseWmtsLayer = new ol.layer.Tile({
                opacity: params.opacity || 1,
                source: new ol.source.WMTS({
                    url: url,
                    layer: params.layer,
                    style: 'default',
                    format: 'image/png',
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: [0, 0],
                        resolutions: that.mapInfo.resolutions,
                        matrixIds: that.mapInfo.matrixIds
                    })
                })
            });
            baseWmtsLayer.set('layerId', params.layer);
            if (!!virmap) {
                virmap.addLayer(baseWmtsLayer);
            } else {
                this.getMap().addLayer(baseWmtsLayer);
            }
            return baseWmtsLayer;
        };

    /**
     * 添加wms图层
     * @param params
     * @returns {ol.layer.Image}
     */
    GisService.prototype.addWmsLayer = function (params, virmap) {
        var url = params.loadUrl;
        // url = url.replace("10.0.0.122:6160", "172.16.103.143:8080/mapgis");
        // url = url.replace("10.0.0.122:6163", "172.16.103.143:8080/mapgis");
        // url = url.replace("10.0.0.114:6160", "172.16.103.143:8080/mapgis");
        // url = url.replace("10.0.0.114:6164", "172.16.103.143:8080/mapgis");
        if (url.indexOf('?') == -1) {
            url += "?";
        } else {
            url += "&";
        }
        url += "sessionId=" + getSessionId();
        url += "&id=" + (params.id || "");
        var mapInfo = this.mapInfo;
        var layer = new ol.layer.Image({
            opacity: 1,
            source: new ol.source.ImageWMS({
                url: url,
                params: {
                    'LAYERS': params.layer,
                    "VERSION": "1.1.1"
                },
                projection: ol.proj.get(mapInfo.localProjection)
            })
        });
        layer.set('layerId', params.layer);
        if (!!virmap) {
            virmap.addLayer(layer);
        } else {
            this.getMap().addLayer(layer);
        }
        return layer;
    };

    /**
     * 添加wfs图层
     * @param params
     * @returns {ol.layer.Vector}
     */
    GisService.prototype.addWfsLayer = function (params) {
        var layer = new ol.layer.Vector({
            opacity: 1,
            source: new ol.source.Vector({
                url: params.loadUrl,
                format: new ol.format.GML2({extractAttributes: true}),
                strategie: ol.loadingstrategy.bbox
            })
        });
        layer.set('layerId', params.layer);
        this.getMap().addLayer(layer);
        return layer;
    };

    /**
     * 添加临时图层
     * @param params
     */
    GisService.prototype.addTempLayer = function (params) {
        if (params.build && typeof params.build == 'function') {
            params.vector = params.build();
        }
        var vector = params.vector || new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            }),
            declutter: true
        });
        var oldLayer = this.tempLayersObj[params.layer];
        if (oldLayer) {
            vector.setVisible(oldLayer.getVisible());
            vector.setOpacity(oldLayer.getOpacity());
            vector.setMinResolution(oldLayer.getMinResolution());
            vector.setMaxResolution(oldLayer.getMaxResolution());
            this.getMap().removeLayer(oldLayer);
        }
        this.getMap().addLayer(vector);
        this.tempLayersObj[params.layer] = vector;
        this.tempLayers[params.layer] = params;
        params.infoList = [];
        params.infos = {};
        return vector;
    };

    /**
     * 添加聚类图层
     * @param params
     */
    GisService.prototype.addClusterLayer = function (params) {
        var clusterLayer = this.addTempLayer(params);
        if (!params.loadUrl) {
            return clusterLayer;
        }
        var gisService = this;
        $.ajax({
            url: params.loadUrl,
            dataType: "json",
            success: function (res) {
                if (!res.success) {
                    gisService.printErrorInfo(params.name + '数据未找到');
                    return;
                }
                var resourceLayer = params.layer + '_temp';
                gisService.addTempLayer({layer: resourceLayer});
                res.data.forEach(function (item) {
                    item.mappingId = gisService.generateUUID();
                    gisService.drawFeature({
                        layer: resourceLayer,
                        mappingId: item.mappingId,
                        data: item,
                        isShowCenter: false,
                        autoShut: false,
                        coordinate: gisService.getFeatureCoordinate(item)
                    });
                });

                var textStyle = new zy.gis.style.Text();
                var cluster = new zy.gis.layer.Cluster();
                cluster.setDistance(params.distance);
                cluster.setTextStyle(textStyle);
                cluster.setLayer(params.layer);
                cluster.setGisService(gisService);
                cluster.setResourceLayer(resourceLayer);
                textStyle.setColor(params.textColor);
                textStyle.setFont(params.textFont);
                textStyle.setStrokeColor(params.textStrokeColor);
                textStyle.setStrokeWidth(params.textStrokeWidth);
                if (params.properties) {
                    var properties = params.properties;
                    for (var i in properties) {
                        if (properties[i].show) {
                            var subject = new zy.gis.layer.Cluster.Subject();
                            subject.setField(properties[i].field);
                            subject.setType(properties[i].type);
                            subject.setComparison(properties[i].comparison);
                            cluster.addSubject(subject);
                        }
                    }
                }
                gisService.addTempLayer(cluster);
            }
        });
        return clusterLayer;
    };

    /**
     * 添加图层
     * @param layerInfo
     */
    GisService.prototype.addLayer = function (layerInfo) {
        this.ZIndex++;
        if (!layerInfo.layer) {
            this.printErrorInfo("图层信息不存在");
        }

        var layer = null;
        // 删除之前存在的图层
        var oldOlLayer = this.getOlLayer(layerInfo);
        if (oldOlLayer != null) {
            this.removeLayer(layerInfo);
        }
        if (layerInfo.loadType == 'wmts') {
            layer = this.addWmtsLayer(layerInfo);
        } else if (layerInfo.loadType == 'wms') {
            layer = this.addWmsLayer(layerInfo);
        } else if (layerInfo.loadType == 'wfs') {
            layer = this.addWfsLayer(layerInfo);
        } else if (layerInfo.loadType == 'cluster') {
            layer = this.addClusterLayer(layerInfo);
        } else if (layerInfo.loadType == 'wtemp') {
            layer = this.addTempLayer(layerInfo);
        } else {
            // this.printErrorInfo("不存在的图层类型");
            // throw "不存在的图层类型";
            layer = this.addTempLayer(layerInfo);
        }
        // 添加临时图层
        this.addTempLayer(layerInfo);

        var that = this;
        // 设置层级显示
        if (layerInfo.zoom) {
            var min = parseInt(layerInfo.zoom.split('-')[0]);
            var max = parseInt(layerInfo.zoom.split('-')[1]);
            min = min <= 1 ? 1 : min;
            max = max >= 19 ? 19 : max;
            layer.setMinResolution(that.mapInfo.resolutions[max]);
            layer.setMaxResolution(that.mapInfo.resolutions[min - 1]);
        }
        // 设置透明度
        if (layerInfo.opacity != null && layerInfo.opacity != undefined) {
            layerInfo.opacity = Number(layerInfo.opacity);
            layer.setOpacity(layerInfo.opacity);
        }
        // 控制是否显示
        if (layerInfo.show != null && layerInfo.show != undefined) {
            layer.setVisible(layerInfo.show);
        }

        // 放入ol图层
        this.olLayers[layerInfo.layer] = layer;
        return layer;
    };

    /**
     * 移除图层
     * @param layer
     */
    GisService.prototype.removeLayer = function (layer) {
        // 移除临时图层
        this.getMap().removeLayer(this.getLayerObj(layer));
        // 移除ol图层
        this.getMap().removeLayer(this.getOlLayer(layer));
        // 删除ol图层数据
        delete this.olLayers[this.getLayer(layer).layer];
        // 删除临时图层源数据
        delete this.tempLayersObj[this.getLayer(layer).layer];
        // 删除自定义图层数据
        delete this.tempLayers[this.getLayer(layer).layer];
    };

    /**
     * 实现画区域放大缩小
     * zoomPickBoolean  true 缩小  false 放大
     */
    GisService.prototype.zoomFun = function (zoomPickBoolean) {
        // this.mapDragForbid(true);
        console.log(zoomPickBoolean === undefined);

        var dragZoom = new ol.interaction.DragZoom({
            condition: ol.events.condition.always,
            out: zoomPickBoolean // true 缩小  false 放大
        });
        if (zoomPickBoolean === undefined) {
            dragZoom.setActive(false);
            this.getMap().removeInteraction(dragZoom);
        } else {
            this.getMap().addInteraction(dragZoom);
            dragZoom.setActive(true);
        }
    };

    /**
     * 放大操作
     */
    GisService.prototype.zoomInFun = function () {
        var that = this;
        var map = this.getMap();
        //获取地图视图
        var view = map.getView();
        //获得当前缩放级数
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
        // that.mapDragForbid();
        // this.zoomFun(false);
    };

    /**
     * 缩小操作
     */
    GisService.prototype.zoomOutFun = function zoomOutFun() {

        var map = this.getMap();
        //获取地图视图
        var view = map.getView();
        //获得当前缩放级数
        var zoom = view.getZoom();
        view.setZoom(zoom - 1);


        // this.zoomFun(true);
    };


    /**
     * 复位操作
     */
    GisService.prototype.reSiteFun = function () {
        var view = this.getMap().getView();
        view.setCenter([this.mapInfo.viewCenterX, this.mapInfo.viewCenterY]);
        view.setZoom(this.mapInfo.initZoom);
    };

    /**
     * 地图是否禁用拖动方法
     * @param isDrag
     */
    GisService.prototype.mapDragForbid = function (isDrag) {
        var map = this.getMap();
        map.getInteractions().forEach(function (element, index, array) {
            if (element instanceof ol.interaction.DragPan) {
                var pan = element;
                pan.setActive(isDrag);
            }
        });
    };

    /**
     * 1、设置鼠标在地图上滑动的样式
     * 2、执行鼠标在地图上点击的功能
     * @param obj
     */
    GisService.prototype.setCursor = function (obj) {
        this.currDestory && typeof this.currDestory == 'function' && this.currDestory();
        // 鼠标样式
        this.cursorStyle = null;
        this.currEvent = obj && obj.event || null;
        this.currDestory = obj && obj.destory || null;
        if (obj && obj.cursorImage) {
            var cursorStyle = $('<div style="width: 20px;height: 20px;border-radius: 50%;background: url(' + obj.cursorImage + ') no-repeat center/cover;position: absolute;z-index: 9999;"></div>');
            this.cursorStyle = cursorStyle;
        }
    };

    /**
     *  鼠标在地图上滑动
     */
    GisService.prototype.mapHover = function (dom) {
        var mapCon = $(dom);
        var that = this;
        mapCon.on('mousemove', function (e) {
            if (that.cursorStyle) {
                if (e.target != that.cursorStyle[0]) {
                    that.cursorStyle.css({
                        'left': e.offsetX + 5,
                        'top': e.offsetY + 5
                    });
                }
            }
        });

        mapCon.hover(function () {
            console.log(!!that.cursorStyle);
            if (!!that.cursorStyle) {
                mapCon.append(that.cursorStyle);
                $(mapCon).css({
                    'cursor': 'none'
                });
            }
        }, function () {
            if (!!that.cursorStyle) {
                that.cursorStyle.remove();
                $(mapCon).css({
                    'cursor': 'initial'
                });
            }
        });
    };

    /**
     * 线 测量 必须在点击工具条之后直接触发  不能通过点击地图触发  否则会有问题
     */
    GisService.prototype.treasureLineFunInit = function () {
        var that = this;
        this.drawMeatureInteraction = "";
        /*LineString or Polygon*/

        this.drawMeaturesource = that.sourceVectorOfTreasure || new ol.source.Vector(); //图层数据源
        this.drawMeaturevector = new ol.layer.Vector({
            title: "celianghuituceng",
            source: that.drawMeaturesource,
            style: new ol.style.Style({ //图层样式
                fill: new ol.style.Fill({
                    color: 'rgba(82, 255, 46, 0.4)' //填充颜色
                }),
                stroke: new ol.style.Stroke({
                    color: '#ff681f',  //边框颜色
                    width: 2   // 边框宽度
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ff544a'
                    })
                })
            })
        });

    };

    GisService.prototype.treasureFun = function (treasureType, gisServiceCallback) {
        var that = this;
        var map = this.getMap();
        var treasureCBValue = {};

        $(that.helpTooltipElement).removeClass('none');

        var wgs84Sphere = new ol.Sphere(6370700); //定义一个球对象6370670
        /**
         * 当前绘制的要素（Currently drawn feature.）
         * @type {ol.Feature}
         */
        var sketch;
        /**
         * 帮助提示框对象（The help tooltip element.）
         * @type {Element}
         */
        // this.helpTooltipElement = null;
        /**
         *帮助提示框显示的信息（Overlay to show the help messages.）
         * @type {ol.Overlay}
         */
        var helpTooltip;
        /**
         * 测量工具提示框对象（The measure tooltip element. ）
         * @type {Element}
         */
        // var measureTooltipElement;
        /**
         *测量工具中显示的测量值（Overlay to show the measurement.）
         * @type {ol.Overlay}
         */
        var measureTooltip;
        /**
         *  当用户正在绘制多边形时的提示信息文本
         * @type {string}
         */
        var continuePolygonMsg = '继续点击绘制多边形';
        /**
         * 当用户正在绘制线时的提示信息文本
         * @type {string}
         */
        var continueLineMsg = '继续点击绘制线';

        /**
         * 鼠标移动事件处理函数
         * @param {ol.MapBrowserEvent} evt
         */

        //测量功能start

        /**
         * 测量长度输出
         * @param {ol.geom.LineString} line
         * @return {string}
         */
        var formatLength = function (line) {
            var length;
            if (true) { //若使用测地学方法测量
                var coordinates = line.getCoordinates();//解析线的坐标
                length = 0;
                var sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
                //通过遍历坐标计算两点之前距离，进而得到整条线的长度
                for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                    var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                    length += wgs84Sphere.haversineDistance(c1, c2);
                }
            } else {
                length = Math.round(line.getLength() * 100) / 100; //直接得到线的长度
            }
            var output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km<div class="mobileTreasureDone" style="display: inline-block;padding: 5px 10px 5px;"><span class="iconfont icon-duihao"></span></div>'; //换算成KM单位
            } else {
                output = (Math.round(length * 100) / 100) + ' ' + 'm<div class="mobileTreasureDone" style="display: inline-block;padding: 5px 10px 5px;"><span class="iconfont icon-duihao"></span></div>'; //m为单位
            }
            return output;//返回线的长度
        };
        /**
         * 测量面积输出
         * @param {ol.geom.Polygon} polygon
         * @return {string}

         complateToolBtnElement.innerHTML = '<div id="complateToolBtnElement" style="display: inline-block"><span class="iconfont icon-duihao"></span></div>';
         // complateToolBtnElement.className = 'tooltip tooltip-measure';
         complateToolBtnElement.className = 'tooltip  tooltip-measure zyTooltip';

         $(complateToolBtnElement)[0].addEventListener("touchstart", function(){
				that.vm.toolPropertyOkClick();
                return false;
			});
         */
        var formatArea = function (polygon) {
            var area;
            if (true) {//若使用测地学方法测量
                var sourceProj = map.getView().getProjection();//地图数据源投影坐标系
                var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326')); //将多边形要素坐标系投影为EPSG:4326
                var coordinates = geom.getLinearRing(0).getCoordinates();//解析多边形的坐标值
                area = Math.abs(wgs84Sphere.geodesicArea(coordinates)); //获取面积
            } else {
                area = polygon.getArea();//直接获取多边形的面积
            }
            var output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup><div class="mobileTreasureDone" style="display: inline-block;padding: 5px 10px 5px;"><span class="iconfont icon-duihao"></span></div>'; //换算成KM单位
            } else {
                output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup><div class="mobileTreasureDone" style="display: inline-block;padding: 5px 10px 5px;"><span class="iconfont icon-duihao"></span></div>';//m为单位
            }
            return output; //返回多边形的面积
        };


        var geodesicCheckbox = document.getElementById('geodesic');//测地学方式对象

        // $("#meatureArea").click(function(){
        //     if(that.drawMeatureInteraction){
        //         map.removeLayer(that.drawMeaturevector);
        //         map.removeInteraction(that.drawMeatureInteraction);
        //     }
        //     map.addLayer(that.drawMeaturevector);
        //     that.drawMeatureInteraction = initDrawInteraction("Polygon");
        //     addInteraction();
        //     map.on('pointermove', pointerMoveHandler); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
        // })

        function initDrawInteraction(meatureType) {
            var draw = null;
            if (meatureType === "LineString") {
                if (initDrawInteraction.drawLine) {
                    return initDrawInteraction.drawLine;
                }
                var drawLine = new ol.interaction.Draw({
                    source: that.drawMeaturesource,//测量绘制层数据源
                    type: 'LineString',  //几何图形类型/*LineString or Polygon*/
                    style: new ol.style.Style({//绘制几何图形的样式
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.5)',
                            lineDash: [10, 10],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    })
                });
                initDrawInteraction.drawLine = drawLine;
                draw = drawLine;
            } else if (meatureType === "Polygon") {
                if (initDrawInteraction.drawPoly) {
                    return initDrawInteraction.drawPoly;
                }
                var drawPoly = new ol.interaction.Draw({
                    source: that.drawMeaturesource,//测量绘制层数据源
                    type: 'Polygon',  //几何图形类型/*LineString or Polygon*/
                    style: new ol.style.Style({//绘制几何图形的样式
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.5)',
                            lineDash: [10, 10],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    })
                });
                initDrawInteraction.drawPoly = drawPoly;
                draw = drawPoly;
            }
            return draw;
        }

        var pointerMoveHandler = function (evt) {
            if (evt.dragging) {
                return;
            }
            /** @type {string} */
            var helpMsg = '请点击开始绘制';//当前默认提示信息
            //判断绘制几何类型设置相应的帮助提示信息
            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg; //绘制线时提示相应内容
                }
            }
            that.helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
            helpTooltip.setPosition(evt.coordinate);//设置帮助提示框的位置
            $(that.helpTooltipElement).removeClass('hidden');//移除帮助提示框的隐藏样式进行显示
        };
        map.on('pointermove', function () {
            $(that.helpTooltipElement).removeClass('none');
        }); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容


        //地图绑定鼠标移出事件，鼠标移出时为帮助提示框设置隐藏样式
        $(map.getViewport()).on('mouseout', function () {
            $(that.helpTooltipElement).addClass('hidden');
        });

        /**
         * 加载交互绘制控件函数
         */
        function addInteraction() {

            map.addInteraction(that.drawMeatureInteraction);

            createMeasureTooltip(); //创建测量工具提示框
            createHelpTooltip(); //创建帮助提示框

            var listener;
            //绑定交互绘制工具开始绘制的事件
            that.drawMeatureInteraction.on('drawstart',
                function (evt) {
                    // 每次测量之前清除历史测量 start
                    that.drawMeaturesource.clear();
                    $(".ol-overlay-container").hide();
                    // 每次测量之前清除历史测量 end
                    // set sketch
                    sketch = evt.feature; //绘制的要素

                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;// 绘制的坐标
                    //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
                    listener = sketch.getGeometry().on('change', function (evt) {
                        var geom = evt.target;//绘制几何要素
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(/** @type {ol.geom.Polygon} */(geom));//面积值
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();//坐标
                        } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength(/** @type {ol.geom.LineString} */(geom));//长度值
                            tooltipCoord = geom.getLastCoordinate();//坐标
                        }
                        that.measureTooltipElement.innerHTML = output;//将测量值设置到测量工具提示框中显示
                        measureTooltip.setPosition(tooltipCoord);//设置测量工具提示框的显示位置
                        treasureCBValue.measure = output;
                        treasureCBValue.position = tooltipCoord;

                        $.each($('.mobileTreasureDone'), function (i, ele) {
                            // console.log(ele);
                            ele.addEventListener("touchstart", function () {
                                gisServiceCallback && typeof gisServiceCallback === 'function' && gisServiceCallback();
                                $(ele).remove();
                                return false;
                            });
                        });
                        /*$('.mobileTreasureDone')[0].addEventListener("touchstart", function(){
                            gisServiceCallback()
                            $('.mobileTreasureDone').remove()
                            return false;
                        });*/

                    });
                }, this);
            //绑定交互绘制工具结束绘制的事件
            that.drawMeatureInteraction.on('drawend',
                function (evt) {
                    that.measureTooltipElement.className = 'tooltip tooltip-static'; //设置测量提示框的样式
                    measureTooltip.setOffset([0, -7]);
                    gisServiceCallback && typeof gisServiceCallback === 'function' && gisServiceCallback(treasureCBValue);
                    // unset sketch
                    sketch = null; //置空当前绘制的要素对象
                    // unset tooltip so that a new one can be created
                    that.measureTooltipElement = null; //置空测量工具提示框对象
                    createMeasureTooltip();//重新创建一个测试工具提示框显示结果
                    ol.Observable.unByKey(listener);
                }, this);
        }

        /**
         *创建一个新的帮助提示框（tooltip）
         */
        function createHelpTooltip() {
            that.helpTooltipElement.className = 'tooltip hidden';
            helpTooltip = new ol.Overlay({
                element: that.helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            map.addOverlay(helpTooltip);
        }

        /**
         *创建一个新的测量工具提示框（tooltip）
         */
        function createMeasureTooltip() {
            $(that.helpTooltipElement).removeClass('none');
            that.measureTooltipElement = document.createElement('div');
            that.measureTooltipElement.className = 'tooltip tooltip-measure';
            measureTooltip = new ol.Overlay({
                element: that.measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            map.addOverlay(measureTooltip);
        }

        //开关长度测量功能
        if (that.drawMeatureInteraction) {
            map.removeLayer(that.drawMeaturevector);
            map.removeInteraction(that.drawMeatureInteraction);
        }
        map.addLayer(that.drawMeaturevector);

        that.drawMeatureInteraction = initDrawInteraction(treasureType);
        addInteraction();

        map.on('pointermove', pointerMoveHandler); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
        // })
        //测量功能end

    };

    /**
     * 清除功能 &&  清除测量线、面
     */
    GisService.prototype.clearFun = function () {
        var that = this;
        var map = this.getMap();
        if (!that.drawMeaturesource) {
            return;
        }
        // 清除划线功能 高亮层上的图元
        that.drawMeaturesource.clear();
        // 隐藏查询跟着鼠标移动的信息框
        $(".ol-overlay-container").hide();

        map.removeLayer(that.drawMeaturevector);
        map.removeInteraction(that.drawMeatureInteraction);

        // 清除高亮层上的图元
        this.highLightLayer.getSource().clear();
    };

    // 清除画线的方法  画的线和多边形依然存在
    GisService.prototype.clearMehtodFun = function () {
        var that = this;
        var map = this.getMap();
        // 隐藏查询跟着鼠标移动的信息框
        $(".ol-overlay-container #container").hide();

        map.removeInteraction(that.drawMeatureInteraction);
        map.on('pointermove', function () {
            $(that.helpTooltipElement).addClass('none');
        }); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
    };


    /**
     * canvas 右键禁用
     */
    GisService.prototype.canvasContextmenu = function () {
        // ol-unselectable: 地图容器 class名称
        document.querySelector('.ol-unselectable').oncontextmenu = function (e) {
            return false;
        }
    };
    /**
     * 导入坐标在地图上展示
     * @param params，coordinate：坐标字符串
     * @returns {ol.Feature}
     */
    GisService.prototype.drawFeature = function (params) {
        var coordinate = this.getFeatureCoordinate(params);
        var mappingId = params.mappingId || this.generateUUID();
        // 是否居中显示，默认true
        var isShowCenter = params.isShowCenter !== false;
        // 是否分析面积，默认false
        var isAnalysisArea = params.isAnalysisArea === true;
        var style = params.style || layerStyle.upload();
        if (params.layer == null) {
            this.printErrorInfo("未知图层");
        }
        var layer = this.getLayer(params.layer);
        var data = params.data || params;
        if (!data.layer) {
            data.layer = layer;
        }
        var layerObj = this.getLayerObj(layer);
        if (!layerObj) {
            this.printErrorInfo(layer.name || '' + '图层不存在');
        }
        var pointList = this.coordinateCorrectArray(coordinate, params);
        // 如果图元已存在，则删除图元
        if (layer.infos && layer.infos[mappingId]) {
            this.removeFeature(data);
        }
        // 重新设置属性
        this.setFeature(data)
        var polygon = new ol.Feature({
            geometry: new ol.geom.Polygon(pointList)
        });
        polygon.setId(mappingId);
        polygon.setStyle(style);
        layerObj.getSource().addFeature(polygon);
        // 设置当前图层可见
        // this.setLayerVisible(layer, true);
        // this.setLayerOpacity(layer, 100);
        this.getLayerObj(layer).setOpacity(1);
        this.getLayerObj(layer).setVisible(true);
        if (this.getLayerIndex(layer) != this.ZIndex) {
            this.setLayerIndex(layer, ++this.ZIndex);
        }
        if (isShowCenter) {
            var view = map.getView();
            view.fit(polygon.getGeometry().getExtent(), map.getSize());
            var zoom = view.getZoom();
            view.setZoom(zoom - 1);
        }
        data.coordinate = coordinate;
        data.mappingId = mappingId;
        if (isAnalysisArea) {
            data.analysisArea = data.analysisArea || this.getAreaByCoor(coordinate, null, true);
        }
        data.layer = typeof layer == 'string' ? layer : layer.layer;
        data.coordinatesRes = data.coordinatesRes || JSON.stringify(pointList);
        return polygon;
    };

    /**
     * 编辑图元
     * @param polygon   图元
     * @param callback
     */
    GisService.prototype.modifyFeature = function (feature, callback) {
        var that = this;
        var polygon = this.getOlFeature(feature);
        if (polygon.modifyInteraction) {
            this.getMap().removeInteraction(polygon.modifyInteraction);
        }
        var modify = new ol.interaction.Modify({
            features: new ol.Collection([polygon]),
        });
        modify.on('modifystart', function (evt) {
            console.log(evt);
        });
        polygon.modifyInteraction = modify;
        this.getMap().addInteraction(modify);

        //删除图元
        if (!!polygon.modifyPopup) {
            return;
        }
        var modifyPopup = polygon.modifyPopup = new ol.Overlay({
            element: $("<div style='cursor: pointer'><i class=\"layui-icon layui-icon-close-fill\" style='color: #f8f8f8;font-size: 24px;'></i></div>")[0]
        });
        modifyPopup.setPosition(polygon.getGeometry().getInteriorPoint().getCoordinates());
        modifyPopup.getElement().addEventListener('click', function popupClick(e) {
            that.removeFeature(feature);
            that.getMap().removeOverlay(modifyPopup);
            delete polygon.modifyPopup;
        });
        this.getMap().addOverlay(modifyPopup);
    };

    /**
     * 编辑图元完成
     * @param polygon   图元
     * @param callback 图元变化监听函数
     */
    GisService.prototype.modifyFeatureEnd = function (feature) {
        var polygon = this.getOlFeature(feature);
        if (polygon.modifyInteraction) {
            this.getMap().removeInteraction(polygon.modifyInteraction);
            delete polygon.modifyInteraction;
        }
        if (polygon.modifyPopup) {
            this.getMap().removeOverlay(polygon.modifyPopup);
            delete polygon.modifyPopup;
        }
        var coordinate = polygon.getGeometry().getCoordinates();
        return coordinate;
    };

    /**
     * 画点
     * @param layer
     * @param callback
     */
    GisService.prototype.drawPoint = function (layer, callback) {
        var that = this;
        var layerObj = this.getLayerObj(layer);
        this.drawGraph(layer, 'Point', function (info, evt) {
            that.drawFeature(info);
            setTimeout(function () {
                layerObj.getSource().removeFeature(evt.feature);
                that.drawPointEnd(layer);
                callback && callback(info);
            });
        });
    };

    GisService.prototype.drawPointEnd = function (layer, callback) {
        this.drawGraphEnd(layer, callback);
    };

    /**
     * 画线
     * @param layer
     * @param callback
     */
    GisService.prototype.drawLine = function (layer, callback) {
        var that = this;
        var layerObj = this.getLayerObj(layer);
        this.drawGraph(layer, 'LineString', function (info, evt) {
            that.drawFeature(info);
            setTimeout(function () {
                layerObj.getSource().removeFeature(evt.feature);
                that.drawLineEnd(layer);
                callback && callback(info);
            });
        });
    };

    GisService.prototype.drawLineEnd = function (layer, callback) {
        this.drawGraphEnd(layer, callback);
    }

    /**
     * 画多边型
     * @param layer
     * @param callback
     */
    GisService.prototype.drawPolygon = function (layer, callback) {
        var that = this;
        var layerObj = this.getLayerObj(layer);
        this.drawGraph(layer, 'Polygon', function (info, evt) {
            that.drawFeature(info);
            setTimeout(function () {
                layerObj.getSource().removeFeature(evt.feature);
                that.drawPolygonEnd(layer);
                callback && callback(info);
            });
        });
    };

    GisService.prototype.drawPolygonEnd = function (layer, callback) {
        this.drawGraphEnd(layer, callback);
    }

    /**
     * 画图
     * @param callback
     */
    GisService.prototype.drawGraph = function (layer, type, callback) {
        var that = this;
        var layerObj = this.getLayerObj(layer);
        var draw = layerObj.drawInteraction = new ol.interaction.Draw({
            source: layerObj.getSource(),
            type: type,
            style: layerStyle.upload()
        });
        this.getMap().addInteraction(draw);

        draw.on('drawend', function (evt) {
            var layerInfo = that.getLayer(layer);
            var mappingId = that.generateUUID();
            if (layerInfo.properties) {
                layerInfo.properties.forEach(function (prop) {
                    if (prop.field == 'mappingId' && prop.fieldType == 'long') {
                        mappingId = that.generateUUID('long');
                    }
                })
            }
            var info = {
                coordinate: evt.feature.getGeometry().getCoordinates(),
                layer: layer,
                isShowCenter: false,
                mappingId: mappingId,
                feature: evt.feature
            };
            callback && callback(info, evt);
        }, this);
    }

    GisService.prototype.drawGraphEnd = function (layer, callback) {
        var that = this;
        var layerObj = this.getLayerObj(layer);
        if (layerObj.drawInteraction) {
            that.getMap().removeInteraction(layerObj.drawInteraction);
            delete layerObj.drawInteraction;
        }
    }

    /**
     * 获取图元面积
     * @param feature
     * @returns {*}
     */
    GisService.prototype.getFeatureArea = function (feature) {
        var olFeature = this.getOlFeature(feature);
        var geometry;
        if (olFeature) {
            geometry = olFeature.getGeometry();
        } else {
            var pointList = this.coordinateCorrectArray(feature.coordinate);
            geometry = new ol.geom.Polygon(pointList);
        }
        return geometry.getArea();
    }

    /**
     * 获取图元坐标串（处理坐标属性名为coordinate和coordinates不一致问题）
     * @param feature
     * @returns {*}
     */
    GisService.prototype.getFeatureCoordinate = function (feature) {
        return feature.coordinate || feature.coordinates;
    }

    GisService.prototype.flashFeature = function (params) {
        var layer = this.getLayer(params.layer);
        var secound = params.secound;
        var layerObj = this.getLayerObj(layer);
        var flag = true;
        var int = setInterval(function () {
            if (flag) {
                layerObj.setVisible(flag)
                flag = !flag;
            } else {
                layerObj.setVisible(flag)
                flag = !flag;
            }
        }, 300);
        setTimeout(function () {
            clearInterval(int);
            layerObj.setVisible(true);
        }, secound);
    };

    /**
     * 清楚所有图元
     * @param layer
     */
    GisService.prototype.clearAllFeature = function () {
        var that = this;
        this.getAllLayer().filter(function (layer) {
            return layer.autoClear !== false;
        }).forEach(function (layer) {
            that.removeAllFeature(layer);
        });
    }

    /**
     * 删除该图层所有图元
     * @param layer
     */
    GisService.prototype.removeAllFeature = function (layer) {
        var that = this;
        this.getAllFeature(layer).forEach(function (feature) {
            that.removeFeature(feature);
        });
        that.removeAllOLFeature(layer);
    };

    /**
     * 删除该图层所有图元
     * @param layer
     */
    GisService.prototype.removeAllOLFeature = function (layer) {
        var that = this;
        var olLayer = this.getLayerObj(layer);
        olLayer.getSource().clear();
    };

    /**
     * 删除图元
     * @param params
     */
    GisService.prototype.removeFeature = function () {
        if (arguments.length == 1) {
            this.removeFeature1(...arguments
            )
            ;
        } else {
            this.removeFeature2(...arguments
            )
            ;
        }
    };

    /**
     * 根据图元信息删除临时图元
     * @param feature
     */
    GisService.prototype.removeFeature1 = function (feature) {
        this.removeFeature2(feature.layer, feature.mappingId);
    };

    /**
     * 根据mapping删除临时图元
     * @param layer
     * @param mappingId
     */
    GisService.prototype.removeFeature2 = function (layer, mappingId) {
        var layer = this.getLayer(layer);
        var layerObj = this.getLayerObj(layer);
        var source = layerObj.getSource();
        var feature = source.getFeatureById(mappingId);
        if (!feature) {
            console.error("图元编号不存在：" + mappingId);
            return;
        }
        source.removeFeature(feature);
        var info = layer.infos[mappingId];
        layer.infoList.splice(layer.infoList.indexOf(info), 1);
        delete layer.infos[mappingId];
        // 删除编辑状态
        this.modifyFeatureEnd(feature);
    };

    /**
     * 获取所有图元
     * @param layer
     * @returns {*|Array}
     */
    GisService.prototype.getAllFeature = function (layer) {
        var layer = this.getLayer(layer);
        return layer.infoList.concat();
    };

    /**
     * 获取图元属性
     * @param params
     */
    GisService.prototype.getFeature = function (layer, mappingId) {
        var layer = this.getLayer(layer);
        return layer.infos && layer.infos[mappingId];
    };

    /**
     * 获取图元对象
     * @param layer polygon
     * @returns {ol.Feature}
     */
    GisService.prototype.getOlFeature = function (polygon) {
        if (polygon instanceof ol.Feature) {
            return polygon;
        }
        var layerObj = this.getLayerObj(polygon.layer);
        var source = layerObj.getSource();
        return source.getFeatureById(polygon.mappingId);
    };

    /**
     * 设置图元属性
     * @param layer
     * @param mappingId
     * @param data
     */
    GisService.prototype.setFeature = function () {
        if (arguments.length == 1) {
            this.setFeature1(...arguments
            )
            ;
        } else {
            this.setFeature3(...arguments
            )
            ;
        }
    };

    /**
     * 设置临时图元属性
     * @param feature
     */
    GisService.prototype.setFeature1 = function (feature) {
        this.setFeature3(feature.layer, feature.mappingId, feature);
    };

    /**
     * 设置图元属性
     * @param layer
     * @param mappingId
     * @param data
     */
    GisService.prototype.setFeature3 = function (layer, mappingId, data) {
        var layer = this.getLayer(layer);
        var feature = this.getFeature(layer, mappingId);
        if (!feature) {
            layer.infoList && layer.infoList.push(data);
        }
        layer.infos[mappingId] = data;
    };

    /**
     * 根据图元ID进行定位
     */
    GisService.prototype.fixedPosition = function (feature) {
        if (arguments.length == 1) {
            this.fixedPosition1(...arguments
            )
            ;
        } else {
            this.fixedPosition2(...arguments
            )
        }
    };

    /**
     * 根据图元ID进行定位
     * @param feature 图元信息
     */
    GisService.prototype.fixedPosition1 = function (feature) {
        this.fixedPosition2(feature.layer, feature.mappingId);
    }

    /**
     * 根据图元ID进行定位
     * @param layer
     * @param mappingIds
     * @returns {*}
     */
    GisService.prototype.fixedPosition2 = function (layer, mappingIds) {
        var mappindIdList = [];

        var layerObj = this.getLayerObj(layer);
        var source = layerObj.getSource();
        if ($.isArray(mappingIds)) {
            mappindIdList = mappingIds;
        } else {
            mappindIdList.push(mappingIds);
        }
        var extent = null;
        mappindIdList.forEach(function (mappingId, index) {
            var polygon = source.getFeatureById(mappingId);
            if (polygon == null) {
                return;
            }
            if (index == 0) {
                extent = polygon.getGeometry().getExtent();
                return;
            }
            if (!extent) {
                return;
            }
            extent = ol.extent.extend(extent.concat(), polygon.getGeometry().getExtent())
        });
        if (!extent) {
            return;
        }
        var view = this.getMap().getView();
        view.fit(extent, map.getSize());
        if (mappindIdList.length < 5) {
            var zoom = view.getZoom();
            view.setZoom(zoom - 2);
        }
    };
    //坐标转换
    GisService.prototype.coordinateTransform = function (params) {
        var xy = ol.proj.transform([params.x, params.y], 'EPSG:4326', 'EPSG:4526');
        return {x: xy[0], y: xy[1]};
    };

    //定位
    GisService.prototype.personFixedPosition = function (params) {
        //var xy = [params.x, params.y];
        params.isShowCenter = true;
        this.drawBubblePoint(params);
        // var view = this.getMap().getView();
        // view.setCenter(xy);
        // var zoom = view.getZoom();
        // view.setZoom(zoom - 1);
        //view.setZoom(13);
    };

    /**
     * 画一个带气泡的点
     * @param params
     */
    GisService.prototype.drawBubblePoint = function (params) {
        var xy = [params.x, params.y];
        var point = new ol.Feature({
            geometry: new ol.geom.Point(xy)
        });
        point.setStyle(layerStyle.iconStyle());
        this.highLightLayer.getSource().clear();
        this.highLightLayer.getSource().addFeature(point);

        var isShowCenter = params.isShowCenter !== false;
        if (isShowCenter) {
            var view = map.getView();
            view.fit(point.getGeometry().getExtent(), map.getSize());
            var zoom = view.getZoom();
            //view.setZoom(zoom - 1);
            view.setZoom(13);
        }
    }


    /**
     * 图元聚合
     * @param layer
     */
    GisService.prototype.cluster = function (layer, option) {
        option = option || {};
        var that = this;
        var layerObj = this.getLayerObj(layer);
        var source = layerObj.getSource();
        // 聚类图
        var clusterSource = new ol.source.Cluster({
            source: source,
            distance: option.distance || 30,     //调用方法时候输入的聚合距离
            geometryFunction: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getInteriorPoint) {
                    return feature.getGeometry().getInteriorPoint();
                }
                return geometry;
            }
        });
        var maxCount = 0;
        clusterSource.on('change', function () {
            if (this.getFeatures().length > 0) {
                if (option.clusters && option.clusters.length > 0) {
                    var cluster = option.clusters.filter(function (cluster) {
                        return cluster.comparison === true;
                    }).pop();

                    // 计算最大数据
                    if (cluster.field) {
                        maxCount = this.getFeatures().map(function (feature) {
                            return feature.get('features').map(function (polygon) {
                                return that.getFeature(layer, polygon.getId())[cluster.field];
                            }).reduce(function (prev, current) {
                                return prev + current;
                            });
                        }).reduce(function (prev, current) {
                            return Math.max(prev, current);
                        });
                    } else {
                        maxCount = this.getFeatures().map(function (feature) {
                            return feature.get('features').length;
                        }).reduce(function (prev, current) {
                            return Math.max(prev, current);
                        });
                    }
                }
            }
        });
        var imageStyleCache = {};
        var style = function (feature) {
            var features = feature.get('features');
            var text = '';
            var count = 0;
            if (option.clusters) {
                option.clusters.forEach(function (cluster) {
                    if (cluster.type == 'sum' && cluster.field) {
                        var sum = features.map(function (polygon) {
                            return Number(that.getFeature(layer, polygon.getId())[cluster.field]);
                        }).reduce(function (prev, current) {
                            return prev + current;
                        });
                        count = cluster.comparison ? sum : count;
                        text += (text ? '\n' : '') + sum;
                    } else if (cluster.type == 'count') {
                        count = cluster.comparison ? features.length : count;
                        text += (text ? '\n' : '') + features.length;
                    }
                });
            } else {
                text = features.length;
                count = features.length;
            }

            var level = 1;
            if (maxCount > 0) {
                level = 7 - parseInt(count / (maxCount / 6));
            }
            that.clusterRedius = 30;
            var imageStyle = imageStyleCache[level] || new ol.style.Icon({
                // color: [76, 139, 244, 0.7],
                scale: 0.5,
                src: basePath + '/static/image/cluster_' + level + '.png'
            });
            imageStyleCache[level] = imageStyle;
            var style = new ol.style.Style({
                image: imageStyle,
                text: option.textStyle || new ol.style.Text({
                    text: text,
                    fill: new ol.style.Fill({
                        color: 'red'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'yellow',
                        width: 1.5
                    }),
                    font: 'normal 13px 微软雅黑',
                })
            });
            style.getText().setText(text + '');
            return style;
        };
        var clusterLayerStr = layer + '_CLUSTER';
        var clusterLayer = this.addTempLayer({layer: clusterLayerStr});
        //clusterLayer.setMinResolution(maxResolution / Math.pow(2, 11));
        clusterLayer.setStyle(style);
        clusterLayer.setSource(clusterSource);
        this.setLayerIndex(clusterLayerStr, 200);
    };

    /**
     * 图元聚合定位
     * @param xy xy坐标
     * @param layer 图层名称
     */
    GisService.prototype.clusterFixed = function (layer, xy) {
        var clusterLayerObj = this.getLayerObj(layer);
        if (clusterLayerObj) {
            var that = this;
            var resolution = this.getMap().getView().getResolution() * 30;
            var extent = [xy[0] - resolution, xy[1] - resolution, xy[0] + resolution, xy[1] + resolution];
            clusterLayerObj.getSource().forEachFeatureInExtent(extent, function (p1) {
                var mappindIds = p1.getProperties().features.map(function (data) {
                    return data.getId();
                });
                that.fixedPosition(layer, mappindIds);
            });
        }
    };

    /**
     * 热力图
     * @param params
     * @returns {*}
     */
    GisService.prototype.heatMap = function (params) {
        var that = this;
        var layer = params.layer || 'HEATMAP';
        var maxCount = 1;
        var layerObj = this.addTempLayer({
            layer: layer, vector: new ol.layer.Heatmap({
                weight: function (feature) {
                    return parseFloat(that.getFeature(layer, feature.getId())[params.field] / maxCount);
                },
                blur: 30,//8
                radius: 24,//15
            })
        });
        var features = [];
        params.data.forEach(function (feature) {
            feature.area = 0;
            feature.mappingId = this.generateUUID();
            var ft = new ol.Feature({
                geometry: new ol.geom.Point([parseFloat(feature.x), parseFloat(feature.y)]),
                id: feature.mappingId
            });
            ft.setId(feature.mappingId);
            features.push(ft);
            maxCount = feature[params.field] > maxCount ? feature[params.field] : maxCount;
            that.setFeature(layer, feature.mappingId, feature);
        });
        layerObj.setSource(new ol.source.Vector({features: features}));
        return layer;
    };

    /**
     * 设置图层样式
     * @param layer
     * @param style
     */
    GisService.prototype.setLayerStyle = function (layer, style) {
        this.getLayerObj(layer).setStyle(style);
    };

    /**
     * 设置图元样式
     * @param layer
     * @param mappingId
     * @param style
     */
    GisService.prototype.setFeatureStyle = function () {
        if (arguments.length == 2) {
            this.setFeatureStyle2(...arguments
            )
            ;
        } else {
            this.setFeatureStyle3(...arguments
            )
            ;
        }
    };

    /**
     * 设置图元样式
     * @param feature
     * @param style
     */
    GisService.prototype.setFeatureStyle2 = function (feature, style) {
        this.setFeatureStyle3(feature.layer, feature.mappingId, style);
    };

    /**
     * 设置图元样式
     * @param layer
     * @param mappingId
     * @param style
     */
    GisService.prototype.setFeatureStyle3 = function (layer, mappingId, style) {
        var layerObj = this.getLayerObj(layer);
        var source = layerObj.getSource();
        var feature = source.getFeatureById(mappingId);
        if (feature) {
            feature.setStyle(style);
        }
    };

    /**
     * 设置图元选中样式
     * @param params
     */
    GisService.prototype.selectPolygon = function (params) {
        this.setFeatureStyle(params.layer, params.mappingId, layerStyle.select2());
    };

    /**
     * 设置图元取消选中
     * @param params
     */
    GisService.prototype.unSelectPolygon = function (params) {
        this.setFeatureStyle(params.layer, params.mappingId, layerStyle.upload());
    };

    /**
     * 设置图元为气泡样式
     * @param params
     */
    GisService.prototype.setBubbleStyle = function (params) {
        this.setFeatureStyle(params.layer, params.mappingId, layerStyle.bubble());
    };

    /**
     * 获取图元样式
     * @param layer
     * @param mappingId
     */
    GisService.prototype.getFeatureStyle = function () {
        if (arguments.length == 1) {
            return this.getFeatureStyle1(...arguments
            )
                ;
        } else {
            return this.getFeatureStyle2(...arguments
            )
                ;
        }
    };

    GisService.prototype.getFeatureStyle1 = function (feature) {
        return this.getFeatureStyle2(feature.layer, feature.mappingId);
    };

    GisService.prototype.getFeatureStyle2 = function (layer, mappingId) {
        var layerObj = this.getLayerObj(layer);
        var source = layerObj.getSource();
        var feature = source.getFeatureById(mappingId);
        if (feature) {
            return feature.getStyle();
        }
        return null;
    };

    /**
     * 设置图层是否可见
     */
    GisService.prototype.setLayerVisible = function (layer, visible) {
        this.getOlLayer(layer) && this.getOlLayer(layer).setVisible(visible);
        this.getLayerObj(layer) && this.getLayerObj(layer).setVisible(visible);
    };

    /**
     * 设置图层透明度
     */
    GisService.prototype.setLayerOpacity = function (layer, opacity) {
        this.getOlLayer(layer) && this.getOlLayer(layer).setOpacity(opacity);
        this.getLayerObj(layer) && this.getLayerObj(layer).setOpacity(opacity);
    };

    /**
     * 设置临时图层索引
     * @param layer
     * @param index
     */
    GisService.prototype.setLayerIndex = function (layer, index) {
        this.getLayerObj(layer).setZIndex(index);
    };
    /**
     * 设置图层索引
     * @param layer
     * @param index
     */
    GisService.prototype.setOlLayerIndex = function (layer, index) {
        this.getOlLayer(layer).setZIndex(index);
    };


    /**
     * 获取临时图层索引
     * @param layer
     * @param index
     * @returns {*|number}
     */
    GisService.prototype.getLayerIndex = function (layer) {
        return this.getLayerObj(layer).getZIndex();
    };
    /**
     * 获取临时图层
     * @param layer
     * @param opacity
     * @returns {*}
     */
    GisService.prototype.getLayerObj = function (layer) {
        var str = typeof layer == 'string' ? layer : layer.layer;
        return this.tempLayersObj[str];
    };

    /**
     * 获取自定义图层
     * @param layer
     * @returns {*}
     */
    GisService.prototype.getLayer = function (layer) {
        // if (!layer) {
        //     return this.tempLayers;
        // }
        return (typeof layer == 'string' ? this.tempLayers[layer] : this.tempLayers[layer.layer]) || layer;
    };

    /**
     * 获取ol图层
     * @param layer
     * @returns {*}
     */
    GisService.prototype.getOlLayer = function (layer) {
        return this.olLayers[this.getLayer(layer).layer];
    };

    /**
     * 获取所有自定义图层
     * @returns {Array}
     */
    GisService.prototype.getAllLayer = function () {
        var list = [];
        for (var i in this.tempLayers) {
            list.push(this.tempLayers[i]);
        }
        return list;
    };

    /**
     * 叠加分析
     * @param params
     */
    GisService.prototype.analysisRequest = function (params, callback) {
        var that = this;
        that.analysisRequestCount = that.analysisRequestCount || 0;
        that.analysisRequestCount++;
        var mapInfo = this.mapInfo;
        var url = this.interfaceInfo.analysisRequestUrl;
        var strCoordCluster = this.coordinateCorrect(params.coordinate);
        var layer = this.getLayer(params.layer);
        var condition = "";
        var data = {
            strCoordCluster: strCoordCluster,
            strSrcRefName: mapInfo.srsCnName,
            strDesRefName: mapInfo.srsCnName,
            strTbl: layer.analysisTopicTableName,
            strClassInfo: layer.analysisTopicName,
            condition: condition,
            strSubPath: function () {
                var d = new Date();
                var year = d.getFullYear() + "";
                var month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
                var day = d.getDate() + 1 < 10 ? "0" + d.getDate() : d.getDate();
                var str = year + month + day;
                return str + "_" + d.getTime() + "_" + that.analysisRequestCount;
            }(),
            nPointLenPM: '2',
            nPointLenMU: '0',
            nPointLenGQ: '0',
            strRegion: "",//行政区代码,可不传
            nIsProjTrans: '1',
            nIsXmlOrGml: '1',
            nBufferDis: '0',
            bOutImage: false
        };
        var analysisInfo = {};
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",//重要，必须有
            dataType: "json",
            data: JSON.stringify(data),
            success: function (result) {

                if (result && result.lstClipSubInfo && result.lstClipSubInfo.length > 0) {
                    var lstClipSubInfo = result.lstClipSubInfo[0];
                    var baseInfo = lstClipSubInfo.basicInfo.lstYearInfo;
                    var clipInfo = {lstRows: [], lstFlds: []};
                    if (lstClipSubInfo.clipInfo && lstClipSubInfo.clipInfo.lstTabInfo && lstClipSubInfo.clipInfo.lstTabInfo.length > 0) {
                        clipInfo = lstClipSubInfo.clipInfo.lstTabInfo[0];
                    }
                    analysisInfo = {basicInfo: baseInfo, clipInfo: clipInfo};
                    if (clipInfo.lstRows.length > 0) {
                        clipInfo.lstRows.forEach(function (result) {
                            var points = result.GEOMETRYS.split(",");
                            var coordinate = "";
                            var tail = '';
                            for (var m = 3; m < points.length; m++) {
                                if (points[m].length < 5) {
                                    coordinate = coordinate.substring(0, coordinate.length - 1) + '*';
                                    continue;
                                }
                                tail = tail == ',' ? ' ' : ',';
                                coordinate = coordinate + points[m] + tail;
                            }
                            coordinate = coordinate.substring(0, coordinate.length - 1);
                            for (var i in layer.properties) {
                                var keys = layer.properties[i].name.split(',');
                                var field = layer.properties[i].field;
                                for (var x in keys) {
                                    if (result[field]) {
                                        break;
                                    }
                                    result[field] = result[field] || result[keys[x]] || '';
                                }
                            }
                            // mappingId不存在则自动创建mappingId
                            result.mappingId = result.mappingId || result.GUID || result.guid || that.generateUUID();
                            // 叠加坐标
                            result.coordinate = coordinate;
                            result.layer = layer.layer;
                        });
                    }
                }
                callback && typeof callback == 'function' && callback(analysisInfo);
            },
            error: function () {
                callback && typeof callback == 'function' && callback(analysisInfo, {});
            }
        });
    };

    /**
     * 国土空间叠加分析，返回内容为图层设置的属性信息
     * @param params
     * @param callback
     */
    GisService.prototype.analysisClipCondition = function (params, callback) {
        var layer = this.getLayer(params.layer);
        this.analysisRequest(params, function (res) {
            var landList = [];
            var basicInfoList = [];
            var basicInfoStr = "";
            var temp = {};
            if (res.clipInfo) {
                res.clipInfo.lstRows.forEach(function (row) {
                    if (temp[row.mappingId]) {
                        return;
                    }
                    temp[row.mappingId] = 1;
                    var resultInfo = {mappingId: row.mappingId, layer: row.layer, coordinate: row.coordinate};
                    landList.push(resultInfo);
                    layer.properties && layer.properties.forEach(function (prop) {
                        var keys = prop.name.split(',');
                        var field = prop.field;
                        for (var x in keys) {
                            if (resultInfo[field]) {
                                break;
                            }
                            resultInfo[field] = resultInfo[field] || row[keys[x]] || '';
                        }
                    });
                });
                if (res.basicInfo && res.basicInfo.length > 0) {
                    // basicInfoStr = res.basicInfo.map(function (item, index) {
                    //     return "<tr><td>"+item.name.replace(/\s/ig, "&nbsp;") + "</td><td>" + item.value + "</td></tr>";
                    // }).reduce(function (a, b) {
                    //     return a + b;
                    // });
                    // console.log(res.basicInfo);
                    basicInfoList = res.basicInfo;
                }
            }
            // console.log(res);
            var result = {success: true, data: landList, basicInfoList: basicInfoList, basicInfoStr: basicInfoStr};
            // var result = {success: true, data: landList, basicInfoList: basicInfoList, basicInfoStr: basicInfoStr};
            callback && callback(result, params);
        });
    };

    /**
     * wps叠加分析
     * @param params
     */
    GisService.prototype.overlayPolygon = function (params, callback) {
        var that = this;
        var layer = this.getLayer(params.layer);
        var gdbpUrl = layer.gdbpUrl;
        var strCoordCluster = this.coordinateCorrect(params.coordinate);
        var coordinatesStr = strCoordCluster.replaceAll(",", " ");
        var url = basePath + "/gis/layer/overlayPolygon";
        var requestUrl = "http://" + this.interfaceInfo.serverIp + ":" + this.interfaceInfo.serverPort + "/igs/rest/ogc/WPSServer";
        var data = {
            requestUrl: requestUrl,
            gdbpUrl: gdbpUrl,
            coordinatesStr: coordinatesStr
        };
        // var result={"success":true,"data":{"name":"项目选址","landList":[{"mappingId":"100","PRJ_LOCK":"0","面积_":"200022","TO_STATEID":"100000000","mpPerimeter":"1394.45463922102","coordinates":"38460513.2865431,3838652.55718237 38460956.6703322,3838854.09526831 38460979.9910217,3838716.291194 38460950.7247532,3838706.08203057 38460731.652759,3838539.39681759 38460553.1954184,3838413.10393043 38460513.2865431,3838652.55718237","mpArea":"88830.2944659293","项目选址名称":"侯寨森林公园周边选址333","mpLayer":"0","FROM_STATEID":"0"},{"mappingId":"100","PRJ_LOCK":"0","面积_":"200022","TO_STATEID":"100000000","mpPerimeter":"2238.53281295178","coordinates":"38460553.1954184,3838413.10393043 38460731.652759,3838539.39681759 38460950.7247532,3838706.08203057 38460979.9910217,3838716.291194 38461054.0812426,3838278.48534283 38461050.735881,3838258.41317284 38461065.8476871,3838208.95635274 38461104.4649285,3837980.76356258 38460634.2093947,3837927.020073 38460553.1954184,3838413.10393043","mpArea":"293282.325473368","项目选址名称":"侯寨森林公园周边选址333","mpLayer":"0","FROM_STATEID":"0"},{"mappingId":"100","PRJ_LOCK":"0","面积_":"200022","TO_STATEID":"100000000","mpPerimeter":"142.580682227292","coordinates":"38461054.0812426,3838278.48534283 38461065.8476871,3838208.95635274 38461050.735881,3838258.41317284 38461054.0812426,3838278.48534283","mpArea":"234.388845736161","项目选址名称":"侯寨森林公园周边选址333","mpLayer":"0","FROM_STATEID":"0"}],"layer":"X410100XMXZ2020GHBHXMXZ"}};
        // callback(result.data);
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    res.data.forEach(function (data) {
                        data.mappingId = data.mappingId || that.generateUUID();
                        data.layer = data.layer || params.layer;
                    });
                    callback && typeof callback === 'function' && callback(res.data);
                }
            },
            error: function (e) {
                callback && typeof callback === 'function' && callback(e);
            }
        });
    };

    /**
     * 坐标串修正
     * @param coordinate
     * @returns 修改正后的坐标串，字符串格式
     */
    GisService.prototype.coordinateCorrect = function (coordinate, optioin) {
        var that = this;
        optioin = optioin || {};
        var type = optioin.type || '';
        var coordinateStr;
        var regex = /^(\d{8}(\.\d+|),\d{7}(\.\d+|)\s?\*?\#?)*$/;
        if ($.isArray(coordinate)) {
            coordinate = coordinate.concat();
            if (coordinate.length == 0) {
                this.printErrorInfo(type + "坐标串信息为空，请确认");
            }
            if ($.isArray(coordinate[0])) {
                for (var i in coordinate) {
                    if ($.isArray(coordinate[i][0])) {
                        for (var x in coordinate[i]) {
                            coordinate[i][x] = coordinate[i][x][0] + ',' + coordinate[i][x][1];
                        }
                    }
                    coordinate[i] = coordinate[i].join(' ');
                }
                coordinateStr = coordinate.join('*');
            } else {
                coordinateStr = coordinate.join(' ');
            }
        }
        // 坐标格式为字符串格式
        else if (typeof coordinate == 'string') {
            var tempCoordinates = coordinate.replace(/，+/ig, ",").replace(/,+/ig, ",").replace(/\r+/ig, '').replace(/\n+/ig, ' ').replace(/\s+/ig, ' ');
            var coordinatesArr = tempCoordinates.split(' ');
            var position = {};
            for (var j = 0, len = coordinatesArr.length; j < len; j++) {
                if (!coordinatesArr[j]) {
                    continue;
                }
                var list = coordinatesArr[j].split(',');
                // 不带注记的坐标串格式
                if (list.length == 2) {
                    coordinateStr = tempCoordinates;
                    break;
                }
                if (list.length < 4) {
                    that.printErrorInfo("坐标串信息有误，请确认");
                }
                if (list[4] == "H") {
                    if (j == 0) {
                        that.printErrorInfo('第一个点不能是弧线中点');
                    }
                    if (j == len - 1) {
                        that.printErrorInfo('最后一个点不能是弧线中点');
                    }
                    // 移除起点坐标
                    // position[list[1]].pop();
                    var pstart = [coordinatesArr[j - 1].split(",")[3], coordinatesArr[j - 1].split(",")[2]];
                    var pcenter = [list[3], list[2]];
                    var pend = [coordinatesArr[j + 1].split(",")[3], coordinatesArr[j + 1].split(",")[2]];
                    var arrls = [pstart, pcenter, pend];

                    pstart = Number(pstart[0]) > Number(pstart[1]) ? pstart : [pstart[1], pstart[0]];
                    pcenter = Number(pcenter[0]) > Number(pcenter[1]) ? pcenter : [pcenter[1], pcenter[0]];
                    pend = Number(pend[0]) > Number(pend[1]) ? pend : [pend[1], pend[0]];

                    //弧线顺序：从左到右，从上到下
                    if (pstart[0] < pend[0] || (pstart[0] == pend[0] && pstart[1] > pend[1])) {
                        arrls = arcDataUtil.getArcPoints({x: pstart[0], y: pstart[1]},
                            {x: pcenter[0], y: pcenter[1]},
                            {x: pend[0], y: pend[1]}, 1);
                    } else {
                        arrls = arcDataUtil.getArcPoints({x: pend[0], y: pend[1]},
                            {x: pcenter[0], y: pcenter[1]},
                            {x: pstart[0], y: pstart[1]}, 1).reverse();
                    }
                    position[list[1]].push.apply(position[list[1]], arrls);
                    continue;
                }
                var x = list[3], y = list[2];
                if (parseFloat(list[2]) > parseFloat(list[3])) {
                    x = parseFloat(list[2]);
                    y = parseFloat(list[3]);
                }
                if (!position[list[1]]) {
                    position[list[1]] = [];
                }
                position[list[1]].push(x + ',' + y);
            }
            if (!coordinateStr) {
                var arrayPosition = [];
                for (var k in position) {
                    position[k] = position[k].join(' ');
                    arrayPosition.push(position[k]);
                }
                coordinateStr = arrayPosition.join('*');
            }
        } else {
            this.printErrorInfo(type + "坐标串信息有误，请确认");
        }
        if (!regex.test(coordinateStr)) {
            this.printErrorInfo(type + "坐标串信息有误，请确认");
        }
        if ((coordinateStr.charAt(coordinateStr.length - 1)) == " ") {
            coordinateStr = coordinateStr.substr(0, coordinateStr.length - 1);
        }
        return coordinateStr;
    };
    /**
     * 坐标串修正,
     * @param coordinate
     * @returns {Array}
     */
    GisService.prototype.coordinateCorrectArray = function (coordinate, option) {
        option = option || {};
        var type = option.type || '';
        var autoShut = option.autoShut !== false;
        var coordinateStr = this.coordinateCorrect(coordinate, option);
        var pointList = [];
        var that = this;
        coordinateStr.split("*").forEach(function (block) {
            var point = [];
            var d = block.split(' ');
            d.forEach(function (item, index) {
                if (item) {
                    var list = item.split(',');
                    var x = Number(list[0]);
                    var y = Number(list[1]);
                    //if (x <= globalMapConfig.minX || x >= globalMapConfig.maxX || y <= globalMapConfig.minY || y >= globalMapConfig.maxY) {
                    //that.printErrorInfo(type + "坐标超出地图范围【" + x + "," + y + "】");
                    //}
                    point.push([x, y]);
                    // 检查首尾坐标是否一样，自动添加尾坐标
                    if (index == d.length - 1 && item != d[0]) {
                        // that.printErrorInfo(type + "首尾坐标不一致");
                        if (autoShut) {
                            point.push(point[0]);
                        }
                    }
                }
            });
            pointList.push(point);
        });
        return pointList;
    };


    /**
     * 生成uuid
     * @returns {string}
     */
    GisService.prototype.generateUUID = function (type) {
        if (type == 'long') {
            return parseInt(Math.random() * 1000000000);
        }
        var d = new Date().getTime(),
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        return uuid.replace(/-/g, "");
    };

    /**
     * 构建
     * @param params
     * @param callback
     */
    GisService.prototype.buildFeature = function (params) {
        var layer = params.layer;
        layer = this.getLayer(layer);
        var that = this;
        var coordinate = this.coordinateCorrect(this.getFeatureCoordinate(params));
        var gRegionArr = new Array();
        coordinate.split("*").forEach(function (block) {
            var pointArr = new Array();
            var d = block.split(' ');
            d.forEach(function (item, index) {
                if (item) {
                    var list = item.split(',');
                    var x = Number(list[0]);
                    var y = Number(list[1]);
                    //if (x <= globalMapConfig.minX || x >= globalMapConfig.maxX || y <= globalMapConfig.minY || y >= globalMapConfig.maxY) {
                    //    that.printErrorInfo("坐标超出地图范围【" + x + "," + y + "】");
                    //}
                    // 检查首尾坐标是否一样
                    if (index == d.length - 1 && item != d[0]) {
                        that.printErrorInfo("首尾坐标不一致");
                    }
                    var p2d = new Zondy.Object.Point2D(x, y);
                    pointArr.push(p2d);
                }
            });
            //设置区要素的几何信息
            var gArc = new Zondy.Object.Arc(pointArr);
            //构成区要素折线
            var gAnyLine = new Zondy.Object.AnyLine([gArc]);
            //构成区要素
            var gRegion = new Zondy.Object.GRegion([gAnyLine]);
            gRegionArr.push(gRegion);

        });
        //构成区要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({RegGeom: gRegionArr});
        //随机输出1~1502之间的整数
        var fillColor = Math.floor(Math.random() * 1502 + 1);
        //设置区要素的图形参数信息
        var cRegionInfo = new Zondy.Object.CRegionInfo({
            EndColor: 1,
            FillColor: 97,
            FillMode: 0,
            OutPenWidth: 1,
            OverMethod: 0,
            PatAngle: 0,
            PatColor: 3,
            PatHeight: 1,
            PatID: 27,
            PatWidth: 1
        });
        // cRegionInfo = null;
        //要素图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({InfoType: 3, RegInfo: cRegionInfo});

        var attValue = [];
        var fldType = [];
        var fldName = [];

        layer.properties.forEach(function (item) {
            var key = item.field;
            if (key == 'mpArea' || key == 'mpPerimeter') {
                return;
            }
            if (params[key] != undefined && params[key] != null) {//过滤空值字段
                attValue.push(params[key]);
                fldType.push(item.fieldType || 'string');
                fldName.push(item.name.split(',')[0]);
            }
        });
        var fldNumber = fldName.length;

        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet();
        /*if(mappingId && !property){
            //设置区要素的属性信息
            var attValue = [mappingId];
            var fldNumber = 23;
            var fldType = ["string"];
            var fldName = ["GUID"];
        }else if(!!property && !mappingId){
            //设置区要素的属性信息
            var attValue = [];
            var fldType = [];
            var fldName = [];
            var fldNumber = Object.keys(property).length;
            for(var key in property){
                fldName.push(key);
                fldType.push( typeof property[key]);
                attValue.push(property[key]);
            }
        }*/
        //创建一个新的区要素
        var newFeature = new Zondy.Object.Feature({AttValue: attValue, fGeom: fGeom, GraphicInfo: graphicInfo});
        newFeature.setFType(3);
        if (params.fid != undefined && params.fid != null) {
            newFeature.setFID(params.fid);
        }
//	    var fldType = ["string","string","string","string","string","string","double","string","string","double"];
//	    var fldName = ["XM_GUID","XMMC","PFWH","PZSJ","SZS","XMWZ","XMMJ","XMLX","CODE","ND"];

        var cAttValue = new Zondy.Object.CAttStruct({FldNumber: fldNumber, FldType: fldType, FldName: fldName});
        featureSet.AttStruct = cAttValue;
        featureSet.addFeature(newFeature);
        return featureSet;
    }

    /**
     * 添加要素信息
     * @param params layer：图层对象，coordinatesStr：坐标串，mappingId：mappingId
     * @param done
     */
    GisService.prototype.insertFeature = function (params, callback, onError) {
        var layer = this.getLayer(params.layer);
        var featureSet = this.buildFeature(params)
        //创建一个要素编辑服务对象
        var editDocFeature = new Zondy.Service.EditDocFeature(layer.docName, layer.layerIndex, {
            ip: this.interfaceInfo.serverIp,
            port: this.interfaceInfo.serverPort
        });
        editDocFeature.add(featureSet, function (data) {
            callback && typeof callback == 'function' && callback({success: true, data: data});
        }, function () {
            callback && typeof callback == 'function' && callback({success: false, data: "导入失败！"});
        });
    };

    /**
     * 编辑要素信息
     * @param params
     * @param callback
     */
    GisService.prototype.updateFeature = function (params, callback) {
        var layer = this.getLayer(params.layer);
        var featureSet = this.buildFeature(params)
        //创建一个要素编辑服务对象
        var editDocFeature = new Zondy.Service.EditDocFeature(layer.docName, layer.layerIndex, {
            ip: this.interfaceInfo.serverIp,
            port: this.interfaceInfo.serverPort
        });
        editDocFeature.update(featureSet, function (data) {
            callback && typeof callback == 'function' && callback({success: true, data: data});
        }, function () {
            callback && typeof callback == 'function' && callback({success: false, data: "信息修改失败！"});
        });
    }

    /**
     * 删除要素
     * @param params
     * @param callback
     * @param onError
     */
    GisService.prototype.deleteFeature = function (params, callback) {
        if (params.fid) {
            this.deleteFeatureByFid(params, callback);
            return;
        }
        var layer = this.getLayer(params.layer), mappingId = params.mappingId || '',
            mappingIdList = params.mappingIdList || [];
        var that = this;
        if (mappingId) {
            mappingIdList.push(mappingId);
        }
        if (mappingIdList && mappingIdList.length > 0) {
            mappingId = mappingIdList.join('\',\'');
        }
        var wherename;
        for (var i = 0; i < layer.properties.length; i++) {
            var item = layer.properties[i];
            if (item.field == 'mappingId') {
                wherename = item.name.split(',')[0];
                break;
            }
        }
        if (!wherename || !mappingId) {
            this.printErrorInfo("mappingId不存在！");
        }

        params = {
            strClassInfo: layer.topicName,
            strLayerSn: layer.strLayerSn,
            strWhere: wherename + " ='" + mappingId + "'"
        };
        var result;
        var url = "http://" + that.interfaceInfo.serverIp + ":" + that.interfaceInfo.serverPort + "/lnd/rest/comms/DeleteFeature";
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: false,
            contentType: "application/json",//重要，必须有
            data: JSON.stringify(params),
            success: function (result) {
                if (result.ExecuteStatus && result.SucedResult > 0) {
                    result = {success: true, data: result};
                    callback && typeof callback == 'function' && callback(result);
                } else {
                    result = {success: false, data: result.ResultMsg};
                    callback && typeof callback == 'function' && callback(result);
                }
            },
            error: function (event, request, settings) {
                var text = request.responseText || request.statusText;
                if (!text) {
                    if (request.readyState == 0) {
                        text = "网络连接失败，请检查网络是否正常";
                    } else {
                        text = request.statusText;
                    }
                    result = {success: false, data: text};
                    callback && typeof callback == 'function' && callback(result);
                } else {
                    result = {success: false, data: '网络连接失败，请检查网络是否正常'};
                }
            }
        });
        return result;
    };

    GisService.prototype.deleteFeatureByFid = function (params, callback) {
        var layer = this.getLayer(params.layer);
        var fids = params.fid || params.fids;
        var editDocFeature = new Zondy.Service.EditDocFeature(layer.docName, layer.layerIndex, {
            ip: this.interfaceInfo.serverIp,
            port: this.interfaceInfo.serverPort
        });
        editDocFeature.deletes(fids, function (data) {
            callback && typeof callback == 'function' && callback({success: true, data: data});
        }, function () {
            callback && typeof callback == 'function' && callback({success: false, data: "删除失败！"});
        });
    }

    // /**
    //  * 查询
    //  * @param params
    //  * @param callback
    //  */
    // GisService.prototype.Buffer = function (param, callback) {
    //     var coordinate = param.coordinate;
    //     var strCoordCluster = "";
    //     if ($.isArray(coordinate)) {
    //         coordinate = coordinate.join(",");
    //         coordinate.split(',').forEach(function (coord, index) {
    //             strCoordCluster += (index % 2 == 0) ? coord + "," : coord + " ";
    //         });
    //     } else if (typeof coordinate == 'string') {
    //         strCoordCluster = coordinate;
    //     }
    //
    //     strCoordCluster = strCoordCluster.trim();
    //     console.log(strCoordCluster);
    //     var url = "http://" + this.interfaceInfo.serverIp + ":" + this.interfaceInfo.serverPort + "/lnd/rest/comms/Buffer";
    //     var data = {
    //         distance: Number(param.distance),
    //         nGeoType: param.nGeoType,
    //         strCoordCluster: strCoordCluster,
    //         strSrcRefName: "高斯大地坐标系_中国2000_38带3_北2"
    //     }
    //     $.ajax({
    //         url: url,
    //         type: 'POST',
    //         contentType: 'application/json',
    //         dataType: 'json',
    //         data: JSON.stringify(data),
    //         success: function (res) {
    //             callback && typeof callback == 'function' && callback(res,param);
    //         }
    //     })
    // }

    /**
     * 查询
     * @param params
     * @param callback
     */
    GisService.prototype.Buffer = function (param, callback, failure) {
        var coordinate = param.coordinate;
        var strCoordCluster = "";
        if ($.isArray(coordinate)) {
            coordinate = coordinate.join(",");
            coordinate.split(',').forEach(function (coord, index) {
                strCoordCluster += (index % 2 == 0) ? coord + "," : coord + " ";
            });
        } else if (typeof coordinate == 'string') {
            strCoordCluster = coordinate;
        }

        strCoordCluster = strCoordCluster.trim();
        // console.log(strCoordCluster);
        //var url = "http://" + this.interfaceInfo.serverIp + ":" + this.interfaceInfo.serverPort + "/lnd/rest/comms/Buffer";
        var url = basePath + "/gis/comms/buffer"
        var data = {
            distance: Number(param.distance),
            nGeoType: param.nGeoType,
            coordinateCluster: strCoordCluster,
            //strSrcRefName: "高斯大地坐标系_中国2000_38带3_北2""
            reference: ""
        }
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (res) {
                callback && typeof callback == 'function' && callback(res, param);
            },
            error: function () {
                failure && typeof failure == 'function' && failure();
            }
        })
    }

    /**
     * 查询
     * @param params
     * @param callback
     */
    GisService.prototype.queryFeature = function (params, callback) {
        var that = this, mappingId = params.mappingId || '';
        var layer = this.getLayer(params.layer);
        var filterLayerStatus = params.filterLayerStatus !== false;
        // 是否分析面积，默认false
        var isAnalysisArea = params.isAnalysisArea === true;
        if (!layer) {
            this.printErrorInfo("图层不存在");
        }
        // if (layer.loadType == 'wmts') {
        //     return this.queryFeatureWmts(params, callback);
        // }
        var mappingIdList = params.mappingIdList || [];
        if (mappingId) {
            mappingIdList.push(mappingId);
        }
        if (mappingIdList && mappingIdList.length > 0) {
            if (mappingIdList.length > 1000) {
                mappingIdList = mappingIdList.slice(0, 1000);
            }
            mappingId = mappingIdList.join('\',\'');
        }
        var geometryType = params.drawType || 'point';//绘图类型
        var coordinates = this.getFeatureCoordinate(params) || (params.position && params.position.x + "," + params.position.y);//坐标串
        var url = "http://" + that.interfaceInfo.serverIp + ":" + that.interfaceInfo.serverPort + "/igs/rest/mrfs/docs/" + layer.docName + "/0/" + layer.layerIndex + "/query";
        if (layer.gdbpUrl) {
            url = "http://" + that.interfaceInfo.serverIp + ":" + that.interfaceInfo.serverPort + "/igs/rest/mrfs/layer/query";
        }
        if (coordinates) {
            coordinates = that.coordinateCorrect(coordinates).replace(/\s+/ig, ",");
        }
        if ('LineString' == geometryType) {
            geometryType = 'line';
        } else if ('Rect' == geometryType) {
            geometryType = 'polygon';
        } else if ('Polygon' == geometryType) {
            geometryType = 'polygon';
        } else {
            geometryType = 'point';
        }

        var where = '', preKey = '', fldName = [], attValue = [];
        layer.properties && layer.properties.forEach(function (item) {
            var key = item.name.split(',')[0];
            if (item.field === "mappingId") {
                preKey = key;
            }
            if (params[item.field] || params[item.field] == 0) {
                fldName.push(key);
                attValue.push(params[item.field]);
            }
        });

        if (!!mappingId) {//精确查询
            where = preKey + " in('" + mappingId + "')";
        } else {//模糊查询
            var len = fldName.length;
            for (var i = 0; i < len; i++) {
                where += (i != 0) ? "and" : "" + fldName[i] + " like '%" + attValue[i] + "%'";
            }
        }
        //传入过滤条件
        if (params["query_where"]) {
            where = params["query_where"];
        }

        var condition = {
            f: 'json',
            gdbp: layer.gdbpUrl,
            cursorType: "",
            dataService: "",
            fields: "",
            guid: "",
            isAsc: false,
            layerIdxs: "",
            geometryType: (!coordinates) ? "" : geometryType,
            geometry: coordinates || '',
            structs: '{IncludeAttribute:true,'//是否包含属性信息。
                + 'IncludeGeometry:true,' //是否包含空间信息。
                + 'IncludeWebGraphic:false}',//是否包含图形信息（显示参数信息）。
            rule: (!!where) ? "" : '{CompareRectOnly:false,' //是否仅比较要素的外包矩形；
                + 'EnableDisplayCondition:false,'////是否将要素的可见性计算在内
                + 'MustInside:false,'//是否完全包含
                + 'Intersect:true}',//是否相交
            page: '0',//设置查询分页号
            pageCount: '50',//设置查询要素数目,
            where: where
        };
        $.ajax({
            url: url,
            type: 'POST',
            timeout: 10000,
            data: JSON.stringify(condition),
            dataType: 'json',
            success: function (mapData) {
                var resultList = [];

                if (mapData.TotalCount > 0) {
                    if (!layer.properties) {
                        layer.properties = []
                    }
                    ;
                    mapData.SFEleArray.forEach(function (sfele) {
                        var result = {fid: sfele.FID};
                        var coordinatesList = [];
                        sfele.fGeom.RegGeom.forEach(function (regGeom) {
                            regGeom.Rings.forEach(function (rings) {
                                var xyList = [];
                                rings.Arcs[0].Dots.forEach(function (dot) {
                                    var x = dot.x;
                                    var y = dot.y;
                                    xyList.push(x + ',' + y);
                                });
                                coordinatesList.push(xyList);
                            })
                            // regGeom.Rings[0].Arcs[0].Dots.forEach(function (dot) {
                            //     var x = dot.x;
                            //     var y = dot.y;
                            //     xyList.push(x + ',' + y);
                            // });

                        });
                        if (coordinatesList.length == 0) {
                            var xyList = [];
                            sfele.fGeom.PntGeom.forEach(function (pntGeom) {
                                xyList.push(pntGeom.Dot.x, pntGeom.Dot.y);
                            })
                            coordinatesList.push(xyList);
                        }
                        var tmpInfo = {};
                        if (sfele.AttValue) {
                            mapData.AttStruct.FldAlias.forEach(function (item, index) {
                                if (item) {
                                    tmpInfo[item] = sfele.AttValue[index];
                                }
                                if (mapData.AttStruct.FldName[index]) {
                                    tmpInfo[mapData.AttStruct.FldName[index]] = sfele.AttValue[index];
                                }
                            });
                        }
                        for (var i in layer.properties) {
                            var keys = layer.properties[i].name.split(',');
                            var field = layer.properties[i].field;
                            for (var x in keys) {
                                result[field] = result[field] || tmpInfo[keys[x]] || '';
                                if (tmpInfo[keys[x]]) {
                                    delete tmpInfo[keys[x]];
                                }
                            }
                        }
                        ;
                        /*for(var key in tmpInfo){
                            if(!result[key]){
                                layer.properties.push({
                                    field:key,
                                    name:key,
                                    show:(key=='Geometry'||key=='FeatureAttr')?false:true,
                                    title:key
                                });
                                result[key] = tmpInfo[key];
                            }
                        };*/
                        // 过滤图层状态
                        if (filterLayerStatus) {
                            if (layer.layerStatus) {
                                if (result.layerStatus == null || result.layerStatus == undefined || result.layerStatus == '') {
                                    return;
                                }
                                // 剔除非正常状态
                                if (layer.layerStatus.indexOf(result.layerStatus) == -1) {
                                    return;
                                }
                            }
                        }
                        // mappingId不存在则自动创建mappingId
                        result.mappingId = result.mappingId || result.GUID || result.guid || that.generateUUID();
                        if (isAnalysisArea) {
                            result.analysisArea = that.getAreaByCoor(coordinatesList, null, true);
                        }
                        result.coordinate = coordinatesList;
                        result.layer = layer.layer;
                        resultList.push(result);
                    });
                }
                that.featurePropTranslate(layer.strLayerSn, resultList, function (resultList) {
                    callback && typeof callback == 'function' && callback({success: true, data: resultList});
                });
            },
            error: function (error) {
                callback && typeof callback == 'function' && callback({success: false, data: '信息查询失败'});
                // that.printErrorInfo("信息查询失败");
            }
        })
    };

    /**
     * 查询
     * @param params
     * @param callback
     */
    GisService.prototype.queryFeatureWmts = function (params, callback) {
        var that = this;
        var drawType = null;
        if (!!params.drawType) {
            switch (params.drawType) {
                case "Point":
                    drawType = 1;
                    break;
                case "LineString":
                    drawType = 12;
                    break;
                case "Rect":
                    drawType = 14;
                    break;
                case "Polygon":
                    drawType = 14;
                    break;
            }
        }
        var layer = this.getLayer(params.layer);
        var OutSRSName = "高斯大地坐标系_中国2000_38带3_北2";
        var geomSRSName = "高斯大地坐标系_中国2000_38带3_北2";
        var geomType = drawType || 1;
        var geometry = that.coordinateCorrect(that.getFeatureCoordinate(params));
        var pageIndex = 1;
        var pageSize = 10;
        // returnGeometry:true;
        var strLayersInfo = layer.strLayersInfo;
        var strSpatialRelation = "Intersect";

        var url = "http://" + that.interfaceInfo.serverIp + ":" + that.interfaceInfo.serverPort + "/lnd/rest/comms/QueryFeature";
        // var url = "http://10.0.0.112:6163/lnd/rest/comms/QueryFeature";

        $.ajax({
            url: url,
            type: 'POST',
            timeout: 60000,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                OutSRSName: OutSRSName,
                geomSRSName: geomSRSName,
                geomType: geomType,
                geometry: geometry,
                pageIndex: pageIndex,
                pageSize: pageSize,
                returnGeometry: true,
                strLayersInfo: strLayersInfo,
                strSpatialRelation: strSpatialRelation
            }),
            dataType: 'json',
            success: function (res) {
                var infoList = [];
                if (!layer.properties) {
                    layer.properties = []
                }
                ;
                if (res.length && res.length > 0) {
                    res[0].LstFeatureResult.forEach(function (item) {
                        var info = {};
                        var featureAttr = JSON.parse(item.FeatureAttr);
                        for (var i in layer.properties) {
                            var keys = layer.properties[i].name.split(',');
                            var field = layer.properties[i].field;
                            for (var x in keys) {
                                info[field] = info[field] || featureAttr[keys[x]] || '';
                            }
                        }
                        ;
                        /*for(var key in item){
                            if(!info[key]){
                                layer.properties.push({
                                    field:key,
                                    name:key,
                                    show:(key=='Geometry'||key=='FeatureAttr')?false:true,
                                    title:key
                                });
                                info[key] = item[key];
                            }
                        };*/
                        info.coordinate = info.coordinate || item.Geometry;
                        info.mappingId = info.mappingId || info.GUID || info.guid || that.generateUUID();
                        info.layer = layer.layer;
                        infoList.push(info);
                    });
                }
                callback && typeof callback == 'function' && callback({success: true, data: infoList});
            },
            error: function (e) {
                console.log(e);
                callback && typeof callback == 'function' && callback({success: false, data: e});
            }
        })
    };

    /**
     * 图元属性转换
     * @param ztjc 专题简称
     * @param feature
     * @param callback
     */
    GisService.prototype.featurePropTranslate = function (ztjc, feature, callback) {
        if (!ztjc) {
            callback && callback(feature);
            return;
        }
        $.ajax({
            url: basePath + '/gis/dict/' + ztjc,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(feature),
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    callback && callback(res.data);
                }
            }
        });
    }

    GisService.prototype.queryPoiInfoList = function (params, callback) {
        var searchText = params.searchText;
        var url = "http://" + this.interfaceInfo.serverIp + ":" + this.interfaceInfo.serverPort + "/igs/rest/mrfs/docs/X410100ZZXQD2020GZZXQD/0/0/query";
        var data = {
            "f": "json",
            "cursorType": "",
            "dataService": "",
            "fields": "",
            "guid": "",
            "isAsc": false,
            "layerIdxs": "",
            "geometryType": "",
            "geometry": "",
            "structs": "{IncludeAttribute:true,IncludeGeometry:true,IncludeWebGraphic:false}",
            "rule": "",
            "page": "0",
            "pageCount": "50",
            "where": "name like '%" + searchText + "%'"
        }
        $.post({
            url: url,
            dataType: 'json',
            // contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data)
        }).done(function (res) {
            var FldName = res.AttStruct.FldName;
            var SFEleArray = res.SFEleArray;
            var infoList = [];
            SFEleArray.forEach(function (item) {
                var info = {};
                for (var i = 0; i < item.AttValue.length; i++) {
                    info[FldName[i]] = item.AttValue[i];
                }
                info["coordinate"] = item.fGeom.PntGeom[0].Dot;
                infoList.push(info)
            });
            callback && typeof callback == 'function' && callback({success: true, data: infoList});
        }).fail(function (error) {
            callback && typeof callback == 'function' && callback({success: false, data: e});
        })
    };

    /**
     * 输出错误信息，并抛出一异常
     * @param text
     * @param style
     */
    GisService.prototype.printErrorInfo = function (text, isThrow) {
        this.msg(text, {icon: 5});
        if (isThrow !== false) {
            throw text;
        }
    };

    /**
     * 弹出错误信息框
     * @param text
     * @param isThrow
     */
    GisService.prototype.openErrorInfo = function (text, isThrow) {
        window.top.layui && window.top.layui.layer && window.top.layui.layer.closeAll('loading');
        window.layui && layui.layer && layui.layer.closeAll('loading');
        text = text || '';
        text = text.replace('非预期的异常:', '');
        if (window.top.layui && window.top.layui.layer) {
            window.top.layui.layer.open({
                title: '操作失败',
                content: text,
                icon: 5
            });
        } else {
            alert(text);
        }
        if (isThrow !== false) {
            throw text;
        }

    };

    /**
     * 输出信息
     * @param text
     * @param style
     */
    GisService.prototype.msg = function (text, style) {
        window.top.layui && window.top.layui.layer && window.top.layui.layer.closeAll('loading');
        window.layui && layui.layer && layui.layer.closeAll('loading');
        text = text || '';
        text = text.replace('非预期的异常:', '');
        if (window.top.layui && window.top.layui.layer) {
            window.top.layui.layer.msg(text, style || {icon: 6});
        } else {
            alert(text);
        }
    };

    //搜索
    GisService.prototype.searchData = function (params, callback) {
        var that = this;
        var searchText = params.searchText;
        var business = params.business;
        var layers = business.layerInfoList.filter(function (layer) {
            return layer.select === true && !!layer.busiType && !!layer.layerStatus;
        });

        var conditionList = [];
        layers.forEach(function (layer) {
            var busiType = layer.busiType;
            var layerStatus = layer.layerStatus;
            layerStatus.split('-').forEach(function (item) {
                var json = {busiType: busiType, layerStatus: item};
                conditionList.push(json);
            });
        })

        var conditionData = {searchText: searchText, conditionList: conditionList};

        $.ajax({
            url: basePath + '/eg/gis/chrk/search',
            type: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(conditionData),
            success: function (res) {
                if (res.totalCount > 0) {
                    callback(res);
                } else {
                    that.printErrorInfo('未查询到相关业务信息', false);
                }
            }
        });
    };

    //解绑地图事件
    GisService.prototype.mapUnbundEvent = function (params) {
        for (var item in params) {
            if (item && params[item]) {
                this.getMap().unByKey(params[item]);
            }
        }
    };

    //解绑图层事件
    GisService.prototype.layerUnbundEvent = function (layer, params) {
        var UnbLayer = this.getOlLayer(layer);
        for (var item in params) {
            if (item && params[item]) {
                UnbLayer.unByKey(params[item]);
            }
        }
    };

    //卷帘
    GisService.prototype.rollingShutter = function (upLayerName, downLayerName, callback) {
        var layerInfo = this.getLayer(upLayerName);
        layerInfo.show = true;
        this.addLayer(layerInfo);
        var layerUp = this.getOlLayer(upLayerName);
        if (!layerUp) {
            console.error("图层不存在");
            return;
        }
        // var layerDown = this.getOlLayer(downLayerName);
        this.mapDragForbid(false);
        var map = this.getMap();
        var pointdragX = 0, pointdragY = 0, direction = '';
        // 注册地图事件
        var pointerdown = map.on('pointerdown', function (e) {
            var pointdown = map.getPixelFromCoordinate(e.coordinate);
            direction = function (x, y) {
                var mh = map.getSize()[1];//$("#mapcon").height() || 611;
                var mw = map.getSize()[0]//$("#mapcon").width() || 1116;
                var a = mh / mw || 0.5;
                var b = mw / mh || 2;
                if (y <= a * x && y <= mh - a * x) {
                    direction = 'toDown';
                } else if (y >= a * x && y >= mh - a * x) {
                    direction = 'toUp';
                } else if (y < a * x && y > mh - a * x) {
                    direction = 'toLeft';
                } else {
                    direction = 'toRight';
                }
                return direction;
            }(pointdown[0], pointdown[1]);
        });
        var pointerdrag = map.on('pointerdrag', function (e) {

            var pointdrag = map.getPixelFromCoordinate(e.coordinate);
            pointdragX = pointdrag[0];
            pointdragY = pointdrag[1];

            map.render();
        })

        var layerUpLis = layerUp.on('precompose', function (e) {
            var ctx = e.context;
            var maxX = ctx.canvas.width;
            var maxY = ctx.canvas.height;
            ctx.save();
            ctx.beginPath();

            switch (direction) {
                case 'toUp':
                    ctx.rect(0, 0, maxX, pointdragY);
                    break;
                case 'toDown':
                    ctx.rect(0, pointdragY, maxX, maxY);
                    break;
                case 'toRight':
                    ctx.rect(pointdragX, 0, maxX, maxY);
                    break;
                case 'toLeft':
                    ctx.rect(0, 0, pointdragX, maxY);
                    break;
                default:
                    ctx.rect(0, 0, maxX, maxY);
                    break;
            }
            ;
            ctx.clip();//裁剪
        });
        //请求完成，渲染
        var layerUpLiss = layerUp.on('postcompose', function (e) {
            var ctx = e.context;
            ctx.restore();
        });

        callback && typeof callback == 'function' && callback({
            pointerdown: pointerdown,
            pointerdrag: pointerdrag
        }, {layerUpLis: layerUpLis, layerUpLiss: layerUpLiss});
    };

    //移动端卷帘
    GisService.prototype.rollingShutterApp = function (upLayerName, downLayerName, callback) {
        var layerUp = this.getOlLayer(upLayerName);
        // var layerDown = this.getOlLayer(downLayerName);
        this.mapDragForbid(false);
        var map = this.getMap();
        var pointdragX = 0, pointdragY = 0, direction = '';
        // 注册地图事件
        var pointerdown = map.on('pointerdown', function (e) {
            var pointdown = map.getPixelFromCoordinate(e.coordinate);
            direction = function (x, y) {
                var mh = map.getSize()[1];//$("#mapcon").height() || 611;
                var mw = map.getSize()[0]//$("#mapcon").width() || 1116;
                var a = mh / mw || 0.5;
                var b = mw / mh || 2;
                if (y <= a * x && y <= mh - a * x) {
                    direction = 'toDown';
                } else if (y >= a * x && y >= mh - a * x) {
                    direction = 'toUp';
                } else if (y < a * x && y > mh - a * x) {
                    direction = 'toLeft';
                } else {
                    direction = 'toRight';
                }
                return direction;
            }(pointdown[0], pointdown[1]);
        });
        var pointerdrag = map.on('pointerdrag', function (e) {

            var pointdrag = map.getPixelFromCoordinate(e.coordinate);
            pointdragX = pointdrag[0] * 2;
            pointdragY = pointdrag[1] * 2;

            map.render();
        })

        var layerUpLis = layerUp.on('precompose', function (e) {
            var ctx = e.context;
            var maxX = ctx.canvas.width;
            var maxY = ctx.canvas.height;
            ctx.save();
            ctx.beginPath();

            switch (direction) {
                case 'toUp':
                    ctx.rect(0, 0, maxX, pointdragY);
                    break;
                case 'toDown':
                    ctx.rect(0, pointdragY, maxX, maxY);
                    break;
                case 'toRight':
                    ctx.rect(pointdragX, 0, maxX, maxY);
                    break;
                case 'toLeft':
                    ctx.rect(0, 0, pointdragX, maxY);
                    break;
                default:
                    ctx.rect(0, 0, maxX, maxY);
                    break;
            }
            ;
            ctx.clip();//裁剪
        });
        //请求完成，渲染
        var layerUpLiss = layerUp.on('postcompose', function (e) {
            var ctx = e.context;
            ctx.restore();
        });

        callback && typeof callback == 'function' && callback({
            pointerdown: pointerdown,
            pointerdrag: pointerdrag
        }, {layerUpLis: layerUpLis, layerUpLiss: layerUpLiss});
    };


    //获取面积
    GisService.prototype.getAreaByCoor = function (coordinate, callback, async) {
        coordinate = this.coordinateCorrect(coordinate);
        var url = this.interfaceInfo.areaRequestUrl;
        var params = {
            distance: 0,
            nGeoType: 14,
            strCoordCluster: coordinate,
            strSrcRefName: "高斯大地坐标系_中国2000_38带3_北2"
        };
        var area = '0';
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: async ? false : true,
            contentType: "application/json",//重要，必须有
            data: JSON.stringify(params),
            success: function (result) {
                var arr = JSON.parse(result.BufferGeometryResult);
                if (arr && arr.length > 0) {
                    area = arr[0].Area.toFixed(2);
                }
                callback && typeof callback == 'function' && callback({success: true, data: area});
            },
            error: function (error) {
                callback && typeof callback == 'function' && callback({success: false, data: error});
            }
        });
        return area;
    };

    /**
     * 阻塞当前线程
     * @param millisecond 阻塞时间，单位：毫秒
     */
    GisService.prototype.sleep = function (millisecond) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > millisecond) {
                break;
            }
        }
    };

    //根据线分割面
    GisService.prototype.splitAreaByLine = function (areaPoints, linePoints) {
        var arr = [];
        var parser = new jsts.io.OL3Parser();
        parser.inject(ol.geom.Point, ol.geom.LineString, ol.geom.LinearRing, ol.geom.Polygon, ol.geom.MultiPoint, ol.geom.MultiLineString, ol.geom.MultiPolygon);
        var area = parser.read(new ol.geom.Polygon(areaPoints));
        var union;
        linePoints.forEach(function (linePoint) {
            var line = parser.read(new ol.geom.LineString(linePoint));
            if (!!union) {
                union = union.union(line);
            } else {
                union = area.getExteriorRing().union(line);
            }
        });
        var polygonizer = new jsts.operation.polygonize.Polygonizer();
        polygonizer.add(union);
        var polygons = polygonizer.getPolygons();
        for (var i = polygons.iterator(); i.hasNext();) {
            var polygon = i.next();
            var intersection = polygon.intersection(area);
            if (!intersection.isEmpty() && intersection.getArea() > 0 && intersection.getGeometryType() == "Polygon") {
                // console.log(parser.write(intersection).getCoordinates());
                var coordinate = parser.write(polygon).getCoordinates();
                arr.push(coordinate);
            }
        }
        return arr;
    };

    /**
     * 获取内置样式选择器
     */
    GisService.prototype.getDefaultStyleSelector = function () {
        return layerStyle;
    }

    /**
     * 文件解析
     * @param file
     */
    GisService.prototype.fileResolve = function (file, callback) {
        var suffix = file.name.substring(file.name.lastIndexOf("."));
        if (suffix == '.txt') {
            return this.fileResolveTxt(file, callback);
        }
        if (suffix == '.shp') {
            return this.fileResolveShp(file, callback);
        }
        if (suffix == '.json') {
            return this.fileResolveJson(file, callback);
        }
        if (suffix == '.dwg') {
            return this.fileResolveDwg(file, callback);
        }
    };

    /**
     * 解析dwg文件
     * @param file
     * @param callback
     */
    GisService.prototype.fileResolveDwg = function (file, callback) {
        var that = this;
        var loading = that.layui.layer.load(0);
        var form = new FormData();
        form.append("file", file);
        var xhr = new XMLHttpRequest();
        xhr.open("post", basePath + '/gis/file/cad/open', true);
        xhr.onload = function () {
            that.layui.layer.close(loading);
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.response);
                if (data.success) {
                    if (data.data && data.data.length > 0) {
                        var info = [{coordinate: data.data[0].pointContent}];
                        callback && callback(info);
                    }
                } else {
                    that.openErrorInfo("解析文件失败");
                }
            } else {
                that.openErrorInfo("解析文件失败");
            }
        };
        xhr.send(form);
    }


    /**
     * 解析txt文件
     * @param file
     */
    GisService.prototype.fileResolveTxt = function (file, callback) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function () {
                var info = [{coordinate: this.result}];
                callback && callback(info);
            }
            reader.readAsText(file);
        }
    };

    /**
     * 解析shp文件
     * @param file
     */
    GisService.prototype.fileResolveShp = function (file, callback) {
        var that = this;
        var reader = new FileReader();
        reader.onload = function () {
            shapefile.openShp(this.result, {encoding: "utf-8"}).then(function (source) {
                source.read().then(function (result) {
                    var info = [{coordinate: result.value.coordinates}];
                    callback && callback(info);
                });
            });
        }
        reader.readAsArrayBuffer(file);
    };

    /**
     * 解析json文件
     * @param file
     * @param callback
     */
    GisService.prototype.fileResolveJson = function (file, callback) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function () {
                var info = JSON.parse(this.result);
                callback && callback(info);
            }
            reader.readAsText(file);
        }
    };

    /**
     * 导出图元信息为json文件
     * @param features
     * @param fileName
     */
    GisService.prototype.exportFeatureJson = function (features, fileName) {
        var that = this;
        if (!$.isArray(features)) {
            features = [features];
        }
        // 序列化图元信息，（去除除属性信息之外的信息）
        var dataList = features.map(function (feature) {
            var layer = that.getLayer(feature.layer);
            var data = {
                coordinate: that.getFeatureCoordinate(feature),
                mappingId: feature.mappingId,
                layer: feature.layer
            };
            layer.properties && layer.properties.forEach(function (prop) {
                data[prop.field] = feature[prop.field];
            });
            return data;
        });
        var text = JSON.stringify(dataList, null, 4);
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    };

    /**
     * 导出坐标文件（txt）
     * @param features
     * @param fileName
     */
    GisService.prototype.exportCoordinate = function (coordinate, fileName) {
        if (!coordinate) {
            this.printErrorInfo("导出坐标不能为空!");
        }
        //coordinate = coordinate.replace(" ","\r");
        var blob = new Blob([coordinate], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    }


    /**
     * 图层刷新
     * @param layer
     */
    GisService.prototype.layerRefresh = function (layer) {
        var obj = this.getOlLayer(layer);
        obj.getSource().refresh()
    }

    zy.util.provide('zy.gis.style.Text');

    /**
     * 文本类构造函数
     * @param params
     * @constructor
     */
    zy.gis.style.Text = function (opt_options) {
        this.color = 'red';
        this.font = 'normal 14px 微软雅黑';
        this.content = '';
        this.strokeColor = 'yellow';
        this.strokeWidth = 1.5;
        var options = opt_options ? opt_options : {};
        ol.obj.assign(this, options);
    };
    /**
     * 文本颜色
     * @param color
     */
    zy.gis.style.Text.prototype.setColor = function (color) {
        this.color = color;
    };
    /**
     * 文本字体类型
     * @param font
     */
    zy.gis.style.Text.prototype.setFont = function (font) {
        this.font = font;
    };
    /**
     * 文本内容
     * @param content
     */
    zy.gis.style.Text.prototype.setContent = function (content) {
        this.content = content;
    };
    /**
     * 文本边线颜色
     * @param strokeColor
     */
    zy.gis.style.Text.prototype.setStrokeColor = function (strokeColor) {
        this.strokeColor = strokeColor;
    };
    /**
     * 文本边线宽度
     * @param strokeWidth
     */
    zy.gis.style.Text.prototype.setStrokeWidth = function (strokeWidth) {
        this.strokeWidth = strokeWidth;
    };
    /**
     * 转换为ol类型
     * @returns {ol.style.Text}
     */
    zy.gis.style.Text.prototype.build = function () {
        var that = this;
        return new ol.style.Text({
            text: that.content,
            fill: new ol.style.Fill({
                color: that.color
            }),
            stroke: new ol.style.Stroke({
                color: that.strokeColor,
                width: parseFloat(that.strokeWidth)
            }),
            font: that.font
        });
    };

    zy.util.provide('zy.gis.Layer');
    zy.gis.Layer = function (opt_options) {

    };

    zy.gis.Layer.prototype.setLayer = function (layer) {
        this.layer = layer;
    };

    zy.gis.Layer.prototype.setVisible = function (visible) {
        this.visible = visible;
    };

    zy.util.provide('zy.gis.layer.Cluster');
    /**
     * 聚类图构造函数
     * @param opt_options
     * @constructor
     */
    zy.gis.layer.Cluster = function (opt_options) {
        this.subjects = [];
        this.distance = 30;
        this.textStyle = new zy.gis.style.Text();
        var options = opt_options ? opt_options : {};
        ol.obj.assign(this, options);
    };
    zy.gis.layer.Cluster.prototype = new zy.gis.Layer();

    zy.gis.layer.Cluster.prototype.setGisService = function (gisService) {
        this.gisService = gisService;
    };

    /**
     * 设置图层
     * @param layer
     */
    zy.gis.layer.Cluster.prototype.setLayer = function (layer) {
        this.layer = layer;
    };

    /**
     * 设置图层名称
     * @param layerName
     */
    zy.gis.layer.Cluster.prototype.setLayerName = function (layerName) {
        this.layerName = layerName;
    };

    /**
     * 设置聚类距离
     * @param distance
     */
    zy.gis.layer.Cluster.prototype.setDistance = function (distance) {
        this.distance = distance;
    };

    /**
     * 添加聚类主题
     * @param subject
     */
    zy.gis.layer.Cluster.prototype.addSubject = function (subject) {
        this.subjects.push(subject);
    };

    /**
     * 设置文本样式
     * @param text
     */
    zy.gis.layer.Cluster.prototype.setTextStyle = function (textStyle) {
        this.textStyle = textStyle;
    };

    /**
     * 设置聚类图层（根据图层拿到该图层的数据源）
     */
    zy.gis.layer.Cluster.prototype.setResourceLayer = function (resourceLayer) {
        this.resourceLayer = resourceLayer;
    };

    zy.gis.layer.Cluster.prototype.build = function (layer, gisService) {
        gisService = gisService || this.gisService;
        layer = layer || this.resourceLayer;
        var that = this;
        // 聚类图
        var clusterSource = new ol.source.Cluster({
            source: gisService.getLayerObj(layer).getSource(),
            distance: parseInt(that.distance),
            geometryFunction: function (feature) {
                var geometry = feature.getGeometry();
                if (geometry.getInteriorPoint) {
                    return feature.getGeometry().getInteriorPoint();
                }
                return geometry;
            }
        });
        var maxCount = 0;
        clusterSource.on('change', function () {
            if (this.getFeatures().length > 0) {
                if (that.subjects.length > 0) {
                    var subject = that.subjects.filter(function (subject) {
                        return subject.comparison === true;
                    }).pop();

                    // 计算最大数据
                    if (subject.type == 'sum' && subject.field) {
                        maxCount = this.getFeatures().map(function (feature) {
                            return feature.get('features').map(function (polygon) {
                                return Number(gisService.getFeature(layer, polygon.getId())[subject.field]);
                            }).reduce(function (prev, current) {
                                return prev + current;
                            });
                        }).reduce(function (prev, current) {
                            return Math.max(prev, current);
                        });
                    } else if (subject.type == 'avg' && subject.field) {
                        maxCount = this.getFeatures().map(function (feature) {
                            return feature.get('features').map(function (polygon) {
                                return Number(gisService.getFeature(layer, polygon.getId())[subject.field]);
                            }).reduce(function (prev, current) {
                                return prev + current;
                            }) / feature.get('features').length;
                        }).reduce(function (prev, current) {
                            return Math.max(prev, current);
                        });
                    } else if (subject.type == 'count') {
                        maxCount = this.getFeatures().map(function (feature) {
                            return feature.get('features').length;
                        }).reduce(function (prev, current) {
                            return Math.max(prev, current);
                        });
                    }
                    this.maxCount = maxCount;
                }
            }
        });
        var imageStyleCache = {};
        var style = function (feature) {
            var features = feature.get('features');
            var text = '';
            var count = 0;
            if (that.subjects.length > 0) {
                that.subjects.forEach(function (subject) {
                    if (subject.type == 'sum' && subject.field) {
                        var sum = features.map(function (polygon) {
                            return Number(gisService.getFeature(layer, polygon.getId())[subject.field]);
                        }).reduce(function (prev, current) {
                            return prev + current;
                        }).toFixed(2);
                        sum = parseFloat(sum);
                        count = subject.comparison ? sum : count;
                        text += (text ? '\n' : '') + sum;
                    } else if (subject.type == 'avg' && subject.field) {
                        var sum = features.map(function (polygon) {
                            return Number(gisService.getFeature(layer, polygon.getId())[subject.field]);
                        }).reduce(function (prev, current) {
                            return prev + current;
                        });
                        var avg = parseFloat((sum / features.length).toFixed(2));
                        count = subject.comparison ? avg : count;
                        text += (text ? '\n' : '') + avg;
                    } else if (subject.type == 'count') {
                        count = subject.comparison ? features.length : count;
                        text += (text ? '\n' : '') + features.length;
                    }
                });
            } else {
                text = features.length;
                count = features.length;
            }

            var level = 7;
            if (maxCount > 0) {
                level = 7 - parseInt(count / (maxCount / 6));
                if (level <= 0) {
                    level = 7;
                }
            }

            var imageS = {
                '1': [255, 0, 0],
                '2': [255, 50, 0],
                '3': [255, 100, 0],
                '4': [255, 150, 0],
                '5': [255, 200, 0],
                '6': [255, 250, 0],
                '7': [200, 255, 0],
            };

            var imageStyle = imageStyleCache[level] || new ol.style.Icon({
                color: imageS[level],
                scale: 0.5,
                src: basePath + '/static/image/cluster.png'
            });
            imageStyleCache[level] = imageStyle;
            var style = new ol.style.Style({
                image: imageStyle,
                text: that.textStyle.build()
            });
            style.getText().setText(text + '');
            return style;
        };

        var vector = new ol.layer.Vector({
            source: clusterSource,
            style: style,
            zIndex: 200
        });

        return vector;
    };

    /**
     * 聚类图专题构造函数
     * @param opt_options
     * @constructor
     */
    zy.gis.layer.Cluster.Subject = function (opt_options) {
        var options = opt_options ? opt_options : {};
        ol.obj.assign(this, options);
    };
    /**
     * 专题类型，sum,count
     * @param type
     */
    zy.gis.layer.Cluster.Subject.prototype.setType = function (type) {
        this.type = type;
    };

    /**
     * 专题字段
     * @param field
     */
    zy.gis.layer.Cluster.Subject.prototype.setField = function (field) {
        this.field = field;
    };

    /**
     * 是否进行比对
     * @param comparison
     */
    zy.gis.layer.Cluster.Subject.prototype.setComparison = function (comparison) {
        this.comparison = comparison === true;
    };


    //图元处理
    var arcDataUtil = {
        //弧线处理
        findCircle: function (x1, y1, x2, y2, x3, y3) {
            var xy = Math.pow(x1, 2) + Math.pow(y1, 2),
                xyse = xy - Math.pow(x3, 2) - Math.pow(y3, 2),
                xysm = xy - Math.pow(x2, 2) - Math.pow(y2, 2);

            xy = (x1 - x2) * (y1 - y3) - (x1 - x3) * (y1 - y2);
            if (Math.abs(xy) < 0.2/*0.000001*/) {
                return null;
            }

            var cx = ((xysm * (y1 - y3)) - (xyse * (y1 - y2))) / (2 * xy),
                cy = ((xyse * (x1 - x2)) - (xysm * (x1 - x3))) / (2 * xy);
            return {x: cx, y: cy, r: Math.sqrt(Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2))}
        },
        lineAngle: function (p1, p2) {
            var x, y, lineAngle = 0, dbJudgeAngle = 0.001;
            x = p1.x - p2.x;
            y = p2.y - p1.y;
            if ((x > 0 && y > 0) || (x > 0 && y < 0)) {
                lineAngle = Math.atan(y / x);
            } else if ((x < 0 && y > 0) || (x < 0 && y < 0)) {
                lineAngle = Math.PI + Math.atan(y / x);
            } else if (x == 0) {
                if (y < 0) {
                    lineAngle = -Math.PI / 2;
                } else if (y > 0) {
                    lineAngle = Math.PI / 2;
                }
            } else if (y == 0) {
                if (x < 0) {
                    lineAngle = Math.PI;
                } else if (x > 0) {
                    lineAngle = 0;
                }
            }

            if (Math.abs(lineAngle - 0) < dbJudgeAngle) {
                lineAngle = 0;
            } else if (lineAngle < 0) {
                lineAngle = 2 * Math.PI + lineAngle;
            }
            return lineAngle;
        },
        findPath: function (paper, ps, pc, pe) {
            var c = this.findCircle(ps.x, ps.y, pc.x, pc.y, pe.x, pe.y), isLine, path, l;
            if (c) {
                var a1 = this.lineAngle(ps, c), a2 = this.lineAngle(pc, c), a3 = this.lineAngle(pe, c),
                    fmax = Math.max(a1, a3), fmin = Math.min(a1, a3),
                    a = a2 > fmin && a2 < fmax ? (fmax - fmin) : (Math.PI * 2 - (fmax - fmin)),
                    ac = a2 < a1 ? (a1 - a2) : (a2 - a1);
                var rotation = (a > Math.PI) ? 1 : 0,
                    flag = ((pc.x - ps.x) * (pe.y - pc.y) - (pc.y - ps.y) * (pe.x - pc.x)) > 0 ? 1 : 0,
                    pathStr = ['M', ps.x, ',', ps.y, ' A', c.r, ',', c.r, ' 0 ', rotation, ',', flag, ' ', pe.x, ',', pe.y].join('');
                if (ac > a) {
                    ac = 2 * Math.PI - ac;
                }
                l = ac * c.r;
                path = paper.path(pathStr).attr({fill: 'none', stroke: '#000', strokeLength: 1});
                paper.circle({cx: c.x, cy: c.y, r: 2, fill: '#000'});
                isLine = false;
            } else {
                path = paper.path(['M', ps.x, ',', ps.y, ' L', pe.x, ',', pe.y].join('')).attr({
                    fill: 'none',
                    stroke: '#000',
                    strokeLength: 1
                });
                isLine = true;
            }
            return [isLine, path, isLine ? null : l];
        },
        getArcPoints: function (ps, pc, pe, parts_len) {

            var paper = Snap(document.createElement("svg")), arr = this.findPath(paper, ps, pc, pe), isLine = arr[0],
                path = arr[1],
                length = path.getTotalLength(), l = parts_len, points = [], sl = arr[2], b = false,
                parts = length / parts_len;
            if (isLine) {
                return [ps.x + "," + ps.y, pc.x + "," + pc.y, pe.x + "," + pe.y];
            } else {
                for (var i = 1; i < parts; i++) {
                    pl = l * i;
                    p = path.getPointAtLength(pl);
                    paper.circle({cx: p.x, cy: p.y, r: 2, fill: '#00f'});
                    if (!b) {
                        if ((sl - pl) == 0) {
                            b = true;
                        } else if ((sl - pl) < 0) {
                            points.push(pc.x + "," + pc.y);
                            b = true;
                        }

                    }
                    if (p.x == pe.x && p.y == pe.y) {
                        break;
                    }
                    points.push(p.x + "," + p.y);
                }
            }
            return points;
        }
    };

    var layerStyle = {
        upload: function (textParam) {
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
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#aa3300'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2})
                })
            });
        },
        select: function (textParam) {
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
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#fff'}),
                    stroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            });
        },
        select2: function (textParam) {
            return new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: '#A33271'//'#1269d3'
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
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#fff'}),
                    stroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            });
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
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    overflow: true,
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
                    backgroundStroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            })
        },
        transparent: function (textParam) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    overflow: true,
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
                    backgroundStroke: new ol.style.Stroke({color: '#f00', width: 1})
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
        },
        iconStyle: function () {
            return new ol.style.Style({
                image: new ol.style.Icon(({
                    src: basePath + '/static/image/fixPositionb.png'
                }))
            });
        },
        // 气泡样式
        bubble: function () {
            return new ol.style.Style({
                image: new ol.style.Icon(({
                    src: basePath + '/static/image/fixPosition.png'
                })),
                geometry: function (feature) {
                    return feature.getGeometry().getInteriorPoint();
                }
            });
        },
        buffer: function (param) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#00ffff',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 255, 0, 0.1)'
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: (param && param.text) || '',
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#fff'}),
                    stroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            })
        },
        // 居住用地
        residentialLand: function (textParam) {
            return new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: 'rgb(255,255,0)'
                }),
                //边线颜色
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    overflow: true,
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
                    backgroundStroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            })
        },
        // 绿地与广场用地
        greenLand: function (textParam) {
            return new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: 'rgb(0,255,0)'
                }),
                //边线颜色
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    overflow: true,
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#000'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2}),
                    backgroundStroke: new ol.style.Stroke({color: '#f00', width: 1})
                })
            })
        },
        // 红色地块
        redLand: function (textParam) {
            return new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: 'rgb(255,0,0)'
                }),
                //边线颜色
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 16px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    overflow: true,
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#ffffff'}),
                    stroke: new ol.style.Stroke({color: '#000000', width: 2}),
                    backgroundStroke: new ol.style.Stroke({color: '#ffffff', width: 1})
                })
            })
        },
        // 公共道路
        publicRoad: function (textParam) {
            return new ol.style.Style({
                //填充色
                fill: new ol.style.Fill({
                    color: 'rgb(126,135,126)'
                }),
                //边线颜色
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    text: textParam || '',
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({color: '#aa3300'}),
                    stroke: new ol.style.Stroke({color: '#ffcc33', width: 2})
                })
            })
        },

    };

    function getSessionId() {
        var sessionId = ($.cookie && $.cookie("JSESSIONID")) || "";
        if (!sessionId) {
            sessionId = window.sessionStorage.getItem("JSESSIONID") || "";
        }
        if (sessionId.indexOf('.') != -1) {
            sessionId = sessionId.substring(0, sessionId.indexOf('.'));
        }
        return sessionId;
    }
})();
