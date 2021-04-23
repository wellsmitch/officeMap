//-----------------------------SpatialQueryOneTool----------------------------------------------
;(function (window, undefined) {
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

    var overlayDomStr = '<div class="container_spatial" style="cursor:pointer;position: absolute;top: 50px;width: 300px">\n' +
        '    \t\t\t \t<div style="background: #0A81C3;color: #fff;line-height: 30px;overflow:hidden;" class="mapMsgWraper_header">\n' +
        '    \t\t\t \t\t<div style="text-indent: 10px;float: left;">属性</div>\n' +
        '    \t\t\t \t\t<div class=\'fr layui-icon layui-icon-close\' style=\'font-weight:800;font-size:16px;cursor:pointer;text-align:center;width:32px;\'></div>\t\t\t\t  \n' +
        '    \t\t\t \t</div>\n' +
        '\t\t\t\t    <div class="contentDetail" style="min-width: 200px;width: 100%"></div>\n' +
        '\t\t\t\t</div>';


    function SpatialQueryOneTool(gisServer, params, spatialQueryCallback) {
        this.gisServer = gisServer;
        this.cb = params.copyFeatureInfo;
        //
        this.overlayDom = overlayDom = $(overlayDomStr);
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

    SpatialQueryOneTool.prototype.clear = function (type) {
        $(this.overlay.getElement()).find('>div:last').empty();
        this.overlay.setPosition(undefined);
        queryDrawLayer.getSource().clear();
        if (!$.isEmptyObject(this.mark)) {
            this.gisServer.removeFeature(this.mark.layer, this.mark.mappingId);
            this.mark = {};
        }

        if (this.tempLayer) {
            this.tempLayer.getSource().clear();
        }
        if (this.mapClickEvent) {
            this.map.unByKey(this.mapClickEvent);
        }
    };
    //封装查询结果封装至ztree：layerNameCn-图层名称，res-查询返回数据，id-图层序号，spatialOverlay-数据位置
    SpatialQueryOneTool.prototype.dealSpatialQueryData = function (params) {
        var that = this;
        var res = params.res;
        console.log(res.coordinate);
        var mappingId = res.mappingId;
        var layer = this.gisServer.getLayer(res.layer);
        var center;
        if ($.isArray(res.coordinate)){
            var index = res.coordinate[0].length;
            if (index < 3){
                center = res.coordinate[0];
                this.gisServer.personFixedPosition({
                    x: res.coordinate[0][0],
                    y: res.coordinate[0][1]
                });
            } else {
                center = getCenterByCoord(this.gisServer.coordinateCorrectArray(res.coordinate));
                var coordinate = res.coordinate;
                this.gisServer.drawFeature({
                    coordinate: coordinate,
                    mappingId: mappingId,
                    layer: layer,
                    isShowCenter: true,
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
            }
        }
        this.overlay.setPosition(center);
        this.map.addOverlay(this.overlay);
        window.zyDrag(that.overlayDom[0]);
        $(that.overlayDom[0]).css({
            left:"3%",//params.pixel[0],
            top: "10%"//params.pixel[1]
        })
        $(that.overlayDom[0]).parent().css({position: "initial"});
        $(that.overlayDom[0]).parent().css({display: "block"});
        $(this.overlay.getElement()).find('.layui-icon-close').click(function () {
            that.clear();
        });
        var properties = layer.properties;
        if (!$.isEmptyObject(this.mark)) {
            if (this.gisServer.getLayerObj(this.mark.layer)){
                this.gisServer.removeFeature(this.mark.layer, this.mark.mappingId);
            }
            this.mark = {};
        }
        var str = "";
        for (var i in properties) {
            if (properties[i].show) {
                var field = properties[i].field;
                str +=
                    "<div class='overflow' style='border-bottom:1px solid #dcdcdc;line-height:30px'>"
                    + "<div class='fl'>" + properties[i].title + ":</div>"
                    + "<div class='fl' style='padding-left:10px;box-sizing:border-box'>" + res[field] + "</div>"
                    + "</div>"
            }
        }
        $(this.overlay.getElement()).find('>div:last').html(str);
        this.mark = {layer: layer, mappingId: mappingId};

    };
    function getCenterByCoord(coordinatesStr) {
        var polygon = new ol.Feature({
            geometry: new ol.geom.Polygon(coordinatesStr)
        });
        var extent = polygon.getGeometry().getExtent();
        var center = ol.extent.getCenter(extent);   //获取边界区域的中心位置

        return center;
    }
    window.SpatialQueryOneTool = SpatialQueryOneTool;
})(window, undefined);