<#assign basePath=request.contextPath />
<html>

<head>
    <meta charset="utf-8">
    <title>Hello MUI</title>
    <#include "/js.ftl"/>
    <#include "/css.ftl"/>
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/elementUI/index.css">
    <link href="${basePath}/static/lib/mui/css/mui.min.css" rel="stylesheet"/>
    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <script src="${basePath}/static/lib/elementUI/index.js"></script>
    <style>
        html,
        body {
            background-color: #efeff4;
            width:100%;
            height:100%;
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
    </style>
</head>

<body>

<header id="header" class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">选择图层</h1>
</header>

<div class="mui-content">
    <div id="app">
        <el-tree :data="layers" node-key="label"
                 show-checkbox
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 @check-change="handleCheckChange"></el-tree>
    </div>
</div>
<script type="text/javascript">
    mui.init({
        swipeBack:true //启用右滑关闭功能
    });
    mui.plusReady(function(){
        var web = plus.webview.currentWebview();

        var vm = new Vue({
            el: '#app',
            data: {
                layers: web.layers,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            },
            methods: {
                handleNodeClick:function(data) {
                    console.log(data);
                },
                handleCheckChange:function(data, checked, indeterminate){
                    var list = plus.webview.currentWebview().opener();
                    // var main=plus.webview.getWebviewById("A.html");
                    mui.fire(list,'selectedLayers',{selectedLayers:data});
                    mui.back();
                }
            }
        })

    });


</script>

</body>

</html>