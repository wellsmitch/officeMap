<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>onemap</title>
    <#include "/js.ftl"/>
<#--    <link rel="stylesheet" href="${basePath}/static/lib/ol3/css/ol.css" type="text/css">-->
    <link rel="stylesheet" href="${basePath}/static/lib/ol4/css/ol.css" type="text/css">
    <link rel="stylesheet" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyle.css">
    <link rel="stylesheet" href="${basePath}/static/lib/layui/css/layui.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/configIndex.css">
    <link rel="stylesheet" href="${basePath}/static/header_fonts/iconfont.css">
    <style type="text/css">
        .layui-layer-tabmain {
            height: 100%;
        }

        .layui-layer-tabmain .layui-layer-tabli {
            height: 100%;
        }
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

    <script src="${basePath}/static/js/gis/service/zy.util.provide.js"></script>

    <script>
        var subjectInfo = ${subjectInfo};
    </script>

    <#--<script type="text/javascript" src="${basePath}/static/lib/layui/layui.all.js"></script>-->
<#--    <script src="${basePath}/static/lib/ol3/js/ol-debug.js"></script>-->
    <script src="${basePath}/static/lib/ol4/js/ol-debug.js"></script>
    <script src="${basePath}/static/lib/ol3/js/proj4-src.js"></script>
    <script src="${basePath}/static/lib/ol3/js/zondyClient.js"></script>
    <script src="${basePath}/static/lib/ol3/js/transferProjection.js"></script>


    <script src="${basePath}/static/lib/zTree/js/jquery.ztree.all.js"></script>
    <script src="${basePath}/static/lib/zTree/js/zy.util.Tree.js"></script>
    <script src="${basePath}/static/js/gis/service/zy.util.mq.js"></script>
    <script src="${basePath}/static/js/gis/service/spatialQueryToolT.js"></script>
    <script src="${basePath}/static/js/gis/service/spatialQueryOneToolT.js"></script>
    <script src="${basePath}/static/lib/ol3/js/snap.svg-min.js"></script>

    <script src="${basePath}/static/js/gis/service/toolbarMultiScreen.js"></script>
    <script src="${basePath}/static/js/gis/service/toolbarT.js"></script>
    <script src="${basePath}/static/js/gis/service/zy.gis.service.js"></script>
    <script src="${basePath}/static/lib/gis/shapefile.js"></script>
    <script src="${basePath}/static/lib/gis/FileSaver.js"></script>
    <script src="${basePath}/static/lib/gis/turf.js"></script>

    <script src="${basePath}/static/lib/echarts/echarts.min.js"></script>
</head>
<body>
<div id="wrapper" mapFtl style="overflow: hidden;position:relative;">
    <div id="map">
        <div class="mapCoordinatePanel"
             style="bottom: 0px; position: absolute; left: 0px;right: 80px; z-index: 10; background: rgb(0, 0, 0); font-size: 12px; line-height: 20px; color: rgb(255, 255, 255); opacity: 0.5; cursor: initial;">
            <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls"></span>
            <span id="mapLevelSpan"></span>
        </div>
    </div>
</div>
<script>
    (function () {
        var projection_4526 = new ol.proj.Projection({
            code: 'EPSG:4526',
            extent: [35221333.3333333, 3522133.33333333, 38743466.6666667, 7044266.66666667],
            units: 'm',
            axisOrientation: 'enu'
        });
        ol.proj.addProjection(projection_4526);
        ol.proj.addCoordinateTransforms("EPSG:4326", "EPSG:4526",
            function (coordinate) {
                return proj4("EPSG:4326", "EPSG:4526", coordinate);
            },
            function (coordinate) {
                return proj4("EPSG:4526", "EPSG:4326", coordinate);
                ;
            }
        );
        ol.proj.addCoordinateTransforms("EPSG:3857", "EPSG:4526",
            function (coordinate) {
                return proj4("EPSG:3857", "EPSG:4526", coordinate);
            },
            function (coordinate) {
                return proj4("EPSG:4526", "EPSG:3857", coordinate);
            }
        );
        proj4.defs("EPSG:4526", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
    })();

    var globalMapConfig = {
        "minX": 38379906.892075,
        "minY": 3791299.29652517,
        "maxX": 38520881.804775,
        "maxY": 3874969.75312517
    };

    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    Date.getDatetimeNow = function (format) {
        return (new Date()).format(format || 'yyyyMMdd-hhmmssS') + range(100000, 999999);
    };

    function range(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
</script>
<script src="${basePath}/static/js/gis/manager/map/map.js"></script>
</body>

</html>
