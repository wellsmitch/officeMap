<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>基本信息管理</title>
    <#include "/js.ftl"/>
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/layui/css/layui.css">
    <script type="text/javascript" src="${basePath}/static/lib/layui/layui.js"></script>
    <script src="${basePath}/static/js/gis/manager/config/index.js"></script>
    <style type="text/css">
        #baseConfigSetting{
            font-size: 14px;
            line-height: 28px;
        }

        #layerInfo th, #businessConfigId th {
            background: #f2f2f2;
            border: 1px solid #e5e5e5;
            padding: 0 10px;
            text-align: center;
        }

        #layerInfo td, #businessConfigId td {
            border: 1px solid #e5e5e5;
            padding: 0 10px;
            text-align: center;
        }

        .layui-layer-page .layui-layer-content {
            overflow: auto !important;
        }
    </style>
</head>
<body>
<div id="baseConfigSetting">
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <li class="layui-this">PC端地图基本信息</li>
            <li>PC端通用接口</li>
            <li>APP端地图基本信息</li>
            <li>APP端通用接口</li>
        </ul>
        <div class="layui-tab-content">


            <div class="layui-tab-item layui-show">
                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">地图坐标系</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInfo.localProjection"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">坐标系信息</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInfo.srsCnName"
                                   lay-verify="required"
                                   lay-reqtext="坐标系信息是必填项，岂能为空？"
                                   autocomplete="off" class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">地图中心点</label>
                            <div class="layui-input-inline" style="width: 180px;">
                                <input type="text"  v-model.number="mapInfo.viewCenterX" placeholder="x坐标" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 180px;">
                                <input type="text" v-model.number="mapInfo.viewCenterY" placeholder="y坐标" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">显示层级</label>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="text"  v-model.number="mapInfo.minZoom" placeholder="最小层级" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="text" v-model.number="mapInfo.maxZoom" placeholder="最大层级" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                    </div>



                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">最大分辨率</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="mapInfo.maxResolution"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">初始层级</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="mapInfo.initZoom"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">背景图名称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="mapInfo.baseLayerName"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">背景图层url</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInfo.baseLayerUrl"
                                   lay-verify="required"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>


                </form>
            </div>


            <div class="layui-tab-item">

                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">服务器IP</label>
                            <div class="layui-input-inline">
                                <input type="tel" v-model="mapInterFace.serverIp"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">服务器端口</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="mapInterFace.serverPort"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">删除图元</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInterFace.removeUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">添加图元</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInterFace.addUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">叠加分析</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInterFace.analysisRequestUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">获取面积</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapInterFace.areaRequestUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                </form>

            </div>

            <div class="layui-tab-item">
                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <label class="layui-form-label">地图坐标系</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInfo.localProjection"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">坐标系信息</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInfo.srsCnName"
                                   lay-verify="required"
                                   lay-reqtext="坐标系信息是必填项，岂能为空？"
                                   autocomplete="off" class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">地图中心点</label>
                            <div class="layui-input-inline" style="width: 180px;">
                                <input type="text"  v-model.number="mapAppInfo.viewCenterX" placeholder="x坐标" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 180px;">
                                <input type="text" v-model.number="mapAppInfo.viewCenterY" placeholder="y坐标" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">显示层级</label>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="text"  v-model.number="mapAppInfo.minZoom" placeholder="最小层级" autocomplete="off" class="layui-input">
                            </div>
                            <div class="layui-form-mid">-</div>
                            <div class="layui-input-inline" style="width: 100px;">
                                <input type="text" v-model.number="mapAppInfo.maxZoom" placeholder="最大层级" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                    </div>



                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">最大分辨率</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="mapAppInfo.maxResolution"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">初始层级</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model.number="mapAppInfo.initZoom"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">背景图名称</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="mapAppInfo.baseLayerName"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">背景图层url</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInfo.baseLayerUrl"
                                   lay-verify="required"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>


                </form>
            </div>

            <div class="layui-tab-item">

                <form class="layui-form" action="">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">服务器IP</label>
                            <div class="layui-input-inline">
                                <input type="tel" v-model="mapAppInterFace.serverIp"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">服务器端口</label>
                            <div class="layui-input-inline">
                                <input type="text" v-model="mapAppInterFace.serverPort"
                                       lay-verify="required"
                                       autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">删除图元</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInterFace.removeUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">添加图元</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInterFace.addUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">叠加分析</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInterFace.analysisRequestUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">获取面积</label>
                        <div class="layui-input-block">
                            <input type="text" v-model="mapAppInterFace.areaRequestUrl"
                                   lay-verify="title"
                                   autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
    <button class="layui-btn layui-btn-primary" @click="dataSubmit">基本信息提交</button>
</div>
</body>
</html>
