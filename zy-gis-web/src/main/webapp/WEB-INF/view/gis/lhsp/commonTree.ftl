<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>地块业务信息页面</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
    <#include "/css.ftl" />
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/zTree/css/metroStyle/metroStyle.css">
    <#include "/js.ftl" />
    <script type="text/javascript" src="${basePath}/static/lib/zTree/js/jquery.ztree.all.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/zTree/js/jquery.ztree.exhide.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/moment.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/bpmnjs/bpmn-viewer.production.min.js"></script>
    <style type="text/css">
        .layui-btn-sm {margin-left: 15px;padding: 0 8px;height: 28px;line-height: 28px;float: right;}
    </style>
</head>
<body class="hbody">

<!-- 弹出编辑土地用途/规划用途层 -->
<div id="usePanel" style="overflow:hidden;">
    <div style="height: 300px;overflow:auto;float:left;width: 34%;">
        <ul id="usageZTree" class="ztree" style="height: 100%; overflow: auto; box-sizing: border-box;"></ul>
    </div>
    <div style="float:left;width: 65%;">
        <table id="landUseTab" lay-filter="landUseTabFilter"></table>
    </div>
</div>
<script type="text/javascript">

    var treeData =${treeData!'{}'}
</script>
<script type="text/javascript" src="${basePath}/static/js/gis/lhsp/common/commonTree.js"></script>
</body>
</html>
