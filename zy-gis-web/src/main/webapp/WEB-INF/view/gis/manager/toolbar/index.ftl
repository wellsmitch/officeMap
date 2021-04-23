<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>图层管理</title>
    <#include "/js.ftl"/>

    <link rel="stylesheet" href="${basePath}/static/lib/ol3/css/ol.css" type="text/css">
    <link rel="stylesheet" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyle.css">
    <link rel="stylesheet" href="${basePath}/static/lib/layui/css/layui.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/configIndex.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/header_fonts/iconfont.css">

    <script type="text/javascript" src="${basePath}/static/lib/browser5.5.23.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/polyfill7.4.4.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/ol-debug.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/proj4-src.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/zondyClient.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/transferProjection.js"></script>

    <script type="text/javascript" src="${basePath}/static/lib/vue/vue-v2.6.10.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/vue/draggable/Sortable.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/vue/draggable/vuedraggable.umd.min.js"></script>
    <script src="${basePath}/static/lib/util/zy.util.provide.js"></script>
    <script src="${basePath}/static/lib/util/zy.util.mq.js"></script>
    <script src="${basePath}/static/lib/zTree/js/jquery.ztree.all.js"></script>
    <script src="${basePath}/static/lib/zTree/js/zy.util.Tree.js"></script>
    <script src="${basePath}/static/js/gis/service/spatialQueryToolT.js"></script>
    <script src="${basePath}/static/js/gis/service/zy.gis.service.js"></script>
    <script src="${basePath}/static/js/gis/service/toolbarMultiScreen.js"></script>
    <script src="${basePath}/static/js/gis/service/toolbarT.js"></script>
    <script src="${basePath}/static/js/gis/manager/toolbar/index.js"></script>
    <style type="text/css">
        ul, li {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }

        .ztree.ztreeAAuto li a {
            height: auto;
        !important;
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

        #saveCatalogOrLayer .layui-input-inline {
            width: 120px;
        }

        #resource {
            width: 20%;
        }

        [v-cloak] {
            display: none;
        }
        .zyNavFix {
            overflow: hidden;
        }

    </style>

</head>
<body>
<div id="wrapper" style="overflow: hidden;">

    <div id="configMap">
        <div id="map">
            <div
                    style="width: 100%; bottom: 0px; position: absolute; left: 0px; z-index: 10; background: rgb(0, 0, 0); font-size: 12px; line-height: 20px; color: rgb(255, 255, 255); opacity: 0.5; cursor: initial;">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls mouseCoordinateSpan"></span>
                <span id="mapLevelSpan" class="mapLevelSpan"></span>
            </div>
        </div>
    </div>


</div>

</body>
</html>
