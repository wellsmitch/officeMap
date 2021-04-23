<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>低效用地</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
</head>
<body>
<form method="post" enctype="multipart/form-data" action="${basePath}/gis/dxyd/importLand">
    <label>线图层名称：<input type="text" name="xLayerName" value="DXYD_X"/></label>
    <label>面图层名称：<input type="text" name="mLayerName" value="DXYD_M"/></label>
    <input name="file" type="file"/>
    <input type="submit" value="提交"/>
</form>
</body>
</html>
