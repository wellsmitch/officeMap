/**
 * 工具条 对象
 * @param GisService
 * @param obj
 * @constructor
 * 工具条字体颜色  0e387e
 */
define('toolbar', ['legend', 'search', 'ywInfo', 'previewImage','fileService'], function (legend, search, ywInfo, previewImage, fileService) {
    var vm = null;
    var vmFunction = function (GisService, that) {
        /*
        * that 为MobileToolBar 实例化指向  vue 中改变this指向需用_this
        * */
        return new Vue({
            el: "#appMap",
            data: function () {
                return {
                    //elementUI 树 数据key 的配置
                    defaultProps: {
                        children: 'children',
                        label: 'name'
                    },
                    elementUiTreeData: that.obj.layersFun,
                    // 底部弹窗
                    belowDivDomShow: false,
                    belowDivDomShow_ywInfo: false,
                    // 搜索及历史记录
                    // SearchAndHistoryDiv: false,
                    zoomInShow: true,
                    zoomOutShow: true,
                    resetShow: true,
                    // 无图层数据时候控制无图层信息div显示
                    layerDataNull: false,
                    // 搜索关键字初始化
                    searchKeyInfo: "",
                    //与搜索框并列的信息提示框  提示信息初始化
                    tipMsg: "请继续操作",
                    // 地图底部搜索按钮
                    searchBtnDivshow: true,
                    GisService: GisService,
                    listContent: [],
                    currentDrawLand: {},
                    class: "",
                    appToolbarShow: true,
                    scrollTopVar: true,
                    tuliShow: false,
                    as: false,
                    //用于存储地图中已添加的图层
                    addedLayer: {},
                    zoomPrev: 6//记录地图放大缩小的历史层级数
                }
            },
            methods: {
                toYWInfo: function (e) {
                    ywInfo.show(e);
                },
                rt: function () {
                    console.log(this.$refs.tree.getNode("379590540410224640"));
                },
                fixPosition: function (e, event) {
                    $('.titleH3').removeClass("color673AB7");
                    $(event.currentTarget).find('.titleH3').addClass("color673AB7");
                    this.clearCurrentLand();
                    this.currentDrawLand["layer"] = e.layer;
                    this.currentDrawLand["mappingId"] = e.mappingId;
                    this.GisService.drawFeature({
                        coordinate: e.coordinate,
                        mappingId: e.mappingId,
                        layer: e.layer,
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
                },
                mobileToolbarToggle: function(toggleCrtolBol) {
                    // $(e.currentTarget).siblings().slideToggle();
                    var _this = this;
                    if ($(this.$refs.appToolbar).hasClass("slideHeight")) {
                        var h = $(this.$refs.appToolbar).find('.tool_con').height() + 16;
                        $(this.$refs.appToolbar).animate({height: h},function () {
                            $(_this.$refs.appToolbarSlide).attr("class","appToolbarSlide iconfont icon-tubiaozhizuo-1")
                        });
                    }else {
                        $(this.$refs.appToolbar).animate({height: 174},function () {
                            $(_this.$refs.appToolbarSlide).attr("class","appToolbarSlide iconfont icon-tubiaozhizuo-")
                        });
                    }
                    $(this.$refs.appToolbar).toggleClass("slideHeight");
                },
                toUsercenter: function() {
                    view = plus.webview.getWebviewById('onemapUserCenter');

                    if(!view) {
                        view = plus.webview.open(///
                            window.location.origin + basePath + '/gis/app/onemapUserCenter'//'http://www.baidu.com'//url
                            ,'onemapUserCenter'//id
                            ,{
                                top:'0px',bottom:'0px'
                            }// style
                            ,'slide-in-right'
                        );
                        /*mui.open({
                        close: function(){
                            plus.webview.close( "onemapUserCenter", 'slide-in-left' )
                            }
                        })*/
                    }

                },
                //触发顶部搜索弹出事件
                searchAction: function () {
                    var _this = this;
                    that.toggleBelowDivMethod(false);
                    _this.searchKeyInfo = '';
                    search.show(this.GisService,function (params, filedMap) {
                        _this.searchKeyInfo = params.searchKey;
                        mui.close();
                        if(params.coordinate){
                            var xy = params.coordinate[0];
                            _this.GisService.personFixedPosition({x:xy[0],y:xy[1]});
                            return;
                        };
                        if(!params.landCode && !params.mappingId){
                            _this.GisService.layui.layer.msg("暂无地块坐标信息", {icon: 0});
                            return;
                        }
                        _this.toSearchAction(filedMap, params);
                    });
                },
                //根据landcode查找坐标
                toSearchAction: function (filedMap, params) {
                    var _this = this;
                    _this.belowDivDomShow = true;
                    var node = _this.$refs.tree.getNode(_this.findElementUINodeData(params.nodeName).id);
                    if (!node) {
                        _this.GisService.layui.layer.msg("未找到图层", {icon: 0});
                        return;
                    }
                    _this.$refs.tree.setChecked(node.data, true, false);
                    _this.elementCheckStatus = true;
                    _this.elementCheck(node.data);
                    var slshow = {"土地代码": filedMap["土地代码"] || "","土地坐落": filedMap["土地坐落"] || ""};
                    var content = {title: node.data.layerInfoList[0].name, filedMap: filedMap,slshow:slshow};
                    that.toggleDrawerMethod(false);
                    var mappingId = params.mappingId;
                    var layer = node.data.layerInfoList[0].layer;
                    content['mappingId'] = mappingId;
                    content['layer'] = layer;
                    content['landCode'] = params.landCode;
                    _this.listContent = [];
                    _this.listContent.push(content);

                    // _this.SearchAndHistoryDiv = false;
                    mui.open({
                        open: function () {
                            that.toggleBelowDivMethod(true);
                            _this.belowDragAction();
                        },
                        close: function () {
                            _this.clearSearchInfo()
                        }
                    });
                    // that.toggleBelowDivMethod(true);
                    // _this.belowDragAction();

                    var load2 = _this.GisService.layui.layer.load(2, {
                        shade: false,
                        content: "<h3 style='margin-left: -30px; padding-top: 40px; width: 100px; text-align: center; font-size: 18px;'>正在查询...</h3>"
                    });

                    that.GisService.queryFeature({mappingId: mappingId, layer: layer}, function (res2) {
                        if (res2.success && res2.data.length > 0) {
                            content['coordinate'] = res2.data[0].coordinate;

                            _this.GisService.layui.layer.close(load2);
                            _this.clearCurrentLand();
                            _this.currentDrawLand["layer"] = content.layer;
                            _this.currentDrawLand["mappingId"] = content.mappingId;

                            _this.GisService.drawFeature({
                                coordinate: content.coordinate,
                                mappingId: content.mappingId,
                                layer: content.layer,
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
                        } else {
                            // _this.GisService.msg("坐标串信息有误，请确认", {icon: 0});
                            _this.GisService.layui.layer.close(load2);
                        }
                    })
                },
                //工具条图层点击
                toolLayerClick: function () {
                    $(this.$refs.appLayerTree).show().siblings().hide();
                    that.toggleDrawerMethod();
                    // that.layerAndSubjectSwitch(true, false);
                },
                //工具条专题点击
                toolSubjectClick: function () {
                    $(that.subjectDiv).show().siblings().hide();
                    // that.layerAndSubjectSwitch(false, true);
                    that.toggleDrawerMethod();
                },
                //工具条工具点击
                toolToolClick: function () {
                    $(that.toolsDiv).show().siblings().hide();
                    that.toggleDrawerMethod();
                },
                //工具条复位点击
                toolResetClick: function () {
                    that.GisService.setCursor({
                        event: that.GisService.reSiteFun()
                    });
                },
                //工具条清除点击
                toolClearClick: function () {
                    that.GisService.clearFun();
                    this.clearCurrentLand();
                    if (that.queryDrawLayer != null) {
                        that.queryDrawLayer.getSource().clear();
                    }
                    if (!!that.queryDrawInter) {
                        that.GisService.getMap().removeInteraction(that.queryDrawInter);
                    }
                    that.obj.clear.click && typeof that.obj.clear.click == 'function' && that.obj.clear.click();
                },
                //清除当前地块
                clearCurrentLand: function () {
                    if (Object.keys(this.currentDrawLand).length != 0 && !!this.GisService.getLayer(this.currentDrawLand.layer)) {
                        this.GisService.removeFeature(this.currentDrawLand.layer, this.currentDrawLand.mappingId);
                        this.currentDrawLand = {};
                    }
                },
                //图例点击
                legendClick: function () {
                    // legend.show();
                    var layersMap = that.GisService.tempLayers;
                    var s = new Set();
                    for (var key in layersMap) {
                        var layer = layersMap[key]
                        if (!!layer.legendUrl) {
                            s.add(layer.legendUrl);
                        }
                    }
                    if (s.size == 0) {
                        that.GisService.layui.layer.msg("暂无图例", {icon: 0});
                        return;
                    }
                    var images = [];
                    s.forEach(function (item) {
                        var url = null;
                        if ("http" === item.substring(0, 4)) {
                            url = itme;
                        } else {
                            url = basePath + item;
                        }
                        images.push({"src": url})
                    });
                    $('#legendList').empty();
                    images.forEach(function (item) {
                        var img = $('<img style="width: 32px;height: 32px;margin-top: 8px" ' +
                            'class="mui-media-object mui-pull-left" ' +
                            'data-preview-src=' + item.src +
                            ' src=' + item.src +
                            // 'onerror="this.src=\'/ywsp/static/image/unknow.png\'" ' +
                            ' data-preview-group="abc">');
                        $('#legendList').append(img)
                    });
                    previewImage.open(0, "abc")

                },
                //工具条放大
                toolZoomInClick: function () {
                    that.GisService.zoomInFun();
                },
                //工具条缩小
                toolZoomOutClick: function () {
                    that.GisService.zoomOutFun();
                },
                //工具条绘制完成点击(√)
                toolRreasureDoneClick: function () {
                    if (that.GisService.drawMeatureInteraction) {
                        try {
                            that.GisService.drawMeatureInteraction.finishDrawing();
                        } catch (e) {

                        }
                    }
                },
                //工具条退出绘制点击（x）
                toolRreasureCancelClick: function () {
                    if (that.GisService.drawMeatureInteraction) {
                        try {
                            that.GisService.drawMeatureInteraction.finishDrawing();
                        } catch (e) {

                        }
                        that.GisService.clearMehtodFun();
                        this.searchAndTipSwitch(true, "");
                    }
                },
                // 取消 （底部搜索列表的取消操作）
                belowDivCancelAction: function () {
                    this.belowDivDomShow = false;
                    this.listContent = [];
                    this.clearCurrentLand();
                    // this.searchKeyInfo = "";
                    // this.searchInfoDivShow = false;
                    // this.searchBtnDivshow = true;
                },
                // 清除搜索关键字input中的内容
                clearSearchInfo: function () {
                    this.searchKeyInfo = "";
                    this.searchBtnDivshow = true;
                    this.searchAndTipSwitch(true, "");
                    this.toolClearClick();
                    this.belowDivCancelAction();
                    $(this.$refs.appToolbar).css({display: "block"});
                    $(this.$refs.appToolbarSlide).show();
                },
                // 取消
                cancelSearchAction: function () {
                    var _this = this;
                    this.$nextTick(function () {
                        _this.belowDivDomShow = false;
                        that.toggleBelowDivMethod(false);
                        _this.belowDragAction();
                    })
                },
                drawMaskClick: function () {
                    that.toggleDrawerMethod();
                },
                //点击上下拖动时底部容器上升至距离顶部200的地方
                moveActionClick: function (e) {
                    var mapHeight = "40%";
                    $(".appMapWrap").css({
                        height: mapHeight
                    });
                    e.target.parentNode.parentNode.style.top = $(".appMapWrap").height() + 'px';
                    that.GisService.getMap().updateSize();
                },
                // 手机端拖拽逻辑
                belowDragAction: function () {
                    var _this = this;
                    function apptouchInnerFun(div1) {
                        //用于判断向上向下滚动
                        var screenYVar = 0;
                        var belowDivOrient = "middle";
                        //限制最大宽高，不让滑块出去
                        var maxH = document.body.clientHeight - 100;
                        var minH = $("#wrapper").height() * 2 / 5;
                        //手指触摸开始，记录div的初始位置
                        var offsetTop = null;
                        // 用于判断 touchstart是否触发
                        var touchstartAction = false;

                        // var g = 0;
                        div1.addEventListener('touchstart', function (e) {
                            var ev = e || window.event;
                            screenYVar = e.touches[0].screenY;
                            var touch = ev.targetTouches[0];
                            touchstartAction = true;
                            offsetTop = Number(getComputedStyle(document.querySelector(".appMapWrap")).height.replace(/px/ig, ""));
                            oT = touch.clientY - offsetTop;
                            document.addEventListener("touchmove", defaultEvent, false);
                        });
                        //触摸中的，位置记录
                        div1.addEventListener('touchmove', function (e) {
                            // console.log(e);
                            if(!touchstartAction) {return}
                            if(!_this.scrollTopVar) {
                                return
                            }

                            //判断向上向下
                            var disY = e.touches[0].screenY - screenYVar;
                            if (disY > 0) {
                                belowDivOrient = "down";
                                // console.log("downdowndowndown");
                            } else {
                                belowDivOrient = "up";
                                // console.log("upupupupup");
                            }

                            if($(".belowDiv").height() / $("#appMap").height() <= 0.4) {
                                $(".belowDiv,.listContent").css({
                                    overflow: 'hidden'
                                });
                            }else {
                                $(".belowDiv,.listContent").css({
                                    overflow: 'auto'
                                });
                            }

                            var ev = e || window.event;
                            var touch = ev.targetTouches[0];
                            var oTop = touch.clientY - oT;
                            if (oTop < minH) {
                                oTop = minH;
                            } else if (oTop >= maxH) {
                                oTop = maxH;
                            }
                            $(div1).css({
                                top: oTop,
                                height: 'auto'
                            });
                            $(".appMapWrap").css({
                                height: oTop
                            });
                            that.GisService.getMap().updateSize();
                            offsetTop = getComputedStyle(document.querySelector(".appMapWrap")).height;
                        });
                        //触摸结束时的处理
                        div1.addEventListener('touchend', function () {
                            touchstartAction = false;
                            if(belowDivOrient === "up") {
                                var mapHeight = "40%";
                                $(".appMapWrap").css({
                                    height: mapHeight
                                });
                                $(".belowDiv").css({
                                    top: $(".appMapWrap").height()
                                });
                                $(".listContent").css({
                                    overflow: 'auto'
                                });

                                that.GisService.getMap().updateSize();
                            }else if(belowDivOrient === "down") {
                                var mapHeight = "calc(100% - 100px)";
                                $(".appMapWrap").css({
                                    height: mapHeight
                                });
                                $(".belowDiv").css({
                                    top: $(".appMapWrap").height(),
                                    overflow: 'hidden'
                                });
                                $(".listContent").css({
                                    overflow: 'hidden'
                                });
                                that.GisService.getMap().updateSize();
                            }
                        });
                        belowDivOrient = "middle";

                        //阻止默认事件
                        function defaultEvent(e) {
                            e.preventDefault();
                        }
                    }

                    setTimeout(function () {
                        var mapConHeight = getComputedStyle(document.querySelector(".appMapWrap")).height;
                        $(".belowDiv").css({
                            top: mapConHeight
                        });
                        apptouchInnerFun($('.belowDiv')[0])
                    }, 200)
                },
                //属性图形绘制完成动作
                toolPropertyOkClick: function () {
                    if (that.queryDrawInter.sketchCoords_ != null) {
                        that.queryDrawInter.finishDrawing();
                    } else {
                        that.GisService.getMap().removeInteraction(that.queryDrawInter);
                    }
                },

                // 因为elementUI tree 采用的市v-if 处理方式 所以采用递归方式添加图层
                findElementUINode: function (data, callback) {
                    var _this = this;
                    if (data && data.length > 0) {
                        data.forEach(function (ele) {
                            if (ele.children && ele.children.length > 0) {
                                _this.findElementUINode(ele.children, callback);
                            } else {
                                callback(ele)
                            }
                        });
                    } else {
                        callback()
                    }
                },
                //elementUI checkChange
                checkChange: function (a, b) {
                    // 捕捉elementUi 节点勾选状态
                    this.elementCheckStatus = b;
                },
                findElementUINodeData: function (layerData_) {
                    var _this = this;
                    _this.findTreeResData = null;
                    this.elementUiTreeData.forEach(function (item) {
                        if (item.children) {
                            resData = _this.findElementUINodeByChildren(layerData_, item.children, function (resData_) {
                                if (!_this.findTreeResData) {
                                    //图层节点挂接layerInfoList对象然后包含图层 所以要把节点返回出去
                                    _this.findTreeResData = item;
                                }
                            })
                        } else {
                            if (Array.isArray(item.layerInfoList)) {
                                item.layerInfoList.forEach(function (ele) {
                                    if(typeof layerData_ == "string" ) {
                                        if (ele.layer === layerData_) {
                                            console.log(2221, item);
                                            if (!_this.findTreeResData) {
                                                //图层节点挂接layerInfoList对象然后包含图层 所以要把节点返回出去
                                                _this.findTreeResData = item;
                                            }
                                        }
                                    }else {
                                        if (ele.id === layerData_.id) {
                                            console.log(2221, item);
                                            if (!_this.findTreeResData) {
                                                //图层节点挂接layerInfoList对象然后包含图层 所以要把节点返回出去
                                                _this.findTreeResData = item;
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    });
                    return _this.findTreeResData;
                },
                findElementUINodeByChildren: function (layerData_, childrenData, callback) {
                    var _this = this;
                    childrenData.forEach(function (item) {
                        if (item.children) {
                            _this.findElementUINodeByChildren(layerData_, item.children, callback);
                        } else {
                            if (Array.isArray(item.layerInfoList)) {
                                item.layerInfoList.forEach(function (ele) {
                                    if(typeof layerData_ == "string" ) {//目前只支持 layerName
                                        if (ele.layer === layerData_) {
                                            if (!_this.findTreeResData) {
                                                //图层节点挂接layerInfoList对象然后包含图层 所以要把节点返回出去
                                                _this.findTreeResData = item;
                                            }
                                            callback(item)
                                        }
                                    }else {
                                        if (ele.id === layerData_.id) {
                                            if (!_this.findTreeResData) {
                                                //图层节点挂接layerInfoList对象然后包含图层 所以要把节点返回出去
                                                _this.findTreeResData = item;
                                            }
                                            callback(item)
                                        }
                                    }
                                })
                            }
                        }
                    });
                },
                // 通过遍历elementUI的数据源的key找树节点的id(elementUI树的数据源id与专题单条数据的id对应不上)
                findTreeIdByLayer: function (treeData, layerVar, checkStatus) {
                    var _this = this;
                    treeData.forEach(function (ele) {
                        if (ele.children) {
                            _this.findTreeIdByLayer(ele.children, layerVar, checkStatus)
                        } else {
                            if (Array.isArray(ele.layerInfoList)) {
                                ele.layerInfoList.forEach(function (ele_) {
                                    if (ele_['layer'] === layerVar) {
                                        if (checkStatus) {
                                            var layer = _this.GisService.addLayer(ele_);
                                            _this.addedLayer[ele_.id] = ele_;
                                            if(ele_.layer === _this.GisService.poiQueryLayername){
                                                layer.setZIndex(9998);
                                            }else if(ele_.layer === _this.GisService.lwQueryLayername){
                                                layer.setZIndex(9997);
                                            }
                                        } else {
                                            that.GisService.removeLayer(ele_);
                                            delete _this.addedLayer[ele_.id];
                                        }
                                        _this.$refs.tree.setChecked(ele.id, checkStatus, true);
                                    }
                                })
                            }
                        }
                    });
                    that.tuliControl();
                },
                //elementUI的勾选节点主动触发方法
                setCheckedById: function (mobileLayer, checkStatus) {
                    this.$refs.tree.setChecked(mobileLayer.layer, checkStatus, true);
                },
                //elementUI check
                elementCheck: function (a, b, c, d) {
                    var _this = this;
                    if (a.children && a.children.length > 0) {
                        _this.findElementUINode(a.children, function (a) {
                            _this.treeAddlayer(a)
                        });
                    } else if (a.layerInfoList && a.layerInfoList.length > 0) {
                        this.treeAddlayer(a)
                    };
                    that.tuliControl();
                },
                //遍历layerList中的图层
                treeAddlayer:function(a){
                    var _this = this;
                    Array.isArray(a.layerInfoList) && a.layerInfoList.forEach(function (layerInfo) {
                        if (!!_this.elementCheckStatus) {
                            var layer = that.GisService.addLayer(layerInfo);
                            _this.addedLayer[layerInfo.id] = layerInfo;
                            if(layerInfo.layer === _this.GisService.poiQueryLayername){
                                layer.setZIndex(9998);
                            }else if(layerInfo.layer === _this.GisService.lwQueryLayername){
                                layer.setZIndex(9997);
                            }
                        } else {
                            _this.GisService.removeLayer(layerInfo);
                            delete _this.addedLayer[layerInfo.id]
                            // if(layerInfo.layer === _this.GisService.poiQueryLayername || layerInfo.layer === _this.GisService.lwQueryLayername){
                        }
                    });
                },
                slideShowControl: function (show = true) {
                    if(!!show) {
                        $(this.$refs.appToolbarSlide).show()
                    }else {
                        $(this.$refs.appToolbarSlide).hide()
                    }
                },
                //工具条点搜索
                pointQuery:function () {
                    setTimeout(function () {
                        $("li[attr='Point']").click();
                        that.toggleDrawerMethod(false);
                    })

                },
                downloadapk:function () {
                    mui.plusReady(function () {
                        $.post(basePath + '/gis/app/getversion', function (res) {
                            var nowVersion = plus.runtime.version;
                            window.localStorage.setItem("onemapApkDownHtml",res.data.onemapappdownloadHtml);
                            window.localStorage.setItem("onemapApkDownUrl",res.data.onemapappdownload);
                            if(res.success && res.data.onemapappVersion != nowVersion) {
                                mui.confirm('发现新版本，是否更新,若安装失败请卸载重新安装', '操作提示', ['取消', '确认'], function (e) {
                                    if(e.index === 1){
                                        var file = {
                                            url: res.data.onemapappdownload,
                                            filename: "onemapapk" + res.data.onemapappVersion + "_" + new Date().getTime() + ".apk"
                                        };
                                        fileService.download(file);
                                    }
                                },"div");
                            }
                        });
                    });
                },
                //获取用户基本信息
                getUserInfo: function () {
                    $.get(basePath+'/common/user/info',function(res){
                        if(res.success){
                            console.log(res);
                        }
                    })
                },
                //统计
                statistics:function(){
                    $(that.statisticsDiv).show().siblings().hide();
                    that.toggleDrawerMethod();
                },
                //顶部搜索框 与 提示信息切换
                searchAndTipSwitch: function (searchDivShow, tipMsg) {
                    this.searchBtnDivshow = searchDivShow;
                    this.tipMsg = tipMsg;
                },
                //定位
                personPersition:function () {
                    var _this = this;
                    showLoading("定位中...");
                    var posiMark = true;
                    try {
                        plus.geolocation.getCurrentPosition(function (p) {
                            hideLoading();

                            var xyObj = that.GisService.coordinateTransform({x: p.coords.longitude, y: p.coords.latitude});
                            that.GisService.personFixedPosition(xyObj);
                        }, function(e){
                            if(posiMark){
                                var msg = "";
                                switch(e.code){
                                    case 2:
                                        msg = ",请确认系统定位开关是否打开";
                                        break;
                                    default:
                                        msg = ",请检查网络"
                                }
                                _this.GisService.layui.layer.msg("定位失败"+msg, {icon: 0});
                                hideLoading();
                            }
                            posiMark = false;
                        },{timeout:5000});
                    }catch (e) {
                        mui.toast("定位失败.");
                        hideLoading();
                    }
                }
            },
            watch: {
                /*通过监听 contentList 的长度来控制高度*/
                // 监听 底部弹窗 打开  与   关闭
                belowDivDomShow: function (newVal, oldVal) {
                    var _this = this;
                    this.$nextTick(function () {
                        that.toggleBelowDivMethod(newVal);
                        _this.belowDragAction();
                        _this.appToolbarShow = !newVal
                    });
                },
                belowDivDomShow_ywInfo: function (newVal, oldVal) {
                    var _this = this;
                    this.$nextTick(function () {
                        that.toggleBelowDivMethod(newVal);
                        _this.belowDragAction()
                    });
                },
                listContent: function (newVal, oldVal) {
                    // 监听必须得有  由于拖动时改变的是行内样式  重新搜索时需要初始化高度
                    if (newVal.length <= 1) {
                        // 底部
                        // $(".belowDiv").css({
                        //     height: 100
                        // });

                        // 顶部
                        $("#appMapWrap").css({
                            height: "calc(100% - 100px)"
                        })
                    } else {
                        // 底部
                        $(".belowDiv").css({
                            height: "60%"
                        });

                        // 顶部
                        $(".appMapWrap").css({
                            height: "40%"
                        })
                    }
                    that.GisService.getMap().updateSize();

                }
            },
            mounted: function () {
                //　监听　listContent　滚动
                this.downloadapk();
                var _this = this;
                setTimeout(function () {
                    $(".toolContent li:not('.shixiao')").click(function () {
                        _this.slideShowControl(false)
                    });
                    $(".toToolbar").click(function () {
                        _this.slideShowControl(true)
                    })
                });

                document.querySelector(".listContent").onscroll = function () {
                    var listContentDom = document.querySelector(".listContent");
                    if(listContentDom.scrollTop === 0) {
                        _this.scrollTopVar = true
                    } else {
                        _this.scrollTopVar = false
                    }
                };

                var map = this.GisService.createMap({
                    map: 'map',
                    coordinate: 'mouseCoordinateSpan',
                    zoom: 'mapLevelSpan'
                });
                that.belowDivDom = $(".belowDiv");

                this.personPersition();

                var poiNode = this.$refs.tree.getNode(this.findElementUINodeData(this.GisService.poiQueryLayername).id);
                var lwNode = this.$refs.tree.getNode(this.findElementUINodeData(this.GisService.lwQueryLayername).id);
                this.$refs.tree.setChecked(poiNode.data, true, false);
                this.$refs.tree.setChecked(lwNode.data, true, false);

                /* map.getView().on("change",function(e){
                    var zoom = map.getView().getZoom();  //获取当前地图的缩
                    console.log(zoom)
                    mui.toast(zoom)
                    if (zoom <= 5 || (!zoom && _this.zoomPrev < 16))
                    {
                        that.GisService.setCursor({
                            event: that.GisService.reSiteFun()
                        });
                    }
                    _this.zoomPrev = zoom ? zoom : _this.zoomPrev;
                }) */
                /*map.on("moveend",function(e){

                    var zoom = map.getView().getZoom();  //获取当前地图的缩

                    //mui.toast(zoom)
                    if (zoom < 5 || (!zoom && _this.zoomPrev < 16))
                    {
                        //map.zoomTo(17);
                        that.GisService.setCursor({
                            event: that.GisService.reSiteFun()
                        });
                    }
                    _this.zoomPrev = zoom ? zoom : _this.zoomPrev;
                });*/

                /////

            }
        });
    };

    function MobileToolBar(GisService, obj) {
        var that = this;
        this.GisService = GisService;
        this.obj = obj;
        //存储地图中已添加的图层
        this.addedLayer = {};
        this.vm = vmFunction(this.GisService, this);
        this.mapcon = GisService.mapCondiv;
        this.InIt(this.mapcon);

        obj && obj.ZoomIn ? this.vm.zoomInShow : null;
        obj && obj.ZoomOut ? this.vm.zoomOutShow : null;
        obj && Array.isArray(obj.layersFun) ? this.layersFun(obj.layersFun) : null;
        //专题#5c5c5c
        obj && Array.isArray(obj.mapSubject) ? this.mapSubject(obj.mapSubject) : null;
        //工具
        obj && obj.toolBarTools ? this.toolBarTools() : null;
        //统计
        obj && obj.statistics ? this.statistics() : null;
        obj && obj.reSite ? this.vm.resetShow : null;

        // 初始化时候隐藏抽屉容器中的所有模块
        $('.drawDivSingle').hide();
    }

//init
    MobileToolBar.prototype.InIt = function (mapcon) {
        this.tool_con = this.vm.$refs.tool_con;
        this.canceCheckAllMark = true;
    };
// 调出右边抽屉容器
    MobileToolBar.prototype.toggleDrawerMethod = function (flag) {
        var that = this;
        var open = getComputedStyle(that.vm.$refs.drawMask).display;
        if (flag != undefined) {
            open = flag;
        }
        if (open === "none") {
            $(".drawDiv").removeClass("slide-right").addClass("slide-left");
            $(this.vm.$refs.drawMask).show();
        } else {
            $(".drawDiv").removeClass("slide-left").addClass("slide-right");
            $(this.vm.$refs.drawMask).hide();
        }
    };

// 调出下面弹出层容器
    MobileToolBar.prototype.toggleBelowDivMethod = function (heightVal) {
        if(heightVal !== undefined) {
            this.vm.belowDivDomShow = heightVal
        }
        var open = window.getComputedStyle($('.belowDiv')[0]).display;
        if (open === "none") {
            $(this.mapcon).parent().parent().css({height: "100%"});
            $(this.vm.$refs.queryCancel).attr("class","fl iconfont icon-quxiao").text("")
        } else {
            $(this.vm.$refs.queryCancel).attr("class","fl").text("返回")
        }
        this.GisService.getMap().updateSize();
    };

// 图层
    MobileToolBar.prototype.layersFun = function (layersData) {
        var that = this;
        that.layers = layersData;
        // 存储历史勾选的图层数据
        this.layerSelectedObject = {};
        if (!layersData || (layersData && layersData.length === 0)) {
            // layerContentDom = "<div style='color: #333333;;text-align: center;margin-top: 30%'>暂无图层数据</div>"
            that.layerDataNull = true
        }
        //初始化图层树
        var setting = {
            check: {
                //控制显示勾选框
                enable: true,
                chkStyle: 'checkbox',
                autoCheckTrigger: true
            },
            view: {
                nameIsHTML: true,
                dblClickExpand: false,
                //是否显示虚线
                showLine: false,
                //是否显示文件图标
                showIcon: false,
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pid"
                }
            },
            callback: {
                onClick: function (a, b, c, d) {
                    var checkedStatus = c.getCheckStatus().checked;
                    that.layerTreeObj.checkNode(c, !checkedStatus, true);
                    if (!checkedStatus) {
                        that.layerSelectedObject[c.id] = c;

                    } else if (that.layerSelectedObject[c.id] && that.canceCheckAllMark) {
                        delete that.layerSelectedObject[c.id];
                    }
                    that.layersToggle(c, !checkedStatus);
                    that.toggleDrawerMethod();

                },
                onCheck: function (a, b, c, d) {
                    var checkedStatus = !!(c.getCheckStatus().checked);
                    if (!!checkedStatus) {
                        that.layerSelectedObject[c.id] = c;
                    } else if (that.layerSelectedObject[c.id] && that.canceCheckAllMark) {
                        delete that.layerSelectedObject[c.id];
                    }
                    that.layersToggle(c, checkedStatus)
                }
            },
            edit: {
                enable: false,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false,
                    isMove: false
                }
            }
        };
        layersData.map(function (ele) {
            if (ele.layerInfoList && ele.layerInfoList.length > 0) {
                ele.docName = ele.layerInfoList[0].docName;
            }
        });
        this.layerTreeObj = $.fn.zTree.init($(that.vm.$refs.appLayerContent), setting, layersData);
    };

//控制图层显示隐藏
    MobileToolBar.prototype.layersToggle = function (layers, isShow) {
        var that = this;
        !!layers.layerInfoList && layers.layerInfoList.forEach(function (ele) {
            if (!!isShow) {
                var layer = that.GisService.addLayer(ele);
                if(ele.layer === that.GisService.poiQueryLayername){
                    layer.setZIndex(9998);
                }else if(ele.layer === that.GisService.lwQueryLayername){
                    layer.setZIndex(9997);
                }
            } else {
                that.GisService.removeLayer(ele);
            }
        });
    };

//专题
    MobileToolBar.prototype.mapSubject = function (mapSubjectData) {
        var that = this;
        var mapSubjectDom = "";
        if (!mapSubjectData || (mapSubjectData && mapSubjectData.length === 0)) {
            mapSubjectDom = "<div style='color: #333333;;text-align: center;margin-top: 30%'>暂无专题数据</div>"
        } else {
            mapSubjectData.forEach(function (item, index) {
                var mapSubjectDomLi = "";
                var $mapSubjectDomUl = "<ul class='overflow subjectUlPanel' >";
                $mapSubjectDomUl += mapSubjectDomLi;
                item.children.forEach(function (item1) {
                    var imageUrl = "";
                    if (item1.subjectIcon && item1.subjectIcon.substr(0, 4) === "http") {
                        imageUrl = item1.subjectIcon
                    } else {
                        imageUrl = basePath + item1.subjectIcon
                    }
                    if(item.code === 'zhuti') {
                        mapSubjectDomLi += "<li class='appSubjectLi zhuti color1269d3'><div class='themeIcon iconfont"+(item1.name != "卫星影像"  ? " themeActive" : '')+"'><img style='width: 70px; height: 50px; display: block; margin: 0 auto;' src=" + imageUrl + " alt=''></div><div class='subjectInnerDiv'>" + (item1.name || '') + "</div></li>"
                    }else {
                        mapSubjectDomLi += "<li class='appSubjectLi'><img style='width: 40px;height: 40px;margin: 6px 0 2px;' src=" + imageUrl + " alt=''><div class='subjectInnerDiv'>" + (item1.name || '') + "</div></li>"
                    }
                });
                $mapSubjectDomUl += mapSubjectDomLi;
                $mapSubjectDomUl += "</ul>";
                mapSubjectDom += "<div>\n" +
                    "    <div class='subjectOneTitle overflow subTitle "+item.code+"' style='border-bottom: 1px solid #e6e6e6; padding: 6px 0;'>" +
                    "   <div class='fl' style='width: 4px;height: 16px;margin: 2px 10px 0 10px;background: #0098f8;'></div>" +
                    "        <div class=\"fl\">" + (item.name || '') + "</div>\n" +
                    //默认展开专题 第二组
                    "        <div class=\"fr iconfont subjectListToggleIcon " + (item.code !== "zhuti" ? (index === 1 ? 'icon-tubiaozhizuo-' : "icon-tubiaozhizuo-1") : '') + "\" style='padding-right: 10px; line-height: 20px; color: #989494;'></div>\n" +
                    "    </div>\n" +
                    "    <div class=\"subjectCon\" style='display: " + (index === 0 ? "block" : "none") + "\'>" + $mapSubjectDomUl + "</div>\n" +
                    "</div>";
            })
        }

        //专题容器
        var subjectDiv = this.subjectDiv = $("<div class=\"drawDivSingle subjectContent\" style='height: 100%;'></div>");

        /**
         * 专题
         */
        var subject_panelTitle = $("<div class='panelTitle mainTitle'>专题</div>");
        var subject_panelcontent = this.subject_panelcontent = $("<div class='subjectUlContent' style='height: calc(100% - 38px);overflow-y: auto'></div>");
        subject_panelcontent.append($(mapSubjectDom));
        var subject_panel = $("<div class='panel' style='height: 100%;'></div>");
        subject_panel.append(subject_panelTitle).append(subject_panelcontent);
        subjectDiv.append(subject_panel);
        $(this.vm.$refs.drawDivDom).append(subjectDiv);

        var subjectBark = [];
        // 控制主题 （兴趣点  路网  卫星影像专题）
        this.subject_panelcontent.find("li.zhuti").click(function (e) {
            if (!$(e.currentTarget).hasClass("color1269d3")) {
                // 添加图层操作
                $(this).addClass("color1269d3");
                $(this).find('.themeIcon').addClass("themeActive");
                var ulIndex = $(this).parent().index(".subjectUlPanel");
                var liIndex = $(this).index();
                var subjectLayers = mapSubjectData[ulIndex]["children"][liIndex]["layerInfoList"];

                if (Array.isArray(subjectLayers)) {
                    subjectLayers.forEach(function (ele, index) {
                        that.vm.findTreeIdByLayer(that.vm.elementUiTreeData, ele.layer, true);
                    });
                }
            }else {
                $(e.currentTarget).removeClass("color1269d3");
                $(e.currentTarget).find('.themeIcon').removeClass("themeActive");
                var ulIndex = $(this).parent().index(".subjectUlPanel");
                var liIndex = $(this).index();
                var subjectLayers = mapSubjectData[ulIndex]["children"][liIndex]["layerInfoList"];

                if (Array.isArray(subjectLayers)) {
                    subjectLayers.forEach(function (ele, index) {
                        that.vm.findTreeIdByLayer(that.vm.elementUiTreeData, ele.layer, false);
                    });
                }
            }
        });
        // 点解专题 向地图中添加专题  并移除历史专题
        this.subject_panelcontent.find("li:not('.zhuti')").click(function (e) {
            for (key in that.vm.addedLayer) {
                var d = that.vm.addedLayer[key].layer;
                that.GisService.removeLayer(that.vm.addedLayer[key]);
                var uINodeObj = that.vm.findElementUINodeData(that.vm.addedLayer[key]);
                if (uINodeObj) {
                    that.vm.$refs.tree.setChecked(uINodeObj, false, true);
                } else {
                    console.error("从图层树中未找到要反选的节点")
                }
            }

            if (!$(this).hasClass("color1269d3")) {
                // 添加图层操作
                $(subject_panelcontent).find("li:not('.zhuti')").removeClass("color1269d3");
                $(this).addClass("color1269d3");
                var ulIndex = $(this).parent().index(".subjectUlPanel");
                var liIndex = $(this).index();
                var subjectLayers = mapSubjectData[ulIndex]["children"][liIndex]["layerInfoList"];

                if (Array.isArray(subjectLayers)) {
                    subjectLayers.forEach(function (ele, index) {
                        that.vm.findTreeIdByLayer(that.vm.elementUiTreeData, ele.layer, true);
                    });
                }
            }else {
                $(subject_panelcontent).find("li:not('.zhuti')").removeClass("color1269d3");
                var ulIndex = $(this).parent().index(".subjectUlPanel");
                var liIndex = $(this).index();
                var subjectLayers = mapSubjectData[ulIndex]["children"][liIndex]["layerInfoList"];

                if (Array.isArray(subjectLayers)) {
                    subjectLayers.forEach(function (ele, index) {
                        that.vm.findTreeIdByLayer(that.vm.elementUiTreeData, ele.layer, false);
                    });
                }
            }
            that.tuliControl();
            that.toggleDrawerMethod();
        });

        // 专题列表折叠
        $(".subjectOneTitle").click(function (e) {
            if($(e.currentTarget).hasClass("zhuti")) {return}
            $(this).next().toggle();
            if (getComputedStyle($(this).next()[0]).display !== "block") {
                $(this).find('.subjectListToggleIcon').removeClass("icon-tubiaozhizuo-").addClass("icon-tubiaozhizuo-1");
            } else {
                $(this).find('.subjectListToggleIcon').removeClass("icon-tubiaozhizuo-1").addClass("icon-tubiaozhizuo-");
            }
            e.stopPropagation()
        });
    };

    //通过获取当前图层的数量来控制图例是否显示
    MobileToolBar.prototype.tuliControl = function (layerShow, subjectShow) {
        if(this.GisService.getAllLayer().length > 0) {
            this.vm.tuliShow = true
        }else {
            this.vm.tuliShow = false
        }
    };

// 图层与专题之间切换 勾选历史地图数据回显
    MobileToolBar.prototype.layerAndSubjectSwitch = function (layerShow, subjectShow) {
        var that = this;
        if (layerShow) {
            // 进入图层之前先删掉专题上面的图层
            this.subjectSelectedArr && that.subjectSelectedArr.forEach(function (ele, index) {
                that.GisService.removeLayer(ele)
            });
            // 展示之前勾选过的图层
            for (key in this.layerSelectedObject) {
                if (this.layerSelectedObject[key].layerInfoList) {
                    this.layerSelectedObject[key].layerInfoList.forEach(function (ele) {
                        // console.log(ele);
                        that.GisService.addLayer(ele)
                    })
                } else {
                    that.GisService.addLayer(that.layerSelectedObject[key])
                }
            }
        } else {
            // 从图层切到专题时候之前勾选图层移除
            this.canceCheckAllMark = false;
            for (key in this.layerSelectedObject) {
                if (this.layerSelectedObject[key].layerInfoList) {
                    this.layerSelectedObject[key].layerInfoList.forEach(function (ele) {
                        that.GisService.removeLayer(ele)
                    })
                } else {
                    that.GisService.removeLayer(that.layerSelectedObject[key])
                }
            }
            this.canceCheckAllMark = true
        }

        if (subjectShow) {
            // 回显之前勾选过的专题
            this.subjectSelectedArr && that.subjectSelectedArr.forEach(function (ele, index) {
                that.GisService.addLayer(ele);

            });
        }
        this.tuliControl()
    };

//工具
    MobileToolBar.prototype.toolBarTools = function (selectFun) {
        var that = this;
        //工具容器
        var toolsDiv = this.toolsDiv = $("<div class=\"drawDivSingle toolContent\"></div>");
        /**
         * 测量
         */
        var treasure_panelTitle = $("<div class='panelTitle mainTitle'>测量</div>");
        var treasure_panelcontent = $("<ul class='panelcontent treasureCon overflow' style='padding: 10px 0;'></ul>");
        var treasure_panel = $("<div class='panel'></div>");
        treasure_panel.append(treasure_panelTitle).append(treasure_panelcontent);
        toolsDiv.append(treasure_panel);

        this.treasureLine(treasure_panelcontent);
        this.treasureArea(treasure_panelcontent);
        /**
         * 按图形查询地块信息
         */
        var query_panelTitle = $("<div class='panelTitle mainTitle'>选择图斑</div>");
        var query_panelcontent = $("<ul class='panelcontent queryCon overflow' style='padding: 10px 0;'></ul>");
        var query_panel = $("<div class='panel'></div>");
        query_panel.append(query_panelTitle).append(query_panelcontent);
        toolsDiv.append(query_panel);

        this.appFeatureQuery(query_panelcontent);
        /**
         * 展示
         */
        var zhanshi_panelTitle = $("<div class='panelTitle mainTitle'>展示</div>");
        var zhanshi_panelcontent = $("<ul class='panelcontent treasureCon overflow' style='padding: 10px 0;'></ul>");
        var zhanshi_panel = $("<div class='panel'></div>");
        zhanshi_panel.append(zhanshi_panelTitle).append(zhanshi_panelcontent);
        toolsDiv.append(zhanshi_panel);

        this.fenPing(zhanshi_panelcontent);
        this.juanLian(zhanshi_panelcontent);

        $(this.vm.$refs.drawDivDom).append(toolsDiv);
    };

//属性
    MobileToolBar.prototype.appFeatureQuery = function (contentDom) {
        var that = this;
        this.appFeatureQueryDom = $(
            "<li class='fl' attr=\"Point\">" +
            "<div class='drawQueryMethodDiv'>" +
            "<div style=\"background: #93e3af;\" class=\"iconfont icon-dianji1 drawQueryInfoIcon\"></div>" +
            "<div class='drawQueryInfoText'>点选</div>" +
            "</div>" +
            "</li>" +
            "<li class='fl' attr=\"Rect\">" +
            "<div class='drawQueryMethodDiv'>" +
            "<div style=\"background: #84c8e4;\" class=\"iconfont icon-juxing drawQueryInfoIcon\"></div>" +
            "<div class='drawQueryInfoText'>矩形选择</div>" +
            "</div>" +
            "</li>" +
            "<li class='fl' attr=\"Polygon\">" +
            "<div class='drawQueryMethodDiv'>" +
            "<div style=\"background: #be93e3;\" class=\"iconfont icon-duobianxing1 drawQueryInfoIcon\"></div>" +
            "<div class='drawQueryInfoText'>多边形选择</div>" +
            "</div>" +
            "</li>"
        );
        this.queryDrawLayer = null;
        contentDom.append(this.appFeatureQueryDom);
        this.appFeatureQueryDom.click('li', function (e) {
            if (that.queryDrawLayer == null) {
                that.queryDrawLayer = getQueryDrawLayer();
            } else {
                that.GisService.getMap().removeLayer(that.queryDrawLayer);
                that.queryDrawLayer = getQueryDrawLayer();
            }

            that.vm.searchAndTipSwitch(false,"请点击地图进行选择");

            that.toggleDrawerMethod();
            var drawType = $(this)[0].getAttribute("attr");
            that.queryDrawInter = getDrawInteraction(drawType);
            that.complateToolBtn = createcomplateToolBtn();
            $(that.vm.$refs.appToolbar).hide();

            $('#deleteToolBtnElement').click(function () {
                that.queryDrawInter.removeLastPoint();
            });

            that.queryDrawInter.on('drawstart',function (evt) {
                sketch = evt.feature; //绘制的要素
                if (that.queryDrawInter["mode_"]==='Polygon') {
                    var tooltipCoordd = sketch.getGeometry().getFirstCoordinate();// 绘制的坐标
                    that.complateToolBtn.setPosition(tooltipCoordd);
                }
                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;
                    if (geom instanceof ol.geom.Polygon) {
                        var geomArr = geom.getCoordinates()[0];
                        tooltipCoordd = geomArr[geomArr.length -2];
                    } else if (geom instanceof ol.geom.LineString) {
                        tooltipCoordd = geom.getLastCoordinate();
                    }
                    that.complateToolBtn.setPosition(tooltipCoordd);
                });
            }, this);

            that.queryDrawInter.on('drawend', function (e) {
                that.complateToolBtn.setPosition([0,0]);
                if (that.queryDrawInter["mode_"] != 'Point'){
                    map.removeInteraction(that.queryDrawInter);
                }else{
                    setTimeout(function () {
                        that.queryDrawLayer.getSource().clear();
                    })
                }
                that.vm.clearCurrentLand();//删除当前地块
                $(that.vm.$refs.appToolbar).show();
                that.vm.listContent = [];
                drawEndDeal(e, drawType);
            });
        });

        function drawEndDeal(e, drawType) {
            that.vm.slideShowControl(true);
            var extent = e.feature.getGeometry().getExtent();
            var center = ol.extent.getCenter(extent);
            var view = map.getView();
//			view.setCenter(center);
            if (drawType != 'Point') {
                view.fit(extent, map.getSize(), {maxZoom: 17});
            };
            var coordinates;
            if (drawType == 'Point') {
                coordinates = e.feature.getGeometry().getCoordinates().join(",");
            } else if (drawType == 'LineString') {
                coordinates = e.feature.getGeometry().getCoordinates().join(" ");
            } else {
                coordinates = e.feature.getGeometry().getCoordinates()[0].join(" ");
            }
            var layersMap = that.GisService.tempLayers;
            var layers = [];
            for (var key in layersMap) {
                var layer = layersMap[key];
                if(key != that.GisService.poiQueryLayername && key != that.GisService.lwQueryLayername){
                    layers.push(layer);
                }
            }
            if (layers.length === 0) {
                that.GisService.msg("请确认需要查询到图层是否打开！", {icon: 0});
                return;
            }
            var queryLayerCount = 0;
            var load3 = that.GisService.layui.layer.load(2, {
                shade: false,
                content: "<h3 style='margin-left: -30px; padding-top: 40px; width: 100px; text-align: center; font-size: 18px;'>正在查询...</h3>"
            });

            that.queryInfoByDrawMark = true
            layers.forEach(function (queryRequest) {
                ++queryLayerCount;
                var params = {
                    layer: queryRequest.layer,
                    drawType: drawType,
                    coordinates: coordinates
                };
                if(queryRequest.layer.indexOf("ZRZ")!=-1||queryRequest.layer.indexOf("ZDJBXX")!=-1){
                    params["query_where"] = "FROM_STATEID=0";
                }
                that.GisService.queryFeature(params, function (res) {
                    --queryLayerCount;
                    if (res.success) {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(function (item) {
                                var content = trans2Title(queryRequest, item);
                                that.vm.listContent.push(content);
                                if(that.queryInfoByDrawMark) {
                                    mui.open({
                                        open: function () {
                                            that.toggleBelowDivMethod(true);
                                            that.vm.belowDragAction();
                                        },
                                        close: function () {
                                            that.vm.clearSearchInfo()
                                        }
                                    });
                                    that.queryInfoByDrawMark = false;
                                    that.GisService.drawFeature({
                                        coordinate: content.coordinate,
                                        mappingId: content.mappingId,
                                        layer: content.layer,
                                        isShowCenter: true
                                    });
                                    that.vm.currentDrawLand["layer"] = content.layer;
                                    that.vm.currentDrawLand["mappingId"] = content.mappingId;
                                }
                                that.GisService.getMap().updateSize();
                            })
                        }
                    } else {
                        console.error(res.data);
                    }
                    if (queryLayerCount === 0) {
                        if (that.vm.listContent.length === 0) {
                            that.GisService.layui.layer.msg("未查询到地块信息", {icon: 0});
                        }
                        that.GisService.layui.layer.close(load3);
                    }
                });
            });
        };

        function getQueryDrawLayer() {
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
            that.GisService.getMap().addLayer(queryDrawLayer);
            return queryDrawLayer;
        }

        function createcomplateToolBtn() {
            var complateToolBtnElement = document.createElement('div');
            complateToolBtnElement.innerHTML = '<div id="complateToolBtnElement" style="display: inline-block"><span class="iconfont icon-duihao"></span></div>';
            complateToolBtnElement.className = 'tooltip  tooltip-measure zyTooltip';

            $(complateToolBtnElement)[0].addEventListener("touchstart", function(){
                that.vm.toolPropertyOkClick();
                return false;
            });

            var measureTooltip = new ol.Overlay({
                element: complateToolBtnElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            that.GisService.getMap().addOverlay(measureTooltip);
            return measureTooltip;
        }

        function getDrawInteraction(drawType) {
            var drawInteraction;
            if (drawType === 'Rect') {
                drawInteraction = new ol.interaction.Draw({
                    source: that.queryDrawLayer.getSource(),
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
                drawInteraction = new ol.interaction.Draw({
                    source: that.queryDrawLayer.getSource(),
                    type: drawType,//'Polygon'
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
            var map = that.GisService.getMap();
            if (!!that.queryDrawInter) {
                map.removeInteraction(that.queryDrawInter);
            }
            that.GisService.getMap().addInteraction(drawInteraction);
            return drawInteraction;
        }

        function trans2Title(layer, data) {
            var props = layer.properties;
            var filedMap = {},slshow = {},tempArr=[];
            var content = {
                title: layer.name,
                filedMap: filedMap,
                slshow:slshow,
                layer: layer.layer,
                mappingId: data.mappingId,
                coordinate: data.coordinate,
                landCode: data.landCode || data['地块编号'] || data['地块编码'],
                ywType: layer.docName
            };
            if(!!content.landCode){//查询业务图层时只展示业务库字段
                if(layer.docName==='YSYD' || layer.docName==='BPYD' || layer.docName==='CBYD' || layer.docName==='GDYD'){
                    $.ajax({
                        url:basePath + '/eg/gis/chrk/detail/landCode/' + content.landCode,
                        type:'GET',
                        async:false,
                        dataType:'json'
                    }).done(function (res) {
                        if (res.success) {
                            var landMapping = res.data;
                            if (!landMapping) {
                                mask.close();
                                mui.toast("未查询到该地块信息！");
                                return;
                            }
                            search.trans2Title(filedMap, landMapping);
                            content.slshow = {"土地代码": filedMap["土地代码"] || "","土地坐落": filedMap["土地坐落"] || ""};
                        }
                    })
                    return content;
                }
            }
            if (!!props && Object.keys(props).length > 0) {
                for (var i in props) {
                    if (props[i].show) {
                        filedMap[props[i].title] = data[props[i].field];
                    }
                    if(props[i].slIndex){
                        var temp = {};
                        temp[props[i].title] = data[props[i].field]||'';
                        tempArr[props[i].slIndex-1] = temp;
                    }
                }
            } else {//未配置属性字段时展示图层属性
                for (var j in data) {
                    if ("coordinate" != j) {
                        filedMap[j] = data[j];
                    }
                }
            }
            //添加关键信息
            for(var i=0;i<tempArr.length;i++){
                slshow = Object.assign(slshow,tempArr[i]);
            }
            return content;
        }
    };

// 测距
    MobileToolBar.prototype.treasureLine = function (contentDom) {
        var that = this;
        this.treasureLineDom = $("<li class='collapseMapDivCls_length treasure fl' style='width: 33.33%'>" +
            "<div class='treasureDiv'>" +
            '<div class="iconfont icon-ceju1 treasureIcon" style="background: #bee393"></div>' +
            '<div class="treasureText">测距</div>' +
            "</div>" +
            "</li>");
        contentDom.append(this.treasureLineDom);
        this.treasureLineDom.click(function (e) {
            $(that.vm.$refs.appToolbar).hide();
            that.vm.searchAndTipSwitch(false,"请点击地图进行测量");
            var methodVar = "treasure";
            that.toggleDrawerMethod();
            that.GisService.setCursor({
                destory: function () {
                    that.GisService.clearMehtodFun();
                },
            });
            that.GisService.treasureFun("LineString",function(){
                that.vm.toolRreasureDoneClick()
            });
        })
    };

// 测面
    MobileToolBar.prototype.treasureArea = function (contentDom) {
        var that = this;
        this.treasureAreaDom = $("<li class='collapseMapDivCls_length treasure fl' style='width: 33.33%'>" +
            "<div class='treasureDiv'>" +
            '<div class="iconfont icon-cemian1 treasureIcon" style="background: #e48a84"></div>' +
            '<div class="treasureText">测面</div>' +
            "</div>" +
            "</li>");
        contentDom.append(this.treasureAreaDom);

        this.treasureAreaDom.click(function (e) {
            $(that.vm.$refs.appToolbar).hide();
            that.vm.searchAndTipSwitch(false,"请点击地图进行测量");
            that.toggleDrawerMethod();
            that.GisService.setCursor({
                destory: function () {
                    that.GisService.clearMehtodFun();
                }
            });
            that.GisService.treasureFun("Polygon",function(){
                that.vm.toolRreasureDoneClick()
            });
        })
    };

    //统计
    MobileToolBar.prototype.statistics = function (selectFun) {
        var that = this;
        //工具容器
        var statisticsDiv = this.statisticsDiv = $("<div class=\"drawDivSingle statisticsContent\"></div>");
        /**
         * 业务统计
         */
        var ywtj_panelTitle = $("<div class='panelTitle mainTitle'>业务统计</div>");
        var ywtj_panelcontent = $("<ul class='panelcontent queryCon overflow' style='padding: 10px 0;'></ul>");
        var ywtj_panel = $("<div class='panel'></div>");
        ywtj_panel.append(ywtj_panelTitle).append(ywtj_panelcontent);
        statisticsDiv.append(ywtj_panel);

        this.statisticsYWTJ(ywtj_panelcontent);
        /**
         * 批征供情况
         */
        var pzgqk_panelTitle = $("<div class='panelTitle mainTitle'>批征供情况</div>");
        var pzgqk_panelcontent = $("<ul class='panelcontent queryCon overflow' style='padding: 10px 0;'></ul>");
        var pzgqk_panel = $("<div class='panel'></div>");
        pzgqk_panel.append(pzgqk_panelTitle).append(pzgqk_panelcontent);
        statisticsDiv.append(pzgqk_panel);

        this.statisticsPZGQK(pzgqk_panelcontent);
        $(this.vm.$refs.drawDivDom).append(statisticsDiv);
    };

// 业务统计
    MobileToolBar.prototype.statisticsYWTJ = function (contentDom){
        this.ywtj_panelcontentLis = $(
            "<li class='fl' attr=\"Ydbp\">" +
            "<div class='ywtjMethodDiv'>" +
            "<div style=\"background: #93e3af;\" class=\"iconfont icon-tongji drawQueryInfoIcon\"></div>" +
            "<div class='ywtjInfoText drawQueryInfoText'>报批</div>" +
            "</div>" +
            "</li>" +
            "<li class='fl' attr=\"Tdcb\">" +
            "<div class='ywtjMethodDiv'>" +
            "<div style=\"background: #84c8e4;\" class=\"iconfont icon-tongji1 drawQueryInfoIcon\"></div>" +
            "<div class='ywtjInfoText drawQueryInfoText'>储备</div>" +
            "</div>" +
            "</li>" +
            "<li class='fl' attr=\"Tdgy\">" +
            "<div class='ywtjMethodDiv'>" +
            "<div style=\"background: #be93e3;\" class=\"iconfont icon-tongji2 drawQueryInfoIcon\"></div>" +
            "<div class='ywtjInfoText drawQueryInfoText'>供应</div>" +
            "</div>" +
            "</li>"
        );
        contentDom.append(this.ywtj_panelcontentLis);
        this.ywtj_panelcontentLis.click('li', function (e) {
            var type = $(this).attr("attr");
            view = plus.webview.getWebviewById('statisticsYWTJ');

            if(!view) {
                view = plus.webview.open(
                    window.location.origin + basePath + '/gis/app/statistics/ywtj?type=' + type
                    // 'http://222.143.38.161:8080/app/gis/app/onemapUserCenter'
                    ,'statisticsYWTJ'
                    ,{
                        top:'0px',bottom:'0px'
                    }
                    ,'slide-in-right'
                );
            }
        });

    };

// 批征供情况
    MobileToolBar.prototype.statisticsPZGQK = function (contentDom){
        this.pzgqk_panelcontentLis = $(
            "<li class='fl' attr=\"pewz\">" +
            "<div class='drawQueryMethodDiv'>" +
            "<div style=\"background: #93e3af;\" class=\"iconfont icon-pierweizhengyujing drawQueryInfoIcon\"></div>" +
            "<div class='drawQueryInfoText'>批而未征</div>" +
            "</div>" +
            "</li>" +
            "<li class='fl' attr=\"pewg\">" +
            "<div class='drawQueryMethodDiv'>" +
            "<div style=\"background: #84c8e4;\" class=\"iconfont icon-pierweigongfenxi drawQueryInfoIcon\"></div>" +
            "<div class='drawQueryInfoText'>批而未供</div>" +
            "</div>" +
            "</li>"
        );
        contentDom.append(this.pzgqk_panelcontentLis);
        this.pzgqk_panelcontentLis.click('li', function (e) {
            var type = $(this).attr("attr");

            view = plus.webview.getWebviewById('statisticsPZGQK');

            if(!view) {
                view = plus.webview.open(
                    window.location.origin +basePath+ '/gis/app/statistics/pzgqk?type=' + type
                    ,'statisticsPZGQK'
                    ,{
                        top:'0px',bottom:'0px'
                    }
                    ,'slide-in-right'
                );
            }

        });
    };

//分屏
    MobileToolBar.prototype.fenPing = function (contentDom){
        var that = this;
        this.fenPingDom = $("<li class='collapseMapDivCls_length treasure shixiao fl' style='width: 33.33%'>" +
            "<div class='treasureDiv'>" +
            '<div class="iconfont icon-fenping treasureIcon" style="background: #bee393"></div>' +
            '<div class="treasureText">分屏</div>' +
            "</div>" +
            "</li>");
        contentDom.append(this.fenPingDom);
        this.fenPingDom.click(function (e) {
            mui.openWindow({
                url:window.location.origin+''+basePath+'/gis/app/fengPing',
                id:'selectLayers',
                styles:{
                    top:0,//新页面顶部位置
                    bottom:0,//新页面底部位置
                },
                extras:{
                    layers:that.obj.layersFun //扩展参数
                },
                createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
                show:{
                    autoShow:true,//页面loaded事件发生后自动显示，默认为true
                },
                waiting:{
                    autoShow:true,//自动显示等待框，默认为true
                    title:'正在加载...',//等待对话框上显示的提示内容
                    options:{
                    }
                }
            })

        })
    };

//卷帘
    MobileToolBar.prototype.juanLian = function (contentDom){
        var that = this;
        this.juanLianDom = $("<li class='collapseMapDivCls_length shixiao treasure fl' style='width: 33.33%'>" +
            "<div class='treasureDiv'>" +
            '<div class="iconfont icon-juanlianduibi treasureIcon" style="background: #93e2e3"></div>' +
            '<div class="treasureText">卷帘</div>' +
            "</div>" +
            "</li>");
        contentDom.append(this.juanLianDom);
        this.juanLianDom.click(function (e) {
            mui.openWindow({
                url:window.location.origin+''+basePath+'/gis/app/juanlian',
                id:'juanlian',
                styles:{
                    top:0,//新页面顶部位置
                    bottom:0,//新页面底部位置
                },
                extras:{
                    layers:that.obj.layersFun //扩展参数
                },
                createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
                show:{
                    autoShow:true,//页面loaded事件发生后自动显示，默认为true
                },
                waiting:{
                    autoShow:true,//自动显示等待框，默认为true
                    title:'正在加载...',//等待对话框上显示的提示内容
                    options:{
                        // width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
                        // height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
                    }
                }
            })

        })
    };

    function getXzqhInfo(code) {
        var xzqh = {
            '410171': '经开区',
            '410104': '管城回族区',
            '410172': '高新区',
            '410170': '郑东新区',
            '410111': '郑州市本级',
            '410105': '金水区',
            '410102': '中原区',
            '410106': '上街区',
            '410103': '二七区',
            '410108': '惠济区',
            '410182': '荥阳市',
            '410184': '新郑市',
            '410181': '巩义市',
            '410122': '中牟县',
            '410183': '新密市',
            '410185': '登封市'
        };
        return code ? xzqh[code] : code;
    }
    return {
        MobileToolBar: MobileToolBar
    }
});
