<#assign basePath=request.contextPath />

<style>
    .height_220 {
        height: 160px;
        position: absolute;
        top:30px;
        padding-bottom: 10px;
        display: none;
        border-bottom: 1px solid #c8c7cc;
    }

</style>

<div id="legendDv" class="height_220">
    <div id="legend" style="font-size: 16px;line-height: 40px;text-align: center">图例</div>
    <ul class="mui-table-view" id="legendList">
    </ul>
    <#--<script src="${basePath}/static/js/gis/manager/app/legend.js"></script>-->
</div>