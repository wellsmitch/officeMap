<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>联合审批</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
    <#include "/css.ftl" />
    <#include "/js.ftl" />
    <script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>
    <style type="text/css">
        .layui-table th{text-align: center;}
        .module-title {background-color: #01a5e7;margin-top: 5px;padding: 0;height: 36px;line-height: 36px;position: relative;}
        .module-title span {padding-left: 16px;font-weight: bold;display: inline-block;}
        .module-title button {position: absolute;top: 3px;right: 5px}
        .myPanel {border: 1px solid #e3e3e3;padding: 10px 5px;position: relative;}
        .myPanel .layui-input-inline {width: 240px;}
        .module-sub-title {margin-top: 10px;margin-bottom: 10px;height: 25px;line-height: 25px;padding-top: 0px;}
        .module-sub-title span {border-left: 5px solid #01a5e8;padding-left: 8px;font-weight: bold;display: inline-block;}
        .module-sub-title button {float: right;}
        .layui-btn-sm {margin-left: 15px;padding: 0 8px;height: 28px;line-height: 28px;float: right;}
        .layui-btn i:only-child {margin: 0;}
        .form-box{/*background-color: #f2f2f2;*/padding: 8px 0 0 0;}
        .layui-form-mid button{margin-left: 0;}
        .first-label{width: 90px;}
        .second-label{width: 190px;}
        .one-line{width: 690px !important;}
        .btn-toolbar{cursor: pointer;trasition:.3s}
    </style>
</head>
<body>
<div id="infoPanel" style="height: 100%; overflow: auto;">
    <form id="mainForm" class="layui-form" style="width: auto; margin: 0 auto;">
<#--        <div class="myPanel">-->
            <div class="form-box">
                <div class="layui-form-item">
<#--                    <label class="layui-form-label first-label label-required">议题类型</label>-->
<#--                    <div class="layui-input-inline ">-->
<#--                        <select lay-verify="required"  :disabled="readonly" v-init="xmfa.issueType=xmfa.issueType||''" name="issueType" v-model="xmfa.issueType">-->
<#--                            <option value="1">招拍挂出让</option>-->
<#--                            <option value="2">协议出让</option>-->
<#--                            <option value="3">划拨供应</option>-->
<#--                            <option value="4">新征地收储</option>-->
<#--                            <option value="5">国有地收储</option>-->
<#--                        </select>-->
<#--                    </div>-->
                    <label class="layui-form-label first-label label-required">会议名称</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.xmmc" type="text"  lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>
            <button id="saveBtn" lay-submit class="layui-hide" lay-filter="*">提交</button>
<#--        </div>-->
    </form>
</div>
<script src="${basePath}/static/js/gis/lhsp/xmxx/gis.lhsp.xmxx.js"></script>
<script src="${basePath}/static/js/gis/lhsp/xmxx/form.js"></script>
</body>
</html>
