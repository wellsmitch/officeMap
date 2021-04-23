/**
 * 拖动
 * @param containterObj
 * @param leftDomObj
 * @param rightDomObj
 * @param bottomDivObj
 * @param GisService
 * @param viewObj 禁止拖动
 * @constructor
 */
var Drag = function (containterObj, leftDomObj, rightDomObj, bottomDivObj, GisService, viewObj) {

    var handle = document.createElement('div'),
        bottomHandle = document.createElement('div'),

        containter = typeof containterObj === "string" ? containterObj : containterObj.selector,
        containterStyle = typeof containterObj === "object" ? (containterObj.style ? containterObj.style : {}) : {},


        leftDom = typeof leftDomObj === "string" ? leftDomObj : leftDomObj.selector,
        leftDomStyle = (typeof leftDomObj === "object") ? (leftDomObj.style ? leftDomObj.style : {}) : {},

        rightDom = typeof rightDomObj === "string" ? rightDomObj : rightDomObj.selector,
        rightDomStyle = typeof rightDomObj === "object" ? (rightDomObj.style ? rightDomObj.style : {}) : {},
        rightDomShow = typeof rightDomObj === "object" ? (rightDomObj.show != undefined ? rightDomObj.show : true) : true,

        bottomDiv = typeof bottomDivObj === "string" ? bottomDivObj : bottomDivObj.selector,
        bottomDivStyle = typeof bottomDivObj === "object" ? (bottomDivObj.style ? bottomDivObj.style : {}) : {},
        bottomDivShow = typeof bottomDivObj === "object" ? (bottomDivObj.show != undefined ? bottomDivObj.show : true) : true;

    // 是否允许拖动
    var accept = true;
    if (viewObj && (viewObj.acceptDrag != undefined)) {
        accept = viewObj.acceptDrag
    }
    if (!($('#handle').length !== 0 && $('#bottomHandle') !== 0)) {
        handle.setAttribute('id', 'handle');
        bottomHandle.setAttribute('id', 'bottomHandle');
        $(rightDom).append(handle);
        $(bottomDiv).append(bottomHandle);
    }


    $(handle).css({
        position: 'absolute',
        left: '-4px',
        top: 0,
        bottom: 0,
        width: '8px',
        cursor: 'w-resize',
        'zIndex': 99999
    });
    $(bottomHandle).css({
        position: 'absolute',
        left: 0,
        top: '-4px',
        right: 0,
        height: '8px',
        cursor: 'n-resize',
        'zIndex': 99999
    });
    /*样式初始化  start*/
    $(containter).css({
        position: 'relative'
    }).css(containterStyle);
    $(leftDom).css({
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: $('#bottomDiv').length > 0 ? (bottomDivShow ? 200 : 0) : 0,
        right: rightDomShow && rightDomObj.width ? rightDomObj.width : rightDomShow ? 400 : 0   //
        // background: '#fff5a1'
    })
        .css(leftDomStyle)
        .css($('#bottomDiv').length > 0 ? leftDomStyle : {bottom: 0})

    /**
     *  浏览器视窗变化处理
     */
    function rightBottomByWindowResize() {
        GisService.getMap().updateSize();
        // return
        $(rightDom).css({
            position: 'absolute',
            right: 0,
            top: 0,
            left: $(leftDom).width(),
            bottom: 0,
            width: rightDomShow ? "auto" : '0px',
            display: rightDomShow ? 'block' : 'none'
            // background: '#85fff3'
        }).css(rightDomStyle);
        if ($(bottomDiv).length !== 0) {
            $(bottomDiv).css({
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: $(leftDom).height(),
                height: bottomDivShow ? "auto" : '0px',
                display: bottomDivShow ? 'block' : 'none'
                // background: '#ad72ff'
            }).css(bottomDivStyle);
        }
    }

    rightBottomByWindowResize();

    /*样式初始化  end*/
    var isResizing = false,//横向控制
        isResizing1 = false,//纵向控制
        lastDownX = 0,
        lastDownY = 0,
        $containter = $(containter),
        $leftDiv = $(leftDom),
        $rightDiv = $(rightDom),
        $bottomDiv = $(bottomDiv);
    $bottomDiv.css({
        top: $leftDiv.height(),
        right: $rightDiv.width()
    });

    $('#handle').on('mousedown', function (e) {
        isResizing = true;
        isResizing1 = false;
        lastDownX = e.clientX;
        mouseMove()

    });

    function mouseMove() {
        $(document).on('mousemove', function (e) {
            if (!accept) {
                return
            }
            if (!isResizing1 && isResizing) {
                var offsetRight = $containter.width() - (e.clientX - $containter.offset().left);
                offsetRight = (offsetRight < 100) ? 100 : offsetRight;
                $leftDiv.css({
                    'right': rightDomShow ? offsetRight : 0,
                    width: "auto"
                });
                $rightDiv.css({
                    'left': $(containter).width() - Number($leftDiv.css("right").replace(/px/ig, '')),
                    display: rightDomShow ? 'block' : 'none' //bottomDivShow
                });
                $bottomDiv.css({
                    top: $leftDiv.height(),
                    right: rightDomShow ? $rightDiv.width() : '0',
                    // height: bottomDivShow ? 'auto' : '0',
                    display: bottomDivShow ? 'block' : 'none'
                });


            } else if (!isResizing && isResizing1) {
                var offsetBottom = $containter.height() - (e.clientY - $containter.offset().top);
                offsetBottom = (offsetBottom < 100) ? 100 : offsetBottom;
                $leftDiv.css({
                    'bottom': bottomDivShow ? offsetBottom : 0
                });
                $bottomDiv.css({
                    // height: bottomDivShow ? 'auto' : 0,
                    display: bottomDivShow ? 'block' : 'none',
                    top: $leftDiv.height(),
                    right: $rightDiv.width()
                });
            }
            GisService.getMap().updateSize();
            $(document).on('mouseup', function () {
                isResizing = false;
                isResizing1 = false;
            });
            // e.preventDefault();

        })
    }

    //dom 生成后调用防止地图变形
    GisService.getMap().updateSize();

    window.onresize = function () {
        $(rightDom).css({
            position: 'absolute',
            right: 0,
            top: 0,
            left: $(leftDom).width(),
            bottom: 0,
            // background: '#85fff3'
        }).css(rightDomStyle);
        $(bottomDiv).css({
            position: 'absolute',
            left: 0,
            bottom: 0,
            top: $(leftDom).height(),
            // background: '#ad72ff'
        }).css(bottomDivStyle);
    };


    // 上下
    $('#bottomHandle').on('mousedown', function (e) {
        isResizing1 = true;
        isResizing = false;
        lastDownY = e.clientY;
        mouseMove()
    });
};

/**
 * 工具条 对象
 * @param GisService
 * @param obj
 * @constructor
 */
function ToolBar(GisService, obj) {
    // 获取最外层容器
    var that = this;
    this.mapcon = GisService.mapCondiv;
    this.GisService = GisService;
    this.layers = obj.layersFun;//business.layers,
    // console.log(this.layers);
    this.obj = obj;
    this.opacitySliderObj = {};
    this.InIt(this.mapcon);
    this.GisService.clearMehtodFun();
    this.selectFun(obj.select);
    // obj && obj.select ? this.selectFun(obj.select) : null;
    obj && obj.reSite ? this.reSite() : null;
    obj && obj.ZoomIn ? this.ZoomIn() : null;
    obj && obj.ZoomOut ? this.ZoomOut() : null;

    obj && obj.featureQuery ? this.featureQuery(obj.featureQuery) : null;

    obj && obj.treasureLine ? this.treasureLine() : null;
    obj && obj.treasureArea ? this.treasureArea() : null;
    obj && obj.bufferAnalysis ? this.bufferAnalysis() : null;
    obj && obj.clear ? this.clear(obj.clear) : null;


    obj && obj.multiScreen ? this.multiScreen(this.mapcon) : null;
    obj && obj.multiScreenT ? this.multiScreenT(this.mapcon) : null;

    obj && obj.rollingShutter ? this.rollingShutter() : null;

    obj && obj.analysisRequest ? this.analysisRequest(obj.analysisRequest) : null;

    obj && obj.layersFun ? this.layersFun(obj.select) : null;
    obj && obj.search ? this.searchFun(obj.search) : null;
    this.maxScreen(this.mapcon)
}


// 选择
ToolBar.prototype.selectFun = function (callback) {
    var that = this;
    this.selectDom = $('<div class="fl qx noneSplitBlock blue_class" ref="initialDom" @click="toolInit($event)">选择</div>');
    this.tool_con.append(this.selectDom);
    that.GisService.setCursor({
        cursorImage: basePath + '/static/image/rmenu1.gif',
        event: callback
    });
    $(this.selectDom).click(function (e) {
        // 清除划线测量
        // that.toolbarPreMethodOption();
        $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
        // that.destroyZoom();
        that.GisService.setCursor({
            cursorImage: basePath + '/static/image/rmenu1.gif',
            event: callback
        });
    });
};

// 放大
ToolBar.prototype.ZoomIn = function () {
    var that = this;
    this.ZoomInDom = $('<div class="iconfont icon-addTodo-nav toolbarAction fd" title="放大"></div>');
    // leftBottomWrap
    this.leftBottomWrap.append(this.ZoomInDom);
    this.ZoomInDom.click(function (e) {
        that.GisService.zoomInFun()
    })
};

// 缩小
ToolBar.prototype.ZoomOut = function () {
    var that = this;
    this.ZoomOutDom = $('<div class="iconfont icon-jianhao toolbarAction sx" title="缩小"></div>');
    // this.tool_con.append(this.ZoomOutDom);
    this.leftBottomWrap.append(this.ZoomOutDom);
    this.ZoomOutDom.click(function (e) {
        that.GisService.zoomOutFun()
    })
};

// 关闭/展开 工具条
ToolBar.prototype.toolBarClose = function () {
    this.toolBarClose = $('<div class="fl" style="padding:0;height:34px;background:#fff">\n' +
        '                        <div class=\'spread_close\' style="padding-right:0;width:4px;height:28px;margin-top:3px;background:url(' + basePath + '/static/image/toolbarsword.png) 0 0 no-repeat"></div>\n' +
        '                    </div>');
    this.toolWrap.append(this.toolBarClose);
    $(this.toolBarClose).click(function () {
        $(this).prev().toggle();
        if (getComputedStyle($(this).prev()[0]).display === "none") {
            $('.spread_close').css({
                backgroundPositionY: -84
            })
        } else {
            $('.spread_close').css({
                backgroundPositionY: 0
            })
        }
    });
};

// 销毁区域放大 与  区域 缩小对象 及放大、缩小功能
ToolBar.prototype.destroyZoom = function () {
    var that = this;
    that.GisService.setCursor({});

    // setActive(false) 为销毁
    that.dragZoomOut.setActive(false);
    // removeInteraction 为移除
    that.GisService.getMap().removeInteraction(that.dragZoomOut);

    that.dragZoomIn.setActive(false);
    that.GisService.getMap().removeInteraction(that.dragZoomIn);


    this.ZoomOut ? $(this.ZoomOutDom).removeClass('blue_class') : '';
    this.ZoomIn ? $(this.ZoomInDom).removeClass('blue_class') : '';

};

var poilayer = {
    "id": "404655080554364928",
    "createTime": "2020-08-21 15:14:49",
    "createUser": "admin",
    "modifyTime": "2020-12-15 14:33:51",
    "modifyUser": "admin",
    "pid": "357456258220949504",
    "lvl": null,
    "lft": null,
    "rgt": null,
    "name": "兴趣点",
    "type": 0,
    "loadType": "wms",
    "layer": "X410100ZZXQD2020GZZXQD",
    "loadMode": null,
    "loadUrl": "http://10.0.0.114:6160/igs/rest/ogc/doc/X410100ZZXQD2020GZZXQD/WMSServer",
    "loadAppUrl": "http://222.143.38.161:8080/onemap/119/igs/rest/ogc/doc/POIXQDPOIXQD/WMSServer",
    "docName": "X410100ZZXQD2020GZZXQD",
    "strLayerSn": null,
    "layerIndex": 0,
    "properties": [{
        "field": "ID",
        "name": "ID",
        "fieldType": "long",
        "show": false,
        "title": "ID"
    }, {
        "field": "OBJECTID",
        "name": "OBJECTID",
        "fieldType": "long",
        "show": false,
        "title": "OBJECTID"
    }, {"field": "PoiID", "name": "PoiID", "fieldType": "string", "show": false, "title": "PoiID"}, {
        "field": "name",
        "name": "NAME",
        "fieldType": "string",
        "show": true,
        "title": "名称"
    }, {"field": "type", "name": "TYPE", "fieldType": "string", "show": true, "title": "类型"}, {
        "field": "LAT",
        "name": "LAT",
        "fieldType": "double",
        "show": false,
        "title": "LAT"
    }, {"field": "address", "name": "ADDRESS", "fieldType": "string", "show": true, "title": "地址"}, {
        "field": "LNG",
        "name": "LNG",
        "fieldType": "double",
        "show": false,
        "title": "LNG"
    }, {
        "field": "mpLayer",
        "name": "mpLayer",
        "fieldType": "long",
        "show": false,
        "title": "图层"
    }, {
        "field": "FROM_STATEID",
        "name": "FROM_STATEID",
        "fieldType": "long",
        "show": false,
        "title": "FROM_STATEID"
    }, {
        "field": "TO_STATEID",
        "name": "TO_STATEID",
        "fieldType": "long",
        "show": false,
        "title": "TO_STATEID"
    }, {"field": "PRJ_LOCK", "name": "PRJ_LOCK", "fieldType": "long", "show": false, "title": "PRJ_LOCK"}],
    "analysisTopicName": null,
    "analysisTopicTableName": null,
    "topicName": null,
    "layerIcon": null,
    "legendUrl": null,
    "strLayersInfo": null,
    "gdbpUrl": null,
    "layerCode": null,
    "threeDimensionLoadType": null,
    "threeDimensionLoadUrl": null,
    "threeDimensionAppLoadUrl": null,
    "threeDimensionCorrectHeight": null,
    "threeDimensionLayerIndex": null
};

//右边按钮控制
ToolBar.prototype.rightBtnCtrl = function (rightBtnFun) {
    var that = this;
    if (typeof rightBtnFun.close === "function") {
        rightBtnFun.close(function () {
            $(that.mapcon).parent().css({
                left: 0,
                width: "100%"
            });
        });
        // 若关闭右边所有u按钮则需要铺满地图
        if (
            this.sideRightBtnGroup.find(".sideRightBtn.none").length ===
            this.sideRightBtnGroup.find(".sideRightBtn").length
        ) {
            $(that.mapcon).parent().css({
                left: 0,
                width: "100%"
            });
        }
        this.GisService.getMap().updateSize();
        return;
    }
    $(".dragBlock").css({
        right: 26,
        top: 0,
        left: "auto"
    });
    if (typeof this.rightBtnPrevHide === "function") {
        this.rightBtnPrevHide();
        $(that.mapcon).parent().css({
            left: 0,
            width: "100%"
        });
    }
    if (typeof rightBtnFun.open === "function") {
        this.sideRightBtnGroup.find(".sideRightBtn").removeClass("sideRightActive");
        rightBtnFun.open(function (conDom) {
            // console.log($(that.mapcon).parent());
            $(that.mapcon).parent().css({
                left: 0,
                width: $(that.mapcon).parent().parent().width() - $(conDom).width() - that.sideRightBtnGroup.width(),
                // right: $(conDom).width()
            });
        })
    }
    this.GisService.getMap().updateSize();
    this.rightBtnPrevHide = rightBtnFun.hide;
};

ToolBar.prototype.InIt = function (mapcon) {
    this.layerTreeArr = [];
    this.layerTreeArrObj = {};

    /**
     * 选择
     * */
    var that = this;
    this.toolWrap = $('<div class="toolbar" style="overflow:hidden;height:34px"></div>');
    this.tool_con = $('<div class="tool_con fl" style="width:auto;overflow:hidden;padding:4px 0 0 6px;height: 34px;background:#fff"></div>');
    this.toolWrap.append(this.tool_con);
    $(mapcon).parent().append(this.toolWrap);
    // 右边按钮
    this.sideRightBtnGroup = $('<div class="sideRight" style=""></div>');
    $(mapcon).parent().parent().append(that.sideRightBtnGroup);
    //地图容器发生变化
    $(mapcon).parent().parent().resize(function () {
        $.each($('.dragBlock,.addIframe'), function (index, ele) {
            if (window.getComputedStyle(ele).display === "block") {
                var outerWidth = Number(window.getComputedStyle($(mapcon).parent().parent()[0]).width.replace(/px/ig, ''))
                $(mapcon).parent().css({
                    right: ($(ele).width() + 30),
                    width: outerWidth - ($(ele).width() + 32)
                });
                that.GisService.getMap().updateSize()
            }
        });
    });
    //切换
    this.sideRightBtnGroup.click(".sideRightBtn", function (ev) {
        var actionType = $(ev.target).find("span").attr("type");
        var isActive = $(ev.target).hasClass("sideRightActive");
        if (!$(ev.target).hasClass("sideRightBtn")) {
            return
        }
        // console.log(actionType);
        switch (actionType) {
            case "layer":
                that.layDom.addClass("layerHeightFull");
                that.rightBtnCtrl({
                    type: "layer",
                    open: function (rightBtnFunOpenCb) {
                        if (isActive) {
                            that.selectDom.click();
                            return;
                        }
                        // that.layDom.parent().addClass("layerHeightFull");
                        //图层信息容器
                        that.layerDom.addClass('blue_class').siblings().removeClass('blue_class');
                        that.layDom.show();
                        rightBtnFunOpenCb(that.layDom);
                        that.sideRightBtnGroup.find(".sideRightBtnOfLayer").addClass("sideRightActive");
                    },
                    hide: function () {
                        that.layDom.hide();
                        that.sideRightBtnGroup.find(".sideRightBtn").removeClass("sideRightActive");
                        // that.layDom.parent().removeClass("layerHeightFull");
                    }
                });
                break;
            case "bufferAnalysis":
                that.rightBtnCtrl({
                    type: "bufferAnalysis",
                    open: function (rightBtnFunOpenCb) {
                        if (isActive) {
                            that.selectDom.click();
                            return
                        }
                        //图层信息容器
                        that.bufferAnalysisToolbarDom.addClass('blue_class').siblings().removeClass('blue_class');
                        that.bufferAnalysisDom.show();
                        rightBtnFunOpenCb(that.bufferAnalysisDom);
                        that.sideRightBtnGroup.find(".sideRightBtnOfBufferAnalysis").addClass("sideRightActive");
                    },
                    hide: function () {
                        that.bufferAnalysisDom.hide();
                        that.sideRightBtnGroup.find(".sideRightBtn").removeClass("sideRightActive");
                    }
                });
                break;
            case "search":
                that.searchDom.addClass("layerHeightFull");
                that.rightBtnCtrl({
                    type: "search",
                    open: function (rightBtnFunOpenCb) {
                        if (isActive) {
                            that.selectDom.click();
                            return
                        }
                        //图层信息容器
                        that.searchToolbarDom.addClass('blue_class').siblings().removeClass('blue_class');
                        that.searchDom.show();
                        rightBtnFunOpenCb(that.searchDom);
                        that.sideRightBtnGroup.find(".sideRightBtnOfSearch").addClass("sideRightActive");
                        $(".searchImg").addClass('blue_class');//.siblings().removeClass('blue_class');
                    },
                    hide: function () {
                        that.searchDom.hide();
                        that.sideRightBtnGroup.find(".sideRightBtn").removeClass("sideRightActive");
                    }
                });
                break;
            default:
                that.rightBtnCtrl({
                    open: function (rightBtnFunOpenCb) {
                        if (isActive) {
                            that.selectDom.click();
                            $("#sideCon" + $(ev.target).attr("num")).hide();
                            that.sideRightBtnGroup.find("#sideBtn" + $(ev.target).attr("num")).removeClass("sideRightActive");
                            $(that.mapcon).parent().css({
                                left: 0,
                                width: $(that.mapcon).parent().parent().width() - that.sideRightBtnGroup.width(),
                            });
                            return
                        }
                        rightBtnFunOpenCb($("#sideCon" + $(ev.target).attr("num")));
                        $("#sideCon" + $(ev.target).attr("num")).show();
                        that.sideRightBtnGroup.find("#sideBtn" + $(ev.target).attr("num")).addClass("sideRightActive");
                    },
                    hide: function () {
                        console.log("iframe close action");
                        $("#sideCon" + $(ev.target).attr("num")).hide();
                        that.sideRightBtnGroup.find("#sideBtn" + $(ev.target).attr("num")).removeClass("sideRightActive");
                    }
                });
                break;
        }
    });
    //关闭
    this.sideRightBtnGroup.click(".sideRightBtnClose", function (ev) {
        if (!$(ev.target).hasClass("sideRightBtnClose")) {
            return
        }
        var actionType = $(ev.currentTarget).attr("type");
        switch (actionType) {
            case "layer":
                that.rightBtnCtrl({
                    close: function (closeCb) {
                        that.layDom.hide();
                        $(ev.currentTarget).parent().addClass("none").removeClass("sideRightActive");
                        closeCb(ev)
                    }
                });

                break;
            case "bufferAnalysis":
                that.rightBtnCtrl({
                    close: function (closeCb) {
                        that.bufferAnalysisDom.hide();
                        $(ev.currentTarget).parent().addClass("none").removeClass("sideRightActive");
                        closeCb(ev)
                    }
                });
                break;
            case "search":
                that.rightBtnCtrl({
                    close: function (closeCb) {
                        that.searchDom.hide();
                        $(ev.currentTarget).parent().addClass("none").removeClass("sideRightActive");
                        closeCb(ev)
                    }
                });
                break;
        }
        $(that.selectDom).click();
        //阻止事件委托  必须 否则会出现  再次触发右边按钮视图出现情况
        return false;
    });

    // 左下角 放大 缩小  复位
    this.leftBottomWrap = $('<div class="sideLeftBottom" style="position: absolute; left: 10px; bottom: 32px; background: #fff; padding: 3px 6px; line-height: 20px; color: #595959;box-shadow: 0 0 10px 0 #d2d2d2;"></div>');
    $(mapcon).parent().append(that.leftBottomWrap);
    /**
     *实例化  画区域放大地图对象
     */
    this.dragZoomIn = new ol.interaction.DragZoom({
        className: 'ol-zoom',
        condition: ol.events.condition.always,
        out: false // true 缩小  false 放大
    });

    /**
     *实例化  画区域缩小地图对象
     */
    this.dragZoomOut = new ol.interaction.DragZoom({
        condition: ol.events.condition.always,
        out: true // true 缩小  false 放大
    });

    this.GisService.addTempLayer(poilayer);
    this.GisService.setLayerIndex(poilayer, 9999);
    //禁用地图右击功能
    $(mapcon).find("canvas").on("contextmenu", function (eve) {
        return false
    });

    /**
     * subjectInfo
     * getParaByName("html") === "initial" --->  onemap/gis/lhsp/html/index
     * */
    if (eval('typeof subjectInfo===\'undefined\'') || getQueryString("html") === "initial") {
        return;
    }
    console.log("subjectInfo in");
    var iframeArr = [{
        title: subjectInfo.name,
        id: Math.round(Math.random() * 100000000),
        url: subjectInfo.formUrl
    }];
    if (!subjectInfo.formUrl) {
        return
    }

    iframeArr.forEach(function (ele, iindex) {
        var $iframeSingle = $('<div class="addIframe" num=' + ele.id + ' id=sideCon' + ele.id + ' style="border: 1px solid #eaeaea;position: absolute; top: 0; bottom: 0; right: 30px; width: 330px;display:' + (iindex === 0 ? "block" : "none") + '"> <iframe dfdfdfdfdf style="width: 100%;height: 100%;border: none;" src=' + ele.url + ' /></div>');
        // var $iframeSingle = $('<div class="addIframe dragBlock excludeHeight" num=' + ele.id + ' id=sideCon' + ele.id + ' style="width: 330px; right: 26px; top: 0px; left: auto; display: block;">' +
        //     '<div class="mapMsgWraper_header">' +
        //     '<div class="header_list">' +
        //     '<div class="ele_search fl">' + ele.title + '</div>' +
        //     '</div>' +
        //     '</div>' +
        //     '<div class="mapMsgWraperCon">' +
        //     '<iframe dfdfdfdfdf style="width: 100%;height: 100%;border: none;" src=' + ele.url + ' />' +
        //     '</div>' +
        //     '</div>');

        $(mapcon).parent().parent().append($iframeSingle);
        var $iframeBtnDom = $('<div class="sideRightBtn sideRightActive" num=' + ele.id + ' id=sideBtn' + ele.id + ' style="padding-bottom: 10px;display: ' + (iindex === 0 ? "block" : "none") + '">' + ele.title + '</div>');
        that.sideRightBtnGroup.prepend($iframeBtnDom);
        if (iindex === 0) {
            $(that.mapcon).parent().css({
                left: 0,
                width: $(that.mapcon).parent().parent().width() - $iframeSingle.width() - that.sideRightBtnGroup.width(),
            });
            that.GisService.getMap().updateSize();
            that.rightBtnCtrl({
                hide: function () {
                    $("#sideCon" + ele.id).hide();
                    that.sideRightBtnGroup.find("#sideBtn" + ele.id).removeClass("sideRightActive");
                }
            })
        }
        var otherIframe = new that.zyScroll($iframeSingle.find(".mapMsgWraperCon")[0]);
    })
};

// 全屏
ToolBar.prototype.maxScreen = function (mapcon) {
    var that = this;
    this.maxScreen = $('<div class="iconfont icon-quanping toolbarAction fullScreen" title="全屏"></div>');
    // this.tool_con.append(this.maxScreen);
    // this.toolWrap.append(this.tool_con);
    // leftBottomWrap
    this.leftBottomWrap.append(this.maxScreen);
    this.toolBarClose();
    $(mapcon).parent().append(this.toolWrap);
    $(this.maxScreen).click(function (e) {
        var mapContainer = $(that.GisService.getMap().viewport_);
        mapContainer.find('.ol-full-screen button').click();
    });
};

//分屏-项目策划
ToolBar.prototype.multiScreen = function (mapcon) {
    var that = this;
    this.multiScreen = $('<div class="fl multiScreenTool noneSplitBlock">分屏</div>');
    this.tool_con.append(this.multiScreen);
    $(this.multiScreen).click(function (e) {
        $('.multiScreen').show();
        initMultiScreen();
    })
};


//分屏
ToolBar.prototype.multiScreenT = function (mapcon) {
    var that = this;
    var maps = [], gisServices = [];
    var $multiScreen = $('<div class="fl multiScreenTool noneSplitBlock">' +
        '<div class="fl noneSplitBlock">分屏</div>' +
        '<div class="layui-icon layui-icon-triangle-d fr" style="color: #000;display:none;"></div>' +
        '</div>');
    this.tool_con.append($multiScreen);

    var $multiScreenCount = $(
        '<div style="display:none;position: absolute;z-index: 10;left:247px;text-align:center;\n' +
        'cursor: pointer;top: 42px;box-shadow: 0 0 3px 0 #b1b1b1;background-color: #fff;line-height: 18px">\n' +
        '<div class="multiScreenCount" attr="1"><span class="l-btn-icon icon-point">1</span></div>\n' +
        '<div class="multiScreenCount" attr="2"><span class="l-btn-icon icon-point">2</span></div>\n' +
        '<div class="multiScreenCount" attr="3"><span class="l-btn-icon icon-point">3</span></div>\n' +
        '<div class="multiScreenCount" attr="4"><span class="l-btn-icon icon-point">4</span></div>\n' +
        '<div class="multiScreenCount" attr="5"><span class="l-btn-icon icon-point">5</span></div>\n' +
        '<div class="multiScreenCount" attr="6"><span class="l-btn-icon icon-point">6</span></div>\n' +
        '</div>\n');
    $(this.mapcon).parent().append($multiScreenCount);

    $multiScreen.click(function (e) {
        // createMultiScreen(2);
        that.GisService.setCursor();
        $(that.selectDom).click();
        $multiScreen.find('div:last').click();
    });

    $multiScreen.find('div:last').on('click', function (e) {
        e.stopPropagation();
        var position = $multiScreen.position();
        $multiScreenCount.css({
            left: position.left,
            top: position.top + $multiScreen.outerHeight() + 18
        }).slideDown("fast");
        // $multiScreenCount.toggle();
        $("body").bind("mousedown", onBodyDown);

        function hideMenu() {
            $multiScreenCount.fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
        }

        function onBodyDown(event) {
            hideMenu();
        }
    });

    $multiScreenCount.find('div').on('click', function (e) {
        // $('.cx').addClass('blue_class').siblings().removeClass('blue_class');
        var count = $(this).attr('attr');
        createMultiScreen(count);
        e.stopPropagation();
    });

    function createMultiScreen(num) {
        maps = [], gisServices = [];
        num = Number(num);
        //构造gis创建参数
        var layui = that.GisService.layui;
        var mapInfo = that.GisService.mapInfo;
        var mapInterFace = that.GisService.interfaceInfo;
        var mapLayers = that.layers;

        //分屏公用对象声明
        var sourceVectorOfTreasure = new ol.source.Vector();
        var gisservParam = {
            layui: layui,
            sourceVectorOfTreasure: sourceVectorOfTreasure,
        }
        var mapView = null;

        //获取map的div和当前gisserver，追加div
        var targetId = that.GisService.getMap().getTarget();
        var $multiScreen = $('' +
            '<div class="multiScreen toolbar" class="overflow">\n' +
            '     <div class="multSection fl"></div>\n' +
            '</div>');
        $('#' + targetId).parent().append($multiScreen);
        // $('.multiScreen').show();

        //创建map和gisservice
        for (var i = 0; i < num; i++) {
            //构造地图容器
            var mapClass = "multi-screen-map" + i;
            var mapdiv = "<div class='col-lg col-lg-" + num + "'></div>";
            var header = '<div class="panel-header">' +
                '    <div class="overflow">\n' +
                // '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">请选择图层</label>\n' +
                '       <div class="zTreeDemoBackground fl">\n' +
                '\t\t\t\t<ul class="list">\n' +
                '\t\t\t\t\t<li class="title">\n' +
                // '\t\t\t\t\t\t<div class="multiScreenSelect subject">请选择专题</div>\n' +
                '\t\t\t\t\t\t<div class="multiScreenSelect layer">请选择图层</div>\n' +
                '\t\t\t\t\t</li>\n' +
                '\t\t\t\t</ul>\n' +
                '\t\t   </div>' +
                '    </div>\n' +
                '</div>';
            var body = "<div class='multi-screen_maps " + mapClass + "'>" +
                "" +
                "</div>";
            $(mapdiv).append($(header)).append($(body)).appendTo($multiScreen.find('.multSection'));
            //创建gisService，map
            var gisService = new GisService(gisservParam, mapInfo, mapInterFace);//（公用测量图层）
            var map = gisService.createMap({
                map: $multiScreen.find('.multi-screen_maps.' + mapClass)[0],
                // coordinate: 'mouseCoordinateSpan',
                // zoom: 'mapLevelSpan'
            });
            maps.push(map);
            gisServices.push(gisService);
            if (!!mapView) {
                map.setView(mapView);
            } else {
                mapView = map.getView();
            }
        }
        //图层树dom和图层选择
        var $multiScreenTree = $('<div class="menuContent" style="display:none; position: absolute;">\n' +
            '\t\t\t<ul class="multiScreenTree ztree" style="margin-top: 3px; width: auto;min-width: 200px; height: 300px; overflow: auto; box-shadow: 0 0 10px 0 #bdbcbc; border-radius: 4px; background: rgba(255,255,255,0.7);"></ul>\n' +
            '</div>');
        $multiScreenTree.appendTo($multiScreen);
        (function () {
            var $menuContent = $multiScreen.find('.menuContent');
            var $ztreeDom = $multiScreen.find('.multiScreenTree.ztree');

            $.each($multiScreen.find('.multiScreenSelect.layer'), function (index, item) {
                $(item).click(function () {
                    if (!item.layerNodes) {
                        item.layerNodes = JSON.parse(JSON.stringify(that.layers));
                        item.layerNodes.forEach(function (layer) {
                            layer.checked = false;
                        })
                    }
                    new MyzzyyTree($ztreeDom, item.layerNodes, true, function (flag, node) {
                        var gisService = gisServices[index];
                        if (!node instanceof Array) {
                            gisService.layui.layer.msg("请选择图层！", {icon: 0});
                            return;
                        }
                        var title = "";
                        node.forEach(function (layerInfo) {
                            if (flag) {
                                title += layerInfo.name;
                                layerInfo.show = true;
                                layerInfo.opacity = 1;
                                gisService.addLayer(layerInfo);
                            } else {
                                title = title.replace(layerInfo.name, "");
                                gisService.removeLayer(layerInfo);
                            }
                        })
                        $(item).html((!!title) ? title : "请选择图层");
                        // if (gisService.multiScreenLayer) {
                        //     gisService.removeLayer(gisService.multiScreenLayer);
                        // }
                        // gisService.multiScreenLayer = node.layer;
                        // node.show = true;node.opacity = 1;
                        // gisService.addLayer(node);
                    });
                    var layerup = $(item);
                    var layerupPosition = layerup.position();
                    $menuContent.css({
                        left: layerupPosition.left,
                        top: layerupPosition.top + layerup.outerHeight()
                    }).slideDown("fast");
                    $menuContent.on("mousedown", function (e) {
                        return false;
                    });
                    $("body").on("mousedown", onBodyDown);
                });
            });

            $.each($multiScreen.find('.multiScreenSelect.subject'), function (index, item) {
                $(item).click(function () {
                    new MyzzyyTree($ztreeDom, layui.subjectList, true, function (node) {
                        var gisService = gisServices[index];
                        if (!node.layerInfoList || node.layerInfoList.length == 0) {
                            gisService.layui.layer.msg("请选择专题节点！", {icon: 0});
                            return;
                        }
                        $(item).html(node.name);
                        var layerList = node.layerInfoList.map(function (layer) {
                            return Object.assign(layer, layer.layerInfo, layer.property);
                        });
                        if (gisService.multiScreenLayerList && gisService.multiScreenLayerList.length > 0) {
                            gisService.multiScreenLayerList.forEach(function (layer) {
                                gisService.removeLayer(layer);
                            });
                            gisService.multiScreenLayerList = [];
                        }
                        gisService.multiScreenLayerList = layerList;
                        // node.show = true;node.opacity = 1;
                        layerList.forEach(function (layer) {
                            gisService.addLayer(layer);
                        });
                    });
                    var layerup = $(item);
                    var layerupPosition = layerup.position();
                    $menuContent.css({
                        left: layerupPosition.left,
                        top: layerupPosition.top + layerup.outerHeight()
                    }).slideDown("fast");
                    $menuContent.on("mousedown", function (e) {
                        return false;
                    });
                    $("body").on("mousedown", onBodyDown);
                });
            });


            function hideMenu() {
                $menuContent.fadeOut("fast");
                $("body").off("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                setTimeout(hideMenu);
            }

        })();

        //工具条
        var toolbarMultiScreen = new ToolbarMultiScreen(gisServices, {
            ZoomIn: true,
            ZoomOut: true,
            layersFun: that.layers,
            featureQuery: {},
            reSite: true,
            treasureArea: true,
            treasureLine: true,
            rollingShutter: true,
            multiScreen: true,
            clear: {
                show: true,
            },
            search: {
                placeholder: "请输入兴趣点名称",
                queryType: "poi"
            },
            select: function (event) {
                var xy = event.coordinate;
                var x = xy[0], y = xy[1];
                // var selectLayers = getSelectLayers();
                var selectLayers = function () {
                    alert()
                };
            }
        });
    }

};

//////////////////////////订阅start
// toolbar 注册监听对象 初始化
ToolBar.prototype.initLayerMq = function () {
    var that = this;
    // console.log(this.layers);
    this.layers.map(function (ele, index, arr) {
        ele.nameBark = ele.name;
        that.layerTreeArr.unshift(ele);
        that.layerTreeArrObj[ele.id] = ele;

        if (ele.type == 0 && ele.layer) {
            // ele.index = arr.length - index
            that.GisService.addLayer(ele);
            that.GisService.setOlLayerIndex(ele, arr.length - index);
        }
    });
    this.initLayerTreeObj = that.initLayerTree("", that.layerTreeArr);

    var layerListener = new zy.util.mq("mapLayer_" + Math.ceil(Math.random() * 1000), this.layers, ["checked", "name", "show"]);
    layerListener.register({
        // 添加
        add: function (info) {
            // console.log(info);
            if (!info.nameBark) {
                info.nameBark = info.name
            }
            ;
            if (!info.name_) {
                info.name_ = that.createLayerTreeNameDom(info);
                info.open = true
            }

            if (info.show === undefined) {
                info.show = true
            }
            if (info.opacity === undefined) {
                info.opacity = 1
            }
            if (info.type == 0 && info.layer) {
                that.GisService.addLayer(info);
            }

            var nodes_ = that.initLayerTreeObj.getNodesByParam("id", info.pid, null);
            if (nodes_.length > 1) {
                console.error("树节点id不唯一")
            }
            that.layerTreeArrObj[info.id] = info;
            that.initLayerTreeObj.addNodes(nodes_.length > 0 ? nodes_[0] : null, info);
            that.showControl($("div[singledomid=\'" + info.id + "\']"), info);
            that.layerSearchControl($("div[singledomid=" + info.id + "]"), info);
            that.opacityFun($("div[singledomid=" + info.id + "]"), info);
            // console.log(info.layerInfoList);
            if (Array.isArray(info.layerInfoList)) {
                info.layerInfoList.map(function (ele) {
                    var nodes = that.initLayerTreeObj.getNodesByParam("id", ele.pid, null);
                    if (nodes.length == 0) {
                        ele.pid = info.id;
                        nodes = that.initLayerTreeObj.getNodesByParam("id", ele.pid, null);
                    }
                    if (!ele.nameBark) {
                        ele.nameBark = ele.name
                    }
                    ;
                    if (!ele.name_) {
                        ele.name_ = that.createLayerTreeNameDom(ele);
                        ele.open = true
                    }

                    if (ele.show === undefined) {
                        ele.show = true
                    }
                    that.layerTreeArrObj[ele.id] = ele;
                    if (ele.type == 0 && ele.layer) {
                        that.GisService.addLayer(ele);
                    }

                    if (nodes.length > 1) {
                        console.error("树节点id不唯一")
                    }
                    that.initLayerTreeObj.addNodes(nodes.length > 0 ? nodes[0] : null, ele, false);
                    that.opacityFun($("div[singledomid=" + ele.id + "]"), ele);
                    that.showControl($("div[singledomid=\'" + ele.id + "\']"), ele);
                    that.layerSearchControl($("div[singledomid=" + ele.id + "]"), ele);
                    // layui.element.render('collapse');
                })
            }
        },
        //删除 gis web
        remove: function (info, index) {
            // console.log("remove::::", info);
            that.GisService.removeLayer(info);
            delete that.layerTreeArrObj[info.id];
            var nodes = that.initLayerTreeObj.getNodesByParam("id", info.id, null);
            // var nodes = that.initLayerTreeObj.getNodesByParam("name", info.name, null);
            that.initLayerTreeObj.removeNode(nodes[0]);

            //处理专题配置删除逻辑
            if (Array.isArray(info.layerInfoList)) {
                info.layerInfoList.map(function (ele) {
                    that.GisService.removeLayer(ele);
                    delete that.layerTreeArrObj[ele.id];
                    var nodes = that.initLayerTreeObj.getNodesByParam("id", info.id, null);
                    // var nodes = that.initLayerTreeObj.getNodesByParam("name", info.name, null);
                    if (nodes.length > 0) {
                        that.initLayerTreeObj.removeNode(nodes[0]);
                    }
                })
            }
        },
        //更新 update
        update: function (newInfo, oldInfo) {
            return;
            console.log(newInfo);
            var layLi = $(that.layerDom).find("ul").find("li[layer=" + newInfo.layer + "]");
            var layLiEye = layLi.find('.eye');

            // 透明度更新
            that.opacityFun(layLi, newInfo);

            // 图层显示隐藏更新
            that.layerShowAndHide(layLi, layLiEye, newInfo, newInfo.show);
        },
        //更新 modifyProperties
        modifyProperties: function (info, key, value) {
            return;
            console.log(info, key);
            var layLi = $(that.layerDom).find("ul").find("li[layer=" + info.layer + "]");
            var layLiEye = layLi.find('.eye');

            // 透明度更新
            if (key === "opacity") {
                that.opacityFun(layLi, info.layer);
            }

            // 图层显示隐藏更新
            if (key === "show") {
                that.layerShowAndHide(layLi, layLiEye, info, info.show);
            }
        }
    })
};


//////////////////////////订阅end
// 初始化图层

ToolBar.prototype.createLayerTreeNameDom = function (ele, i, arrs) {

    if (ele.select === undefined) {
        ele.select = false
    }
    // console.log(ele.type,ele.nameBark);
    // 处理初始化时候是否显示图层 show 字段为undefined的情况
    var eyeOpen;
    // if (ele.show === undefined) {
    //     ele.show = true;
    //     ele.opacity = 100;
    //     eyeOpen = true;
    // } else {
    //     eyeOpen = ele.show;
    //     if (!ele.show) {
    //         ele.opacity = 0;
    //     }
    // }
    console.log("ele.show:::",ele.show);

    if(ele.show == undefined) {
        ele.show = true
    }
    var isFolder = true; //ele.type === 1 || Array.isArray(ele.layerInfoList);
    var singleDom = '<div class="outer" title=' + ele.nameBark + '  singleDomPid=' + ele.pid + ' singleDomId=' + ele.id + ' LAYER=' + ele.layer + ' style="display: inline-block;width: 100%">' +
        '<div class="overflow">' +
        '<div style="line-height: 1;cursor: move;max-width: 130px; text-overflow: ellipsis; overflow: hidden;' + (isFolder ? "float: left" : "") + '">' + ele.nameBark + '</div>' +

        // 眼控制
        '<div class="fr overflow"><div singleeyedomid=' + ele.id + ' style="line-height: 20px;cursor: pointer;' + (ele.type === 1 ? "margin-top:0" : "") + '" title=' + (eyeOpen ? "可见" : "不可见") + ' class="fl eye iconfont ' +
        (ele.show ? 'icon-xianshi toolBarEyeOpen' : 'icon-buxianshi toolBarEyeClose')
        + '"></div>' +

        (ele.select != undefined ?
            (
                '<div class="fl" style="padding-left: 8px">' +
                '<input class="showLayer" style="display: none" selectIsOk type="checkbox"' + (ele.show ? 'checked' : '') + '>' +

                '<div singleselectdomid=' + ele.id + ' style="line-height: 14px;cursor: pointer;color: #fff;font-size: 14px;border-radius: 2px" title=' +
                (ele.select ? '可查' : '不可查')
                + ' class="fl selectIcon layui-icon ' +
                (ele.select ? 'layui-icon-ok selectIconOpen' : 'layui-icon-ok selectIconClose')
                + '"></div>' +

                '<div class="isSearch fr" style="display:none;cursor:pointer;padding-left:6px;color: ' + (ele.select != undefined ? (ele.select ? "#03679e" : "#dc5638") : '') + '">' + (ele.select != undefined ? (ele.select ? "可查" : "不可查") : '') + '</div>' +
                '</div>'
            )
            : '') +
        '</div></div>' +


        '<input class="showLayer" style="display: none" layerIsShow type="checkbox"' + (ele.show ? 'checked' : '') + '>' +
        '<div class="layer stopEvent overflow_clear layerOpacityDiv" style="/*height: 30px;*/' + (ele.type === 1 ? "float: left;padding-left: 10px" : "") + '">' +

        // 拖拽条
        '<div class=\"fl layerOpacityCtrl slider' + ele.id + '\" class="demo-slider"></div>'
        //备份// (isFolder ? "" : '<div class=\"fl slider' + ele.id + '\" style="width:130px;margin: 14px 14px 5px 0;" class="demo-slider"></div>')
        +
        '</div>' +
        '</div>';
    return singleDom;
};

ToolBar.prototype.initLayerTree = function (addMapLayerInfo, zNodes) {
    var that = this;
    $.fn.zTree.destroy($("#" + that.layDomId));//ztree
    zNodes.reverse();
    zNodes.map(function (ele, i, arr) {
        ele.name_ = that.createLayerTreeNameDom(ele, i, arr);
        ele.open = true
    });
    var setting = {
        check: {
            //控制显示勾选框
            enable: false,
//				chkStyle:'radio',
            chkStyle: 'checkbox',
//				nocheckInherit: true,
            autoCheckTrigger: false
        },
        view: {
            nameIsHTML: true,
            dblClickExpand: false,
            //是否显示虚线
            showLine: true,
            //是否显示文件图标
            showIcon: false,
            showTitle: false,
            addHoverDom: function (treeId, treeNode, c, d) {
                // console.log(treeId, treeNode, c, d);
                return treeNode.nameBark;
            }
        },
        callback: {
            beforeDrop: function (sourceNode, currentNode, targetNodeArr, moveType) {
                if (targetNodeArr.pid === currentNode[0].pid) {
                    //与目标节点是平行关系
                    if (moveType !== "inner") {
                        return true
                    }
                }
                return false;
            },
            onDrop: function () {
                that.zTreeObj_1.transformToArray(that.zTreeObj_1.getNodes())
                    .filter(function (ele) {
                        return ele.layer !== null;
                    })
                    .forEach(function (ele, index, arr) {
                        if (ele.layer) {
                            that.GisService.setOlLayerIndex(ele.layer, arr.length - index)
                        }
                    });
            }
        },
        data: {
            key: {
                name: 'name_'
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                isCopy: false,//所有操作都是move
                isMove: true,
                prev: true,
                next: true,
                inner: true
            }
        }
    };
    this.zTreeObj_1 = $.fn.zTree.init($("#" + that.layDomId), setting, zNodes);

    this.zTreeObj_1.expandAll(false);
    //处理
    $("#" + that.layDomId).on("mousedown", ".stopEvent", function () {
        return false
    });

    zNodes.map(function (ele) {
        that.opacityFun($("div[singledomid=" + ele.id + "]"), ele);
        // console.log($("div[singledomid=" + ele.id + "]"));
        that.showControl($("div[singledomid=\'" + ele.id + "\']"), ele);
        that.layerSearchControl($("div[singledomid=" + ele.id + "]"), ele);
    });
    return this.zTreeObj_1;
};

// 点击框 控制图层是否可查询
ToolBar.prototype.layerMsgSelectControl = function (slef1, LayerSingleData) {
    // console.log(LayerSingleData);
    if ($(slef1).hasClass('selectIconOpen')) {
        $(slef1)
            .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconClose')
            .attr('title', '不可查');
        LayerSingleData.select = false
    } else {
        $(slef1)
            .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconOpen')
            .attr('title', "可查");
        LayerSingleData.select = true
    }
};
// 点击眼 控制图层是否显示
ToolBar.prototype.layerShowAndHide = function (li, clickObj, Layer_, checkStatus) {
    var that = this;
    $(clickObj).parent().parent().next().prop("checked", !checkStatus);

    if (Layer_.layer != undefined) {
        that.GisService.setLayerVisible(Layer_, !checkStatus);
    }

    if (!checkStatus) {
        $(clickObj).attr('class', 'fl eye iconfont icon-xianshi toolBarEyeOpen').attr('title', "可见");
        Layer_.show = true
    } else {
        $(clickObj).attr('class', 'fl eye iconfont icon-buxianshi toolBarEyeClose').attr('title', "不可见");
        if ($(li).find('.isSearch').html() != '') {
            // $(li).find('.selectIcon')
            //     .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconClose')
            //     .attr('title', "不可查");
            Layer_.show = false;
            // Layer_.select = false
        }
    }
};

// 控制图层透明度方法
ToolBar.prototype.opacityFun = function (outerDom, Layer_) {
    var that = this;
    if (!Layer_.opacity || Layer_.opacity === undefined || Layer_.opacity === null) {
        Layer_.opacity = 100
    }
    if (Layer_.opacity > 1) {
        Layer_.opacity = Layer_.opacity / 100
    }
    // console.log(Layer_);
    var opacityRes = Layer_.opacity;
    that.GisService.setLayerOpacity(Layer_, Layer_.opacity);
    this.opacitySliderObj["opacitySlider_" + Layer_.id] = this.GisService.layui.slider.render({
        elem: outerDom.find(".slider" + Layer_.id)[0]
        , value: Layer_.opacity * 100
        , theme: '#0A81C3' //主题色
        , min: 0
        , max: 100
        , setTips: function (value) {//自定义提示文本
            return value;
        }, change: function (value) {
            that.GisService.setLayerOpacity(Layer_, value / 100);
            var domEach = outerDom.parent().parent().parent().find(".outer");
            $.each(domEach, function (index, ele) {
                if (index != 0) {
                    that.opacityChildrenCtrl(ele, that.layerTreeArrObj[$(ele).attr("singledomid")], value)
                }
            })
        }
    });

};

ToolBar.prototype.opacityChildrenCtrl = function (outerDom, Layer_, value) {
    var that = this;
    that.GisService.setLayerOpacity(Layer_, value / 100);
    this.opacitySliderObj['opacitySlider_' + Layer_.id].setValue(value)
};


// 控制图层是否显示
ToolBar.prototype.showControl = function (li, ele) {
    var that = this;
    this.GisService.setLayerVisible(ele, ele.show === undefined ? true : ele.show);
    li.find('.eye').unbind("click").click(function (e) {
        var self = this;
        //备份 // var checkStatus = $(this).parent().prev().prop("checked");
        var checkStatus = $(this).parent().parent().next().prop("checked");
        that.layerShowAndHide(li, self, ele, checkStatus);

        var eyeLis = li.find('.eye').parents("a").next().find('.eye');

        $.each(eyeLis, function (i, domli) {
            var self = this;
            that.layerShowAndHide(domli, self, that.layerTreeArrObj[$(domli).eq(0).attr("singleeyedomid")], checkStatus);
            e.preventDefault();
        });
        e.preventDefault();
    });

};

// 控制图层是否可查
ToolBar.prototype.layerSearchControl = function (li, ele) {
    var that = this;
    $(li).find('.selectIcon').unbind("click").click(function (e) {
        var slef1 = this;
        that.layerMsgSelectControl(slef1, ele);
        var selectLis = li.find('.selectIcon').parents("a").next().find('.selectIcon');
        // console.log($(slef1).hasClass("selectIconOpen"));
        $.each(selectLis, function (i, domli) {
            if (!$(slef1).hasClass("selectIconOpen")) {
                $(domli).addClass('selectIconOpen');
            } else {
                $(domli).removeClass('selectIconOpen');
            }

            that.layerMsgSelectControl(domli, that.layerTreeArrObj[$(domli).eq(0).attr("singleselectdomid")]);
            e.preventDefault();
        });
    });
};

ToolBar.prototype.layersFun = function (selectFun) {
    var that = this;
    this.layerDom = $('<div class="fl tc">图层</div>');
    this.tool_con.append(that.layerDom);
    this.layerDom.click(function (e) {
        that.layDom.addClass("layerHeightFull")
        // that.QueryWayDom.hide();
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            // $(that.layDom).hide();
            that.rightBtnCtrl({
                open: function (rightBtnFunOpenCb) {
                    //图层信息容器
                    that.layDom.show();
                    // that.layDom.addClass("layerHeightFull");
                    // sideRightBtnOfLayer
                    if (that.sideLayerBtn) {
                        that.sideLayerBtn.remove()
                    }
                    that.sideLayerBtn = $('<div class="sideRightBtn sideRightBtnOfLayer sideRightActive">图层管理<span class="iconfont icon-quxiao sideRightBtnClose" type="layer"></span></div>');
                    // that.sideRightBtnGroup.find(".sideRightBtnOfLayer").removeClass("none").addClass("sideRightActive");
                    that.sideRightBtnGroup.prepend(that.sideLayerBtn);
                    rightBtnFunOpenCb(that.layDom);
                    //关闭
                    that.sideLayerBtn.find(".sideRightBtnClose").click(function (ev) {
                        that.rightBtnCtrl({
                            close: function (closeCb) {
                                that.layDom.hide();
                                that.sideLayerBtn.remove();
                                closeCb(ev)
                            }
                        });
                    })
                },
                hide: function () {
                    //图层信息容器
                    that.layDom.hide();
                    that.sideLayerBtn.removeClass("sideRightActive");
                }
            });
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
        } else {
            that.rightBtnCtrl({
                close: function (closeCb) {
                    closeCb();
                    that.sideLayerBtn.remove();
                    that.layDom.hide();
                }
            });
            that.selectDom.click();
        }
        // that.layDom.toggle();
        that.GisService.setCursor({
            event: selectFun
        });

    });

    that.layDomId = "mapLayerZtree" + Math.ceil(Math.random() * 1000000);
    that.layDom = $(
        '<div class="dragBlock excludeHeight layerTreeOuter" style="display:none;width:330px;">\n' +
        '<div class="mapMsgWraper_header" style="">\n' +
        '<div class="header_list">\n' +
        '<div class="ele_search fl">图层管理</div>\n' +
        '</div>\n' +
        // '<div class="fr iconfont icon-biaoji fixedRight" style="cursor: pointer"></div>\n' +
        // '<div class="fr closeAction" style="cursor: pointer">X</div>\n' +
        '</div>\n' +
        '<div class="mapMsgWraperCon" style="">\n' +
        '<div class="ztree TreeOfLayer ztreeAAuto" id=' + that.layDomId + ' sda style="padding: 10px 10px 10px 16px;line-height:30px;height: 100%;box-sizing: border-box">\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>');
    $(this.mapcon).parent().parent().append(that.layDom);
    this.layerDrag = new this.drag(that.layDom[0], {acceptDrag: true}, that);

    // x 号关闭图层 目前没用
    that.layDom.find('.closeAction').click(function () {
        $(that.layDom).hide();
        $(that.selectDom).click();
    });

    //透明度滑进显示 滑出不显示 start
    //滑进
    that.layDom.on("mouseenter", ".outer", function (ele) {
        var $hoverDom = "";
        if ($(ele.target).hasClass("outer")) {
            $hoverDom = $(ele.target)
        } else {
            $hoverDom = $(ele.target).parents(".outer")
        }
        $hoverDom.find(".layerOpacityDiv").addClass("layerHover");
    });

    //划出
    that.layDom.on("mouseleave", ".outer", function (ele) {
        if ($(ele.target).hasClass("layui-slider-wrap") || $(ele.target).hasClass("layui-slider-wrap-btn")) {
            return
        }
        var $hoverDom = "";
        if ($(ele.target).hasClass("outer")) {
            $hoverDom = $(ele.target)
        } else {
            $hoverDom = $(ele.target).parents(".outer")
        }
        $hoverDom.find(".layerOpacityDiv").removeClass("layerHover");
    });
    //透明度滑进显示 滑出不显示 end
    // 初始化图层信息数据的注册监听
    this.initLayerMq();
    this.layerScroll = new that.zyScroll(that.layDom.find(".mapMsgWraperCon .ztree")[0]);
    that.layDom.find(".mapMsgWraperCon .ztree").on("mousewheel", function (e) {
        that.layerScroll.renderObj.resize()
    });
};

//属性
ToolBar.prototype.featureQuery = function (params) {
    var that = this;
    that.GisService = this.GisService;
    that.layers = this.layers;
    that.draws = {};
    var spatialQueryTool = new SpatialQueryTool(that.GisService, params);
    this.feaQueryDom = $('<div class="fl cx overflow">' +
        '<div class="fl">属性</div><div class="layui-icon layui-icon-triangle-d fr" style="color: #000"></div>' +
        '</div>');
    this.tool_con.append(this.feaQueryDom);

    var QueryWayDom = $(
        '<div style="display:none;position: absolute;z-index: 10;left:66px;text-align:center;\n' +
        'cursor: pointer;top: 42px;box-shadow: 0 0 3px 0 #b1b1b1;background-color: #fff;line-height: 18px">\n' +
        '<div class="queryWay" attr="Point"><span class="l-btn-icon icon-point">点击</span></div>\n' +
        '<div class="queryWay" attr="Rect"><span class="l-btn-icon icon-rect">矩形</span></div>\n' +
        '<div class="queryWay" attr="LineString"><span class="l-btn-icon icon-linestring">画线</span></div>\n' +
        '<div class="queryWay" attr="Polygon"><span class="l-btn-icon icon-polygon" style="padding-left: 32px">多边形</span></div>\n' +
        '</div>\n');
    $(this.mapcon).parent().append(QueryWayDom);

    that.feaQueryDom.click(function (e) {
        $('.cx').toggleClass('blue_class');
        if ($('.cx').hasClass('blue_class')) {
            $('.cx').addClass('blue_class').siblings().removeClass('blue_class');
            startDrawInteraction('Point');
        } else {
            that.GisService.setCursor();
            $(this.selectDom).click();
        }
    });

    that.feaQueryDom.find('div:last').on('click', function (e) {
        e.stopPropagation();
        QueryWayDom.slideDown("fast");
        $("body").bind("mousedown", onBodyDown);

        function hideMenu() {
            QueryWayDom.fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
        }

        function onBodyDown(event) {
            hideMenu();
        }
    });

    QueryWayDom.find('div').on('click', function (e) {
        $('.cx').addClass('blue_class').siblings().removeClass('blue_class');
        var drawType = $(this).attr('attr');
        startDrawInteraction(drawType);
        e.stopPropagation();
    });

    function startDrawInteraction(drawType) {
        that.GisService.setCursor({
            destory: function () {
                spatialQueryTool.clear();
                if (!$.isEmptyObject(that.draws)) {
                    that.GisService.getMap().removeInteraction(that.draws.draw)
                }
            }
        });
        var draw = spatialQueryTool.getDrawInteraction(drawType);
        that.draws["draw"] = draw;
        that.GisService.getMap().addInteraction(draw);
        draw.on('drawend', function (e) {
            drawEndDeal(e, drawType);
        });
    }

    function drawEndDeal(e, drawType) {
        spatialQueryTool.clear();
        var extent = e.feature.getGeometry().getExtent();
        var center = ol.extent.getCenter(extent);   //获取边界区域的中心位置
        var view = map.getView();
//			view.setCenter(center);  //设置当前地图的显示中心位置
        if (drawType == 'Rect' || drawType == 'Polygon') {
            view.fit(extent, map.getSize());
        }
        var coordinates;
        if (drawType == 'Point') {
            coordinates = e.feature.getGeometry().getCoordinates().join(",");
        } else if (drawType == 'LineString') {
            coordinates = e.feature.getGeometry().getCoordinates().join(" ");
        } else {
            coordinates = e.feature.getGeometry().getCoordinates()[0].join(" ");
        }
        var queryRequests = [];
        for (var key in that.layerTreeArrObj) {
            var item = that.layerTreeArrObj[key];
            if (item.select === true && !!item.layer) {
                queryRequests.push(item);
            }
        }
        queryRequests.forEach(function (queryRequest) {
            that.GisService.queryFeature({
                layer: queryRequest.layer,
                drawType: drawType,
                coordinates: coordinates
            }, function (res) {
                if (res.success) {
                    spatialQueryTool.dealSpatialQueryData({
                        queryRequest: queryRequest,
                        res: res.data,
                        center: center,
                        pixel: e.target.downPx_
                    });
                } else {
                    console.error(res.data);
                }
            });
        });
    }
};

//自定义滚动条
ToolBar.prototype.zyScroll = function (selector, setting, toolBar) {
    var that = this;
    this.zyScrollSetting = setting || {
        cursorcolor: "#e7e7e7", //滚动条的颜色
        cursoropacitymax: 0.9, //滚动条的透明度，从0-1
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 true滚动条拖动不可用
        cursorwidth: "5px", //滚动条的宽度  单位默认px
        cursorborder: "0", // 游标边框css定义
        cursorborderradius: "3px", //滚动条两头的圆角
        autohidemode: true, //是否隐藏滚动条  true的时候默认不显示滚动条，当鼠标经过的时候显示滚动条
        zindex: "auto", //给滚动条设置z-index值
        overflowy: 'false',
        railvalign: top, // 对齐水平轨道
        railvalign: 'defaul',
        railpadding: {
            top: 0,
            right: -6,
            left: 0,
            bottom: 0
        }, //滚动条的位置
    };
    this.renderObj = $(selector).niceScroll(that.zyScrollSetting)
};

//缓冲分析
ToolBar.prototype.bufferAnalysis = function () {
    var that = this;
    that.bufferAnalysisToolbarDom = $('<div class="fl jl">缓冲</div>');
    that.tool_con.append(this.bufferAnalysisToolbarDom);

    that.bufferAnalysisDom = $('<div  class="bufferAnalysisPanel dragBlock excludeHeight" style="display:none;min-width: 280px;width:auto;">\n' +
        '        <div class="mapMsgWraper_header">\n' +
        '            <div class="fl">缓冲分析</div>\n' +
        // '            <div class="fr closeAction" style="cursor: pointer">X</div>\n' +
        '        </div>\n' +
        '        <div class="mapMsgWraperCon">\n' +
        '        <div class="overflow" style="margin-top:6px;">\n' +
        '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">选择分析图层:</label>\n' +

        '            <div class="zTreeDemoBackground fl">\n' +
        '\t\t\t\t<ul class="list">\n' +
        '\t\t\t\t\t<li class="title">\n' +
        '<input class="layerup toolbar_inputofGroup" placeholder="请选择缓冲图层" style="width: 130px" type="text" readonly value=""/>\n' +
        '</li>\n' +
        '</ul>' +
        '\t\t\</div>' +

        //'<div class="zTreeDemoBackground fl" style="padding-left: 10px">' +
        //'<input style="cursor:pointer"  class="choiceBuffer" type="checkbox" />' +
        //'<label class="toolbar_labelofGroup" style="width: auto!important;">选择缓冲对象</label>\n' +
        //'</div>' +
        '   </div>' +
        '<div class="menuContent" style="display:none; position: absolute;">\n' +
        '<ul class="bufferAnalysis ztree" style="margin-top: 3px; width: auto;min-width: 200px; height: 300px; overflow: auto; box-shadow: 0 0 10px 0 #bdbcbc; border-radius: 4px; background: rgba(255,255,255,0.7);"></ul>' +
        '</div>' +
        '<div class="overflow" style="">' +
        '      <label class="fl toolbar_labelofGroup" style="width: auto!important;">选择缓冲对象:</label>' +
        '      <div class="zTreeDemoBackground fl">' +
        '         <input style="cursor:pointer;margin-top:6px;margin:8px 0 0 4px"  class="choiceBuffer" type="checkbox" />' +

        '      </div>' +

        '</div>' +


        '<div class="overflow" style="">' +
        '      <label class="fl toolbar_labelofGroup" style="width: auto!important;">导入缓冲对象:</label>' +
        '      <div class="zTreeDemoBackground fl">' +
        '           <input class="toolbar_inputofGroup importBufferName" style="width: 130px" type="text" readonly />\n' +

        '<input style="display: none" type="file" id="coordinatesFile">' +
        '      </div>' +
        '<div class="zTreeDemoBackground fl" style="width: auto!important;">' +
        '   <div class="importBufferDiv zyBtnNormal" style="">导入</div>' +
        '</div>' +
        '</div>' +
        '<div class="drawType overflow" style="">' +
        '   <label class="fl toolbar_labelofGroup" style="width: auto!important;">绘制缓冲对象:</label>' +
        '   <div class="zTreeDemoBackground fl">' +
        '   <ul class="list">' +
        '   <li class="title" style="line-height:30px;">' +
        '   <input name="bufferMode" class="bufferMode" type="radio" value="Point" style="width: 20px"/> 点缓冲' +
        '   <input name="bufferMode" class="bufferMode" type="radio" value="LineString" style="width: 20px"/> 线缓冲' +
        '   <input name="bufferMode" class="bufferMode" type="radio" value="Polygon" style="width: 20px"/> 面缓冲' +
        '   </li>' +
        '   </ul>' +
        '   </div>' +
        '</div>' +

        '<div class="overflow" style="">' +
        '   <label class="fl toolbar_labelofGroup" style="width: auto!important;display: inline-block;padding: 0 6px 0 35px;">缓冲半径:</label>' +
        '   <div class="zTreeDemoBackground fl">' +
        '   <ul class="list">' +
        '   <li class="title">' +
        '       <input class="toolbar_inputofGroup distance" style="width: 130px" type="text" value="0">米' +
        '   </li>' +
        '   </ul>' +
        '   </div>' +
        '</div>' +
        '<div class="bufferObjList">' +
        '<div class="overflow" style="">' +
        '   <label class="fl toolbar_labelofGroup" style="width: auto!important;">缓冲对象列表:</label>' +
        '</div>' +

        '<div class="overflow" style="padding: 0 10px;">' +
        '<table class="bufferTableMain" style="width: 100%;text-align: center;">' +
        '       <thead><tr>' +
        '           <th style="width: 10%">序号</th>' +
        '           <th style="width: 45%">面积平方米</th>' +
        '           <th style="width: 35%">操作</th>' +
        '        </tr> </thead> ' +
        '   <tbody class="bufferTable">' +
        '     </tbody>' +
        '</table>' +
        '</div>' +

        '<div class="overflow">' +
        ' <div class="fl analysis zyBtnNormal">开始分析</div>' +
        ' <div class="fl clearBuffer zyBtnNormal">清除缓冲</div>' +
        '</div>' +
        '</div>' +
        '<div class="analysisResult" style="max-width: 350px;overflow-x:hidden;overflow-y:auto;padding: 0 10px 10px;"></div>' +
        '</div>');
    $(that.mapcon).parent().parent().append(that.bufferAnalysisDom);
    this.drag(that.bufferAnalysisDom[0]);
    var bufferAnalysisScroll = new this.zyScroll(that.bufferAnalysisDom.find(".mapMsgWraperCon")[0]);
    this.bufferAnalysisDrag = new this.drag(that.bufferAnalysisDom[0], {acceptDrag: true}, that);

    //分析结果折叠效果
    $("body").click(".toggleAnalysisRes", function (e) {
        if (!$(e.target).hasClass("toggleAnalysisRes")) {
            return
        }
        if ($(e.target).hasClass("layui-icon-triangle-r")) {
            $(e.target).attr({
                "class": "toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px"
            });
            $(e.target).find(">div").show()
        } else {
            $(e.target).attr({
                "class": "toggleAnalysisRes layui-icon layui-icon-triangle-r indent10px"
            });
            $(e.target).find(">div").hide()
        }
        return false
    });

    var bufferAnalysisLayers = [];
    var $layerup = that.bufferAnalysisDom.find('.layerup');
    var $distance = that.bufferAnalysisDom.find('.distance');
    var $menuContent = that.bufferAnalysisDom.find('.menuContent');
    var $analysisResult = that.bufferAnalysisDom.find('.analysisResult');
    var analysisResult = [];
    var highLightLayer;
    var $bufferTable = that.bufferAnalysisDom.find('.bufferTable');
    var $choiceBuffer = that.bufferAnalysisDom.find('.choiceBuffer');
    var $coordinatesFile = that.bufferAnalysisDom.find('#coordinatesFile');
    var $importBufferDiv = that.bufferAnalysisDom.find('.importBufferDiv');
    var $importBufferName = that.bufferAnalysisDom.find('.importBufferName');

    var getHighLightLayer = function () {
        if (!highLightLayer || !that.GisService.getLayerObj(highLightLayer)) {
            highLightLayer = that.GisService.generateUUID();
            that.GisService.addTempLayer({
                layer: highLightLayer, vector: new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: []
                    }),
                    zIndex: 99999
                })
            });
        }
        return highLightLayer;
    };

    that.bufferAnalysisToolbarDom.click(function (e) {
        (function () {
            bufferAnalysisLayers = [];
            analysisResult = [];
            $layerup.val("");

            $layerup.unbind().click(function () {
                if (!this.layerNodes) {
                    this.layerNodes = JSON.parse(JSON.stringify(that.layers));
                }
                var layerList = JSON.parse(JSON.stringify(that.layers));
                layerList.forEach(function (layer) {
                    var mark = bufferAnalysisLayers.some(function (bufferLayer) {
                        return layer.layer == bufferLayer;
                    });
                    if (mark) {
                        layer.checked = true;
                        var pid = layer.pid;
                        var a = true;
                        while (a) {
                            for (var i in layerList) {
                                if (layerList[i].id == pid) {
                                    layerList[i].checked = true;
                                    pid = layerList[i].pid;
                                    a = true
                                    break;
                                } else {
                                    a = false;
                                }
                            }
                        }
                    }
                });
                new MyzzyyTree(that.bufferAnalysisDom.find('.bufferAnalysis.ztree'), layerList, true, function (flag, node) {
                    var str = $layerup.val();
                    if (flag) {
                        node.forEach(function (layer) {
                            str += layer.name;
                            //bufferAnalysisLayers.push(layer.layer);
                            bufferAnalysisLayers.push(layer);
                        })
                    } else {
                        node.forEach(function (layer) {
                            for (var i = bufferAnalysisLayers.length; i >= 0; i--) {
                                if (layer.layer == bufferAnalysisLayers[i].layer) {
                                    str = str.replace(layer.name, "");
                                    bufferAnalysisLayers.splice(i, 1);
                                }
                            }
                        })
                    }

                    $layerup.val(str);
                });
                var layerupPosition = $layerup.position();
                $menuContent.css({
                    zIndex: 10,
                    left: layerupPosition.left,
                    top: layerupPosition.top + $layerup.outerHeight()
                }).slideDown("fast");
                $menuContent.on("mousedown", function (e) {
                    return false;
                });
                $("body").bind("mousedown", onBodyDown);
            });

            $importBufferDiv.unbind().click(function () {
                $coordinatesFile.val("")
                $coordinatesFile.click()
            })

            var geometryArray = [];
            var bufferObject = [];
            $coordinatesFile.unbind().on('change', function (e) {
                var files = e.target.files;
                if (files != null && files.length > 0) {
                    gisService.fileResolve(files[0], function (infoList) {
                        $importBufferName.val(files[0].name);
                        infoList.forEach(function (info) {
                            var coordinate = info.coordinate;
                            var distance = Number($distance[0].value || 0);
                            that.bufferAnalysisDom.find('.clearBuffer').click();
                            var coordinateStr = that.GisService.coordinateCorrect(coordinate);
                            var coordinateArr = coordinateStr.split(" ");
                            var nGeoType;
                            if (coordinateArr.length == 1) {
                                nGeoType = "Point";
                            } else if (coordinateArr.length == 2) {
                                nGeoType = "LineString";
                            } else {
                                nGeoType = "Polygon";
                            }
                            var polygon = that.GisService.drawFeature({
                                layer: getHighLightLayer(), coordinate: coordinate, style: new ol.style.Style({
                                    fill: new ol.style.Fill({
                                        color: '#ffcc33'//'#1269d3'
                                    }),
                                    //边线颜色
                                    stroke: new ol.style.Stroke({
                                        color: '#ffcc33',//'#ff0000',
                                        width: 2
                                    }),
                                })
                            });
                            var layerObj = that.GisService.getLayerObj(getHighLightLayer());
                            var source = layerObj.getSource();
                            var feature = source.getFeatureById(polygon.getId());
                            coordinateStr = that.GisService.coordinateCorrect(that.GisService.coordinateCorrectArray(coordinate));
                            var drawGraphInfo = {
                                distance: distance,
                                nGeoType: nGeoType,
                                coordinate: coordinateStr,
                                layer: getHighLightLayer(),
                                feature: feature,
                                mappingId: polygon.getId()
                            };
                            if (!distance && drawGraphInfo.nGeoType != 'Polygon') {
                                //if (!distance){
                                bufferCallBack(null, drawGraphInfo);
                            } else {
                                that.GisService.Buffer(drawGraphInfo, bufferCallBack);
                            }
                        });
                    });
                }
            })

            $distance.unbind().on('change', function (e) {
                if (bufferObject.length <= 0) {
                    return;
                }
                $bufferTable.find('.buffer-detil').remove();
                var temp = [];
                bufferObject.forEach(function (item) {
                    temp.push(item);
                    var polygon = item.polygon;
                    var drawGraphInfo = item.drawGraphInfo;
                    if (polygon) {
                        that.GisService.removeFeature(getHighLightLayer(), polygon.getId());
                    }
                    drawGraphInfo.distance = Number($(e.target).val() || 0);
                    if (!drawGraphInfo.distance && drawGraphInfo.nGeoType != 'Polygon') {
                        bufferCallBack(null, drawGraphInfo);
                    } else {
                        that.GisService.Buffer(drawGraphInfo, bufferCallBack);
                    }
                });
                temp.forEach(function (item) {
                    bufferObject.splice(bufferObject.indexOf(item), 1);
                })
                geometryArray = [];
            });

            // 选择缓冲对象
            $choiceBuffer.unbind().click(function (e) {
                if ($(e.target).prop("checked") == true) {
                    clearBuffer();
                    $(".bufferMode:checked").attr("checked", false);
                    if (bufferAnalysisLayers.length > 1) {
                        that.GisService.layui.layer.msg("请选择单个分析图层！", {icon: 0});
                        $choiceBuffer.attr('checked', false);
                        return;
                    }
                    if (bufferAnalysisLayers.length <= 0) {
                        that.GisService.layui.layer.msg("请选择分析图层！", {icon: 0});
                        $choiceBuffer.attr('checked', false);
                        return;
                    }
                    that.GisService.drawGraphEnd(getHighLightLayer());
                    that.GisService.drawGraph(getHighLightLayer(), 'Point', function (res) {
                        //that.GisService.drawGraphEnd(highLightLayer);
                        clearBuffer();
                        that.GisService.queryFeature({
                            layer: bufferAnalysisLayers[0],
                            coordinates: res.coordinate.join(",")
                        }, function (data) {
                            if (data.success) {
                                if (data.data.length <= 0) {
                                    $choiceBuffer.attr('checked', false);
                                    that.GisService.layui.layer.msg("未查询到数据！", {icon: 0});
                                    return;
                                }
                                var distance = Number($distance[0].value || 0);
                                var data = data.data[0];
                                data.distance = distance;
                                data.layer = res.layer;
                                data.feature = res.feature;
                                data.coordinate = that.GisService.coordinateCorrect(data.coordinate);
                                var polygon = that.GisService.drawFeature({
                                    isShowCenter: false,
                                    layer: getHighLightLayer(), coordinate: data.coordinate, style: new ol.style.Style({
                                        stroke: new ol.style.Stroke({
                                            color: '#67b4ed',//'#ff0000',
                                            width: 2
                                        })
                                    })
                                });
                                var layerObj = that.GisService.getLayerObj(getHighLightLayer());
                                var source = layerObj.getSource();
                                var feature = source.getFeatureById(polygon.getId());
                                var drawGraphInfo = {
                                    distance: distance,
                                    nGeoType: 'Polygon',
                                    coordinate: data.coordinate,
                                    layer: getHighLightLayer(),
                                    feature: feature,
                                    mappingId: polygon.getId()
                                }

                                if (!distance && drawGraphInfo.nGeoType != 'Polygon') {
                                    bufferCallBack(null, drawGraphInfo);
                                } else {
                                    that.GisService.Buffer(drawGraphInfo, bufferCallBack);
                                }
                            }
                        })
                    });
                    e.stopPropagation();
                } else {
                    that.GisService.drawGraphEnd(getHighLightLayer());
                }
            });

            // 绘制缓冲对象
            that.bufferAnalysisDom.find('.drawType .bufferMode').unbind().click(function (e) {
                clearBuffer();
                $choiceBuffer.attr('checked', false);
                var mode = $(e.target).val();
                that.GisService.drawGraphEnd(getHighLightLayer());
                startDrawGraph(mode);
            })

            // 画出缓冲区
            function startDrawGraph(type) {
                that.GisService.drawGraph(getHighLightLayer(), type, function (res, evt) {
                    //that.GisService.drawGraphEnd(highLightLayer);
                    clearBuffer();
                    var distance = Number($distance[0].value || 0);
                    res.distance = distance;
                    res.nGeoType = type;
                    if (!distance && type != 'Polygon') {
                        bufferCallBack(null, res);
                    } else {
                        that.GisService.Buffer(res, bufferCallBack);
                    }
                });
            }

            // 获取缓冲区后画出来
            function bufferCallBack(result, drawGraphInfo) {
                $('.bufferObjList').show();
                var bufferInfo = null;
                var geometry = null;
                var polygon = null;
                if (!!result) {
                    if (result.success) {
                        bufferInfo = result['data'];
                        geometry = bufferInfo['geometry'];
                        polygon = that.GisService.drawFeature({
                            isShowCenter: false,
                            layer: getHighLightLayer(), coordinate: geometry, style: new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#00ffff',
                                    width: 2
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(0, 255, 0, 0.1)'
                                })
                            })
                        });
                    } else {
                        that.GisService.layui.layer.msg(result['data'], {icon: 0});
                        return;
                    }
                }
                var geometryTmp = {
                    geometry: (!!geometry ? geometry : drawGraphInfo.coordinate),
                    nGeoType: drawGraphInfo.nGeoType
                }
                geometryArray.push(geometryTmp);
                bufferObject.push({drawGraphInfo: drawGraphInfo, polygon: polygon});
                var $tr = $("<tr class='buffer-detil' style='cursor: pointer'></tr>");
                $tr.append("<td class='fixed' style='border: 1px solid #ccc;'>1</td> <td class='fixed' style='border: 1px solid #ccc;'>" + (!!bufferInfo ? (bufferInfo['area'] || '暂无面积') : 0) + "</td>" +
                    "<td style='border: 1px solid #ccc;'><a class='deleteBuffer' href='javascript:void(0)'>删除</a>&nbsp;&nbsp;<a class='exportCoordinate' href='javascript:void(0)'>导出坐标</a></td>");
                $bufferTable.append($tr);

                $tr.find('.fixed').unbind().click(function () {
                    var params = {
                        layer: getHighLightLayer(),
                        mappingId: (!!polygon ? polygon.getId() : drawGraphInfo.mappingId)
                    }
                    that.GisService.fixedPosition(params);
                    that.GisService.twinkle([params],5);


                    // that.GisService.setFeatureStyle({layer:highLightLayer,mappingId:polygon.getId()}, new ol.style.Style({
                    //     stroke: new ol.style.Stroke({
                    //         color: '#00ffff',//'#ff0000',
                    //         width: 2
                    //     })
                    // }));
                });
                $tr.find('.deleteBuffer').unbind().click(function () {
                    geometryArray.splice(geometryArray.indexOf(geometryTmp), 1);
                    bufferObject.splice(bufferObject.indexOf({drawGraphInfo: drawGraphInfo, polygon: polygon}), 1);
                    if (drawGraphInfo && drawGraphInfo.layer) {
                        var layerObj = that.GisService.getLayerObj(drawGraphInfo.layer)
                        if (layerObj) {
                            layerObj.getSource().removeFeature(drawGraphInfo.feature);
                        }
                    }
                    if (polygon) {
                        that.GisService.removeFeature(getHighLightLayer(), polygon.getId());
                        that.GisService.clearAllFeature();
                    }
                    $tr.remove();
                });

                $tr.find('.exportCoordinate').unbind().click(function (eve) {

                    //that.GisService.exportCoordinate(!!polygon ? polygon : drawGraphInfo.feature,'坐标.txt');

                    that.GisService.exportCoordinate(!!geometry ? geometry : drawGraphInfo.coordinate, '坐标.txt');
                })
            }

            // 清除缓冲
            that.bufferAnalysisDom.find('.clearBuffer').unbind().click(function (e) {
                clearBuffer();
                that.GisService.drawGraphEnd(getHighLightLayer());
                $(".bufferMode:checked").attr("checked", false);
                $choiceBuffer.attr('checked', false);
            });

            function clearBuffer() {
                analysisResult = [];
                $analysisResult.text("");
                geometryArray = [];
                bufferObject = [];
                $importBufferName.val("");
                that.GisService.clearAllFeature();
                //that.GisService.drawGraphEnd(highLightLayer);
                $bufferTable.find('.buffer-detil').remove();
            }

            that.bufferAnalysisDom.find('.analysis').unbind().click(function (e) {
                $analysisResult.html("");
                analysisResult = [];
                that.hightlightLand = {}
                if (bufferAnalysisLayers.length <= 0) {
                    that.GisService.layui.layer.msg("请选择分析图层！", {icon: 0});
                    return;
                }

                bufferAnalysisLayers = bufferAnalysisLayers.filter(function(item){
                    return item.type == 0  && !!item.analysisTopicTableName;
                });
                if (bufferAnalysisLayers.length == 0){
                    that.GisService.layui.layer.msg("请确认叠加分析是否配置！", {icon: 0});
                    return;
                }

                if (geometryArray.length <= 0) {
                    that.GisService.layui.layer.msg("请绘制缓冲对象！", {icon: 0});
                    return;
                }
                var maker = geometryArray.some(function (geometry) {
                    return geometry.nGeoType == 'Point' || geometry.nGeoType == 'LineString'
                })
                var distance = Number($distance[0].value || 0);
                if (maker && !distance) {
                    that.GisService.layui.layer.msg("请设置缓冲半径！", {icon: 0});
                    return;
                }
                var list = []
                bufferAnalysisLayers.forEach(function(item){
                    var maker = list.some(layer => layer.analysisTopicTableName ==  item.analysisTopicTableName);
                    if (!maker){
                        list.push(item);
                    }
                })

                var bufferCount = list.length;
                var loading = that.GisService.layui.layer.load(0);

                var twinkleParma = [];
                bufferObject.forEach(function(land){
                    twinkleParma.push({layer:getHighLightLayer(),mappingId:!!land.polygon ? land.polygon.getId() : land.drawGraphInfo.mappingId});
                })
                that.GisService.twinkle(twinkleParma,5);
                var count = 0;
                var errorInfo = [];
                list.forEach(function (layer){
                    var coordinate = geometryArray.map(function (land) {
                        return land.geometry;
                    }).join("#");
                    that.GisService.analysisClipCondition({
                        layer: layer,
                        coordinate: coordinate
                    }, function (result, analysisParams) {
                        count++;
                        if (result.basicInfoList && result.basicInfoList.length > 0){
                            result.tableName = !!analysisParams.layer.analysisName ? analysisParams.layer.analysisName : analysisParams.layer.name
                            analysisResult.push(result);
                        } else {
                            errorInfo.push(!!analysisParams.layer.analysisName ? analysisParams.layer.analysisName : analysisParams.layer.name);
                        }
                        if (bufferCount == count){
                            if (analysisResult.length > 0){
                                var $table = null;
                                var $table1 = null;
                                $analysisResult.empty();
                                analysisResult.filter(function (item) {
                                    return item.success && item.basicInfoList.length > 0;
                                }).forEach(function (singleRes) {
                                    //var layerObj = that.GisService.getLayer(singleRes.layer)
                                    $analysisResult.append(that.createAnalysisResDom(singleRes.basicInfoList,singleRes.tableName));
                                    $analysisResult.append("<div class='overflow'><div class='fl'>压占地块数:</div>"
                                        + singleRes.data.length + "块<div class='fr layui-icon layui-icon-down toggleHuanChong'></div></div>");
                                    $table1 = $("<table style='width: 100%;text-align: center;display:none'></table>");
                                    singleRes.data.forEach(function (feature, i) {
                                        feature.isShowCenter = false;
                                        that.GisService.drawFeature(feature);
                                        var $tr1 = $("<tr style='cursor: pointer' mappingId=" + feature.mappingId + "></tr>");
                                        $tr1.append("<td style='border: 1px solid #ccc;width: 45%'>" + (i + 1) + "</td><td style='border: 1px solid #ccc;width: 45%'>" + (that.GisService.getFeatureArea(feature).toFixed(2) || '暂无面积') + "</td>");
                                        $table1.append($tr1);
                                        $tr1.unbind().click(function () {
                                            var feature = singleRes.data[i];
                                            for (var kk in that.hightlightLand) {
                                                that.GisService.setFeatureStyle(that.hightlightLand[kk], that.GisService.getDefaultStyleSelector().upload());
                                            }
                                            that.GisService.fixedPosition(feature);
                                            that.GisService.setFeatureStyle(feature, new ol.style.Style({
                                                fill: new ol.style.Fill({
                                                    color: '#4C8BF4'//'#1269d3'
                                                })
                                            }));
                                            that.GisService.twinkle([{layer:feature.layer,mappingId:feature.mappingId}],5);
                                            that.hightlightLand[feature.mappingId] = feature;
                                        });
                                    });
                                    $analysisResult.append($table1);
                                });
                                $(".toggleHuanChong").click(function (e) {
                                    if (window.getComputedStyle($(e.currentTarget).parent().next()[0]).display === "table") {
                                        $(e.currentTarget).attr("class", "fr layui-icon layui-icon-down toggleHuanChong")
                                    } else {
                                        $(e.currentTarget).attr("class", "fr layui-icon layui-icon-up toggleHuanChong")
                                    }
                                    $(e.currentTarget).parent().next().toggle()
                                });
                            }
                            if (errorInfo.length != 0){
                                that.GisService.layui.layer.msg(errorInfo.join(",") + '分析失败!', {icon: 5});
                            }
                            that.GisService.layui.layer.close(loading);
                        }
                    })
                })
                // geometryArray.forEach(function (geometry) {
                //     bufferAnalysisLayers.forEach(function (layer, index) {
                //         that.GisService.analysisClipCondition({
                //             layer: layer,
                //             coordinate: geometry.geometry
                //         }, function (result, layerInfo) {
                //             result.layer = layerInfo.layer;
                //             analysisResult.push(result);
                //             // 结果展示
                //             if (analysisResult.length == bufferCount) {
                //
                //             }
                //         });
                //     });
                // })
            })

            function hideMenu() {
                $menuContent.fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                setTimeout(hideMenu);
            }
        })();
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            // that.bufferAnalysisDom.show();
            that.rightBtnCtrl({
                open: function (rightBtnFunOpenCb) {
                    //图层信息容器
                    if (that.sideBufferAnalysisBtn) {
                        that.sideBufferAnalysisBtn.remove()
                    }
                    that.bufferAnalysisDom.show();

                    that.sideBufferAnalysisBtn = $('<div class="sideRightBtn sideRightBtnOfBufferAnalysis sideRightActive">缓冲<span class="iconfont icon-quxiao sideRightBtnClose" type="bufferAnalysis"></span></div>');
                    that.sideRightBtnGroup.prepend(that.sideBufferAnalysisBtn);

                    // that.sideRightBtnGroup.find(".sideRightBtnOfbufferAnalysis").removeClass("none").addClass("sideRightActive");
                    rightBtnFunOpenCb(that.bufferAnalysisDom);
                    //关闭
                    that.sideBufferAnalysisBtn.find(".sideRightBtnClose").click(function (ev) {
                        that.rightBtnCtrl({
                            close: function (closeCb) {
                                that.bufferAnalysisDom.hide();
                                that.sideBufferAnalysisBtn.remove();
                                closeCb(ev)
                            }
                        });
                    })
                },
                hide: function () {
                    //图层信息容器
                    that.bufferAnalysisDom.hide();
                    that.sideRightBtnGroup.find(".sideRightBtnOfbufferAnalysis").removeClass("sideRightActive");
                }
            });
            that.GisService.setCursor({
                destory: function () {
                    that.bufferAnalysisDom.find('.clearBuffer').click();
                    that.GisService.removeLayer(getHighLightLayer());
                    that.GisService.drawGraphEnd(getHighLightLayer());
                    $(".bufferMode:checked").attr("checked", false);
                    $choiceBuffer.attr('checked', false);
                }
            });
        } else {
            that.rightBtnCtrl({
                close: function (closeCb) {
                    closeCb();
                    that.sideBufferAnalysisBtn.remove();
                    that.bufferAnalysisDom.hide();
                }
            });
            that.selectDom.click();
        }
    });

    that.bufferAnalysisDom.find('.closeAction').click(function () {
        $(that.selectDom).click();
    });
};

//缓冲分析 结果树结构 start
//生成缓冲分析结果
ToolBar.prototype.createAnalysisResDom = function (resData,tableName) {
    var that = this;
// // console.log(resData);
//     if (!resData || resData.length === 0) {
//         return
//     }
//
//     var $panelDiv = $("<div></div>");
//     resData = that.toTree(that.analysisDataFn(resData));
//     resData.forEach(function (ele) {
//         // console.log(ele);
//         $panelDiv = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d'></div>");
//         var $innerDom = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px'><span class='analysisTitle'>" + ele.name + ele.value + "</span></div>");
//         $panelDiv.append($innerDom);
//         if (ele.children) {
//             that.recursion(ele.children, $innerDom)
//         } else {
//             $panelDiv.find(".layui-icon").css({
//                 color: "transparent"
//             });
//         }
//     });
//     var returnDom = $panelDiv.html();
//     return returnDom
    // console.log(ele);


    if (!resData || resData.length === 0) {
        return
    }

    var $panelDivOuter = $("<div></div>");
    resData = that.toTree(that.analysisDataFn(resData));
    resData.forEach(function (ele) {
        // console.log(ele);
        var $panelDiv = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d'></div>");
        var $panelDiv = $("<div class=''></div>");
        var $innerDom = $(
            "<div class='indent10px "+
            (ele.children && ele.children.length > 0 ? "toggleAnalysisRes layui-icon layui-icon-triangle-d": '')
            +"' style=\""+
            (ele.children && ele.children.length > 0 ? '': 'padding-left: 30px')
            +"\">" +
            "<span class='analysisTitle'>" + ele.name + ele.value + "</span>" +
            "</div>"
        );
        $panelDiv.append($innerDom);
        if (ele.children) {
            that.recursion(ele.children, $innerDom)
        } else {
            $panelDiv.find(".layui-icon").css({
                // color: "transparent"
            });
        }
        $panelDivOuter.append($panelDiv)
    });

    var returnDom = "<div>"+tableName+"</div>" + $panelDivOuter.html();

    return returnDom
};
//将数据增加id pid 属性
ToolBar.prototype.analysisDataFn = function (tempData) {
    var that = this;
    tempData.map(function (ele, index, tempDataArr) {
        if (index === 0) {
            ele.pid = 0;
            ele.id = ele.name;
        } else {
            var count = index - 1;
            while (count > -1) {
                if (that.getBlank(tempDataArr[count].name) < that.getBlank(ele.name)) {
                    ele.id = ele.name;
                    ele.pid = tempDataArr[count]["id"];
                    return
                }
                if (count === 0) {
                    ele.id = ele.name;
                    ele.pid = 0;
                }
                count--;
            }
        }
        return ele
    });
    return tempData
};

//获取空格数量
ToolBar.prototype.getBlank = function (param) {
    var count = 0;
    while (true) {
        count++;
        var d = param.substr(1, count).trim();
        if (d !== '') {
            return count
        }
    }
};

//递归创建分析结构dom
ToolBar.prototype.recursion = function (childrenData, $innerDiv) {
    var that = this;
    childrenData.forEach(function (children_) {
        // console.log(children_);
        var $child = "";
        if (children_.children && children_.children.length > 0) {
            $child = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px'><span class='analysisTitle'>" + children_.name + children_.value + "</span></div>");
        } else {
            $child = $("<div class='indent10px'>" + children_.name + children_.value + "</div>");

        }
        $innerDiv.append($child);
        if (children_.children) {
            that.recursion(children_.children, $child)
        }
    })
}
//平行数据结构转换成嵌套数据结构
ToolBar.prototype.toTree = function (data) {
    var result = [];
    if (!Array.isArray(data)) {
        return result
    }
    data.forEach(item => {
        delete item.children;
    });
    var map = {};
    data.forEach(item => {
        map[item.id] = item;
    });
    data.forEach(item => {
        var parent = map[item.pid];
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
},
//缓冲分析 结果树结构 end
//卷帘
    ToolBar.prototype.rollingShutter = function () {
        var that = this;
        that.GisService = this.GisService;
        that.layers = this.layers;
        var upLayerName, downLayerName, mapEvent, layerEvent;
        that.rollingDom = $('<div class="fl jl">卷帘</div>');
        that.tool_con.append(this.rollingDom);

        that.rollingShutterDom = $('<div style="display:none;min-width: 280px;width:auto;position: absolute;z-index: 10;left: 252px;top: 50px; ">\n' +
            '        <div class="mapMsgWraper_header">\n' +
            '            <div class="fl">卷帘</div>\n' +
            '            <div class="fr closeAction" style="cursor: pointer">X</div>\n' +
            '        </div>\n' +
            '        <div style="background:rgba(255,255,255,.9);overflow: hidden">\n' +
            '        <div class="overflow" style="margin-top:10px;">\n' +
            '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">上层图层</label>\n' +
            '            <div class="zTreeDemoBackground fl">\n' +
            '\t\t\t\t<ul class="list">\n' +
            '\t\t\t\t\t<li class="title">\n' +
            '\t\t\t\t\t\t<input class="layerup toolbar_inputofGroup" type="text" readonly value=""/>\n' +
            '\t\t\t\t\t</li>\n' +
            '\t\t\t\t</ul>\n' +
            '\t\t\</div>' +
            '            </div>\n' +
            '        <div class="overflow" style="margin-top:10px;">\n' +
            '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">下层图层</label>\n' +
            '            <div class="zTreeDemoBackground fl">\n' +
            '\t\t\t\t<ul class="list">\n' +
            '\t\t\t\t\t<li class="title">\n' +
            '\t\t\t\t\t\t<input class="laydown toolbar_inputofGroup" type="text" readonly value="" />\n' +
            '\t\t\t\t\t</li>\n' +
            '\t\t\t\t</ul>\n' +
            '\t\t</div>' +
            '        </div>' +
            '       <div class="menuContent" style="display:none; position: absolute;">\n' +
            '\t\t\t<ul class="rollingShutter ztree" style="margin-top: 3px; width: auto;min-width: 200px; height: 300px; overflow: auto; box-shadow: 0 0 10px 0 #bdbcbc; border-radius: 4px; background: rgba(255,255,255,0.7);"></ul>\n' +
            '\t\t</div></n>' +
            '        <div >\n' +
            '            <div style="margin-left: 50px">\n' +
            '                <button class="layui-btn layui-btn-normal" style="height: 30px;line-height: 30px;margin: 10px;" >确定</button>\n' +
            '                <button class="layui-btn layui-btn-primary" style="height: 30px;line-height: 30px;margin: 10px;" >取消</button>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        </div>\n' +
            '    </div>');
        $(that.mapcon).parent().append(that.rollingShutterDom[0]);
        // this.drag(that.rollingShutterDom[0]);
        this.rollingShutterDrag = new this.drag(that.rollingShutterDom[0], {acceptDrag: true}, that);

        var rollingSelectedLayer = {};
        that.rollingDom.click(function (e) {
            (function () {
                var $menuContent = that.rollingShutterDom.find('.menuContent');

                that.rollingShutterDom.find('.layerup').click(function () {
                    if (!this.layerNodes) {
                        this.layerNodes = JSON.parse(JSON.stringify(that.layers));
                    }
                    var layerup = that.rollingShutterDom.find('.layerup');
                    var znodesLayers = that.zTreeObj_1.getNodes();
                    new MyzzyyTree(that.rollingShutterDom.find('.rollingShutter.ztree'), this.layerNodes, false, function (flag, node) {
                        if (!flag) {
                            rollingSelectedLayer["up"] = {};
                            layerup.attr("value", "").attr("title", "");
                            return;
                        }
                        if (node.length != 1) {
                            that.GisService.layui.layer.msg('请选择单个图层', {icon: 0});
                            layerup.attr("value", "").attr("title", "");
                            return;
                        }
                        rollingSelectedLayer["up"] = node[0];
                        layerup.attr("value", node[0].name).attr("title", node[0].name);
                    })
                    var layerupPosition = layerup.position();
                    $menuContent.css({
                        left: layerupPosition.left,
                        top: layerupPosition.top + layerup.outerHeight()
                    }).slideDown("fast");
                    $menuContent.on("mousedown", function (e) {
                        return false;
                    });
                    $("body").bind("mousedown", onBodyDown);
                });
                that.rollingShutterDom.find('.laydown').click(function () {
                    var laydown = that.rollingShutterDom.find('.laydown');
                    if (!this.layerNodes) {
                        this.layerNodes = JSON.parse(JSON.stringify(that.layers));
                    }
                    new MyzzyyTree(that.rollingShutterDom.find('.rollingShutter.ztree'), this.layerNodes, false, function (flag, node) {
                        if (!flag) {
                            rollingSelectedLayer["down"] = {};
                            laydown.attr("value", "").attr("title", "");
                            return;
                        }
                        if (node.length != 1) {
                            that.GisService.layui.layer.msg('请选择单个图层', {icon: 0});
                            laydown.attr("value", "").attr("title", "");
                            return;
                        }
                        rollingSelectedLayer["down"] = node;
                        laydown.attr("value", node[0].name).attr("title", node[0].name);
                    });
                    var laydownOffset = laydown.position();
                    $menuContent.css({
                        left: laydownOffset.left + "px",
                        top: laydownOffset.top + laydown.outerHeight() + "px"
                    }).slideDown("fast");
                    $menuContent.on("mousedown", function (e) {
                        return false;
                    });
                    $("body").bind("mousedown", onBodyDown);
                })

                function hideMenu() {
                    $menuContent.fadeOut("fast");
                    $("body").unbind("mousedown", onBodyDown);
                }

                function onBodyDown(event) {
                    setTimeout(hideMenu);
                }

            })();

            $(e.target).toggleClass('blue_class');
            if ($(e.target).hasClass('blue_class')) {
                $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
                that.rollingShutterDom.show();
                that.GisService.setCursor({
                    destory: function () {
                        that.rollingShutterDom.hide();
                        if (!!mapEvent) {
                            that.GisService.mapUnbundEvent(mapEvent);
                        }
                        if (!!layerEvent) {
                            that.GisService.layerUnbundEvent(upLayerName, layerEvent);
                        }
                        that.GisService.mapDragForbid(true);
                    }
                });
            } else {
                $(that.selectDom).click();
            }
        });

        that.rollingShutterDom.find('.closeAction').click(function () {
            $(that.selectDom).click();
        });
        that.rollingShutterDom.find('button:last-child').click(function () {
            $(that.selectDom).click();
        });
        that.rollingShutterDom.find('button:first-child').click(function () {
            if (!!mapEvent) {
                that.GisService.mapUnbundEvent(mapEvent);
            }
            if (!!layerEvent) {
                that.GisService.layerUnbundEvent(upLayerName, layerEvent);
            }
            upLayerName = rollingSelectedLayer.up.layer;
            downLayerName = rollingSelectedLayer.down && rollingSelectedLayer.down.layer;
            if (!upLayerName) {
                that.GisService.msg('上层图层为必选图层!');
                return;
            }
            that.GisService.rollingShutter(upLayerName, downLayerName, function (mapEve, layerEve) {
                mapEvent = mapEve;
                layerEvent = layerEve;
            });
        });
    };

// 复位
ToolBar.prototype.reSite = function () {
    var that = this;
    this.reSite = $('<div class="iconfont icon-shouye toolbarAction fw" title="复位" style="font-size: 14px;padding: 2px 0 0 1px;cursor: pointer"></div>');
    // this.tool_con.append(this.reSite);
    this.leftBottomWrap.append(this.reSite);
    this.reSite.click(function (e) {
        $(e.target).siblings().removeClass('blue_class');
        that.GisService.setCursor({
            event: that.GisService.reSiteFun()
        });
        $(that.selectDom).click();
    });
};

/**
 * 叠加分析
 * @param layer
 * @param callback
 */
ToolBar.prototype.analysisRequest = function (params) {
    var that = this;
    var layer = params.layer;
    var callback = params.callback;
    this.analysisDom = $('<div class="fl djfx">叠加</div>');
    this.tool_con.append(this.analysisDom);
    this.analysisDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.GisService.setCursor({
                destory: function () {
                    that.GisService.clear();
                    that.GisService.drawPolygonEnd(layer);
                }
            });
            that.GisService.drawPolygon(layer, function (info) {
                that.GisService.analysisClipCondition(info, function (data) {
                    callback && typeof callback == 'function' && callback(data);
                })
            });
        } else {
            $(that.selectDom).click();
        }
    });
};

// 测距
ToolBar.prototype.treasureLine = function () {
    var that = this;
    this.treasureLineDom = $('<div class="collapseMapDivCls_length treasure noneSplitBlock fl">测距</div>');
    this.tool_con.append(this.treasureLineDom);
    this.treasureLineDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.GisService.setCursor({
                destory: function () {
                    that.GisService.clearMehtodFun();
                }
            });
            that.GisService.treasureFun("LineString");
        } else {
            $(that.selectDom).click();
        }
    })
};

// 测面
ToolBar.prototype.treasureArea = function () {
    var that = this;
    this.treasureAreaDom = $('<div class="collapseMapDivCls_area noneSplitBlock treasure fl">测面</div>');
    this.tool_con.append(this.treasureAreaDom);
    this.treasureAreaDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.GisService.setCursor({
                destory: function () {
                    that.GisService.clearMehtodFun();
                }
            });
            that.GisService.treasureFun("Polygon");
        } else {
            $(that.selectDom).click();
        }
    })
};

// 清除
ToolBar.prototype.clear = function () {
    var that = this;
    this.treasureLineDom = $('<div class="collapseMapDivCls_clean fl">清除</div>');
    this.tool_con.append(this.treasureLineDom);
    this.treasureLineDom.click(function (e) {
        // that.toolbarPreMethodOption();
        // that.GisService.setCursor({
        //     event: that.obj.select
        // });
        // $(e.target).siblings().removeClass('blue_class');
        // $('.qx').addClass("blue_class");

        $(that.selectDom).click();

        that.GisService.clearFun();
        that.obj.clear.click && typeof that.obj.clear.click == 'function' && that.obj.clear.click();
    });
}

//搜索
ToolBar.prototype.searchFun = function (params) {
    var that = this;
    this.searchToolbarDom = $('<div class="fl searchImg">搜索</div>');
    this.tool_con.append(that.searchToolbarDom);

    that.business = params.business;
    that.layers = this.layers;
    that.GisService = this.GisService;
    var checkLandFun = params.checkLandFun;
    var unCheckLandFun = params.unCheckLandFun;
    var copyLandFun = params.copyLandFun;
    var placeholder = params.placeholder || "地块代码/坐落/图幅号";
    var queryType = params.queryType;

    this.searchDom = $('<div class="dragBlock excludeHeight" id="searchVmId" style="display: none;width: 330px">' +
        '<div class="mapMsgWraper_header">搜索</div>' +
        '<div class="mapMsgWraperCon"> \n' +
        '   <div style="overflow:hidden;padding:4px 4px 4px 4px;background: #fff"> \n' +
        '    <div style="float:left"> \n' +
        '     <input type="text" id="queryLandCode" @keydown.enter="queryLandBtn()" placeholder="' + '请输入搜索内容'/*placeholder*/ + '" v-model="searchText" autocomplete="off" class="layui-input queryInputCls" /> \n' +
        '    </div> \n' +
        '    <div style="text-align: center;float:left"> \n' +
        '     <button class="layui-icon layui-icon-close" id="clearSearchCon" v-on:click="clearSearchCon()" style="height:30px;line-height:30px;margin-left:0px;border:none;background:transparent;cursor:pointer;font-size:28px"></button> \n' +
        '    </div> \n' +
        '    <div style="height: 100%; display: none; overflow: auto;"></div> \n' +
        '    <div style="text-align: center;float:left"> \n' +
        '     <div class="layui-icon layui-icon-search  radius inline-block" id="queryLandBtn" v-on:click="queryLandBtn()" style="width:40px;height:30px;line-height:30px;margin-left:0px;background:#0b76fa;color:#fff;cursor:pointer;font-size:20px"></div> \n' +
        '    </div> \n' +
        '   </div> \n' +
        '   <div style="max-height: 310px;max-height: calc(100% - 60px);overflow: auto;background: rgba(255,255,255,.8);"> \n' +
        '<ul style="">' +
        '<li bbbb style="cursor: pointer;" v-show="poiInfoList.length>0">' +
        '   <div class="poiDiv" style="border-bottom:1px solid #ccc;line-height: 24px;padding: 6px">' +
        '        <div @click="toggleLayerGroup($event)" style="background: #f5f5f5;">兴趣点</div>' +
        '            <div v-for="(info,i) in poiInfoList" @click="poiFixPostion(info,i)" class="poiDiv searchResSingle" style="border-bottom:1px solid #ccc;line-height: 24px;padding: 6px">' +
        '                 <div class="overflow">\n' +
        '                  <div class="fl" style="font-weight:800">名称：</div>\n' +
        // '                  <div class="fl" style="width: 232px;">{{info["名称"]}}</div>\n' +
        '                  <div class="fl" style="width: 220px;">{{info.name}}</div>\n' +
        '                 </div> \n' +
        '                 <div class="overflow">\n' +
        '                  <div class="fl" style="font-weight:800">地址：</div>\n' +
        '                  <div class="fl" style="width: 224px;">{{info.address}}</div>\n' +
        // '                  <div class="fl" style="width: 232px;">{{info["地址"]}}</div>\n' +
        '                 </div> \n' +
        '            </div>' +
        '       </div>' +
        '   </div>' +
        '</li>' +
        '<li style="cursor: pointer;" v-show="layerSearchInfoList.length>0" v-for="(info,i) in layerSearchInfoList">' +
        '   <div class="poiDiv" v-show="info.queryRes.length > 0" style="border-bottom:1px solid #ccc;line-height: 24px;padding: 6px">' +
        '        <div @click="toggleLayerGroup($event)" style="background: #f5f5f5;">{{info.title}}</div>' +
        '        <div class="overflow searchResSingle" v-for="(value, key) in info.queryRes"  @click="poiFixPostion(value.initData,i)" style="border-top: 1px solid rgb(234, 234, 234); border-bottom: 1px solid rgb(234, 234, 234); padding-left: 10px; box-sizing: border-box;">\n' +
        '           <div class="overflow" v-for="(value1, key1) in value.resultData">' +
        '               <div class="fl layerSearchLabel">{{key1}}</div>' +
        '               <div class="fl layerSearchCon" :labelCon="key1">{{value1}}</div>\n' +
        '           </div> \n' +
        '       </div>' +
        '   </div>' +
        '</li>' +
        '</ul>' +
        '</div> \n' +
        '</div></div>');

    $(this.mapcon).parent().parent().append(that.searchDom);

    var searchVm = new Vue({
        el: "#searchVmId",
        data: {
            searchText: '',
            poiInfoList: [],
            layerSearchInfoList: []
        },
        methods: {
            //清除查询
            clearSearchCon: function () {
                this.searchText = "";
                this.poiInfoList = [];
                this.layerSearchInfoList = [];
                that.searchDom.find('div>input').val('').focus();
                that.GisService.highLightLayer.getSource().clear();
            },
            // 查询
            queryLandBtn: function () {
                if (this.searchText === "") {
                    that.GisService.layui.layer.msg('请输入查询内容', {icon: 5});
                    return;
                }
                this.layerSearchInfoList = []
                if (queryType === "poi") {
                    this.poiQuery()
                }
                this.layerQuery()
            },
            toggleLayerGroup: function (ev) {
                $(ev.target).siblings().toggle()
            },
            // 兴趣点搜索
            poiQuery: function () {
                var searchThis = this;
                var textArr = this.searchText.split(" ").map(function (text) {
                    return "name like '%" + text + "%'";
                });
                that.GisService.queryFeature({
                    query_where: textArr.join(" and "),
                    layer: poilayer
                }, function (res) {
                    console.log("poiQuery::", res);
                    if (!res.success) {
                        return
                    }
                    searchThis.poiInfoList = res.data
                })
            },
            // 拼接图层搜索sql
            createSql: function (propertySingle, index1) {
                var searchThis = this;
                var str = " ( ";
                searchThis.searchText.split(" ").forEach(function (ele, inde) {
                    str += (
                        (inde > 0 ? " and " : " ") +
                        propertySingle.name.split(",")[0] + " like '%" + ele + "%' "
                    )
                })
                str += " ) "
                return str;
            },
            //图层搜索
            layerQuery: function () {
                var searchThis = this;
                var layersFilter = that.layers.filter(function (item) {
                    item.layerNameTitle = item.nameBark
                    return item.layer && item.select === true;
                })
                // 发起 请求的次数
                var searchCount = 0;
                layersFilter.forEach(function (ele, index) {
                    if ("layerInfo:::", ele.properties) {
                        console.log(ele);
                        var queryWhere = "";
                        //为了sql or 的处理添加字段
                        var allowQueryNum = 0;
                        var resultKeyArr = [];
                        ele.properties.forEach(function (propertySingle, index1) {
                            if (propertySingle["allowQuery"]) {
                                queryWhere += (
                                    (allowQueryNum > 0 ? " or " : " ") +
                                    searchThis.createSql(propertySingle, index1)
                                )
                                allowQueryNum++;
                                resultKeyArr.push({
                                    name: propertySingle.field,
                                    title: propertySingle.title
                                })
                            }
                        })
                        var layerSearchInfoListTemp = [];
                        // searchCount++
                        if(!queryWhere){
                            return
                        }
                        that.GisService.queryFeature({
                            query_where: queryWhere,//"保护区编号 = '4101031000079'",
                            layer: ele.layer
                        }, function (res) {
                            console.log(21312312312);
                            // searchCount--;
                            console.log("layerQuery::", res);
                            if (!res.success) {
                                console.error(res.data);
                                return
                            }
                            var layerQueryEdited = res.data.map(function (el_) {
                                var element_ = {
                                    initData: el_,
                                    resultData: {}
                                };
                                resultKeyArr.forEach(function (al_) {
                                    element_.resultData[al_.title] = el_[al_.name];
                                })
                                return element_
                            })
                            layerSearchInfoListTemp.push({
                                title: ele.fullPathName,
                                queryRes: layerQueryEdited
                            })
                            console.log(searchCount);
                            // if (searchCount === 0) {
                                console.log("layerSearchInfoListTemp::", layerSearchInfoListTemp);
                                searchThis.layerSearchInfoList = searchThis.layerSearchInfoList.concat(layerSearchInfoListTemp)
                            // }
                        })
                    }
                })
                console.log("需要查询的图层", layersFilter);
            },
            //定位
            poiFixPostion: function (info, index) {
                var searchThis = this;
                if (this.prevLayerInfo) {
                    that.GisService.removeFeature(searchThis.prevLayerInfo)
                }
                var coordinate = info.coordinate;
                if (!!coordinate) {
                    if (info.coordinate[0].length < 3) {
                        that.GisService.personFixedPosition({
                            x: info.coordinate[0][0],
                            y: info.coordinate[0][1]
                        });
                    } else {
                        that.GisService.drawFeature(info)
                    }
                } else {
                    console.log("兴趣点坐标异常");
                }
                this.prevLayerInfo = info
            },
            getLayersByChecked: function () {
                return that.layers.filter(function (item) {
                    return item.select === true;
                });
            }
        },
        mounted: function () {
            that.searchDom = $("#searchVmId");
            that.searchDrag = new that.drag(document.querySelector("#searchVmId"), {acceptDrag: true}, that);
            $('#searchVmId').click(".searchResSingle", function (event) {
                $('.searchResSingle').removeClass("searchResSingleActive")
                var $lDom = ''
                if ($(event.target).hasClass("searchResSingle")) {
                    $lDom = $(event.target)
                } else {
                    $lDom = $(event.target).parents(".searchResSingle")
                }
                $lDom.addClass("searchResSingleActive")
            });
            that.searchToolbarDom.click(function (e) {
                // $(e.target).toggleClass('blue_class');
                if (that.searchDom.is(":hidden")) {
                    that.rightBtnCtrl({
                        open: function (rightBtnFunOpenCb) {
                            //图层信息容器
                            if (that.sideSearchBtn) {
                                that.sideSearchBtn.remove()
                            }
                            that.searchDom.show();
                            that.sideSearchBtn = $('<div class="sideRightBtn sideRightBtnOfSearch sideRightActive">搜索<span class="iconfont icon-quxiao sideRightBtnClose" type="search"></span></div>');
                            that.sideRightBtnGroup.prepend(that.sideSearchBtn);
                            rightBtnFunOpenCb(that.searchDom);
                            //关闭
                            that.sideSearchBtn.find(".sideRightBtnClose").click(function (ev) {
                                that.rightBtnCtrl({
                                    close: function (closeCb) {
                                        that.searchDom.hide();
                                        that.sideSearchBtn.remove();
                                        closeCb(ev)
                                    }
                                });
                            })
                        },
                        hide: function () {
                            //图层信息容器
                            that.searchDom.hide();
                            that.sideRightBtnGroup.find(".sideRightBtnOfSearch").removeClass("sideRightActive");
                        }
                    });
                    // $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
                } else {
                    that.rightBtnCtrl({
                        close: function (closeCb) {
                            closeCb();
                            that.sideSearchBtn.remove();
                            that.searchDom.hide();
                        }
                    });
                    that.selectDom.click();
                }
                // that.GisService.setCursor({
                //     event: that.obj.selectFun
                // });
            });
        }
    })
}
// 地图内功能模块给予拖动效果
window.zyDrag = ToolBar.prototype.drag = function (selector, param, toolBarInstance) {
    var that = this;
    this.param = param || {acceptDrag: true};
    if (Array.isArray(selector)) {
        selector.forEach(function (ele) {
            dragDomFun(ele)
        });
    } else {
        dragDomFun(selector)
    }

    function dragDomFun(singleSelector) {
        if ($(singleSelector).length !== 1) {
            return;
        }

        var out = null;
        if (typeof singleSelector === "object") {
            out = singleSelector;
        } else if (typeof singleSelector === "string") {
            document.querySelector(singleSelector)
        }
        $(out).parent().css({
            //不能放开否则地图伸缩会有问题
            // position: "relative"
        });
        out.onmousedown = function (ev) {
            if (that.param && !that.param.acceptDrag) {
                return
            }
            $(ev.target).parent().removeClass("layerHeightFull");

            if (!$(ev.target).hasClass('mapMsgWraper_header')) {
                return;
            }
            var Event = ev || window.event;
            var sb_bkx = Event.clientX - out.offsetLeft;
            var sb_bky = Event.clientY - out.offsetTop;
            document.onmousemove = function (ev) {
                // console.log(toolBarInstance);
                if (toolBarInstance) {
                    $(toolBarInstance.mapcon).parent().css({
                        left: 0,
                        width: "100%",
                        // right: $(conDom).width()
                    });
                    try {
                        toolBarInstance.GisService.getMap().updateSize();
                    } catch (e) {
                        console.error(e)
                    }
                }
                var Event = ev || window.event;
                var endx = Event.clientX - sb_bkx;
                var endy = Event.clientY - sb_bky;
                var wwx = $(out).parent().clientWidth;
                var wwy = $(out).parent().clientHeight;
                if (endx <= 0) {
                    endx = 0;
                } else if (endx >= wwx - out.offsetWidth) {
                    endx = wwx - out.offsetWidth;
                }
                if (endy <= 0) {
                    endy = 0;
                } else if (endy >= wwy - out.offsetHeight) {
                    endy = wwy - out.offsetHeight;
                }
                out.style.left = endx + 'px';
                out.style.right = "auto";
                out.style.top = endy + 'px';
                document.onmouseup = function () {
                    document.onmousemove = null;
                }
            }
        }
    }
};
