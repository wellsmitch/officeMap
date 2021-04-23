<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>文件上传</title>
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
    <link rel="stylesheet" type="text/css" href="${basePath}/static/lib/viewerjs/viewer.min.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/upload.css">
    <style>
        .auto-right.fileReleas > .top-bar {
            padding: 0 10px;
        }
        .auto-right.fileReleas .layui-btn-sm {
            height: 20px;
            line-height: 20px;
        }
        /*.fileReleas .center-view {*/
        /*    top: 32px;*/
        /*}*/
        .fileReleas .center-view {
            top: 0px;
        }
    </style>
    <#include "/js.ftl"/>
    <script type="text/javascript" src="${basePath}/static/lib/formdata.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/viewerjs/viewer.min.js"></script>
</head>
<body class="hbody">
<div class="layout-main">
    <div id="uploadView" class="fix-left treeview" style="width: 300px;margin-right: -300px">
        <ul id="categoryTree"></ul>
    </div>
    <div class="auto-right fileReleas" style="margin-left: 300px">
        <p class="top-bar" style="display: none">
            <span>本地文件 </span><span id="path"></span>
            <span id="localFileBar" class="fr">
         <button id="setFolderBtn" class="layui-btn layui-btn-sm">设置目录</button>
         <button id="refreshBtn" class="layui-btn layui-btn-sm">刷新列表</button>
       </span>
            <span id="fileBar" class="fr">
<#--         <button id="localFileBtn" class="layui-btn layui-btn-sm">本地文件列表</button>-->
         <button id="downloadBtn" style="display: none" class="layui-btn layui-btn-sm">下载</button>
         <button id="viewTypeBtn" style="display: none" class="layui-btn layui-btn-sm" title="切换视图"><i class="fa fa-tv"></i></button>
       </span>
        </p>
        <div class="center-view">
            <div id="localFileList" class="filelist">

            </div>
            <div id="imageView" class="imageView">

            </div>
            <iframe id="fileView" name="fileView" class="fileView">
            </iframe>
            <div id="playBar" class="viewer-toolbar play">
                <ul>
                    <li id="prevBtn" role="button" class="viewer-prev" data-viewer-action="prev"></li>
                    <li id="nextBtn" role="button" class="viewer-next" data-viewer-action="next"></li>
                </ul>
            </div>
        </div>
    </div>
    <form id="downloadForm" action="" target="fileView" class="layui-hide" method="post"></form>
</div>
<script type="text/javascript">
    var category =${category!'[]'}, file =${file!'[]'}, readonly =${readonly}, formId = '${formId}',
        mainTable = '${mainTable!''}', mainTableKey = '${mainTableKey!''}', businessKey = '${businessKey!''}',
        tmpKey = '${tmpKey!''}', inProcess =${(RequestParameters.inProcess??)?then('true','false')},
        taskKey = '${taskKey!''}', localDir = (localStorage && localStorage.localDir) || null, fso;
</script>
<script src="${basePath}/static/js/workflow/uploadView.js"></script>
</body>
</html>
