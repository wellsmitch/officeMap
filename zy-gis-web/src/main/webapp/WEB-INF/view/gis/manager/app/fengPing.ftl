<#assign basePath=request.contextPath />
<html>

<head>
    <meta charset="utf-8">
    <title>分屏对比</title>
    <#--<#include "/js.ftl"/>-->
    <#--<#include "/css.ftl"/>-->
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <#--<link rel="stylesheet" type="text/css" href="${basePath}/static/css/app.css">-->
    <#--<link rel="stylesheet" href="${basePath}/static/css/gis/manager/gis.css">-->
    <link rel="stylesheet" href="${basePath}/static/lib/ol3/css/ol.css">
    <link rel="stylesheet" href="${basePath}/static/lib/elementUI/index.css">
    <link rel="stylesheet" href="${basePath}/static/lib/mui/css/mui.min.css">

    <script type="text/javascript" src="${basePath}/static/lib/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/vue/vue-v2.6.10.min.js"></script>
    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <script src="${basePath}/static/lib/elementUI/index.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/ol-debug.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/proj4-src.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/ol3/js/transferProjection.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/util/zy.util.provide.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/util/zy.util.mq.js"></script>
    <script type="text/javascript" src="${basePath}/static/js/gis/service/zy.gis.service.js"></script>
    <#--<#include "include.ftl"/>-->

    <#--<#include "/eg/reserve/gis/gis.ftl"/>-->
    <#--<script src="${basePath}/static/js/gis/manager/app/eruda.min.js"></script>-->
    <#--<script>eruda.init();</script>-->

    <style>
        html,
        body {
            background-color: #efeff4;
            width: 100%;
            height: 100%;
        }

        .full {
            width: 100%;
            height: 100%;
        }

        .fl {
            float: left;
        }

        .fr {
            float: right;
        }

        .mui-bar .mui-pull-left .mui-icon {
            padding-right: 5px;
            font-size: 28px;
        }

        .mui-bar .mui-btn {
            font-weight: normal;
            font-size: 17px;
        }

        .mui-bar .mui-btn-link {
            top: 1px;
        }

        .mui-content-padded a {
            margin: 3px;
            width: 50px;
            height: 50px;
            display: inline-block;
            text-align: center;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 15px;
            background-clip: padding-box;
        }

        .mui-content-padded a .mui-icon {
            margin-top: 12px;
        }

        .active .mui-spinner-indicator {
            background: #007AFF;
        }

        .mui-content a {
            color: #8F8F94;
        }

        .mui-content a.active {
            color: #007aff;
        }

        .ol-full-screen.ol-unselectable.ol-control {
            display: none;
        }

        .el-drawer__open .el-drawer.rtl {
            overflow: auto;
        }
    </style>
</head>

<body>

<header id="header" class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">分屏对比</h1>
</header>

<div class="mui-content full">
    <div id="wrapper" class="full" style="position:relative;">
        <div id="map1" style="width:100%;height:50%;">
            <#--<div class="mapCoordinatePanel"
                 style="width: 100%; bottom: 0px; position: absolute; left: 0px; z-index: 10; background: rgb(0, 0, 0); font-size: 12px; line-height: 20px; color: rgb(255, 255, 255); opacity: 0.5; cursor: initial;">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls"></span>
                <span id="mapLevelSpan"></span>
            </div>-->
        </div>
        <div style="width:100%;background-color:#1e80ea;border:1px solid #1e80ea;"></div>
        <div id="map2" style="width:100%;height:50%;">
            <#--<div class="mapCoordinatePanel"
                 style="width: 100%; bottom: 0px; position: absolute; left: 0px; z-index: 10; background: rgb(0, 0, 0); font-size: 12px; line-height: 20px; color: rgb(255, 255, 255); opacity: 0.5; cursor: initial;">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls"></span>
                <span id="mapLevelSpan"></span>
            </div>-->
        </div>
        <div  style="position: absolute;top:2%;">
            <el-button @click="rememUpDowm('up')" size="medium" round>+图层{{upLayerName?": "+upLayerName:''}}</el-button>
        </div>
        <div  style="position: absolute; bottom:43%;">
            <el-button @click="rememUpDowm('down')" size="medium" round>+图层{{downLayerName?": "+downLayerName:''}}</el-button>
        </div>
        <div class="full" style="height:100%;">
            <el-drawer
                    title="选择图层"
                    size="70%"
                    ref="drawer"
                    :visible.sync="drawer"
                    append-to-body="true"
                    :with-header="false"
                    @open="opendrawer"
                    @closed="closeddrawer">
                <div id="treeDiv" style="height:100%;display: none;">
                    <el-tree :data="layers" node-key="label" show-checkbox default-expand-all node-key="id" ref="tree"
                             :props="defaultProps" @check-change="checkChange">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                         </span>
                    </el-tree>
                </div>
            </el-drawer>
        </div>
    </div>
</div>
<script type="text/javascript">
    var basePath = '${basePath}';
    mui.init();

    var vm = new Vue({
        el: '#wrapper',
        data: {
            layers: null,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            gisService: null,
            maps: [],
            drawer: false,
            checkLyType: '',
            upLayerName: '',
            upLayerCode: '',
            downLayerName: '',
            downLayerCode: '',
            upLayerMap: {},
            downLayerMap: {}
        },
        created: function () {
            var that = this;
            $.get(basePath + '/gis/subject/findSubNodes/onemap_layer')
                .done(function (res) {
                    var layerRoot = subject2Json(res.data, "onemap_layer");
                    that.layers = layerRoot.children;

                    function subject2Json(subs, rootCode) {
                        var root = {}, pidMap = {};
                        subs.forEach(function (item) {
                            if (item.layerInfoList && item.layerInfoList.length > 0) {
                                item.layerInfoList.forEach(function (item) {
                                    Object.assign(item, item.layerInfo, item.property);
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
                });
        },
        methods: {
            checkChange: function (data, checked, subchecked) {
                var that = this;
                if (checked && !subchecked && !!data.layerInfoList) {
                    var layer = data.layerInfoList[0];
                    var maps = this.maps;
                    var olLayer;
                    if (this.checkLyType === "up") {
                        this.upLayerName = layer.name;
                        this.upLayerCode = layer.layer;
                        if (layer.loadType === 'wmts') {
                            olLayer = this.gisService.addWmtsLayer(layer, maps[0]);
                        } else {
                            olLayer = this.gisService.addWmsLayer(layer, maps[0]);
                        }
                        this.upLayerMap[this.upLayerCode] = olLayer;
                    } else {
                        this.downLayerName = layer.name;
                        this.downLayerCode = layer.layer;
                        if (layer.loadType === 'wmts') {
                            olLayer = this.gisService.addWmtsLayer(layer, maps[1]);
                        } else {
                            olLayer = this.gisService.addWmsLayer(layer, maps[1]);
                        }
                        this.downLayerMap[this.downLayerCode] = olLayer;
                    }
                }
                if (!checked && data.layerInfoList && data.layerInfoList[0].layer) {
                    var temLayer = data.layerInfoList[0].layer;
                    if (this.checkLyType === "up") {
                        if(temLayer == this.upLayerCode){
                            this.upLayerName = "";
                            this.upLayerCode = "";
                        }
                        this.maps[0].removeLayer(this.upLayerMap[temLayer]);
                    } else {
                        if(temLayer == this.downLayerCode){
                            this.downLayerName = "";
                            this.downLayerCode = "";
                        }
                        this.maps[1].removeLayer(this.downLayerMap[temLayer]);
                    }
                }
            },
            rememUpDowm: function (type) {
                this.drawer = true;
                this.checkLyType = type;
            },
            opendrawer: function () {
                setTimeout(function(){
                    $('#treeDiv').show();
                },50)
            },
            closeddrawer:function(){
                $('#treeDiv').hide();
            }
        },
        mounted: function () {
            var that = this;
            $.get(basePath + '/gis/config/info', {
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(function (res) {
                that.gisService = new GisService({layui: {}}, res.data.mapInfo, res.data.mapInterFace);
                that.maps = that.gisService.createFPMap([{map: 'map1'}, {map: 'map2'}]);
            });

        }
    })

</script>

</body>

</html>