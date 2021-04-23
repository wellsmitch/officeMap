var mainWindow,gisService,subjectInfo,landMappingInfo,requestId,landMappingInfo = [];
var mapLoadEndEventList = [];
var drawFeatureEventList = [];
function mapLoadEnd() {
    var iframeWindow = document.querySelector("#selectLandGisIframe").contentWindow;
    mainWindow = iframeWindow;
    gisService = iframeWindow.getGisService();
    subjectInfo = iframeWindow.subjectInfo;
    drawFeatureEventList.forEach(function (event) {
        event && event(mainWindow,gisService);
    })
    mapLoadEndEventList.forEach(function (event) {
        event && event(mainWindow,gisService);
    });

}
layui.use(['form', 'table', 'laydate', 'jquery', 'element', 'slider', 'upload'], function () {
    var slider = layui.slider;
    var upload = layui.upload;
    var form = layui.form;
    var element = layui.element;
    var layer = layui.layer;
    var topLayer = window.top.layui.layer;
    var table = layui.table;
    var landCode = getQueryString('landCode');
    var selectLandVue = new Vue({
        el: '#selectLand',
        data:{
            landMappingInfo:landMappingInfo
        },
        methods: {
            //gisService
            // checkLandFun: function (data) {
            //     var that = this;
            //     var maker = landMappingInfo.some(function (layer) {
            //             return layer.mappingId = data.mappingId;
            //     })
            //     if (!maker){
            //         landMappingInfo.unshift(data);
            //     }
            // },
            // uncheckLandFun:function (data) {
            //     var that = this;
            //     var index = landMappingInfo.findIndex(function (layer) {
            //         return layer.mappingId = data.mappingId;
            //     });
            //     landMappingInfo.splice(index,1);
            // },
            // 取消选中
            removeRela:function (data) {
                var that = this;
                if (gisService.getFeature(data.layer, data.mappingId)) {
                    gisService.removeFeature(data.layer, data.mappingId);
                }
                var index = landMappingInfo.findIndex(function (layer) {
                    return layer.mappingId = data.mappingId;
                });
                landMappingInfo.splice(index, 1);
            },
            // 定位
            fixedPosition: function (data) {
                var that = this;
                gisService.clearAllFeature();
                gisService.fixedPosition(data.layer, data.mappingId);
            }
        },
        mounted: function () {
            var that = this;
            if ($('#leftMapOutDiv').length != 0) {
                Drag(
                    '.gis_lanchCodeMap', '#leftMapOutDiv',
                    {selector: '#rightDiv',show: true},
                    {selector: '#bottomDiv',show: $('#bottomDiv').length > 0 },
                    undefined, {acceptDrag: true}
                );
            }
            // drawFeatureEventList.push(function (mainWindow,gisService) {
            //     if (landCode){
            //         var landCodeArr = landCode.split(",");
            //         landCodeArr.forEach(function (land) {
            //
            //         })
            //     }
            // })
            mapLoadEndEventList.push(function (mainWindow,gisService) {
                var mapService = mainWindow.mapService;
                requestId = gisService.generateUUID('long');
                mapService.listenerSelectPosition({requestId:requestId},function(coordinate){
                    mainWindow.maplayers.forEach(function (layer) {
                        if (layer.type == 0 && layer.select == true){
                            gisService.queryFeature({
                                layer: layer.layer,
                                coordinates: coordinate.join(",")
                            }, function (result) {
                                if (result.success) {
                                    if (result.data.length <= 0) {
                                        gisService.layui.layer.msg("未查询到数据！", {icon: 0});
                                        return;
                                    }
                                    var data = result.data[0];
                                    var maker = landMappingInfo.some(function (layer) {
                                        return layer.landCode == data.landCode;
                                    })
                                    if (!maker){
                                        var polygon = gisService.drawFeature(data);
                                        landMappingInfo.push(data);
                                    }
                                }
                            })
                        }
                    })
                })
            })
        },
        beforeDestroy:function(){
            if (mainWindow){
                var mapService = mainWindow.mapService;
                mapService.unListenerSelectPosition({requestId:requestId});
            }
        }
    })

    window.getChooseLand = function () {
        return landMappingInfo;
    }

});






