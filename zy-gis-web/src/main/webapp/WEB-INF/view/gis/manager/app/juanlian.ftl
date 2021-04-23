<#assign basePath=request.contextPath />
<html>

<head>
    <meta charset="utf-8">
    <title>卷帘对比</title>
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
        .full{
            width: 100%;
            height: 100%;
        }
        .fl{
            float:left;
        }
        .fr{
            float:right;
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
        .ol-scale-line.ol-unselectable{
            display: none;
        }
        .el-drawer__open .el-drawer.rtl{
            overflow:auto;
        }
        .el-tree-node .el-checkbox {
            display: none;
        }
        .el-tree-node .is-leaf + .el-checkbox {
            display: inline-block;
        }

    </style>
</head>

<body>

<header id="header" class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">卷帘对比</h1>
</header>

<div class="mui-content  full">
    <div id="wrapper" class="full" style="position:relative;overflow: hidden;">
        <div id="map">
            <#--<div class="mapCoordinatePanel"
                 style="width: 100%; bottom: 0px; position: absolute; left: 0px; z-index: 10; background: rgb(0, 0, 0); font-size: 12px; line-height: 20px; color: rgb(255, 255, 255); opacity: 0.5; cursor: initial;">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls"></span>
                <span id="mapLevelSpan"></span>
            </div>-->
        </div>
        <div class="toolbar" style="position: absolute; top:2%;left: 1%">
            <div >
                <el-button @click="rememUpDowm('up')" size="medium" round>上层图层{{upLayerName ? "： " + upLayerName:''}}</el-button>
            </div>
            <div  style="margin-top:5px;">
                <el-button @click="rememUpDowm('down')" size="medium" round>下层图层{{downLayerName ? "： " + downLayerName:''}}</el-button>
            </div>
        </div>
        <#--<div class="block" style="position: absolute; bottom:10px;width:100%;padding-left: 10px;padding-right: 10px;">
            <el-slider v-model="sliderValue" @input="sliderChange()"></el-slider>
        </div>-->
        <div class="block" style="position: absolute;right:8px;top:15%;height:100%;">
            <el-slider v-model="sliderValue" @input="sliderChange()" height="70%" vertical></el-slider>
        </div>
        <div class="full" style="overflow: auto;">
            <el-drawer
                    title="选择图层"
                    size="70%"
                    ref="drawer"
                    :visible.sync="drawer"
                    append-to-body="true"
                    :with-header="false"
                    @open="opendrawer"
                    @closed="closeddrawer">
                <div id="treeDiv" style="display: none;height:100%;">
                    <el-tree :data="layers" show-checkbox default-expand-all node-key="id" ref="tree" :props="defaultProps"
                             @check="elementCheck">
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
            sliderValue: 50,
            gisService: null,
            map:null,
            drawer: false,
            checkLyType:'',
            upLayerName:'',
            upLayerCode:'',
            downLayerName:'',
            downLayerCode:'',
            // mapEvent:null,
            // layerEvent:null,
        },
        created: function () {
            var that = this;
            $.get(basePath + '/gis/subject/findSubNodes/onemap_layer')
                .done(function (res) {
                    var layerRoot = subject2Json(res.data,"onemap_layer");
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
            elementCheck: function (data) {
                var that = this;
                if(!data.layerInfoList || !data.layerInfoList[0]){
                    mui.toast("请选择图层节点");
                    that.$refs.tree.setCheckedKeys([]);
                    return;
                }
                this.$refs.drawer.closeDrawer();
                var layer = data.layerInfoList[0];

                if(this.checkLyType ==="up"){
                    if(!!this.upLayerCode){//清除已有图层
                        this.gisService.removeLayer(this.upLayerCode);
                    }
                    this.gisService.addLayer(layer);
                    this.upLayerName = layer.name;
                    this.upLayerCode = layer.layer;
                    this.bindCompose(this.upLayerCode);
                }else{
                    if(!!this.downLayerCode){//清除已有图层
                        this.gisService.removeLayer(this.downLayerCode);
                    }
                    this.gisService.addLayer(layer);
                    this.downLayerName = layer.name;
                    this.downLayerCode = layer.layer;
                    if(!!this.upLayerCode && this.gisService.getLayerIndex(this.upLayerCode)>=0){
                        var index = this.gisService.getLayerIndex(this.downLayerCode)+3;
                        this.gisService.olLayers[this.upLayerCode].setZIndex(index);
                    }
                }
                /*if(!!this.upLayerCode){
                    this.gisService.rollingShutterApp(this.upLayerCode, this.downLayerCode, function (mapEve, layerEve) {
                        that.mapEvent = mapEve;
                        that.layerEvent = layerEve;
                    });
                }*/
            },
            handleCheckChange: function (data, checked, indeterminate) {
                console.log(data);
            },
            rememUpDowm:function(type){
                this.checkLyType = type;
                this.drawer = true;

                if (!!this.mapEvent) {
                    this.gisService.mapUnbundEvent(this.mapEvent);
                    this.mapEvent = null;
                }
                if (!!this.layerEvent) {
                    this.gisService.layerUnbundEvent(this.upLayerCode, this.layerEvent);
                    this.layerEvent = null;
                }
                this.gisService.mapDragForbid(true);
            },
            opendrawer:function(){
                var that = this;
                setTimeout(function(){
                    $('#treeDiv').show();
                    that.$refs.tree.setCheckedKeys([]);
                },50)
            },
            closeddrawer:function(){
                $('#treeDiv').hide();
            },
            sliderChange:function(){
                if(this.map){
                    this.map.render();
                }
            },
            bindCompose:function(layerName){
                var that = this;
                var ollayer = this.gisService.olLayers[layerName];
                var precompose = ollayer.on('precompose',function(e){
                    var ctx=e.context;
                    // var width=ctx.canvas.width*(that.sliderValue/100);
                    var height=ctx.canvas.height*(that.sliderValue/100);
                    ctx.save();
                    ctx.beginPath();
                    // ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
                    ctx.rect(0, ctx.canvas.height-height, ctx.canvas.width, ctx.canvas.height);
                    ctx.clip();//裁剪
                });
                var postcompose = ollayer.on('postcompose',function(e){
                    var ctx=e.context;
                    ctx.restore();
                });
            }

        },
        mounted: function () {
            var that = this;
            $.get(basePath + '/gis/config/info', {
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }).done(function (res) {
                that.gisService = new GisService({layui: {}}, res.data.mapInfo, res.data.mapInterFace);
                that.map = that.gisService.createMap({
                    map: 'map',
                    // coordinate: 'mouseCoordinateSpan',
                    // zoom: 'mapLevelSpan'
                });
            });

        }
    })


</script>

</body>

</html>