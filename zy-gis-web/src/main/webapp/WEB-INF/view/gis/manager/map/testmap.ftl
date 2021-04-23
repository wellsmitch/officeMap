<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试地图</title>
    <#include "/js.ftl"/>
    <#include "/css.ftl"/>
    <style>
        html,body{
            width:100%;
            height:100%;
        }
        #wrapper_XMHX{
            position: relative;
            width:100%;
            height:100%;
        }
        .mapCon{
            position: absolute;
            width:70%;
            height:100%;
            left:0;
        }
        .ywxx{
            position: absolute;
            width:30%;
            height:100%;
            right:0;
        }
    </style>
</head>
<body style="overflow: hidden">
<div id="wrapper_XMHX" v-cloak>
    <div class="mapCon" style="right: 0">
        <iframe id="mapIframe" src="${basePath}/gis/map/index/test"
                style="width:100%;height:100%;border: medium none;"></iframe>
    </div>
    <div class="ywxx">
        <h1>信息</h1>
    </div>
</div>
</body>
<script>

    $(function(){

        var iframe = document.getElementById('mapIframe');

        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function() {
                var gisService = Window.getGisService();
                console.log(gisService);
            });
        } else {
            iframe.onload = function() {
                var gisService = iframe.contentWindow.getGisService();
                console.log(gisService);

               /* var params = {layer:'QS4101852019ZDJBXX',mappingId:'987',宗地代码:'asdfasdfa001',备注:'长江路西三环',coordinate:'38462857.7149,3856381.0792 38463407.3646,3854744.3457 38465386.1019,3856087.9329 38464470.0196,3857309.3759 38462857.7149,3856381.0792'}
                gisService.insertFeature(params,function (res) {
                    console.log(res);
                });*/

                // gisService.deleteFeature({mappingId:'987',layer:'QS4101852019ZDJBXX'})

               /* gisService.queryFeature({标识码:'23111',layer:'QS4101852019ZDJBXX'},function (res) {
                    console.log(res);
                });*/

                /*gisService.drawFeature({layer:'QS4101852019ZDJBXX',coordinate:'38462857.7149,3856381.0792 38463407.3646,3854744.3457 38465386.1019,3856087.9329 38464470.0196,3857309.3759 38462857.7149,3856381.0792'});

                gisService.flashFeature({layer:'QS4101852019ZDJBXX',secound:5000});*/


            };
        }
    });



        /*var mapIframe = $('#mapIframe')[0].contentWindow;
        mapIframe.postMessage({type:"add"},"http://localhost:8080");

        function receiveMessage(event){
            console.log(event.data);
        }
        window.addEventListener("message", receiveMessage, false);*/

</script>
</html>
