<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>联合会审</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
    <#include "/css.ftl"/>
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/lhsp/index.css">
    <#include "/js.ftl"/>

    <style type="text/css">
        #openLayerTabs .layui-layer-tabmain .layui-layer-tabli{
            position: absolute;
            left: 0;
            right: 0;
            z-index: 1;
            display: block!important;
            background: #ffffff;
        }
        #openLayerTabs .layui-layer-tabmain .layui-layer-tabli.layui-this {
            z-index: 2;
        }
        #openLayerTabs .layui-layer-tabmain .layui-layer-tabli[style="display: none;"] {
            z-index: 1;
        }
        #openLayerTabs .layui-layer-tabmain .layui-layer-tabli[style="display: list-item;"] {
            z-index: 3;
        }
        </style>
</head>
<body class="hbody" style="margin: 0">
<div class="layout-main auto" v-cloak style="padding: 0" id="xmxzGis">
<#--    <div id="xmxxEditDv" style="display: none;">-->
<#--        <table class="faxxTable">-->
<#--            <tr>-->
<#--                <td class="faxxLabel">-->
<#--                    会议名称-->
<#--                </td>-->
<#--                <td>-->
<#--                    <input class="faxxInput" type="text" placeholder="会议名称" v-model="xmxx.xmmc"/>-->
<#--                </td>-->
<#--            </tr>-->
<#--&lt;#&ndash;            <tr>&ndash;&gt;-->
<#--&lt;#&ndash;                <td class="faxxLabel">坐落</td>&ndash;&gt;-->
<#--&lt;#&ndash;                <td>&ndash;&gt;-->
<#--&lt;#&ndash;                    <input class="faxxInput" type="text" placeholder="请输入坐落信息" v-model="faxx.zl"/>&ndash;&gt;-->
<#--&lt;#&ndash;                </td>&ndash;&gt;-->
<#--&lt;#&ndash;            </tr>&ndash;&gt;-->
<#--        </table>-->
<#--    </div>-->
    <div class='gis_lanchCodeMap auto overflow' style="width: 100%;height: 100%">
        <!--编辑地块-->
        <div id="leftMapOutDiv" class='left_wraper' style="border: 1px solid #000;">
            <div class="endEditBtn" v-show="modifyFeatureEndObj" @click="modifyFeatureEnd()">保存编辑</div>
            <div class="endEditBtn" style="right: 100px;" v-show="modifyFeatureEndObj" @click="modifyFeatureCancel()">
                取消编辑
            </div>
            <#--<div style="width: 30px;position: absolute;top: 0;right: -10;bottom:0;z-index: 10;/*background: #eee*/"></div>-->
            <#--<div-->
            <#--style="height: 30px;position: absolute;left: 0;right: 0;bottom:0;z-index: 10;/*background: #eee*/"></div>-->
            <div style="height: 100%">
                <iframe id="xmxzGisIframe" width="100%" height="100%" :src="'${basePath}/gis/map/index/tdgyxtsp?html=initial'"
                        frameborder="0"></iframe>
            </div>
        </div>
        <#include "template.ftl"/>
        <div id="bottomDiv" v-if="false" class="customTabCls">
        </div>
    </div>
</div>
<script type="text/javascript">
    function analysisDiv() {

    }

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
            left: 0,
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
            top: 0,
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
            right: rightDomShow && rightDomObj.width ? rightDomObj.width : rightDomShow ? 320 : 0   //
            // background: '#fff5a1'
        })
            .css(leftDomStyle)
            .css($('#bottomDiv').length > 0 ? leftDomStyle : {bottom: 0})

        /**
         *  浏览器视窗变化处理
         */
        function rightBottomByWindowResize() {
            if (GisService) {
                GisService.getMap().updateSize();
            }

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
            analysisDiv();

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
                if (GisService) {
                    GisService.getMap().updateSize();
                }
                $(document).on('mouseup', function () {
                    isResizing = false;
                    isResizing1 = false;
                    analysisDiv();
                });
                e.preventDefault();

            })
        }

        if (GisService) {
            //dom 生成后调用防止地图变形
            GisService.getMap().updateSize();
        }

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
            analysisDiv();
        };


        // 上下
        $('#bottomHandle').on('mousedown', function (e) {
            isResizing1 = true;
            isResizing = false;
            lastDownY = e.clientY;
            analysisDiv();
            mouseMove()
        });
    };

</script>
<style type="text/css">
    .layui-layer-tabmain {height: 100%;}
    .layui-layer-tabmain .layui-layer-tabli {height: 100%;}
    </style>
<script type="text/javascript" src="${basePath}/static/lib/jquery.nicescroll.js"></script>
<script src="${basePath}/static/js/gis/lhsp/xmxx/gis.lhsp.xmxx.js"></script>
<script src="${basePath}/static/js/gis/lhsp/xmfa/gis.lhsp.xmfa.js"></script>
<script src="${basePath}/static/js/gis/lhsp/index.js"></script>
</body>
</html>
