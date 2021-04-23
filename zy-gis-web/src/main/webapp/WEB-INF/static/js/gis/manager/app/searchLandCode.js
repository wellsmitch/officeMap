define('search', [], function () {

    var callback = null;
    var GisService = null;
    var config = {
        open: function () {
            $('#searchAndHistory').show();
        },
        close: function () {
            $('#searchAndHistory').hide();
            hideLoading()
            // mui('#searchAndHistory .mui-scroll-wrapper').scroll().scrollTo(0, 0);
        }
    };

    var searchVm = new Vue({
        el: '#searchAndHistory',
        data: {
            storeLandcodes: [],
            searchKey: "",
            poiList: []
        },
        created: function () {
            this.storeLandcodes = JSON.parse(localStorage.getItem("landcodes")) || [];
        },
        methods: {
            toSearchlandMapping: function () {
                this.poiList = [];
                var _this = this;
                this.$nextTick(function () {
                    _this.searchKey = _this.searchKey.replace(/\s/ig, '');
                    if (_this.searchKey === "" || _this.searchKey == null) {
                        // mui.toast("搜索内容不能为空！");
                        return;
                    }

                    //保存storeLandcode
                    this.saveStoreLandcode(this.storeLandcodes, this.searchKey);
                    //清空搜索内容
                    this.poiList = [];

                    //1,根据landcode搜索
                    if (new RegExp(/^\w{4}-/ig).test(_this.searchKey)) {
                        var mask = mui.createMask();
                        mask.show();
                        $.get(basePath + '/eg/gis/chrk/detail/landCode/' + _this.searchKey)
                            .done(function (res) {
                                if (res.success) {
                                    var landMapping = res.data;
                                    if (!landMapping) {
                                        mask.close();
                                        mui.toast("未查询到该地块信息！");
                                        return;
                                    }
                                    var filedMap = {};
                                    trans2Title(filedMap, landMapping);
                                    var nodeName = getLayerbyStatus(landMapping.busiType);
                                    mask.close();
                                    // mui.close();
                                    var params = {
                                        "searchKey": _this.searchKey,
                                        "nodeName": nodeName,
                                        "mappingId": landMapping.mappingId,
                                        "landCode": landMapping.landCode
                                    };
                                    _this.searchKey = "";
                                    callback(params, filedMap);
                                }
                            })
                        return;
                    }

                    //2,根据项目名称坐落查询
                    showLoading("查询中...")
                    $.get(basePath + '/gis/app/getLandInfoByProname/' + this.searchKey)
                        .done(function (res) {
                            if (res.success) {
                                res.data = res.data.filter(function (item2) {
                                    return !!item2.BUSITYPE;
                                });
                                res.data.forEach(function (item) {
                                    item.docName = getLayerbyStatus(item.BUSITYPE);
                                });
                                _this.poiList = _this.poiList.concat(res.data);

                                //查询landmapping,缺少项目名称
                                if(_this.poiList.length<=0 && false){
                                    $.ajax({
                                        url:basePath + '/eg/gis/chrk/search',
                                        type:'POST',
                                        data:JSON.stringify({"searchText":this.searchKey}),
                                        contentType:'application/json; charset=UTF-8',
                                        success:function (res) {
                                            if(res.success && res.results.length>0){
                                                res.results.forEach(function (item) {
                                                    item.docName = getLayerbyStatus(item.busiType);
                                                });
                                                _this.poiList = _this.poiList.concat(res.results);
                                            }
                                        }
                                    })
                                }

                                //3,根据兴趣点搜索
                                if(GisService.getLayer(GisService.poiQueryLayername)){
                                    GisService.queryFeature({
                                        layer: GisService.poiQueryLayername,
                                        "名称": _this.searchKey
                                    }, function (res) {
                                        hideLoading();
                                        if (res.success && res.data.length > 0) {
                                            _this.poiList = _this.poiList.concat(res.data);
                                        } else if (_this.poiList.length == 0) {
                                            mui.toast("未查询到相关信息！");
                                        }
                                    },function (error) {
                                        hideLoading()
                                    });
                                }else{
                                    hideLoading();
                                    GisService.layui.layer.msg("兴趣点图层未打开", {icon: 0});
                                }
                            } else {
                                hideLoading()
                            }
                        }).fail(function () {
                        hideLoading()
                    })
                })
            },
            clickHisLandcode: function (landcode) {
                this.searchKey = landcode;
                this.toSearchlandMapping();
            },
            searchClose: function () {
                this.searchKey = '';
                this.poiList = [];
                mui.close();
            },
            poiPosition: function (item) {
                item.searchKey = item["PRONAME"] || item["名称"];
                if (item.coordinate) {
                    callback(item);
                    return;
                }
                var params = {
                    "searchKey": this.searchKey,
                    "nodeName": item.docName,
                    "mappingId": item.MAPPINGID,
                    "landCode": item.LANDCODE
                };
                var filedMap = {};
                trans2Title(filedMap, item);
                callback(params, filedMap);

            },
            //历史记录
            delStoreLandcode: function (landcode) {
                var i = this.storeLandcodes.indexOf(landcode);
                this.storeLandcodes.splice(i, 1);
                localStorage.setItem("landcodes", JSON.stringify(this.storeLandcodes));

            },
            delAllStoreLandcode: function () {
                this.storeLandcodes = [];
                localStorage.setItem("landcodes", JSON.stringify([]));
            },
            saveStoreLandcode: function (arr, str) {
                //保存storeLandcode
                var i = arr.indexOf(str);
                if (i > -1) {
                    arr.unshift(arr.splice(i, 1)[0]);
                } else {
                    if (arr.length > 10) {
                        arr.pop();
                    }
                    arr.unshift(str);
                }
                ;
                localStorage.setItem("landcodes", JSON.stringify(arr));
            }
        }
    });

    return {
        show: function (gisService, cb) {
            mui.open(config);
            callback = cb;
            GisService = gisService;
            searchVm.poiList = [];
            searchVm.searchKey = '';
            // $('#searchAndHistory').show();
        },
        trans2Title: trans2Title
    }

    function trans2Title(filedMap, landMapping) {
        filedMap['土地代码'] = landMapping.landCode || landMapping.LANDCODE;
        filedMap['行政区划'] = (!!landMapping.areaNum) ? getXzqhInfo(landMapping.areaNum || landMapping.AREANUM) : null;
        filedMap['宗地编号'] = landMapping.zdBianhao || landMapping.ZDBIANHAO;
        filedMap['土地面积'] = (!!landMapping.area) ? (landMapping.area || landMapping.AREA) + "平方米" : null;
        filedMap['土地坐落'] = landMapping.location || landMapping.LOCATION;
        filedMap['图幅号'] = landMapping.mapNum || landMapping.MAPNUM;
        filedMap['土地北至'] = landMapping.northTo || landMapping.NORTHTO;
        filedMap['土地东至'] = landMapping.eastTo || landMapping.EASTTO;
        filedMap['土地南至'] = landMapping.southTo || landMapping.SOUTHTO;
        filedMap['土地西至'] = landMapping.westTo || landMapping.WESTTO;
    }

    function getLayerbyStatus(status) {
        var docName;
        switch (status) {
            case '02':
                // docName = 'YSYD';
                // docName = '预审用地';
                docName = 'LYSYD410100YSYD';
                break;
            case '03':
                // docName = 'BPYD';
                // docName = '报批用地';
                docName = 'LBPYD410100BPYD';
                break;
            case '05':
                // docName = 'CBYD';
                // docName = '储备用地';
                docName = 'LCBYD410100CBYD';
                break;
            case '06':
                // docName = 'GDYD';
                // docName = '供地用地';
                docName = 'LGDYD410100GDYD';
                break;
        }
        return docName;
    }

})