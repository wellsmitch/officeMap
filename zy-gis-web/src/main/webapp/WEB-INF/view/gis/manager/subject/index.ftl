<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>专题管理</title>
    <#include "/js.ftl"/>
    <link rel="stylesheet" href="${basePath}/static/lib/ol3/css/ol.css" type="text/css">
    <link rel="stylesheet" href="${basePath}/static/lib/layui/css/layui.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/Features-Clean.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <link rel="stylesheet" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyle.css">
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
    <script src="${basePath}/static/js/gis/manager/subject/index.js"></script>
    <script src="${basePath}/static/lib/gis/FileSaver.js"></script>

    <style type="text/css">
        .layui-form-label {
            width: 80px !important;
        }

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

        #resource {
            width: 20%;
        }

        .zyNavFix {
            overflow: hidden;
        }

        .dir-name {
            cursor: pointer;
        }

        .layer-info-option {
            float: left;
            margin: 0 8px;
        }

        .list-group-item {
            padding: .75rem 0 .75rem 1.25rem;
        }

    </style>

</head>
<body>

<div id="wrapper" style="overflow: hidden;">
    <div id="resource">
        <div>
            <div id="updateTree">
                <button class="layui-btn layui-btn-normal" @click="saveSubject('addRoot')">添加根分类</button>
            </div>
            <input style="display: none" type="file" id="layerFile" @change="layerFileChange($event)" accept=".json">
            <ul id="subjectTree" class="ztree"></ul>
        </div>

    </div>

    <div id="configMap">
        <div id="map">
            <div class="mouseCoordinateAndMapLevelDiv">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls"></span>
                <span id="mapLevelSpan"></span>
            </div>
        </div>
    </div>


    <div id="saveSubject" style="display:none">
        <div class="zyNavFix">
            <div class="layui-form-item">
                <div class="overflow" style="padding-top: 10px">
                    <div class="layui-inline">
                        <label class="layui-form-label">专题名称</label>
                        <div class="layui-input-inline">
                            <input type="text" lay-verify="title" autocomplete="off" class="layui-input"
                                   v-model="currentNode.name" placeholder="请输入专题名">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">专题编码</label>
                        <div class="layui-input-inline">
                            <input type="text" lay-verify="title" autocomplete="off" class="layui-input"
                                   v-model="currentNode.code" placeholder="请输入专题编码">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">专题表单地址</label>
                        <div class="layui-input-inline">
                            <input type="text" lay-verify="title" autocomplete="off" class="layui-input"
                                   v-model="currentNode.formUrl" placeholder="请输入专题编码">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">专题图标</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="currentNode.subjectIcon" name="subjectIcon"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <button type="button" class="layui-btn layui-btn-normal"
                                @click="selectLayer('add')"
                                style="margin: 0 0 0 40px">选择图层
                        </button>

                        <button type="button" class="layui-btn layui-btn-normal"
                                @click="setSubjectMapInfo('add')"
                                v-show="false"
                        >配置专题信息
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="overflow configTableTitleSub">
            <div class="fl" style="width: 100px">图层名称</div>
            <div class="fr layerPropertyDiv">
                <div class="fl">透明度</div>
                <div class="fl">显示层级</div>
                <div class="fl">是否可见</div>
                <div class="fl">是否可选</div>
                <div class="fl">叠加分析</div>
                <div class="fl">操作</div>
            </div>
        </div>
        <form class="layui-form" action="">
            <div id="layerInfoListDiv" class="list-group col nested-sortable sortable-drag"></div>
        </form>
        <#--        <div v-if="currentNode.layerInfoList && currentNode.layerInfoList.length > 0">-->
        <#--            <form class="layui-form" action="">-->
        <#--                <div class="overflow configTableTitleSub">-->
        <#--                    <div class="fl">序号</div>-->
        <#--                    <div class="fl" style="width:600px;">图层名称</div>-->
        <#--                    <div class="fl">透明度</div>-->
        <#--                    <div class="fl">显示层级</div>-->
        <#--                    <div class="fl">默认是否可见</div>-->
        <#--                    <div class="fl">默认是否可选</div>-->
        <#--                    <div class="fl">叠加分析</div>-->
        <#--                    <div class="fl">操作</div>-->
        <#--                </div>-->
        <#--                <draggable class="configTableBodySub" v-model="currentNode.layerInfoList" @end="dragEnd">-->
        <#--                    <div class="overflow" v-for="(item,i) in currentNode.layerInfoList" :key="i">-->
        <#--                        <div class="fl">{{i+1}}</div>-->
        <#--                        <div class="fl" style="width:600px;text-align: left;">-->
        <#--                            {{item.layerInfo.fullPathName.replace(/\//ig,' / ')}}-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <input type="text" name="opacity" v-model="item.property.opacity_show"-->
        <#--                                   placeholder="请输入0-100之间数字"-->
        <#--                                   autocomplete="off" class="layui-input">-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <input type="text" name="zoom" v-model="item.property.zoom" placeholder="请输入层级范围如：1-20"-->
        <#--                                   autocomplete="off" class="layui-input">-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <input type="checkbox" name="show" :value="item.layerInfo.id" lay-filter="switch"-->
        <#--                                   lay-skin="switch" lay-text="是|否" :checked="item.property.show">-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <input type="checkbox" name="select" :value="item.layerInfo.id" lay-filter="switch"-->
        <#--                                   lay-skin="switch" lay-text="是|否" :checked="item.property.select">-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <input type="checkbox" name="analysis" :value="item.layerInfo.id" lay-filter="switch"-->
        <#--                                   lay-skin="switch" lay-text="是|否" :checked="item.property.analysis">-->
        <#--                        </div>-->
        <#--                        <div class="fl">-->
        <#--                            <a class="layui-btn layui-btn-danger layui-btn-xs"-->
        <#--                               v-on:click="delLayerProperty(i,'del')">删除</a>-->
        <#--                        </div>-->
        <#--                    </div>-->
        <#--                </draggable>-->
        <#--            </form>-->
        <#--        </div>-->
    </div>


    <div id="selectLayer" style="display:none">

        <ul id="layerTree" class="ztree"></ul>

    </div>

    <div id="setSubjectMapInfo" style="display: none;">
        <div class="layui-tab-item layui-show" style="margin-top: 20px">
            <form class="layui-form" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">地图坐标系</label>
                    <div class="layui-input-inline">
                        <input type="text" v-model="currentNode.mapInfo.localProjection"
                               lay-verify="title"
                               autocomplete="off"
                               class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">坐标系信息</label>
                    <div class="layui-input-block" style="width:50%">
                        <input type="text" v-model="currentNode.mapInfo.srsCnName"
                               lay-verify="required"
                               lay-reqtext="坐标系信息是必填项，岂能为空？"
                               autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">地图中心点</label>
                        <div class="layui-input-inline" style="width: 180px;">
                            <input type="text" v-model.number="currentNode.mapInfo.viewCenterX" placeholder="x坐标"
                                   autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-form-mid">&nbsp--&nbsp;&nbsp;</div>
                        <div class="layui-input-inline" style="width: 180px;">
                            <input type="text" v-model.number="currentNode.mapInfo.viewCenterY" placeholder="y坐标"
                                   autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">显示层级</label>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="text" v-model.number="currentNode.mapInfo.minZoom" placeholder="最小层级"
                                   autocomplete="off" class="layui-input">
                        </div>
                        <div class="layui-form-mid">&nbsp;--&nbsp;&nbsp;</div>
                        <div class="layui-input-inline" style="width: 100px;">
                            <input type="text" v-model.number="currentNode.mapInfo.maxZoom" placeholder="最大层级"
                                   autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>


                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">最大分辨率</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model.number="currentNode.mapInfo.maxResolution"
                                   lay-verify="required"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">初始层级</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model.number="currentNode.mapInfo.initZoom"
                                   lay-verify="required"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>


</div>

</body>
</html>
