require.config({
    // baseUrl: basePath + '/static/js/',// 不能放开
    paths: {
        toolbar: basePath + '/static/js/gis/manager/app/MoblieToolbar',
        search: basePath + '/static/js/gis/manager/app/searchLandCode',
        legend: basePath + '/static/js/gis/manager/app/legend'
    }
});
require(['toolbar'], function (toolbar) {
    console.log(toolbar);
    layui.use(['slider', 'layer', 'jquery', 'form'], function () {
        var slider = layui.slider,
            layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        var vm = new Vue({
            el: '#vueOther',
            data: {
                gisService: null,
                selectToolLayers: [],
                layers: [],
                subjects: []
            },
            created: function () {
                var that = this;
                that.dbMapBaseInfo(function (dbdata) {
                    that.gisService = new GisService({layui: layui}, dbdata.mapInfo, dbdata.mapInterFace);
                });
            },
            watch: {
                gisService: function (val) {
                    var that = this;
                    /*var map = this.gisService.createMap({
                        map: 'map',
                        coordinate: 'mouseCoordinateSpan',
                        zoom: 'mapLevelSpan'
                    });*/

                    $.when($.get(basePath + '/gis/subject/findSubNodes/onemap_layer'),
                        $.get(basePath + '/gis/subject/findSubNodes/onemap_subject')
                    ).then(function (res1, res2) {
                        if (!res1[0].success || !res2[0].success) {
                            layer.msg("图层数据异常！", {icon: 5});
                            return;
                        }
                        var templayers = res1[0].data;
                        for(var i=templayers.length-1;i>=0;i--){
                            if(templayers[i].code && templayers[i].code === "app_poi"){
                                var itempoi = templayers[i].layerInfoList[0];
                                Object.assign(itempoi,itempoi.layerInfo, itempoi.property);
                                that.gisService.poiQueryLayername = itempoi.layer;
                                setTimeout(function () {
                                    var poiLayer = that.gisService.addLayer(itempoi);
                                    poiLayer.setZIndex(9998);
                                })
                                // templayers.splice(i,1);
                            }else if(templayers[i].code && templayers[i].code === "app_lw"){
                                var itemlw = templayers[i].layerInfoList[0];
                                Object.assign(itemlw,itemlw.layerInfo, itemlw.property);
                                that.gisService.lwQueryLayername = itemlw.layer;
                                setTimeout(function () {
                                    var lwLayer = that.gisService.addLayer(itemlw);
                                    lwLayer.setZIndex(9997);
                                })
                                // templayers.splice(i,1);
                            }
                        }
                        var layerRoot = subject2Json(res1[0].data,"onemap_layer");
                        that.layers = layerRoot.children;

                        var subjectRoot = subject2Json(res2[0].data,"onemap_subject");
                        that.subjects = subjectRoot.children;

                        var toolBar = new toolbar.MobileToolBar(that.gisService, {
                            ZoomIn: true,
                            ZoomOut: true,
                            layersFun: that.layers || [],
                            mapSubject: that.subjects || [],
                            // featureQuery: {},
                            reSite: true,
                            treasureArea: true,
                            treasureLine: true,
                            toolBarTools: true,
                            // rollingShutter: true,
                            statistics: true,
                            clear: {
                                show: true
                            }
                        });

                        that.layers.filter(function (item) {
                            return item.layerInfoList && item.layerInfoList.length > 0;
                        }).forEach(function (subject) {
                            that.configExpand(subject);
                        });

                        function subject2Json(subs, rootCode) {
                            var root = {}, pidMap = {};
                            subs.forEach(function (item) {
                                if (item.layerInfoList && item.layerInfoList.length > 0) {
                                    item.layerInfoList.forEach(function (ele) {
                                        Object.assign(ele, ele.layerInfo, ele.property);
                                    })
                                }
                                if (item.code == rootCode) {
                                    root = item;
                                }
                                if (!pidMap[item.pid]) {
                                    pidMap[item.pid] = [];
                                    pidMap[item.pid].push(item);
                                } else {
                                    pidMap[item.pid].push(item);
                                }
                            });
                            trans2Json(root, pidMap);
                            return root;
                        }

                        function trans2Json(root, pidMap) {
                            var id = root.id;
                            if (!!pidMap[id]) {
                                root['children'] = pidMap[id];
                                if (root['children'].length > 0) {
                                    root['children'].forEach(function (item) {
                                        trans2Json(item, pidMap);
                                    })
                                }
                            }
                        }

                    }, function (e) {
                        layer.msg(e.data, {icon: 5})
                    })
                }
            },
            methods: {
                dbMapBaseInfo: function (callback) {
                    $.ajax({
                        type: "GET",
                        url: basePath + '/gis/config/info',
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function (res) {
                            if (res.success) {
                                callback && typeof callback == 'function' && callback(res.data)
                            } else {
                                alert('ajax获取数据有异常！！')
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                },
                configExpand: function (business) {
                    business.layerInfoList.forEach(function (layerInfo) {
                        switch (layerInfo.docName) {
                            case 'YSYD':
                                layerInfo.busiType = '02';
                                layerInfo.layerStatus = '1-2-3';
                                break;
                            case 'YSSH':
                                layerInfo.busiType = '02';
                                layerInfo.layerStatus = '2-3';
                                break;
                            case 'YDYS':
                                layerInfo.busiType = '02';
                                layerInfo.layerStatus = '3';
                                break;
                            case 'BPYD':
                                layerInfo.busiType = '03';
                                layerInfo.layerStatus = '1-2-3';
                                break;
                            case 'BPSH':
                                layerInfo.busiType = '03';
                                layerInfo.layerStatus = '2-3';
                                break;
                            case 'JSYD':
                                layerInfo.busiType = '03';
                                layerInfo.layerStatus = '3';
                                break;
                            case 'CBYD':
                                layerInfo.busiType = '05';
                                layerInfo.layerStatus = '1-2-3';
                                break;
                            case 'CBSH':
                                layerInfo.busiType = '05';
                                layerInfo.layerStatus = '2-3';
                                break;
                            case 'TDCB':
                                layerInfo.busiType = '05';
                                layerInfo.layerStatus = '3';
                                break;
                            case 'GDYD':
                                layerInfo.busiType = '06';
                                layerInfo.layerStatus = '1-2-3';
                                break;
                            case 'GDSH':
                                layerInfo.busiType = '06';
                                layerInfo.layerStatus = '2-3';
                                break;
                            case 'GDXM':
                                layerInfo.busiType = '06';
                                layerInfo.layerStatus = '3';
                                break;
                        }
                    })
                }
            }
        });
    });
    var backTemp = mui.back;
    var backCount = 0;
    mui.back = function () {
        if (windowQueue.length == 0) {
            mui.toast("再按一次退出应用");
            backCount++;
            if (backCount >= 2) {
                plus.runtime.quit();
            }
            setTimeout(function () {
                backCount = 0;
            }, 2000);
        } else {
            backTemp();
        }
    };
})