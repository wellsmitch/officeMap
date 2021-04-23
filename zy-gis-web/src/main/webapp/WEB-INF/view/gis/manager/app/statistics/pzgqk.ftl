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
    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <link href="${basePath}/static/lib/mui/css/mui.min.css" rel="stylesheet"/>
    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <style>
        html,
        body {
            background-color: #efeff4;
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
        .module-sub-title {
            margin-top: 10px;
            margin-bottom: 10px;
            height: 25px;
            line-height: 25px;
            padding: 0px !important;
            border: none !important;
        }
        .module-sub-title span {
            border-left: 5px solid #1269d3;
            padding-left: 8px;
            font-weight: bold;
            display: inline-block;
        }
    </style>
</head>

<body>

<header id="header" class="mui-bar mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title title"></h1>
</header>

<div class="mui-content">
    <div style="padding:4px;">
        <div class="module-sub-title">
            <span class="title"></span>
        </div>
        <#--<div class="overflow" style="margin: 10px 0;">
            <div class="fl blue_block" style="margin-top: 2px; margin-left: 0px;"></div>
            <div class="fl title">批而未征</div>
        </div>-->
        <table class="layui-hide" id="xzqhtjTable" lay-filter="xzqhtjTable"></table>
    </div>
    <div style="padding:4px;">
        <div class="module-sub-title">
            <span>土地列表<i id="areaName"style="font-style: normal;margin-left: 10px;color: red;"></i></span>
        </div>
        <#--<div class="overflow" style="margin: 10px 0;">
            <div class="fl blue_block" style="margin-top: 2px; margin-left: 0px;"></div>
            <div class="fl">土地列表<span class="xzqhName" style="fontweight:bold;color:red;"></span></div>
        </div>-->
        <table class="layui-hide" id="tdListTable" lay-filter="tdListTable"></table>
    </div>
</div>
<script type="text/javascript">
    mui.init({
        swipeBack:true //启用右滑关闭功能
    });
    layui.use('table', function(){
        var table = layui.table;
        var type = getQueryString("type");
        var urlObj = {
            "pewz" : {tabUrl : "/eg/statistics/getOneMapPewzTable",listUrl : "/eg/statistics/pewzLandList",title : "批而未征"},
            "pewg" : {tabUrl : "/eg/statistics/getOneMapPewgTable",listUrl : "/eg/statistics/pewgLandList",title : "批而未供"}
        };

        $(".title").text(urlObj[type].title);

        table.render({
            elem: '#xzqhtjTable'
            ,url:basePath + urlObj[type].tabUrl
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,totalRow: true
            ,cols: [[
                {field:'areaName', width:120, title: '行政区',align:'center',totalRowText: '合计'}
                ,{field:'caseNum', title: '数量(宗)',align:'center', totalRow: true, templet: function (e) {
                        return "<span style='cursor: pointer;color: blue;'>" + e.caseNum + "</span>"
                    }}
                ,{field:'area',title: '面积(平方米)',align:'center', totalRow: true}
            ]]
            ,response: {
                statusName: 'success',
                statusCode: true,
                msgName: 'data',
                countName: 'totalCount',
                dataName: 'results'
            }
        });

        table.render({
            elem: '#tdListTable',
            id: 'tdListTable',
            page: {layout: ['prev', 'page', 'next', 'count']},
            limit: 10,
            data: [],
            cols: [[
                {type:'numbers', width:60, title: '序号',align:'center'},
                {field: 'landCode', title: '地块代码',align:'center', minWidth: 185},
                {field: 'location', title: '坐落',align:'center', minWidth: 110},
                {field: 'area', title: '面积(平方米)', align: 'right', minWidth: 110}
            ]]
        });

        //监听行单击事件（双击事件为：rowDouble）
        table.on('row(xzqhtjTable)', function(obj){
            //标注选中样式
            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');

            var data = obj.data;

            $('#areaName').text('-- ' + data.areaName);
            var areaNum = getXzqhCode(data.areaName);

            $.get(basePath + urlObj[type].listUrl,{areaNum : areaNum},function (res) {
                if (res.success) {
                    table.reload('tdListTable', {
                        data: res.data
                    });
                }
            });

            table.on('row(tdListTable)', function(obj) {
                //标注选中样式
                obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
            })


        });

    });

    function getXzqhCode(name) {
        var xzqh = {
            "中原区":"410102",
            "二七区":"410103",
            "管城回族区":"410104",
            "金水区":"410105",
            "上街区":"410106",
            "惠济区":"410108",
            "郑州市本级":"410111",
            "中牟县":"410122",
            "郑东新区":"410170",
            "经开区":"410171",
            "高新区":"410172",
            "巩义市":"410181",
            "荥阳市":"410182",
            "新密市":"410183",
            "新郑市":"410184",
            "登封市":"410185"
        };
        return name ? xzqh[name] : name;
    };
</script>

</body>

</html>