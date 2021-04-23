<#assign basePath=request.contextPath />
<html>

<head>
    <meta charset="utf-8">
    <title>用地报批统计</title>
    <#include "/js.ftl"/>
    <#include "/css.ftl"/>
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <link href="${basePath}/static/lib/mui/css/mui.min.css" rel="stylesheet"/>
    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <script src="${basePath}/static/lib/echarts/echarts.min.js"></script>
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
    <h1 id="title" class="mui-title"></h1>
</header>

<div class="mui-content">
    <div id="ywtjChart" style="width: 100%;height:50%;"></div>

    <div class="ywtjTable">
        <div style="overflow: hidden;">
            <div style="float: right;color: #666;font-size: 12px;">数量：宗 &nbsp;&nbsp;&nbsp;&nbsp; 面积：平方米 &nbsp;&nbsp;&nbsp;&nbsp;</div>
        </div>
        <div class="layout-main" style="height:50%;overflow: auto;">
            <table class="layui-table" id="dataTab" lay-filter="dataTab" lay-data="{url:'${basePath}/eg/statistics/getOneMap${type}Table',response : {statusName : 'success',statusCode : true,msgName : 'data',countName : 'totalCount',dataName : 'results'},totalRow: true}">
                <thead>
                <tr>
                    <th lay-data="{field:'areaName',align:'center',fixed: 'left',width:'100',totalRowText: '合计'}" rowspan="2">行政区</th>
                    <th class="year" lay-data="{align:'center'}" colspan="2"></th>
                    <th class="year" lay-data="{align:'center'}" colspan="2"></th>
                    <th class="year" lay-data="{align:'center'}" colspan="2"></th>
                </tr>
                <tr>
                    <th lay-data="{field:'caseNum1',totalRow: true,align:'right',width:'60'}">数量</th>
                    <th lay-data="{field:'area1',totalRow: true,align:'right',width:'110'}">面积</th>
                    <th lay-data="{field:'caseNum2',totalRow: true,align:'right',width:'60'}">数量</th>
                    <th lay-data="{field:'area2',totalRow: true,align:'right',width:'110'}">面积</th>
                    <th lay-data="{field:'caseNum3',totalRow: true,align:'right',width:'60'}">数量</th>
                    <th lay-data="{field:'area3',totalRow: true,align:'right',width:'110'}">面积</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
</div>
<script type="text/javascript">
    mui.init({
        swipeBack:true //启用右滑关闭功能
    });
    var type = getQueryString("type");
    var titleObj = {
        "Ydbp" : "用地报批统计",
        "Tdcb" : "土地储备统计",
        "Tdgy" : "土地供应统计"
    };

    $("#title").text(titleObj[type]);

    $.get(basePath + "/eg/statistics/getYears",function (res) {
        if (res.success) {
            var data = res.data,year = $(".year");
            year.each(function (i,e) {
                $(e).text(data[i]+'年');
            });
        } else {

        }
    });

    var ywtjChart = echarts.init(document.getElementById('ywtjChart'),'light');
    $.get(basePath + "/eg/statistics/getOneMap"+type+"Histogram",function (res) {
       if (res.success) {
           var data = res.data,year = data.year,area = data.area,count = data.count;
           for (var i in year) {
               year[i] = year[i]+'年';
           }
           var product = ['product'],countData = ['数量(宗)'],areaData = ['面积(平方米)'];
           product = product.concat(year);
           countData = countData.concat(count);
           areaData = areaData.concat(area);
           var option = {
               tooltip: {
                   trigger: 'axis',
                   axisPointer: {
                       // type: 'cross',
                       animation: false,
                       crossStyle: {
                           color: '#999'
                       }
                   }
               },
               legend: {
                   data:['数量(宗)','面积(平方米)']
               },
               grid: {
                   left: 30,
                   right: 75
               },
               xAxis: {
                   type: 'category',
                   axisPointer: {
                       type: 'shadow'
                   },
                   splitLine: {
                       show: false
                   },
                   axisLine:{
                       lineStyle:{
                           color:'#959595'
                       }
                   }
               },
               yAxis: [
                   {
                       type: 'value',
                       name: '数量(宗)',
                       splitLine: {
                           show: false
                       },
                       axisLine:{
                           lineStyle:{
                               color:'#959595'
                           }
                       }
                   },
                   {
                       type: 'value',
                       name: '面积(平方米)',
                       splitLine: {
                           show: false
                       },
                       axisLine:{
                           lineStyle:{
                               color:'#959595'
                           }
                       }
                   }
               ],
               dataset:{
                   source:[
                       product,
                       countData,
                       areaData
                   ]
               },
               series: [
                   // 这几个系列会在第一个直角坐标系中，每个系列对应到 dataset 的每一行。
                   {
                       type: 'bar',
                       barGap: 0,
                       barWidth:32,
                       seriesLayoutBy: 'row',
                       itemStyle: {
                           color: '#55aaff',
                           borderColor: '#000000',
                           borderWidth:0.3
                       }
                   },
                   {
                       type: 'bar',
                       barWidth:32,
                       seriesLayoutBy: 'row',
                       yAxisIndex: 1,
                       itemStyle: {
                           color: '#00d600',
                           borderColor: '#000000',
                           borderWidth:0.5
                       }
                   },
               ]
           };
           ywtjChart.setOption(option);
       } else {

       }
    });

    layui.use('table', function(){
        var table = layui.table;
        table.reload('dataTab');
    });
</script>

</body>

</html>