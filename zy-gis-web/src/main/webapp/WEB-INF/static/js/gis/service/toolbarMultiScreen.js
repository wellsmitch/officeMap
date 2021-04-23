/**
 * 工具条 对象
 * @param GisService
 * @param obj
 * @constructor
 */
function ToolbarMultiScreen(GisService, obj) {
    // 获取最外层容器
    var that = this;
    this.mapcon = GisService[0].mapCondiv;
    // this.GisService = GisService;
    this.GisService = GisService;
    this.GisServiceList=GisService;
    this.layers = obj.layersFun;//business.layers,
    this.obj = obj;
    this.InIt(this.mapcon);
    // this.GisService.clearMehtodFun();
    // this.selectFun(obj.select);
    obj && obj.select ? this.selectFun(obj.select) : null;
    obj && obj.ZoomIn ? this.ZoomIn() : null;
    obj && obj.ZoomOut ? this.ZoomOut() : null;
    // obj && obj.layersFun ? this.layersFun(obj.select) : null;
    obj && obj.featureQuery ? this.featureQuery(obj.featureQuery) : null;
    obj && obj.reSite ? this.reSite() : null;
    obj && obj.treasureLine ? this.treasureLine() : null;
    obj && obj.treasureArea ? this.treasureArea() : null;
    // obj && obj.rollingShutter ? this.rollingShutter() : null;
    obj && obj.clear ? this.clear(obj.clear) : null;
    // obj && obj.search ? this.searchFun(obj.search) : null;
    // obj && obj.multiScreen ? this.multiScreen(this.mapcon) : null;
    // this.drag([that.tcCon, '#rollingShutter']);
    // this.maxScreen(this.mapcon)

    // 增加关闭分屏按钮
    this.multiscreenClose();
}


// 选择
ToolbarMultiScreen.prototype.selectFun = function (callback) {
    var that = this;
    this.selectDom = $('<div class="fl qx blue_class" ref="initialDom" @click="toolInit($event)">选择</div>');
    this.tool_con.append(this.selectDom);
    that.GisService.forEach(function (ele) {
        ele.setCursor({
            cursorImage: basePath + '/static/image/rmenu1.gif',
            event: callback
        });
    })

    $(this.selectDom).click(function (e) {
        // 清除划线测量
        // that.toolbarPreMethodOption();
        $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
        // that.destroyZoom();
        that.GisService.forEach(function (ele) {
            ele.setCursor({
                cursorImage: basePath + '/static/image/rmenu1.gif',
                event: callback
            });
        })
    });
};

// 放大
ToolbarMultiScreen.prototype.ZoomIn = function () {
    var that = this;
    this.ZoomInDom = $('<div class="fl fd">放大</div>');
    this.tool_con.append(this.ZoomInDom);

    this.ZoomInDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.dragZoomIn.setActive(true);
            that.GisService.forEach(function (gisService) {
                gisService.setCursor({
                    cursorImage: basePath + '/static/image/rmenu1.gif',
                    event: gisService.zoomInFun,
                    destory: function () {
                        that.dragZoomIn.setActive(false);
                    }
                });
                gisService.getMap().addInteraction(that.dragZoomIn);
            })
        } else {
            $(that.allCleanDom).click();
        }
    })
};

// 缩小
ToolbarMultiScreen.prototype.ZoomOut = function () {
    var that = this;
    this.ZoomOutDom = $('<div class="fl sx">缩小</div>');
    this.tool_con.append(this.ZoomOutDom);
    this.ZoomOutDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.dragZoomOut.setActive(true);
            that.GisService.forEach(function (gisService) {
                gisService.setCursor({
                    cursorImage: basePath + '/static/image/rmenu2.gif',
                    event: that.GisService.zoomOutFun,
                    destory: function () {
                        that.dragZoomOut.setActive(false);
                    }
                });
                gisService.getMap().addInteraction(that.dragZoomOut);
            })
        } else {
            $(that.allCleanDom).click();
        }
    })
};

// 关闭/展开 工具条
ToolbarMultiScreen.prototype.toolBarClose = function () {
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
ToolbarMultiScreen.prototype.destroyZoom = function () {
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


ToolbarMultiScreen.prototype.InIt = function (mapcon) {
    this.layerTreeArr = [];
    this.layerTreeArrObj = {};
    var that = this;
    this.toolWrap = $('<div class="ToolbarMultiScreen"></div>');
    this.tool_con = $('<div class="tool_con fl" style="width:auto;overflow:hidden;padding:4px 0 0 6px;height: 34px;background:#fff"></div>');
    this.toolWrap.append(this.tool_con);
    $(".multiScreen").prepend(this.toolWrap);
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
};

// 全屏
ToolbarMultiScreen.prototype.maxScreen = function (mapcon) {
    var that = this;
    this.maxScreen = $('<div class="collapseMapDivCls maxScreen fl">全屏</div>');
    this.tool_con.append(this.maxScreen);
    this.toolWrap.append(this.tool_con);
    this.toolBarClose();
    $(mapcon).parent().append(this.toolWrap);
    $(this.maxScreen).click(function (e) {
        var mapContainer = $(that.GisService.getMap().viewport_);
        mapContainer.find('.ol-full-screen button').click();
    });
};

//////////////////////////订阅start
// ToolbarMultiScreen 注册监听对象 初始化
ToolbarMultiScreen.prototype.initLayerMq = function () {
    var that = this;
    // console.log(this.layers);
    this.layers.map(function (ele) {
        ele.nameBark = ele.name;
        that.layerTreeArr.unshift(ele);
        that.layerTreeArrObj[ele.id] = ele;

        if (ele.type == 0 && ele.layer) {
            that.GisService.addLayer(ele);
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

            if (Array.isArray(info.layerInfoList)) {
                var nodes_ = that.initLayerTreeObj.getNodesByParam("id", info.pid, null);
                if (nodes_.length > 1) {
                    console.error("树节点id不唯一")
                }
                that.layerTreeArrObj[info.id] = info;
                that.initLayerTreeObj.addNodes(nodes_.length > 0 ? nodes_[0] : null, info);
                that.showControl($("div[singledomid=\'" + info.id + "\']"), info);
                that.layerSearchControl($("div[singledomid=" + info.id + "]"), info);

                info.layerInfoList.map(function (ele) {
                    ele.pid = info.id;
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
                    var nodes = that.initLayerTreeObj.getNodesByParam("id", ele.pid, null);
                    if (nodes.length > 1) {
                        console.error("树节点id不唯一")
                    }
                    that.initLayerTreeObj.addNodes(nodes.length > 0 ? nodes[0] : null, ele);
                    that.opacityFun($("div[singledomid=" + ele.id + "]"), ele);
                    that.showControl($("div[singledomid=\'" + ele.id + "\']"), ele);
                    that.layerSearchControl($("div[singledomid=" + ele.id + "]"), ele);
                })
            } else {
                that.layerTreeArrObj[info.id] = info;
                var nodes = that.initLayerTreeObj.getNodesByParam("id", info.pid, null);
                if (nodes.length > 1) {
                    console.error("树节点id不唯一")
                }
                that.initLayerTreeObj.addNodes(nodes.length > 0 ? nodes[0] : null, info);
                that.opacityFun($("div[singledomid=" + info.id + "]"), info);
                that.showControl($("div[singledomid=\'" + info.id + "\']"), info);
                that.layerSearchControl($("div[singledomid=" + info.id + "]"), info);
            }
        },
        //删除 gis web
        remove: function (info, index) {
            // console.log("remove::::", info);
            that.GisService.removeLayer(info);
            delete that.layerTreeArrObj[info.id];
            var nodes = that.initLayerTreeObj.getNodesByParam("name", info.name, null);
            that.initLayerTreeObj.removeNode(nodes[0]);

            //处理专题配置删除逻辑
            if (Array.isArray(info.layerInfoList)) {
                info.layerInfoList.map(function (ele) {
                    that.GisService.removeLayer(ele);
                    delete that.layerTreeArrObj[ele.id];
                    var nodes = that.initLayerTreeObj.getNodesByParam("name", info.name, null);
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

ToolbarMultiScreen.prototype.createLayerTreeNameDom = function (ele, i, arrs) {

    if (ele.select === undefined) {
        ele.select = false
    }
    // console.log(ele.type,ele.nameBark);
    // 处理初始化时候是否显示图层 show 字段为undefined的情况
    var eyeOpen;
    if (ele.show === undefined) {
        ele.show = true;
        ele.opacity = 100;
        eyeOpen = true;
    } else {
        eyeOpen = ele.show;
        if (!ele.show) {
            ele.opacity = 0;
        }
    }
    var isFolder = ele.type === 1 || Array.isArray(ele.layerInfoList);
    var singleDom = '<div class="outer" title=' + ele.nameBark + '  singleDomPid=' + ele.pid + ' singleDomId=' + ele.id + ' LAYER=' + ele.layer + ' style="display: inline-block;width: 190px">' +
        '<div style="line-height: 1;cursor: move;' + (isFolder ? "float: left" : "") + '">' + ele.nameBark + '</div>' +

        '<input class="showLayer" style="display: none" layerIsShow type="checkbox"' + (ele.show ? 'checked' : '') + '>' +
        '<div class="layer stopEvent overflow" style="/*height: 30px;*/' + (ele.type === 1 ? "float: left;padding-left: 10px" : "") + '">' +

        // 拖拽条
        (isFolder ? "" : '<div class=\"fl slider' + ele.id + '\" style="width:130px;margin: 14px 14px 5px 0;" class="demo-slider"></div>')
        +

        // 眼控制
        '<div singleeyedomid=' + ele.id + ' style="line-height: 20px;cursor: pointer;margin-top: 6px;' + (ele.type === 1 ? "margin-top:0" : "") + '" title=' + (eyeOpen ? "可见" : "不可见") + ' class="fl eye iconfont ' +
        (ele.show ? 'icon-xianshi toolBarEyeOpen' : 'icon-buxianshi toolBarEyeClose')
        + '"></div>' +

        (ele.select != undefined ?
            (
                '<div class="fl" style="padding-left: 8px">' +
                '<input class="showLayer" style="display: none" selectIsOk type="checkbox"' + (ele.show ? 'checked' : '') + '>' +

                '<div singleselectdomid=' + ele.id + ' style="line-height: 12px;cursor: pointer;margin-top: 8px' + (ele.type === 1 ? "margin-top:0" : "") + ';color: #fff;font-size: 12px;padding: 2px;border-radius: 2px" title=' +
                (ele.select ? '可查' : '不可查')
                + ' class="fl selectIcon layui-icon ' +
                (ele.select ? 'layui-icon-ok selectIconOpen' : 'layui-icon-ok selectIconClose')
                + '"></div>' +

                '<div class="isSearch fr" style="display:none;cursor:pointer;padding-left:6px;color: ' + (ele.select != undefined ? (ele.select ? "#03679e" : "#dc5638") : '') + '">' + (ele.select != undefined ? (ele.select ? "可查" : "不可查") : '') + '</div>' +
                '</div>'
            )
            : '') +

        '</div>' +
        '</div>';
    return singleDom;
};

ToolbarMultiScreen.prototype.initLayerTree = function (addMapLayerInfo, zNodes) {
    var that = this;
    $.fn.zTree.destroy($(that.layDom).find(".TreeOfLayer")[0]);//ztree
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
    this.zTreeObj_1 = $.fn.zTree.init(that.layDom.find(".TreeOfLayer"), setting, zNodes);
    //处理
    that.layDom.find(".TreeOfLayer").on("mousedown", ".stopEvent", function () {
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


ToolbarMultiScreen.prototype.addMapLayerDom = function (addMapLayerInfo) {
    var that = this;
    addMapLayerInfoArr = [];
    if (!(addMapLayerInfo instanceof Array)) {
        addMapLayerInfoArr[0] = addMapLayerInfo
    } else {
        addMapLayerInfoArr = addMapLayerInfo
    }
    this.layerData1 = addMapLayerInfoArr[0];
    addMapLayerInfoArr.map(function (ele, i, arrs) {
        if (arrs.length <= 2) {
            that.layDom.css({height: '46%'})
        }
        (function (ele) {
            if (ele.select === undefined) {
                ele.select = false
            }

            // 处理初始化时候是否显示图层 show 字段为undefined的情况
            var eyeOpen;
            if (ele.show === undefined) {
                ele.show = true;
                ele.opacity = 100;
                eyeOpen = true;
            } else {
                eyeOpen = ele.show;
                if (!ele.show) {
                    ele.opacity = 0;
                }
            }


            var showParam = 100;

            var li = $('<div LAYER=' + ele.layer + ' style="margin-bottom: 6px">' +
                '<div style="line-height: 1">' + ele.name + '</div>' +

                '<input class="showLayer" style="display: none" layerIsShow type="checkbox"' + (ele.show ? 'checked' : '') + ' layerInfo=' + JSON.stringify(ele) + '>' +
                '<div class="layer" style="height: 30px;">' +


                // 拖拽条
                '<div class="slider fl" id=slider_' + ' style="width:130px;margin: 14px 14px 5px 0px;" class="demo-slider"></div>' +

                // 眼控制
                '<div style="line-height: 20px;cursor: pointer;margin-top: 6px" title=' + (eyeOpen ? "可见" : "不可见") + ' class="fl eye iconfont ' +
                (ele.show ? 'icon-xianshi toolBarEyeOpen' : 'icon-buxianshi toolBarEyeClose')
                + '"></div>' +

                (ele.select != undefined ?
                    (
                        '<div class="fl" style="padding-left: 8px">' +
                        '<input class="showLayer" style="display: none" selectIsOk type="checkbox"' + (ele.show ? 'checked' : '') + ' layerInfo=' + JSON.stringify(ele) + '>' +

                        '<div style="line-height: 12px;cursor: pointer;margin-top: 8px;color: #fff;font-size: 12px;padding: 2px;border-radius: 2px" title=' +
                        (ele.select ? '可查' : '不可查')
                        + ' class="fl selectIcon layui-icon ' +
                        (ele.select ? 'layui-icon-ok selectIconOpen' : 'layui-icon-ok selectIconClose')
                        + '"></div>' +

                        '<div class="isSearch fr" style="display:none;cursor:pointer;padding-left:6px;color: ' + (ele.select != undefined ? (ele.select ? "#03679e" : "#dc5638") : '') + '">' + (ele.select != undefined ? (ele.select ? "可查" : "不可查") : '') + '</div>' +
                        '</div>'
                    )
                    : '') +

                '</div>' +
                '</div>');
            that.layDom.find('ul').prepend(li);
            // for (var key in ele) {
            //     if (key == 'layer') {
            //         continue;
            //     }
            //     ele.layer[key] = ele[key];
            // }
            // 加载图层
            // var resultLayer =
            that.GisService.addLayer(ele);

            li.find('input[type="checkbox"].showLayer').click(function () {
                // 这段走的是以前  图层列表数据前面勾选复选框的逻辑
                that.GisService.setLayerOpacity(ele, $(this).prop("checked"));
            });

            /*
            *
            * click --> arr 操作func()
            *
            * */

            // 点击眼
            li.find('.eye').dblclick(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false
            });
            li.dblclick(function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false
            });

            li.find('.eye').click(function (e) {
                var self = this;
                var checkStatus = $(this).parent().prev().prop("checked");
                that.layerShowAndHide(li, self, ele, checkStatus);
                e.preventDefault();
            });
            // 点击控制是否可以查询
            $(li).find('.selectIcon').click(function () {
                var slef1 = this;
                that.layerMsgSelectControl(slef1, ele);
            });

            // ele.show ? ele.opacity * 100 : 0
            // 控制透明度
            that.opacityFun(li, ele);
        }(ele))
    });
};

// 点击眼 控制图层是否可查询
ToolbarMultiScreen.prototype.layerMsgSelectControl = function (slef1, LayerSingleData) {
    if ($(slef1).hasClass('selectIconOpen')) {
        $(slef1)
            .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconClose')
            .css({padding: 1})
            // .next()
            // .html("不可查")
            .attr('title', '不可查');
        // .css({
        //     color: '#dc5638'
        // });
        LayerSingleData.select = false
    } else {
        $(slef1)
            .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconOpen')
            .css({padding: 2})
            // .next()
            // .html("可查")
            .attr('title', "可查");
        // .css({
        //     color: '#03679e'
        // });
        LayerSingleData.select = true
    }
};
// 点击眼 控制图层是否显示
ToolbarMultiScreen.prototype.layerShowAndHide = function (li, clickObj, Layer_, checkStatus) {
    var that = this;
    // var checkStatus = $(clickObj).parent().prev().prop("checked");
    $(clickObj).parent().prev().prop("checked", !checkStatus);

    var newCheckStatus = $(clickObj).parent().prev().prop("checked");
    if (Layer_.layer != undefined) {
        that.GisService.setLayerVisible(Layer_, newCheckStatus);
    }

    //opacityFun(newCheckStatus ? 100 : 0);
    if (newCheckStatus) {
        $(clickObj).attr('class', 'fl eye iconfont icon-xianshi toolBarEyeOpen').attr('title', "可见");
        Layer_.show = true
    } else {
        $(clickObj).attr('class', 'fl eye iconfont icon-buxianshi toolBarEyeClose').attr('title', "不可见");
        if ($(li).find('.isSearch').html() != '') {
            $(li).find('.selectIcon')
                .attr('class', 'fl selectIcon layui-icon layui-icon-ok selectIconClose')
                .css({padding: 1})
                // .next()
                // .html("不可查")
                .attr('title', "不可查");
            // .css({
            //     color: '#dc5638'
            // });
            Layer_.show = false;
            Layer_.select = false
        }
    }
};

// 控制图层透明度方法
ToolbarMultiScreen.prototype.opacityFun = function (li, Layer_) {
    var that = this;
    // console.log(li.find(".slider" + Layer_.id)[0]);
    that.GisService.setLayerOpacity(Layer_, Layer_.opacity);
    this.GisService.layui.slider.render({
        elem: li.find(".slider" + Layer_.id)[0]
        , value: (Layer_.opacity !== undefined ? Layer_.opacity * 100 : 100)
        , theme: '#0A81C3' //主题色
        , min: 0
        , max: 100
        , setTips: function (value) {//自定义提示文本
            return value;
        }, change: function (value) {
            that.GisService.setLayerVisible(Layer_, !(value / 100 === 0));

            $(li).find("input[layerIsShow]").prop("checked", value / 100 > 0);
            if (value / 100 > 0) {
                $(li).find(".eye").attr('class', 'fl eye iconfont icon-xianshi toolBarEyeOpen').attr('title', "可见");
                Layer_.show = true;
            } else {
                $(li).find(".eye").attr('class', 'fl eye iconfont icon-buxianshi toolBarEyeClose').attr('title', "不可见");
                Layer_.show = false;
                Layer_.select = false
            }
            // console.log(Layer_);
            that.GisService.setLayerOpacity(Layer_, value / 100);
        }
    });

};

// 控制图层是否显示
ToolbarMultiScreen.prototype.showControl = function (li, ele) {
    var that = this;
    this.GisService.setLayerVisible(ele, ele.show === undefined ? true : ele.show);
    li.find('.eye').unbind("click").click(function (e) {
        var self = this;
        var checkStatus = $(this).parent().prev().prop("checked");
        that.layerShowAndHide(li, self, ele, checkStatus);

        var eyeLis = li.find('.eye').parent().parent().parent().parent().next().find('.eye');

        $.each(eyeLis, function (i, domli) {
            var self = this;
            that.layerShowAndHide(domli, self, that.layerTreeArrObj[$(domli).eq(0).attr("singleeyedomid")], checkStatus);
            e.preventDefault();
        });
        e.preventDefault();
    });

};

// 控制图层是否可查
ToolbarMultiScreen.prototype.layerSearchControl = function (li, ele) {
    var that = this;
    $(li).find('.selectIcon').unbind("click").click(function (e) {
        var slef1 = this;
        that.layerMsgSelectControl(slef1, ele);
        var selectLis = li.find('.selectIcon').parent().parent().parent().parent().parent().next().find('.selectIcon');
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

ToolbarMultiScreen.prototype.layersFun = function (selectFun) {
    var that = this;


    this.layerDom = $('<div class="fl tc">图层</div>');
    this.tool_con.append(that.layerDom);
    this.layerDom.click(function (e) {
        // that.QueryWayDom.hide();
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(that.layDom).hide();
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
        } else {
            $(that.layDom).show();
            $('.qx').addClass('blue_class');
        }
        that.layDom.toggle();
        that.GisService.setCursor({
            event: selectFun
        });

    });

    that.layDom = $(
        '<div style="display:none;min-width:240px;position: absolute;z-index: 10;left: 6px;top: 50px;height:46%;background: transparent;">\n' +
        '<div class="mapMsgWraper_header" style="background:#0A81C3;color:#fff;overflow:hidden;line-height:36px;padding: 0 16px">\n' +
        '<div class="header_list">\n' +
        '<div class="ele_search fl">图层管理</div>\n' +
        '</div>\n' +
        '<div class="fr closeAction" style="cursor: pointer">X</div>\n' +
        '</div>\n' +
        '<div class="mapMsgWraperCon" style="background:rgba(255,255,255,.9);height: calc(100% - 36px);overflow: auto">\n' +
        '<div class="ztree TreeOfLayer ztreeAAuto" sda style="padding: 10px 10px 10px 16px;line-height:30px;height: 100%;box-sizing: border-box">\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>');
    $(this.mapcon).parent().append(that.layDom);
    that.layDom.find('.closeAction').click(function () {
        $(that.layDom).hide();
        $(that.selectDom).click();
    });
    // this.addMapLayerDom(this.layers);
    // console.log(that.layers);
    // 初始化图层信息数据的注册监听
    this.initLayerMq();
    // that.initLayerTree("", that.layers);
};

//属性
ToolbarMultiScreen.prototype.featureQuery = function (params) {
    var me = this;
    me.GisService = this.GisService;
    me.layers = this.layers;
    var spatialQueryTools = [];
    me.GisService.forEach(function (gisService) {
        spatialQueryTools.push(new SpatialQueryTool(gisService, params));
    });

    var feaQueryDomMult = $('<div class="fl cx overflow">' +
        '<div class="fl shuxing">属性</div><div class="layui-icon layui-icon-triangle-d fr" style="color: #000"></div>' +
        '</div>');
    this.tool_con.append(feaQueryDomMult);

    var QueryWayDom = $(
        '<div style="display:none;position: absolute;z-index: 10;left:139px;text-align:center;\n' +
        'cursor: pointer;top: 42px;box-shadow: 0 0 3px 0 #b1b1b1;background-color: #fff;line-height: 18px">\n' +
        '<div class="queryWay" attr="Point"><span class="l-btn-icon icon-point">点击</span></div>\n' +
        '<div class="queryWay" attr="Rect"><span class="l-btn-icon icon-rect">矩形</span></div>\n' +
        '<div class="queryWay" attr="LineString"><span class="l-btn-icon icon-linestring">画线</span></div>\n' +
        '<div class="queryWay" attr="Polygon"><span class="l-btn-icon icon-polygon" <!--style="padding-left: 32px"-->>多边形</span></div>\n' +
        '</div>\n');
    $('.multiScreen').prepend(QueryWayDom);

    feaQueryDomMult.click(function (e) {
        e.stopPropagation();
        feaQueryDomMult.toggleClass('blue_class');
        if (feaQueryDomMult.hasClass('blue_class')) {
            QueryWayDom.hide();
            feaQueryDomMult.addClass('blue_class').siblings().removeClass('blue_class');
            startDrawInteraction('Point');
        } else {
            me.GisService.forEach(function (gisService) {
                gisService.setCursor();
            });
        }
    });

    feaQueryDomMult.find('div:last').on('click', function (event) {
        event.stopPropagation();
        // var position = that.feaQueryDom.position();
        // QueryWayDom.css({left:position.left, top:position.top + that.feaQueryDom.outerHeight() + 18}).slideDown("fast");
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

    QueryWayDom.find('div').on('click', function (event) {
        feaQueryDomMult.addClass('blue_class').siblings().removeClass('blue_class');
        var drawType = $(this).attr('attr');
        startDrawInteraction(drawType);
        event.stopPropagation();
    });

    function startDrawInteraction(drawType) {
        me.GisService.forEach(function (gisService,index) {
            gisService.setCursor({
                destory: function () {
                    spatialQueryTools[index].clear("all");
                }
            });
        })
        spatialQueryTools.forEach(function (spatialQueryTool,index) {
            var draw = spatialQueryTool.getDrawInteraction(drawType);
            me.GisService[index].getMap().addInteraction(draw);
            draw.on('drawend', function (e) {
                spatialQueryTools.forEach(function (item,num) {
                    drawEndDeal(e, drawType,num);
                })
            });
        });

    }

    function drawEndDeal(e, drawType,index) {
        spatialQueryTools.forEach(function (spatialQueryTool) {
            spatialQueryTool.clear();
        })
        var extent = e.feature.getGeometry().getExtent();
        var center = ol.extent.getCenter(extent);   //获取边界区域的中心位置
        var map = me.GisService[index].getMap();
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
        for(var key in me.GisService[index].tempLayers){
            var temp = me.GisService[index].tempLayers[key];
            if(temp.layer){
                queryRequests.push(temp);
            }
        };
        if(queryRequests.length<=0){
            return;
        }

        me.GisService[index].queryFeature({
                layer: queryRequests[0].layer,
                drawType: drawType,
                coordinates: coordinates
            }, function (res) {
                if (res.success) {
                    spatialQueryTools[index].dealSpatialQueryDataT({layer: queryRequests[0].layer, data: res.data, center: center});
                } else {
                    console.error(res.data);
                }
        });
    }
};

//卷帘
ToolbarMultiScreen.prototype.rollingShutter = function () {
    var that = this;
    that.GisService = this.GisService;
    that.layers = this.layers;
    var upLayerName, downLayerName, mapEvent, layerEvent;
    that.rollingDom = $('<div class="fl jl">卷帘</div>');
    that.tool_con.append(this.rollingDom);

    that.rollingShutterDom = $('<div style="display:none;min-width: 280px;width:auto;position: absolute;z-index: 10;left: 6px;top: 50px; ">\n' +
        '        <div class="mapMsgWraper_header" style="background:#0A81C3;color:#fff;overflow:hidden;line-height:36px;padding: 0 16px">\n' +
        '            <div class="fl">卷帘</div>\n' +
        '            <div class="fr closeAction" style="cursor: pointer">X</div>\n' +
        '        </div>\n' +
        '        <div style="background:rgba(255,255,255,.5);overflow: hidden">\n' +
        '        <div class="overflow" style="margin-top:10px;">\n' +
        '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">上层图层</label>\n' +
        '            <div class="zTreeDemoBackground fl">\n' +
                '\t\t\t\t<ul class="list">\n' +
                '\t\t\t\t\t<li class="title">\n' +
                '\t\t\t\t\t\t<input class="layerup toolbar_inputofGroup" type="text" readonly value=""/>\n' +
                '\t\t\t\t\t</li>\n' +
                '\t\t\t\t</ul>\n' +
                '\t\t\</div>'+
        '            </div>\n' +
        '        <div class="overflow" style="margin-top:10px;">\n' +
        '            <label class="fl toolbar_labelofGroup" style="width: auto!important;">下层图层</label>\n' +
        '            <div class="zTreeDemoBackground fl">\n' +
                '\t\t\t\t<ul class="list">\n' +
                '\t\t\t\t\t<li class="title">\n' +
                '\t\t\t\t\t\t<input class="laydown toolbar_inputofGroup" type="text" readonly value="" />\n' +
                '\t\t\t\t\t</li>\n' +
                '\t\t\t\t</ul>\n' +
                '\t\t</div>'+
        '        </div>' +
        '       <div class="menuContent" style="display:none; position: absolute;">\n' +
            '\t\t\t<ul class="rolling ztree" style="margin-top: 3px; width: auto;min-width: 200px; height: 300px; overflow: auto; box-shadow: 0 0 10px 0 #bdbcbc; border-radius: 4px; background: rgba(255,255,255,0.7);"></ul>\n' +
            '\t\t</div></n>'+
        '        <div >\n' +
        '            <div style="margin-left: 50px">\n' +
        '                <button class="layui-btn layui-btn-normal" style="height: 30px;line-height: 30px;margin: 10px;" >确定</button>\n' +
        '                <button class="layui-btn layui-btn-primary" style="height: 30px;line-height: 30px;margin: 10px;" >取消</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        </div>\n' +
        '    </div>');
    $(that.mapcon).parent().append(that.rollingShutterDom);

    var rollingSelectedLayer = {};
    that.rollingDom.click(function (e) {
        (function(){
            var currentTextId = "";
            var menuContent = that.rollingShutterDom.find('.menuContent');
            that.rollingShutterDom.find('.layerup').focus(function () {
                initMyTree();
                currentTextId = "layerup";
                var layerup = that.rollingShutterDom.find('.layerup');
                var layerupPosition = layerup.position();
                menuContent.css({left:layerupPosition.left, top:layerupPosition.top + layerup.outerHeight()}).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            });
            that.rollingShutterDom.find('.laydown').click(function () {
                initMyTree();
                currentTextId = "laydown";
                var laydown = that.rollingShutterDom.find('.laydown');
                var laydownOffset =laydown.position();
                menuContent.css({left:laydownOffset.left + "px", top:laydownOffset.top + laydown.outerHeight() + "px"}).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            })
            function hideMenu() {
                menuContent.fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }
            function onBodyDown(event) {
                var classVal = event.target.classList.value;
                if (!(classVal.indexOf('layerup') != -1 || classVal.indexOf('laydown') != -1 || classVal.indexOf('menuContent') != -1 || $(event.target).parents(".menuContent").length>0)) {
                    hideMenu();
                }
            }

            function initMyTree(){
                that.rollingShutterDom.find('.rolling.ztree').empty();
                var myTree = null;
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        // radioType: "all"
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
                        onClick: onClick,
                        onCheck: onCheck
                    }
                };
                var zNodes = that.initLayerTreeObj.getNodes();

                function onClick(e, treeId, treeNode) {
                    myTree.checkNode(treeNode, !treeNode.checked, null, true);
                    return false;
                }

                function onCheck(e, treeId, treeNode) {
                    var nodes = myTree.getCheckedNodes(true),
                        v = "";
                    for (var i=0, l=nodes.length; i<l; i++) {
                        v += nodes[i].name + ",";
                    }
                    if (v.length > 0 ) v = v.substring(0, v.length-1);

                    var cityObj = $("."+currentTextId);
                    if(!treeNode.layer){
                        that.GisService.layui.layer.msg('请选择图层', {icon: 0});
                        cityObj.attr("value", "").attr("title","");
                        return;
                    }
                    if(currentTextId === "layerup"){
                        rollingSelectedLayer["up"] = treeNode;
                    }else{
                        rollingSelectedLayer["down"] = treeNode;
                    }
                    cityObj.attr("value", v).attr("title",v);
                }

                $(document).ready(function(){
                    myTree = $.fn.zTree.init(that.rollingShutterDom.find('.rolling.ztree'), setting, zNodes);
                });
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
ToolbarMultiScreen.prototype.reSite = function () {
    var that = this;
    this.reSite = $('<div class="fl fw">复位</div>');
    this.tool_con.append(this.reSite);

    this.reSite.click(function (e) {
        $(e.target).siblings().removeClass('blue_class');
        that.GisService.forEach(function (item) {
            item.setCursor({
                event: item.reSiteFun()
            });
            $(that.selectDom).click();
        })
    });
};

// 测距
ToolbarMultiScreen.prototype.treasureLine = function () {
    var that = this;
    this.treasureLineDom = $('<div class="collapseMapDivCls_length treasure fl">测距</div>');
    this.tool_con.append(this.treasureLineDom);
    this.treasureLineDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.GisService.forEach(function (item) {
                item.setCursor({
                    destory: function () {
                        that.GisService.forEach(function (item) {
                            item.clearMehtodFun();
                        })
                    }
                });
            });
            that.GisService.forEach(function (item) {
                item.treasureFun("LineString",function (res) {
                    that.GisService.forEach(function (item2) {
                        // ''
                        if(item === item2){return;}
                        var measureTooltip = new ol.Overlay({
                            element: $('<div class="tooltip tooltip-static">'+res.measure.split("<div")[0]+'</div>')[0],
                            offset: [0, -7],
                            positioning: 'bottom-center',
                            position: res.position
                        });
                        item2.getMap().addOverlay(measureTooltip);
                    })
                });
            })
        } else {
            $(that.allCleanDom).click();
        }
    })
};

// 测面
ToolbarMultiScreen.prototype.treasureArea = function () {
    var that = this;
    this.treasureAreaDom = $('<div class="collapseMapDivCls_area treasure fl">测面</div>');
    this.tool_con.append(this.treasureAreaDom);
    this.treasureAreaDom.click(function (e) {
        $(e.target).toggleClass('blue_class');
        if ($(e.target).hasClass('blue_class')) {
            $(e.target).addClass('blue_class').siblings().removeClass('blue_class');
            that.GisService.forEach(function (item) {
                item.setCursor({
                    destory: function () {
                        that.GisService.forEach(function (item) {
                            item.clearMehtodFun();
                        })
                    }
                });
            })
            that.GisService.forEach(function (item) {
                item.treasureFun("Polygon",function (res) {
                    that.GisService.forEach(function (item2) {
                        if(item === item2){return;}
                        var measureTooltip = new ol.Overlay({
                            element: $('<div class="tooltip tooltip-static">'+res.measure.split("<div")[0]+'</div>')[0],
                            offset: [0, -7],
                            positioning: 'bottom-center',
                            position: res.position
                        });
                        item2.getMap().addOverlay(measureTooltip);
                    })
                });
            });
        } else {
            $(that.allCleanDom).click();
        }
    })
};

// 清除
ToolbarMultiScreen.prototype.clear = function () {
    var that = this;
    this.allCleanDom = $('<div class="collapseMapDivCls_clean fl">清除</div>');
    this.tool_con.append(this.allCleanDom);
    this.allCleanDom.click(function (e) {
        $(this).siblings().removeClass('blue_class');
        $(that.selectDom).click();
        that.GisService.forEach(function (gisService) {
            gisService.clearFun();
            gisService.setCursor();
        });
        that.obj.clear.click && typeof that.obj.clear.click == 'function' && that.obj.clear.click();
    });
};

//搜索
ToolbarMultiScreen.prototype.searchFun = function (params) {
    var that = this;

    that.business = params.business;
    that.layers = this.layers;
    that.GisService = this.GisService;
    var checkLandFun = params.checkLandFun;
    var unCheckLandFun = params.unCheckLandFun;
    var copyLandFun = params.copyLandFun;
    var placeholder = params.placeholder || "地块代码/坐落/图幅号";
    var queryType = params.queryType;

    var searchDom = $('<div style="position:absolute;top:6px;right:6px;z-index:30;"> \n' +
        '   <div style="overflow:hidden;padding:6px 6px 6px 16px;background: #fff"> \n' +
        '    <div style="float:left"> \n' +
        '     <input type="text" id="queryLandCode" @keydown.enter="queryLandBtn()" placeholder="'+placeholder+'" v-model="searchText" autocomplete="off" class="layui-input queryInputCls" /> \n' +
        '    </div> \n' +
        '    <div style="text-align: center;float:left"> \n' +
        '     <button class="layui-icon layui-icon-close" id="clearSearchCon" v-on:click="clearSearchCon()" style="height:30px;line-height:30px;margin-left:0px;border:none;background:transparent;cursor:pointer;font-size:28px"></button> \n' +
        '    </div> \n' +
        '    <div style="height: 100%; display: none; overflow: auto;"></div> \n' +
        '    <div style="text-align: center;float:left"> \n' +
        '     <div class="layui-icon layui-icon-search  radius inline-block" id="queryLandBtn" v-on:click="queryLandBtn()" style="width:40px;height:30px;line-height:30px;margin-left:0px;background:#0b76fa;color:#fff;cursor:pointer;font-size:20px"></div> \n' +
        '    </div> \n' +
        '   </div> \n' +
        '   <div style="max-height: 310px;overflow: auto;background: rgba(255,255,255,.8);"> \n' +
        '<ul style="">' +
        '<li v-for="(value,key) in itemJson" markid="+ item.mappingId+"> \n' +
        '<div @click="value.show=!value.show">' +
        '<div class="title_search layui-icon" :class="{ \'layui-icon-down\': value.show,\'layui-icon-up\':!value.show }" style="cursor: pointer;line-height: 36px;font-size:14px;padding-left: 10px;background: rgba(210,210,210,.6);font-weight: 800;color:#666;font-style: 15px;">' +
        '   <span style="padding-left: 10px;font-weight: 100">{{key}}</span>' +
        '</div>' +
        '</div>' +
        '<div class="title_searchCon" style="background: rgba(255,255,255,.8)">' +
        '<div v-if="value.show" v-for="(item,i) in value.data" style="overflow: hidden;border-bottom: 1px dashed #aaa;padding: 6px;line-height: 22px">' +
        '        <div>\n' +
        '         <span style="font-weight:800">土地代码：</span>\n' +
        '         <span>{{item.landCode}}</span>\n' +
        '        </div> \n' +
        '        <div>\n' +
        '         <span style="font-weight:800">土地坐落：</span>\n' +
        '         <span>{{item.location}}</span>\n' +
        '        </div> \n' +
        '        <div class="overflow"></div> ' +
        '<p style="cursor: pointer;color: #1269d3" v-bind:detailorderid="item.mappingId" v-on:click="showDetail(item)" class="fl">地块详情</p><p v-if="!!copyLandFun" class="fr" style="margin-left: 8px;"><button style="color: #fff;background-color: #0b76fa;border: none;border-radius: 3px;font-size: 12px;padding: 3px;cursor: pointer;" v-on:click="copyLand(item)">复制</button></p><p class="fr"><input type="checkbox" v-model="item.checked" class="isLandCheck" v-bind:orderid="item.mappingId" v-on:click="checkLand(item,$event)" /><label for="">选择</label></p> ' +
        '</div>' +
        '</div>' +
        '</li> \n' +
        '<li v-show="poiInfoList.length>0" v-for="(info,i) in poiInfoList">' +
        '   <div @click="poiFixPostion(info)" class="" style="border:1px solid #ccc;">' +
        '        <div>\n' +
        '         <span style="font-weight:800">名称：</span>\n' +
        '         <span>{{info.name}}</span>\n' +
        '        </div> \n' +
        '        <div>\n' +
        '         <span style="font-weight:800">地址：</span>\n' +
        '         <span>{{info.address}}</span>\n' +
        '        </div> \n' +
        '   </div>' +
        '</li>' +
        '</ul>' +
        '</div> \n' +
        '</div>');

    $(this.mapcon).parent().append(searchDom);

    ///////////////
    var searchVm = new Vue({
        el: searchDom[0],
        data: {
            searchText: '',
            queryRequests: that.layers.filter(function (item) {
                return item.select === true;
            }),
            itemJson: {},
            itemDetail: {},
            checkLandFun: checkLandFun,
            unCheckLandFun: unCheckLandFun,
            copyLandFun: copyLandFun,
            poiInfoList: []
        },
        methods: {
            clearSearchCon: function () {
                this.searchText = "";
                this.itemJson = {};
                this.itemDetail = {};
                this.poiInfoList = [];
                searchDom.find('div>input').val('').focus();
                searchDom.find('>div:last').hide();
            },
            poiFixPostion: function (info) {
                var coordinate = info.coordinate;
                if (!!coordinate) {
                    that.GisService.personFixedPosition(info.coordinate);
                } else {
                    console.log("兴趣点坐标异常");
                }
            },
            queryLandBtn: function () {

                this.itemJson = {};
                if (this.searchText == "") {
                    that.GisService.obj.layer.msg('请输入查询内容', {icon: 5});
                    return;
                }
                var queryRequests = that.layers.filter(function (item) {
                    return item.select === true;
                });
                if (queryType === "poi") {
                    that.GisService.queryPoiInfoList({searchText: this.searchText}, function (res) {
                        console.log(res);
                        if (res.success) {
                            searchVm.poiInfoList = res.data;
                        }
                    });
                    return;
                }
                that.GisService.searchData({searchText: this.searchText, business: that.business}, function (res) {
                    if (res.results.length == 0) {
                        // searchDom.find('>div:last').empty().append($("<li style='text-align:center'>无相关的地块信息</li>"));
                    } else {
                        var json = {};
                        res.results.forEach(function (item) {
                            var layer = queryRequests.filter(function (lay) {
                                return lay.busiType === item.busiType && lay.layerStatus.indexOf(item.layerStatus) != -1;
                            });
                            if (!layer[0]) {
                                return
                            }
                            var lname = layer[0].name;
                            if (!json[lname]) {
                                json[lname] = {show: true, data: []};
                            }
                            item.layer = layer[0].layer;
                            item.checked = false;
                            json[lname].data.push(item);

                        });
                        searchVm.itemJson = json;
                        searchDom.find('>div:last').show();
                        layui.element.render('collapse');
                    }
                });

            },
            showDetail: function (item) {
                var landInfo = item;
                var areaName = '';
                if (!!item.areaNum) {
                    areaName = getXzqhInfo(item.areaNum);
                }

                that.GisService.layui.layer.open({
                    type: 1,
                    title: '地块详情',
                    offset: ['52px', '804px'],
                    area: ['336px', '460px'],
                    content:
                        '<div style="padding-top:10px">'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地代码：</label>'
                        + '<div class="layui-input-block margin_b6" style="line-height:33px">'
                        + '<input type="text" name="land_code" disabled="disabled" style="background-color:#eee;border:1px solid lightgray" class="layui-input" value=' + (landInfo.landCode ? landInfo.landCode : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">行政区划：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" name="area_num" disabled="disabled" style="background-color:#eee;border:1px solid lightgray" class="layui-input" value="' + (areaName ? areaName : '') + '">'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">宗地编号：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.zdBianhao ? landInfo.zdBianhao : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地面积：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.area ? landInfo.area : '') + '>'
                        + ' </div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地坐落：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input"  value=' + (landInfo.location ? landInfo.location : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">图幅号：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.mapNum ? landInfo.mapNum : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地北至：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text"  autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.northTo ? landInfo.northTo : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地东至：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.eastTo ? landInfo.eastTo : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地南至：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.southTo ? landInfo.southTo : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '<div class="layui-form-item">'
                        + '<label class="layui-form-label">土地西至：</label>'
                        + '<div class="layui-input-block margin_b6">'
                        + '<input type="text" autocomplete="off" disabled="disabled" class="layui-input" value=' + (landInfo.westTo ? landInfo.westTo : '') + '>'
                        + '</div>'
                        + '</div>'
                        + '</div>'

                });
            },
            checkLand: function (item, $event, callback) {
                var layer = item.layer;
                var mappingId = item.mappingId;
                if (item.checked) {
                    that.GisService.queryFeature({layer: layer, mappingId: mappingId}, function (res) {
                        if (res.success && res.data != "信息查询失败" && res.data.length > 0) {
                            var coordinate = res.data[0].coordinate;
                            var mappingId = res.data[0].mappingId;
                            that.GisService.drawFeature({
                                coordinate: coordinate,
                                mappingId: mappingId,
                                layer: layer,
                                data: res.data[0]
                            });
                            checkLandFun && checkLandFun(res.data[0]);
                            callback && callback(res.data[0]);
                        } else {
                            that.GisService.msg("未查询到选中地块的坐标信息！");
                        }
                    })
                } else {
                    that.GisService.removeFeature(layer, mappingId);
                    unCheckLandFun && unCheckLandFun(layer, mappingId);
                }
            },
            copyLand: function (item) {
                item.checked = true;

                function copy(res) {
                    for (var k in item) {
                        res[k] = item[k];
                    }
                    copyLandFun && copyLandFun(res);
                }

                var feature = that.GisService.getFeature(item.layer, item.mappingId);
                if (feature) {
                    copy(feature);
                    return;
                }
                this.checkLand(item, {}, copy);


                // var layer = searchVm.queryRequests.filter(function (lay) {
                //     return lay.layer.busiType === item.busiType && lay.layer.layerStatus.indexOf(item.layerStatus) != -1;
                // })[0].layer;
                // var mappingId = item.mappingId;
                // that.GisService.queryFeature({layer: layer, mappingId: mappingId}, function (res) {
                //     if (res.success && res.data != "信息查询失败" && res.data.length > 0) {
                //         res["item"] = item;
                //         copyLandFun && copyLandFun(res);
                //     }else{
                //         res["item"] = item;
                //         copyLandFun && copyLandFun(res);
                //     }
                //
                // });
            },
        }
    });
}

//关闭分屏
ToolbarMultiScreen.prototype.multiscreenClose = function() {
    var that = this;
    this.multiscreenCloseDom = $('<div class="collapseMapDivCls_close fl">关闭</div>');
    this.tool_con.append(this.multiscreenCloseDom);
    this.multiscreenCloseDom.click(function (e) {
        $(that.allCleanDom).click();
        $('.multiScreen').remove()
    })
};

// 地图内功能模块给予拖动效果
ToolbarMultiScreen.prototype.drag = function (selector) {
    if (Array.isArray(selector)) {
        selector.forEach(function (ele) {
            dragDomFun(ele)
            // (function () {
            //
            // }())
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
            position: "relative"
        });
        out.onmousedown = function (ev) {
            if (!$(ev.target).hasClass('mapMsgWraper_header')) {
                return;
            }
            var Event = ev || window.event;
            var sb_bkx = Event.clientX - out.offsetLeft;
            var sb_bky = Event.clientY - out.offsetTop;
            document.onmousemove = function (ev) {
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
                out.style.top = endy + 'px';
                document.onmouseup = function () {
                    document.onmousemove = null;
                }
            }
        }
    }

};


