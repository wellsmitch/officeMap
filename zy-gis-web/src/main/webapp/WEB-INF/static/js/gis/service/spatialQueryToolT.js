function MyzzyyTree(target, zNodes, showCheckBox, callback) {
    var that = this;
    this.target = target;
    this.zNodes = zNodes;
    this.showCheckBox = showCheckBox;
    this.callback = callback;
    this.target.empty();
    this.target[0].id = "_a" + parseInt(Math.random() * 100000) + "xx";
    this.nodesMap = {};
    zNodes.forEach(function (node) {
        that.nodesMap[node.id] = node;
    });
    this.initMyTree();
}

MyzzyyTree.prototype.initMyTree = function () {
    var that = this;
    var setting = {
        check: {
            enable: true,
            chkStyle: (this.showCheckBox) ? "checkbox" : "radio",
            radioType: "all",
            chkboxType: { "Y": "ps", "N": "ps" }
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
            onCheck: function (e, treeId, treeNode) {
                var arr = [];
                console.log(treeNode);
                getAllLeafNodes(treeNode, arr);
                arr.forEach(function (node) {
                    that.nodesMap[node.id].checked = treeNode.checked;
                })
                that.callback && typeof that.callback === 'function' && that.callback(treeNode.checked, arr);
            },
            onClick: function (e, treeId, treeNode) {
                zTree.checkNode(treeNode, !treeNode.checked, true);
                setting.callback.onCheck(e, treeId, treeNode);
            }
        }
    };
    var zTree = $.fn.zTree.init(this.target, setting, this.zNodes);
    zTree.expandAll(false);

    function getAllLeafNodes(treeNode, arrayObj) {
        if (treeNode.isParent) {
            var childrenNodes = treeNode.children;
            if (childrenNodes) {
                for (var i = 0; i < childrenNodes.length; i++) {
                    if (!childrenNodes[i].isParent) {
                        arrayObj.push(childrenNodes[i]);
                    } else {
                        getAllLeafNodes(childrenNodes[i], arrayObj);
                    }
                }
            }
        } else {
            arrayObj.push(treeNode);
        }
        return arrayObj;
    }
}

function MyzzyyTreeQuery(target, zNodes, callback) {
    this.target = target;
    this.zNodes = zNodes;
    this.callback = callback;
    this.target.empty();
    this.target[0].id = "_a" + parseInt(Math.random() * 100000) + "xx";
    this.initMyTree();
}

MyzzyyTreeQuery.prototype.initMyTree = function () {
    var that = this;
    var setting = {
        check: {
            enable: false,
            chkStyle: "radio",
            radioType: "all"
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
            onCheck: function (e, treeId, treeNode) {
            },
            onClick: function (e, treeId, treeNode) {
                that.callback && typeof that.callback === 'function' && that.callback(treeNode);
                return false;
            }
        }
    };
    // console.log(this.zNodes);
    var sZtree = $.fn.zTree.init(this.target, setting, this.zNodes);
    var list = sZtree.transformToArray(sZtree.getNodes());
    for (var i = 0; i < list.length; i++) {
        var eleA = list[i];
        if(!eleA.isParent) {
            var node = sZtree.getNodeByParam("tId", eleA.tId, null);
            setting.callback.onClick(null, sZtree.setting.treeId, node);
            return
        }
    }
}
//-----------------------------SpatialQueryTool----------------------------------------------
;(function (window, undefined) {
    // var drawInteraction = {};
    var queryDrawLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        name: '要素查询绘图图层',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(10,129,195,0.2)"
            }),
            stroke: new ol.style.Stroke({
                color: "#0A81C3",
                width: 3
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: "#0A81C3"
                })
            })
        })
    });

    var overlayDomStr = '<div class="container_spatial" style="cursor:pointer;position: absolute;top: 50px">\n' +
        '    \t\t\t \t<div style="background: #0A81C3;color: #fff;line-height: 30px;overflow:hidden;padding: 0" class="mapMsgWraper_header">\n' +
        '    \t\t\t \t\t<div style="text-indent: 10px;float: left;">属性</div>\n' +
        '    \t\t\t \t\t<div class=\'fr layui-icon layui-icon-close\' style=\'font-weight:800;font-size:16px;cursor:pointer;text-align:center;width:32px;\'></div>\t\t\t\t  \n' +
        '    \t\t\t \t</div>\n' +
        '\t\t\t\t    <div class="contentIndex zTreeDemoBackground left">\n' +
        '\t\t\t\t        <ul class="queryResult ztree" style="height:96%;width:100%;overflow-y:scroll;overflow-x: auto;position:relative"></ul>\n' +
        '\t\t\t\t    </div>\n' +
        '\t\t\t\t    <div class="contentDetail" style="min-width: 200px;"></div>\n' +
        '\t\t\t\t</div>';


    function SpatialQueryTool(gisServer, params, spatialQueryCallback) {

        this.gisServer = gisServer;
        this.cb = params.copyFeatureInfo;
        //
        this.overlayDom = overlayDom = $(overlayDomStr);
        this.zNodes = [];
        this.jdata = {};
        this.isAddOverlay = true;
        this.mark = {};
        this.overlay = new ol.Overlay({
            element: overlayDom[0],
            offset: [40, 0],
            //positioning: 'center-left'加上会出现晃动  原因不明
            // positioning: 'center-left',
            //autoPan 搜索出结果后会将结果dom自适应到地图容器中显示
            autoPan: false,
            stopEvent: true,
            autoPanAnimation: {duration: 500},//当Popup超出地图边界时，为了Popup全部可见，地图移动的速度.
        });
        //
        this.uploadLayer = params.uploadLayer;
        this.parentLayer = params.parentLayer;
        this.map = this.gisServer.getMap();
        this.map.addLayer(queryDrawLayer);
        queryDrawLayer.setZIndex(10000000);
    };

    SpatialQueryTool.prototype.clear = function (type) {
        this.zNodes = [];
        this.jdata = {};
        this.isAddOverlay = true;
        $(this.overlay.getElement()).find('>div:last').empty();
        this.overlay.setPosition(undefined);
        queryDrawLayer.getSource().clear();
        if (!$.isEmptyObject(this.mark)) {
            this.gisServer.removeFeature(this.mark.layer, this.mark.mappingId);
            this.mark = {};
        }
        if (!!type && this.drawInteraction) {
            this.map.removeInteraction(this.drawInteraction);
        }
        if (this.tempLayer) {
            this.tempLayer.getSource().clear();
        }
        if (this.pointMove) {
            this.map.removeInteraction(this.pointMove);
        }
        if (this.$poiInfo) {
            this.$poiInfo.find('.layui-icon-close').click();
        }
        if (this.mapClickEvent) {
            this.map.unByKey(this.mapClickEvent);
        }
    };

    SpatialQueryTool.prototype.getDrawInteraction = function (drawType) {
        // if(drawInteraction[drawType]){
        //     return drawInteraction[drawType]
        // }
        this.drawInteraction = createInteraction(drawType);
        // drawInteraction[drawType] = draw;
        return this.drawInteraction;
    };
    //封装查询结果封装至ztree：layerNameCn-图层名称，res-查询返回数据，id-图层序号，spatialOverlay-数据位置
    SpatialQueryTool.prototype.dealSpatialQueryData = function (params) {//layerName,res
        var that = this;
        var layerName = params.queryRequest.name;
        var center = params.center;
        var res = params.res;
        var len = res.length;
        if (len == 0) {
            return;
        }
        var id = "";
        var pid = "";
        if (params.queryRequest.fullPathName) {
            var nameList = params.queryRequest.fullPathName.split("/");
            for (var i = nameList.length > 1 ? 1 : 0; i < nameList.length; i++) {
                var name = nameList[i];
                if (i == nameList.length - 1) {
                    name += "(" + len + ")";
                }
                id += name;
                var node = {id: id, pid: pid, name: name, open: true};
                pid = id;
                if (!this.zNodes.some(function (item) {
                    return item.id == id;
                })) {
                    this.zNodes.push(node);
                }
            }
        } else {
            var name = params.queryRequest.name;
            var node = {id: name, pid: name, name: name, open: true};
            pid = name;
            this.zNodes.push(node);
        }
        for (var i = 1; i <= len; i++) {
            var node = {id: pid + i, pid: pid, name: i, open: true};
            this.zNodes.push(node);
        }
        this.jdata[pid] = res;
        if (this.isAddOverlay) {
            this.isAddOverlay = false;
            this.overlay.setPosition(center);
            // this.map.getView().setCenter(center);
            this.map.addOverlay(this.overlay);
            window.zyDrag(that.overlayDom[0]);
            $(that.overlayDom[0]).css({
                left:params.pixel[0],
                top:params.pixel[1]
            })
            $(that.overlayDom[0]).parent().css({position: "initial"});

            $(this.overlay.getElement()).find('.layui-icon-close').click(function () {
                that.clear();
            });
        }
        $(that.overlayDom).css({
            top: "18%",
            left: "18%"
        });
        new MyzzyyTreeQuery(that.overlayDom.find('.queryResult.ztree'), that.zNodes, function (treeNode) {
            that.onClick2(treeNode);
        });
    };
    SpatialQueryTool.prototype.dealSpatialQueryDataT = function (params) {
        var that = this;
        var map = this.map;
        var data = params.data;
        var layer = params.layer;
        var layerProperty = this.gisServer.getLayer(layer).properties;
        var center = params.center;
        this.tempLayer = this.gisServer.tempLayersObj[layer];
        if (!this.tempLayer) {
            console.log("未查到图层");
            return;
        }
        if (this.pointMove) {
            this.map.removeInteraction(this.pointMove);
            this.$poiInfo.find('.layui-icon-close').click();
            this.tempLayer.getSource().clear();
        }
        var currentFeatures = [];

        var $poiInfo = this.$poiInfo = $('<div class="container_hover" style="cursor:pointer">\n' +
            '\t\t\t<div style="background: #0A81C3;color: #fff;line-height: 30px;overflow:hidden;">\n' +
            '\t\t\t\t<div style="text-indent: 10px;float: left;">查询结果</div>\n' +
            '\t\t\t\t<div class="fr layui-icon layui-icon-close" style="font-weight:800;font-size:16px;cursor:pointer;text-align:center;width:32px;"></div>\n' +
            '\t\t\t</div>\n' +
            '\t\t\t<div class="container_hover_Detail"></div>\n' +
            '\t\t</div>');

        var overlay = new ol.Overlay({
            element: $poiInfo[0],
            offset: [40, 0],
            positioning: 'center-left',
            // autoPan: true,
            // stopEvent: true,
            // autoPanAnimation: {duration: 500},//当Popup超出地图边界时，为了Popup全部可见，地图移动的速度.
        });
        map.addOverlay(overlay);

        var pointMove = this.pointMove = new ol.interaction.Select({
            layers: [this.tempLayer],
            condition: ol.events.condition.pointerMove,
            toggleCondition: ol.events.condition.never
        });

        $poiInfo.find('.layui-icon-close').on('click', function (e) {
            overlay.setPosition(undefined);
            if (currentFeatures.length > 0) {
                currentFeatures.forEach(function (currentFeature) {
                    currentFeature.setStyle(
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                anchorOrigin: 'bottom-left',
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: basePath + '/static/image/fixPositionb.png'
                            }),
                            geometry: function (feature) {
                                return feature.getGeometry().getInteriorPoint();
                            }
                        })
                    );
                });
                currentFeatures = [];
            }

            if (!pointMove.getActive()) {
                pointMove.setActive(true);
            }
        });

        var features = parsePolygonFeatures(data, layerProperty);
        this.tempLayer.getSource().clear();
        this.tempLayer.getSource().addFeatures(features);

        map.addInteraction(pointMove);

        this.mapClickEvent = map.on('click', function (e) {
            var pixel = map.getEventPixel(e.originalEvent);
            var featureInfo = map.forEachFeatureAtPixel(pixel,
                function (feature, layer) {
                    return {
                        feature: feature,
                        layer: layer
                    };
                });
            if (featureInfo !== undefined && featureInfo !== null && featureInfo.layer !== null) {
                pointMove.setActive(false);
            }
        })

        pointMove.on("select", function (evt) {
            if (evt.selected.length == 1 && evt.selected[0].getGeometry() instanceof ol.geom.Polygon) {
                var feature = evt.selected[0];
                currentFeatures.push(feature);
                var center = getCenterByFeature(feature);
                var info = feature.values_.info;
                if (!info) {
                    return;
                }

                that.drawInteraction.setActive(false);

                feature.setStyle([new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: '#aa3300'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',//'#ff0000',
                        width: 4
                    })
                }),
                    new ol.style.Style({
                        image: new ol.style.Icon({
                            anchorOrigin: 'bottom-left',
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            src: basePath + '/static/image/fixPositionb.png'
                        }),
                        geometry: function (feature) {
                            return feature.getGeometry().getInteriorPoint();
                        }
                    })
                ]);
                var html = "";
                for (var key in info) {
                    html += "<div class='hover_line'>" +
                        "   <span>" + key + "</span>" +
                        "   <span>" + info[key] + " : </span>" +
                        "</div>"
                }
                $poiInfo.find('.container_hover_Detail').html(html);

                overlay.setPosition(center);
            } else {
                if (!that.drawInteraction.getActive()) {
                    that.drawInteraction.setActive(true);
                }
                overlay.setPosition(undefined);
                if (currentFeatures.length > 0) {
                    currentFeatures.forEach(function (currentFeature) {
                        currentFeature.setStyle(
                            new ol.style.Style({
                                image: new ol.style.Icon({
                                    anchorOrigin: 'bottom-left',
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    src: basePath + '/static/image/fixPositionb.png'
                                }),
                                geometry: function (feature) {
                                    return feature.getGeometry().getInteriorPoint();
                                }
                            })
                        );
                    })
                    currentFeatures = [];
                }
            }
        });


        function parsePolygonFeatures(resData, layerProperty) {
            var count = resData.length;
            var features = new Array();
            for (var i = 0; i < count; ++i) {
                var info = resData[i];
                var coordinateArr = that.gisServer.coordinateCorrectArray(info.coordinate);
                info = transformTolableFld(info, layerProperty);
                var polygonFeature = new ol.Feature({
                    geometry: new ol.geom.Polygon(coordinateArr),
                    info: info,
                });
                polygonFeature.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Icon({
                            anchorOrigin: 'bottom-left',
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            src: basePath + '/static/image/fixPositionb.png'
                        }),
                        geometry: function (feature) {
                            return feature.getGeometry().getInteriorPoint();
                        }
                    })
                );
                features.push(polygonFeature);
            }
            return features;
        }

        function addResShowLayer(map, features) {
            var vectorSource = new ol.source.Vector({
                features: features,
                wrapX: false
            });
            var vector = new ol.layer.Vector({
                source: vectorSource
            });
            map.addLayer(vector);
        }

        function transformTolableFld(resInfo, layerProperty) {
            var info = {};
            layerProperty.forEach(function (property) {
                if (property.show) {//&& (resInfo[property.title] || resInfo[property.name])
                    info[property.title] = resInfo[property.title] || resInfo[property.name] || "";
                }
            })
            return info;
        }

        function getCenterByFeature(feature) {
            var center;
            var geometry = feature.getGeometry();
            if (geometry instanceof ol.geom.Point) {
                center = geometry.getCoordinates();
            } else if (geometry instanceof ol.geom.MultiPoint) { //点要素
                var points = geometry.getPoints();
                if (points.length > 2) {
                    var index = Math.cell(points.length / 2);  //如果是多个点 则取中间范围的一个点
                    center = points[index - 1].getFirstCoordinate();
                } else {
                    center = points[0].getFirstCoordinate();
                }
                center = geometry.getCoordinates()[0];
            } else if (geometry instanceof ol.geom.MultiLineString) {  //线要素
                var coordinates = geometry.getCoordinates();
                if (coordinates.length > 2) {
                    var index = Math.cell(coordinates.length / 2);
                    center = coordinates[index - 1];
                } else {
                    center = coordinates[0];
                }
            }
            if (geometry instanceof ol.geom.Polygon) {
                center = geometry.getInteriorPoint().getCoordinates(); //获取lable点
            }
            return center;
        }
    };


    SpatialQueryTool.prototype.onClick2 = function (treeNode) {
        if (treeNode.getParentNode() != null) {
            var parentName = treeNode.getParentNode().id;
            var nodeName = treeNode.name;
            this.ztreeNodeOnClick(parentName, nodeName);
        }
    }

    SpatialQueryTool.prototype.ztreeNodeOnClick = function (parentName, nodeName) {
        var that = this;
        var values = this.jdata[parentName][nodeName - 1];
        var layer = this.gisServer.getLayer(values.layer);
        var mappingId = this.gisServer.generateUUID();
        var properties = layer.properties;
        if (!$.isEmptyObject(this.mark)) {
            this.gisServer.removeFeature(this.mark.layer, this.mark.mappingId);
        }
        var str = "";
        if (!!this.cb && !!this.uploadLayer && (this.parentLayer == layer || layer.layer == "D410100QS2019KZDJBXX")) {
            str = "<div class='overflow' style='border-bottom:1px solid #dcdcdc;line-height:30px'>"
                + "<div class='fl'><button>复制</button></div>"
                + "</div>";
        }
        for (var i in properties) {
            if (properties[i].show) {
                var field = properties[i].field;
                var msgVal;
                if(!isNaN(Number(properties[i]['numToFixed'])) && !isNaN(Number(values[field]))){
                    msgVal = parseFloat(Number(values[field]).toFixed(properties[i]['numToFixed']));
                    console.log(msgVal);
                }else {
                    msgVal = values[field]
                }
                str +=
                    "<div class='overflow' style='border-bottom:1px solid #dcdcdc;line-height:30px'>"
                    + "<div class='fl'>" + properties[i].title + ":</div>"
                    + "<div class='fl' style='padding-left:10px;box-sizing:border-box'>" +
                    msgVal
                    + "</div>"
                    + "</div>"
            }
        }
        $(this.overlay.getElement()).find('>div:last').html(str);
        var coordinate = values.coordinate;
        // var guid = values.GUID;
        // var center = getCenterByCoord(this.gisServer.coordinateCorrectArray(coordinate));
        // this.overlay.setPosition(center);
        // this.map.getView().setCenter(center);
        this.gisServer.drawFeature({
            coordinate: coordinate,
            mappingId: mappingId,
            layer: layer,
            isShowCenter: false,
            style: new ol.style.Style({
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
            })
        })
        this.mark = {layer: layer, mappingId: mappingId};
        $(this.overlay.getElement()).find('button').on('click', function () {
            that.cb && that.cb({layer: layer, data: values});
        })
    }

    function createInteraction(drawType) {
        var draw = null;
        if (drawType == 'Rect') {
            draw = new ol.interaction.Draw({
                source: queryDrawLayer.getSource(),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(10,129,195,0.4)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#0A81C3",
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#0A81C3'
                        })
                    })
                }),
                type: "Circle",
                geometryFunction: ol.interaction.Draw.createBox()
            });
        } else {
            draw = new ol.interaction.Draw({
                source: queryDrawLayer.getSource(),
                type: drawType,//'Polygon' Rect LineString
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(10,129,195,0.4)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#0A81C3",
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#0A81C3"
                        })
                    })
                })
            });
        }
        return draw;
    };

    function getCenterByCoord(coordinatesStr) {
        var polygon = new ol.Feature({
            geometry: new ol.geom.Polygon(coordinatesStr)
        });
        var extent = polygon.getGeometry().getExtent();
        var center = ol.extent.getCenter(extent);   //获取边界区域的中心位置
        return center;
    }

    window.SpatialQueryTool = SpatialQueryTool;
})(window, undefined);
