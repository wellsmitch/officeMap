<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <title>oneMap</title>
    <#include "/js.ftl"/>
    <#include "/css.ftl"/>
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyleMobile.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/configIndex.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/appMapFont/iconfont.css">
    <#include "include.ftl"/>
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/elementUI/index.css">

    <script src="${basePath}/static/lib/elementUI/index.js"></script>
    <#include "/eg/reserve/gis/gis.ftl"/>
    <script type="text/javascript" src="${basePath}/static/lib/require.js"></script>
    <script type="text/javascript" src="${basePath}/static/js/modules/app.js"></script>
    <style type="text/css">
        body {
            font-size: 16px;
        }
        table{
            border-collapse: collapse;
            border: 1px solid #e6e0e7;
            width: 100%;
        }
        table tr {
            line-height: 26px;
            font-size: 90%;
        }
        tr:nth-child(even){
            background-color: #fff;
        }
        tr:nth-child(odd) {
            /*background-color: #F5F5F5;*/
        }
        tr td {
            /*color: #900b09;*/
            padding: 2px 2px 2px 2px;
            /*border: 1px solid #aaa;*/
            padding-left:6px;
            line-height: 18px;
        }
        tr td:nth-child(odd) {
            width: 30%;
        }
        tr td:nth-child(even) {
            width: 70%;
        }

        ul, li {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
        .ztree.ztreeAAuto li a {
            height: auto;!important;
        }

        .layerCollapsePanelTitle {
            position: relative;
            line-height: 22px;
            color: #333;
            background-color: #f2f2f2;
            cursor: pointer;
            font-size: 14px;
            overflow: hidden;
        }

        .layerCollapsePanelContain {
            border: 1px solid #e6e6e6;
            border-top: none;
            box-sizing: border-box;
        }

        .layerCollapsePanelContent {
            width: 190px;
            border: 1px solid #e6e6e6;
            border-right: none;
            margin: 6px;
            margin-right: 0;
        }

        .layerCollapsePanel .layui-icon {
            font-size: 12px;
        }

        .layerFolder {
            border-bottom: 1px solid #e6e6e6;
        }

        .layerCollapsePanelContent .layui-icon {
            font-size: 14px;
        }

        .appMapWrap {
            height: 100%;
        }

        #appMap {
            position: relative;
            height: 100%;
        }

        [v-cloak] {
            display: none;
        }

        .appSearchBtn {
            position: absolute;
            width: 98%;
            line-height: 42px;
            text-align: center;
            border-radius: 6px;
            top: 3px;
            left: 50%;
            letter-spacing: 3px;
            z-index: 5;
            transform: translateX(-50%);
        }

        .appLayerTree .ztree * {
            font-size: 18px;
        }

        .color673AB7 {
            /*background-color: #673AB7!important;*/
            background-color: #aa3300 !important;
        }
        .belowDivDomShow_ywInfo a:focus,.belowDivDomShow_ywInfo:active,.belowDivDomShow_ywInfo:visited{
            color: #fff;
        }
        [class*="layui-layer-loading"]] {
            width: 100px;
        }
        .fl {
            float: left;
        }

        .fr {
            float: right;
        }

        .overflow {
            overflow: hidden;
        }

    </style>
    <style type="text/css">
        .mobileLayerTree {
            font-size: 18px;
            margin: 0 10px;
            overflow: auto;
        }
        .mobileLayerTree div {
            width: max-content;
            min-width: 100%;
        }
        .mobileLayerTree .el-tree-node__expand-icon {
            font-size: 20px;
        }
        .mobileLayerTree .el-tree-node__content {
            height: 40px;
        }
        .mobileLayerTree .el-checkbox__inner {
            width: 18px;
            height: 18px;
        }

        .mobileLayerTree .el-checkbox__inner::after {
            border-width: 2px;
            left: 6px;
            top: 3px;
        }

        .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
            height: 4px;
            top: 6px;
        }
        .mobileLayerTree .el-tree-node__label {
            font-size: 18px;
        }
        .appToolbar, .mapZoomTool {
            border-radius: 4px 4px 0 0/4px 4px 0 0;
            overflow: hidden;
        }

        .appToolbarSlide {
            width: 44px;
            background: #fff;
            text-align: center;
            border-top: 1px solid #d4d4d4;
            box-shadow: 0 5px 8px 0px #9e9191;
        }
        .slideHeight {
            overflow: hidden;
        }
        .tuli {
            position: absolute;
            bottom: 33px;
            font-size: 14px;
            padding: 4px 6px;
            right: 10px;
            background: #fff;
            box-shadow: 0px 1px 5px rgba(0,0,0,.3);
            z-index: 1;
        }
        .mapZoomTool {
            display: none!important;
        }
        .dingwei {
            position: absolute;
            width: 36px;
            height: 36px;
            left: 8px;
            bottom: 32px;
            border-radius: 50%;
            font-size: 20px;
            z-index: 10;
            line-height: 36px;
            text-align: center;
            background: #fff;
            box-shadow: 0 0 10px 0 #cecece;
        }
        #map .ol-scale-line {
            left: 50px;
        }
        .TreasureCancelBtn,.doneTreasure {
            display: none!important;
        }
        .appSubjectLi.zhuti{
            width: 33.33%;
            border-right: 1px solid #e6e6e6;
            box-sizing: border-box;
        }
        .themeActive::after {
            content: "\e60b";
            display: block;
            width: 70px;
            line-height: 16px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 0;
            z-index: 2;
            background: #0098f8;
            color: #ffffff;
            text-align: center;
        }
        .themeActive img{
            box-sizing: border-box;
            border: 1px solid #0098f8;
        }
        .themeIcon {
            height: 50px;
            position: relative;
            margin: 4px auto;
        }
    </style>
</head>
<body>
<div id="wrapper" style="overflow: hidden;position: relative;">
    <div id="vueOther"></div>
    <div id="appMap" v-cloak>
        <div :style="belowDivDomShow ? (listContent.length > 1 ?  'height: 40%;' :  'height: calc(100% - 100px);') : 'height: 100%;'" class="appMapWrap">
            <div id="map" style="position: relative">
                <div class="appToolbarWrap" v-show="appToolbarShow">
                    <div class="appToolbar slideHeight" ref="appToolbar" style="height: 174px">
                        <ul class="tool_con" ref="tool_con">
                            <li @click.stop="toolSubjectClick()">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:22px;" class="iconfont icon-diqiu"></dt>
                                    <dd style="font-size:12px;">专题</dd>
                                </dl>
                            </li>
                            <li @click="toolLayerClick()">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:24px;" class="iconfont icon-mulu"></dt>
                                    <dd>
                                        <div style="font-size:12px;">资源</div>
                                    </dd>
                                </dl>
                            </li>
                            <li @click.stop="pointQuery()">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:24px;font-weight: 800;" class="mui-icon mui-icon-info"></dt>
                                    <dd style="font-size:12px;">信息</dd>
                                </dl>
                            </li>
                            <li @click.stop="toolToolClick()">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:22px;" class="iconfont icon-gongju"></dt>
                                    <dd style="font-size:12px;">工具</dd>
                                </dl>
                            </li>
                            <li @click.stop="toolResetClick()" v-show="resetShow">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:26px;font-weight: bolder" class="iconfont icon-yidong"></dt>
                                    <dd style="font-size:12px;">复位</dd>
                                </dl>
                            </li>
                            <li @click.stop="toolClearClick()">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:22px;" class="iconfont icon-qingchuhuancun"></dt>
                                    <dd style="font-size:12px;">清除</dd>
                                </dl>
                            </li>
                            <li @click="statistics()" style="margin: 0;padding: 0;border: none">
                                <dl style="color: #5c5c5c">
                                    <dt style="font-size:22px;" class="iconfont icon-tongji"></dt>
                                    <dd>
                                        <div style="font-size:12px;">统计</div>
                                    </dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                    <div ref="appToolbarSlide" class="appToolbarSlide iconfont icon-tubiaozhizuo-"
                         @click.stop="mobileToolbarToggle($event)"></div>
                    <ul class="mapZoomTool" ref="mapZoomTool">
                        <li @click.stop="toolZoomInClick()" v-show="zoomInShow">
                            <dl>
                                <dt style="color:#5c5c5c;font-size:18px;line-height: 32px;"
                                    class="iconfont icon-21"></dt>
                            </dl>
                        </li>
                        <li @click.stop="toolZoomOutClick()" v-show="zoomOutShow">
                            <dl>
                                <dt style="color:#5c5c5c;font-size:26px;line-height: 30px;"
                                    class="iconfont icon-jianhao"></dt>
                            </dl>
                        </li>
                    </ul>
                </div>
                <#--定位-->
                <div class="dingwei iconfont icon-fuwei" @click="personPersition()"></div>
                <#--图例-->
                <div class="tuli" @click="legendClick()" v-show="tuliShow">
                    <img src="${basePath}/static/image/图例.png" alt="">
                    图例
                </div>
            </div>
        </div>
        <div v-show="belowDivDomShow" class="belowDiv overflow"
             :style="'position: absolute;bottom: 0; z-index: 10; width: 100%;'+(listContent.length > 1 ?  'height: 60%;' :  'height: 100px;')">
            <div class="belowActionTitle overflow" style="height: 16px;">
                <div class="toggleBelowIcon" style="height: 4px; width: 60px; margin: 5px auto; background: #a5a5a5; border-radius: 2px;" @click="moveActionClick($event)"></div>
            </div>
            <div class="listContent" v-show="listContent.length>0" style="overflow: auto;height: calc(100% - 30px);">
                <div v-for="(content,index) in listContent" :key="index">
                    <div :class="index === (listContent.length-1) ? 'overflow queryListLi queryListLiLast' : 'overflow queryListLi'" :style="index === 0 ? 'padding: 0 10px 10px 10px;' :  'padding: 10px;'">
                        <div @click="fixPosition(content,$event)" class="fl" style="width:calc(100% - 60px);">
                            <div class="mapQueryResTitle" style="font-size: 16px; line-height: 22px; font-weight: 800;">资源类别：{{content.title}}</div>
                            <div v-for="(value,key) of content.slshow">
                                <div>{{key}}:{{value}}</div>
                            </div>
                        </div>
                        <div class="fl" style="width: 60px"  @click.stop="toYWInfo(content)">
                            <div style="width: 50px;margin: 4px auto 0">
                                <div class="iconfont icon-icon_on_the_right"
                                     style="font-weight: 800;width: 20px;background: #17a9ff;border-radius: 50%;color: #fff;text-align: center;height: 20px;font-size: 12px;line-height: 20px;margin: 0 auto"
                                >

                                </div>

                                <div style="font-size: 12px;color: #17a9ff;margin: 0 auto;text-align: center">详情</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="searchBtnDivshow" class="appSearchBtn overflow"
             style="color: #333;background: #fff;box-shadow: 0 0 10px 0 #b5b5b5;">
            <div class="fl iconfont icon-zhanghu" @click="toUsercenter()"   style="border: 1px solid #1675dc; box-sizing: border-box; font-size: 22px; color: #1675dc; border-radius: 50%; height: 30px; width: 30px; line-height: 30px; text-align: right; margin: 5px 4px;"></div>
            <div  @click="searchAction()" class="fl" style="width: calc(100% - 80px);text-align: left;color: #888888;letter-spacing: 0px;font-size: 15px">{{searchKeyInfo || "搜索地点、项目名称、坐落"}}</div>
            <div class="fl iconfont icon-quxiao" ref="queryCancel" style="width: 40px;letter-spacing: 0; border-left: 1px solid #aaa; height: 20px; margin-top: 11px; line-height: 20px;" @click.stop="clearSearchInfo()"></div>
        </div>
        <div v-show="!searchBtnDivshow" class="appSearchBtn overflow"
             style="color: #333;background: #fff;box-shadow: 0 0 10px 0 #b5b5b5;">
            <div class="fl" style="width: calc(100% - 40px); text-align: center; color: rgb(136, 136, 136); letter-spacing: 6px; font-size: 16px;">{{tipMsg}}</div>
            <div class="fl iconfont icon-quxiao" ref="queryCancel" style="width: 40px;letter-spacing: 0; border-left: 1px solid #aaa; height: 20px; margin-top: 11px; line-height: 20px;" @click.stop="clearSearchInfo()"></div>
        </div>

        <div ref="drawMask" class="drawMask" @click="drawMaskClick()"></div>

        <div class="drawDiv translateAction" ref="drawDivDom">
            <div class="drawDivSingle layerContent appLayerTree" ref="appLayerTree" style="height: 100%;">
                <div class='panelTitle mainTitle' @click="rt()" >
                    图层
                </div>
                <div class='layerUlContent ztree' ref="appLayerContent"
                     style='height: calc(100% - 38px);overflow-y: auto;font-size: 18px;display: none'>
                    <div v-show="layerDataNull" style='color: #333333;;text-align: center;margin-top: 30%'>暂无图层数据</div>
                </div>
                <div class="mobileLayerTree" style="height: calc(100% - 38px);overflow-y: auto;font-size: 18px;">
                    <el-tree class="filter-tree" :data="elementUiTreeData" ref="tree" show-checkbox node-key="id" @check-change="checkChange" @check="elementCheck"
                             :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
                    </el-tree>
                </div>
            </div>
        </div>
    </div>
    <#include "legend.ftl"/>
    <#include "searchLandCode.ftl"/>
    <#include "ywInfo.ftl"/>
</div>
<style type="text/css">
    .mui-preview-image.mui-fullscreen{
        z-index: 200;
    }
</style>

<script src="${basePath}/static/js/gis/manager/app/index.js"></script>
<script type="text/javascript">
    window.addEventListener('onemapIndex', function(e) {
        plus.webview.close("onemapUserCenter")
        location.href = basePath + "/gis/layer/app/index"
    })
</script>
</body>
</html>
