<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>角色管理</title>
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
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyle.css">
    <style>
        .search {
            height: auto;
        }

        .search .layui-form-label {
            width: 60px;
        }

        .layui-form-label {
            width: 70px;
        }

        .layui-input-block {
            margin-left: 90px;
        }

        .permission-box {
            padding: 10px;
        }

        .permission-box .layui-form-checkbox {
            margin-top: 10px;
        }

        .permission-box .layui-form-checkbox span {
            width: 100px;
        }

        .layui-form-item {
            margin-top: 10px;
        }

        #subjectTree {
            height: 98%;
            overflow: auto;
            width: 30%;
            float: left;
            border-right: 1px solid #dcd6d6;
        }
    </style>
    <#include "/js.ftl"/>
    <#--<script type="text/javascript" src="${basePath}/static/lib/vue/vuev2.6.11.js"></script>-->
    <script type="text/javascript" src="${basePath}/static/lib/zTree/js/jquery.ztree.all.min.js"></script>
</head>
<body class="hbody">
<#-- 输入查询层 -->
<div class="search">
    <form id="formSearch" class="layui-form" action="">
        <div class="layui-inline">
            <label class="layui-form-label">角色编号</label>
            <div class="layui-input-inline">
                <input type="text" name="roleId" lay-verify="roleId" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-inline">
            <label class="layui-form-label">角色名称</label>
            <div class="layui-input-inline">
                <input type="text" name="roleName" lay-verify="roleName" autocomplete="off" class="layui-input">
            </div>
        </div>
        <#-- 表单中的操作按钮 -->
        <div class="layui-inline">
            <button type="submit" class="layui-btn clear-btn layui-btn-sm" id="searchButton" lay-filter="search"
                    lay-submit><i class="layui-icon">&#xe615;</i>查 询
            </button>
        </div>
    </form>
</div>
<div id="main" class="layout-main">
    <#-- table表格 -->
    <table id="roleTable" lay-filter="roleAll"></table>
</div>

<ul id="treeDemo" class="ztree" style="height:350px;overflow: auto;"></ul>


<div id="setSubject" style="overflow: hidden;height: 100%">
    <ul id="subjectTree" class="ztree"></ul>
    <form id="mapinfo" class="layui-form" action="" style="float:left;width: 66%;padding-top: 8px;">
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
            <legend>{{title}}地图配置</legend>
        </fieldset>
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
                <div class="layui-input-inline" style="width: 190px;">
                    <input type="text" v-model.number="mapInfo.viewCenterX" placeholder="x坐标" autocomplete="off"
                           class="layui-input">
                </div>
                <div class="layui-form-mid">-</div>
                <div class="layui-input-inline" style="width: 190px;">
                    <input type="text" v-model.number="mapInfo.viewCenterY" placeholder="y坐标" autocomplete="off"
                           class="layui-input">
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">显示层级</label>
                <div class="layui-input-inline" style="width: 190px;">
                    <input type="text" v-model.number="mapInfo.minZoom" placeholder="最小层级" autocomplete="off"
                           class="layui-input">
                </div>
                <div class="layui-form-mid">-</div>
                <div class="layui-input-inline" style="width: 190px;">
                    <input type="text" v-model.number="mapInfo.maxZoom" placeholder="最大层级" autocomplete="off"
                           class="layui-input">
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
    </form>
</div>
<#-- 操作栏 -->
<script type="text/html" id="barRole">
    <a class="layui-btn clear-btn layui-btn-xs" lay-event="setLayerPermission">图层权限</a>
    <#--<a class="layui-btn clear-btn layui-btn-xs" lay-event="setSubjectPermission">专题配置</a>-->
</script>
<script type="text/javascript">
    var sysId = "${Session.sysId!""}";
</script>
<script src="${basePath}/static/lib/util/zy.util.provide.js"></script>
<script src="${basePath}/static/lib/util/zy.util.mq.js"></script>
<script src="${basePath}/static/lib/zTree/js/zy.util.Tree.js"></script>
<script src="${basePath}/static/js/gis/manager/role/list.js"></script>
</body>
</html>
