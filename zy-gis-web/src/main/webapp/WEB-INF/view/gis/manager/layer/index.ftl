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
    <script src="${basePath}/static/js/gis/manager/layer/index.js"></script>
    <script src="${basePath}/static/lib/gis/FileSaver.js"></script>
    <style type="text/css">
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

    <!--添加根目录-->
    <div id="resource">
        <div v-cloak>
            <div id="updateTree" v-if="openType==='write'">
                <button class="layui-btn layui-btn-normal" @click="saveCatalog('add')">添加根目录</button>
            </div>
            <input style="display: none" type="file" id="layerFile" @change="layerFileChange($event)" accept=".json">
            <ul id="baseTree" class="ztree"></ul>
        </div>
    </div>

    <!--地图服务-->
    <div id="configMap">
        <div id="map" class="zyMapPanel">
            <div class="CoordinateSpanPanel">
                <span id="mouseCoordinateSpan" class="mouseCoordinateSpanCls mouseCoordinateSpan"></span>
                <span id="mapLevelSpan" class="mapLevelSpan"></span>
            </div>
        </div>
    </div>


    <!--修改-->
    <div id="saveCatalog" style="display:none">
        <div class="zyMenu">
        <div class="layui-inline">
            <label class="layui-form-label">目录名称</label>
            <div class="layui-input-inline">
                <input type="text" lay-verify="title" autocomplete="off" class="layui-input"
                       v-model="currentNode.name" placeholder="请输入目录">
            </div>
        </div>
        <div class="layui-inline">
            <label class="layui-form-label">文档名称</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.docName" name="docName" lay-verify="required" autocomplete="off" class="layui-input">
            </div>
        </div>
<#--        <div class="layui-inline" >-->
<#--            <label class="layui-form-label">电脑端URL</label>-->
<#--            <div class="layui-input-inline" style="width: 230px">-->
<#--                <input type="text" v-model="currentNode.loadUrl" name="loadUrl" lay-verify="required"-->
<#--                       autocomplete="off"-->
<#--                       class="layui-input">-->
<#--            </div>-->
<#--        </div>-->
        <div class="layui-inline" >
            <label class="layui-form-label">图层索引</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.layerIndex" name="layerIndex"
                       lay-verify="required"
                       autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div class="layui-inline">
            <label class="layui-form-label">gdbpUrl</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.gdbpUrl" name="gdbpUrl"
                       lay-verify="required"
                       autocomplete="off"
                       class="layui-input">
            </div>
        </div>
    </div>
        <div>
            <hr>
            <button class="layui-btn-primary layui-btn" style="margin: 0 0 10px 36px;" @click="addProperties()">添加属性</button>
            <button class="layui-btn-primary layui-btn" style="margin: 0 0 10px 36px;" @click="resetProperties()">重置属性</button>
            <form class="layui-form" action="">
                <div class="layui-form-item" style="border-bottom: 1px solid #aaa;" id="inputListen">
                    <div class="overflow configTableTitleMenu">
                        <div class="fl" style="width: 60px">序号</div>
                        <div class="fl">数据库字段</div>
                        <div class="fl">字段类型</div>
                        <div class="fl">属性别名</div>
                        <div class="fl">属性名称</div>
                        <div class="fl" style="width: 140px;">关键信息顺序(app)</div>
                        <div class="fl" style="width: 60px">是否显示</div>
                        <div class="fl" style="width: 60px">是否可查</div>
                        <div class="fl" style="width: 70px">保留小数</div>
                        <div class="fl" style="width: 70px;">操作</div>
                    </div>
                    <!--  添加图层属性模板 start  -->
                    <div class="newPropertiesWrape">
                        <draggable class="configTableBody" v-model="currentNode.properties" group="people"  @change="datadragEnd">
                            <div class="layui-inline newPropertiesItem"
                                 v-for="(item, index) in currentNode.properties"
                                 :style="'display: block;padding: 0px 0;border-bottom: 1px dotted #aaa;overflow: hidden;background:'+(item.field=='dataBaseName' ? '#f2f2f2' : '#fff')"
                            >
                                <#--序号-->
                                <#--<div class="fl" style="width: 60px">{{index+1}}</div>-->
                                <div class="fl" style="width: 60px">
                                    <span class="hideIndex none">{{index++}}</span>
                                    <input type="text" v-model="index" @keydown.enter="orderEnter(item, index)" class="layui-input" style="width: 90%">
                                </div>
                                <#--v-model="item.name"-->
                                <#--数据库字段-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.field" placeholder=""
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--字段类型-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.fieldType"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--属性别名-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.name"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--属性名称-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.title"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--关键信息顺序(app)-->
                                <div class="fl" style="width: 140px;">
                                    <input type="text" name="opacity" v-model="item.slIndex"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--是否显示-->
                                <div class="fl" style="width: 60px" @click="item.show = !item.show">
                                    <input type="checkbox" name="show" lay-filter="switch"
                                           lay-skin="switch" lay-text="是|否" :checked="item.show" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--是否可查-->
                                <div class="fl" style="width: 60px" @click="item.allowQuery = !item.allowQuery">
                                    <input type="checkbox" name="show" lay-filter="switch"
                                           lay-skin="switch" lay-text="是|否" :checked="item.allowQuery" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--保留小数-->
                                <div class="fl" style="width: 70px;padding: 9px 10px 0; box-sizing: border-box;">
                                    <input type="text" name="numToFixed" v-model="item.numToFixed"
                                           style="padding-left: 0"  :disabled="item.refId == currentNode.id ? false : true"
                                           autocomplete="off" class="layui-input" :readonly="item.fieldType == 'double' ? false : true">
                                </div>
                                <#--操作-->
                                <div class="fl" style="width: 70px;">
                                    <a class="layui-btn layui-btn-danger layui-btn-xs"
                                       @click="delProperty(index)" v-if="item.refId == currentNode.id">删除</a>
                                </div>
                                <#--<div style="display: inline-block;" v-if="currentNode.loadType == 'cluster'">
                                    <label class="layui-form-label">聚合类型</label>
                                    <div class="layui-input-inline">
                                        <select v-model="item.type"
                                                style="width: 190px; height: 38px; border-radius: 3px; border-color: rgb(230, 230, 230);">
                                            <option value="sum">sum</option>
                                            <option value="avg">avg</option>
                                            <option value="count">count</option>
                                        </select>
                                    &lt;#&ndash;<input type="text" class="layui-input" v-model="item.type" style="width: auto" autocomplete="off"/>&ndash;&gt;
                                    </div>
                                </div>
                                <div style="display: inline-block;margin: 0 10px 8px 0"
                                     v-if="currentNode.loadType == 'cluster'">
                                    <label class="layui-form-label">是否比对</label>
                                    <div class="layui-input-inline">
                                        <input type="checkbox" style="margin-top: 12px" v-model="item.comparison"
                                               autocomplete="off"/>
                                    </div>
                                </div>-->
                            </div>
                        </draggable>
                    </div>
                    <!--  添加图层属性模板 end  -->
                </div>
            </form>
        </div>
    </div>



    <!--添加目录图层-->
    <div id="saveCatalogOrLayer" style="display:none;">
        <div class="layui-inline" v-if="!currentNode.pid || currentNode.saveType == 1">
            <label class="layui-form-label">添加类型</label>
            <div class="layui-input-inline">
                <select name="" id="" v-model="currentNode.saveType"
                        @change="forceUpdate"
                        style="width: 130px;height: 38px;border-radius: 3px;border-color: #e6e6e6;">
                    <option :value="1" selected="true">添加目录</option>
                    <option :value="0">添加图层</option>
                </select>
            </div>
        </div>

        <div class="layui-inline" v-if="currentNode.saveType == 1">
            <label class="layui-form-label">目录名称</label>
            <div class="layui-input-inline">
                <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入节点名称"
                       v-model="currentNode.name" class="layui-input">
            </div>
        </div>
        <div class="layui-inline" v-if="currentNode.saveType == 1">
            <label class="layui-form-label">文档名称</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.docName" name="docName" lay-verify="required" autocomplete="off" class="layui-input">
            </div>
        </div>

        <div class="layui-inline" v-if="currentNode.saveType == 1">
            <label class="layui-form-label">图层索引</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.layerIndex" name="layerIndex"
                       lay-verify="required"
                       autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div class="layui-inline" v-if="currentNode.saveType == 1">
            <label class="layui-form-label">gdbpUrl</label>
            <div class="layui-input-inline">
                <input type="text" v-model="currentNode.gdbpUrl" name="gdbpUrl"
                       lay-verify="required"
                       autocomplete="off"
                       class="layui-input">
            </div>
        </div>
        <div v-if="currentNode.saveType == 0">
            <div class="zyNavFix">
                <#--<fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">-->
                <#--<legend>配置参数</legend>-->
                <#--</fieldset>-->
                <div class="layui-form-item" style="padding-top: 10px">
                    <div>
                        <div class="layui-inline">
                            <label class="layui-form-label">图层名称</label>
                            <div class="layui-input-inline" style='width:250px;'>
                                <input type="text" v-model="currentNode.name" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">图层简称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.strLayerSn" name="strLayerSn"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">图层类型</label>
                            <div class="layui-input-inline">
                                <select name="" id="" v-model="currentNode.loadType" @change="forceUpdate"
                                        style="width: 120px;height: 38px;border-radius: 3px;border-color: #e6e6e6;">
                                    <option value="wms">wms</option>
                                    <option value="wfs">wfs</option>
                                    <option value="wmts">wmts</option>
                                    <option value="wtemp">wtemp</option>
                                    <option value="cluster">cluster</option>
                                    <option value="3DTiles">3DTiles</option>
                                    <option value="GeoJson">GeoJson</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label" style="width: 84px">服务图层名</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.layer" name="layer" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="layui-inline">
                            <label class="layui-form-label">电脑端URL</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.loadUrl" name="loadUrl" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>

                        <div class="layui-inline">
                            <label class="layui-form-label">手机端URL</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.loadAppUrl" name="loadAppUrl"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div v-if="currentNode.loadType == 'wms' || currentNode.loadType == 'wmts'" style="display: inline">
                        <div class="layui-inline">
                            <label class="layui-form-label">文档名称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.docName" name="docName" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>

                        <div class="layui-inline">
                            <label class="layui-form-label">图层索引</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.layerIndex" name="layerIndex"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">叠加专题</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.analysisTopicName" name="analysisTopicName"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">更新专题</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.topicName" name="topicName"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">叠加分析表</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.analysisTopicTableName"
                                       name="analysisTopicTableName"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">叠加分析名称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.analysisName"
                                       name="analysisName"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">图例url</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.legendUrl" name="legendUrl"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <#--<div class="layui-inline">
                            <label class="layui-form-label">图层url</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.layerIcon" name="layerIcon"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>-->
                        <div class="layui-inline">
                            <label class="layui-form-label" v-show="false">通用查询参数</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.strLayersInfo" name="strLayersInfo"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">gdbpUrl</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.gdbpUrl" name="gdbpUrl"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>

                    </div>
                    <div v-if="currentNode.loadType == 'cluster'" style="display: inline">
                        <div class="layui-inline">
                            <label class="layui-form-label">文档名称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.docName" name="docName" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">聚类距离</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="currentNode.distance" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">字体颜色</label>
                            <div class="layui-input-inline">
                                <input type="color" v-model="currentNode.fontColor" lay-verify="required"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">字体类型</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="currentNode.fontType" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label" style="width: 90px">字体边线颜色</label>
                            <div class="layui-input-inline">
                                <input type="color" v-model="currentNode.fontStrokeColor" lay-verify="required"
                                       style="padding-left: 0" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label" style="width: 90px">字体边线宽度</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="currentNode.fontStrokeWidth" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">服务URL</label>
                            <div class="layui-input-inline" style="width: 500px">
                                <input type="text" v-model="currentNode.loadUrl" name="loadUrl" lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <fieldset v-show="false" class="layui-elem-field layui-field-title" style="margin-top: 20px;">
                    <legend>三维配置参数</legend>
                </fieldset>
                <div v-show="false" class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">三维图层类型</label>
                        <div class="layui-input-inline">
                            <select v-model="currentNode.threeDimensionLoadType" @change="forceUpdate"
                                    style="width: 120px;height: 38px;border-radius: 3px;border-color: #e6e6e6;">
                                <option value="wms">wms</option>
                                <option value="wfs">wfs</option>
                                <option value="3DTiles">3DTiles</option>
                                <option value="arcgis">arcgis</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">图层名称</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="currentNode.name" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">图层编码</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="currentNode.layerCode" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">图层索引</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="currentNode.threeDimensionLayerIndex" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">三维-电脑端URL</label>
                        <div class="layui-input-inline" style="width: 500px">
                            <input type="text" v-model="currentNode.threeDimensionLoadUrl" autocomplete="off"
                                   class="layui-input"/>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">三维-手机端URL</label>
                        <div class="layui-input-inline" style="width: 500px">
                            <input type="text" v-model="currentNode.threeDimensionAppLoadUrl" autocomplete="off"
                                   class="layui-input"/>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">修正高度</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="currentNode.threeDimensionCorrectHeight" autocomplete="off"
                                   class="layui-input"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div>
            <hr>
            <button class="layui-btn-primary layui-btn" style="margin: 0 0 10px 36px;" @click="addProperties()">添加属性</button>
            <button class="layui-btn-primary layui-btn" style="margin: 0 0 10px 36px;" @click="resetProperties()">重置属性</button>
            <form class="layui-form" action="">
                <div class="layui-form-item" style="border-bottom: 1px solid #aaa;" id="inputListen">
                    <div class="overflow configTableTitle">
                        <div class="fl" style="width: 60px">序号</div>
                        <div class="fl" style="width: 235px">数据库字段</div>
                        <div class="fl">字段类型</div>
                        <div class="fl">属性别名</div>
                        <div class="fl">属性名称</div>
                        <div class="fl" style="width: 140px;">关键信息顺序(app)</div>
                        <div class="fl" style="width: 60px">是否显示</div>
                        <div class="fl" style="width: 60px">是否可查</div>
                        <div class="fl" style="width: 70px">保留小数</div>
                        <div class="fl" style="width: 70px;">操作</div>
                    </div>
                    <!--  添加图层属性模板 start  -->
                    <div class="newPropertiesWrape">
                        <draggable class="configTableBody" v-model="currentNode.properties" group="people"
                                   @change="datadragEnd">
                            <div class="layui-inline newPropertiesItem"
                                 v-for="(item, index) in currentNode.properties"
                                 :style="'display: block;padding: 0px 0;border-bottom: 1px dotted #aaa;overflow: hidden;margin-right: 0;background:'+(item.field=='dataBaseName' ? '#f2f2f2' : '#fff')"
                            >
                                <#--序号-->
                                <#--<div class="fl" style="width: 60px">{{index+1}}</div>-->
                                <div class="fl" style="width: 60px">
                                    <span class="hideIndex none">{{index++}}</span>
                                    <input type="text" v-model="index" @keydown.enter="orderEnter(item, index)" class="layui-input" style="width: 90%">
                                </div>
                                <#--v-model="item.name"-->
                                <#--数据库字段-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.field" placeholder=""
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--字段类型-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.fieldType"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--属性别名-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.name"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--属性名称-->
                                <div class="fl">
                                    <input type="text" name="opacity" v-model="item.title"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--关键信息顺序(app)-->
                                <div class="fl" style="width: 140px;">
                                    <input type="text" name="opacity" v-model="item.slIndex"
                                           autocomplete="off" class="layui-input" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--是否显示-->
                                <div class="fl" style="width: 60px" @click="item.show = !item.show">
                                    <input type="checkbox" name="show" lay-filter="switch"
                                           lay-skin="switch" lay-text="是|否" :checked="item.show" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--是否可查-->
                                <div class="fl" style="width: 60px" @click="item.allowQuery = !item.allowQuery">
                                    <input type="checkbox" name="show" lay-filter="switch"
                                           lay-skin="switch" lay-text="是|否" :checked="item.allowQuery" :disabled="item.refId == currentNode.id ? false : true">
                                </div>
                                <#--保留小数-->
                                <div class="fl" style="width: 70px;padding: 9px 10px 0; box-sizing: border-box;">
                                    <input type="text" name="numToFixed" v-model="item.numToFixed"
                                           style="padding-left: 0"  :disabled="item.refId == currentNode.id ? false : true"
                                           autocomplete="off" class="layui-input" :readonly="item.fieldType == 'double' ? false : true">
                                </div>
                                <#--操作-->
                                <div class="fl" style="width: 70px;">
                                    <a class="layui-btn layui-btn-danger layui-btn-xs"
                                       @click="delProperty(index)" v-if="item.refId == currentNode.id">删除</a>
                                </div>
                                <#--<div style="display: inline-block;" v-if="currentNode.loadType == 'cluster'">
                                    <label class="layui-form-label">聚合类型</label>
                                    <div class="layui-input-inline">
                                        <select v-model="item.type"
                                                style="width: 190px; height: 38px; border-radius: 3px; border-color: rgb(230, 230, 230);">
                                            <option value="sum">sum</option>
                                            <option value="avg">avg</option>
                                            <option value="count">count</option>
                                        </select>
                                    &lt;#&ndash;<input type="text" class="layui-input" v-model="item.type" style="width: auto" autocomplete="off"/>&ndash;&gt;
                                    </div>
                                </div>
                                <div style="display: inline-block;margin: 0 10px 8px 0"
                                     v-if="currentNode.loadType == 'cluster'">
                                    <label class="layui-form-label">是否比对</label>
                                    <div class="layui-input-inline">
                                        <input type="checkbox" style="margin-top: 12px" v-model="item.comparison"
                                               autocomplete="off"/>
                                    </div>
                                </div>-->
                            </div>
                        </draggable>
                    </div>
                    <!--  添加图层属性模板 end  -->
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
