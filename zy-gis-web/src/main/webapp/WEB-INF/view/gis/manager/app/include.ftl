<#assign basePath=request.contextPath />
<meta http-equiv="pragma" content="no-cache"/>
<meta http-equiv="content-type" content="no-cache, must-revalidate"/>
<meta http-equiv="expires" content="Wed, 26 Feb 1997 08:21:57 GMT"/>
<link rel="icon" type="image/x-icon" href="${basePath}/static/image/favicon.ico"/>
<link href="${basePath}/static/fonts/iconfont.css" rel="stylesheet"/>
<link href="${basePath}/static/header_fonts/iconfont.css" rel="stylesheet"/>
<link href="${basePath}/static/lib/layui/css/layui.css" rel="stylesheet"/>
<link href="${basePath}/static/lib/mui/css/mui.min.css" rel="stylesheet"/>
<link href="${basePath}/static/lib/mui/css/icons-extra.css" rel="stylesheet"/>
<link rel="stylesheet" href="${basePath}/static/lib/mui/css/mui.picker.min.css">
<#--<style>
    [v-cloak] {
        display: none;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .overflow {
        overflow: hidden;
    }

    #zcgl .mui-checkbox input[type=checkbox]:before, .mui-radio input[type=radio]:before {
        font-size: 20px;
    }

    #topCon .mui-input-group .mui-input-row:after {
        background: transparent;
    }

    #attachmentList:after {
        background: transparent;
    }

    body a, body a:hover, body a:active, body a:visited, body a:link, body a:focus {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
        outline: none;
        /*background: none;*/
        text-decoration: none;
        color: #fff;
    }

    .mui-bar.mui-bar-tab.mui-bar-tab2 .mui-tab-item .mui-icon, .mui-bar.mui-bar-tab.mui-bar-tab2 .mui-tab-item .iconfont {
        color: #4a9efe;
        font-weight: 800;
    }

    .mui-bar.mui-bar-tab.mui-bar-tab2 .mui-tab-item .mui-tab-label {
        color: #4a9efe;
    }

    .mui-bar.mui-bar-tab.mui-bar-tab2 .mui-tab-item .mui-icon.mui-icon-loop {
        font-size: 20px;
    }
</style>-->
<script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
<script src="${basePath}/static/lib/mui/js/mui.picker.min.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jquery-1.12.4.min.js"></script>
<#--<script type="text/javascript" src="${basePath}/static/js/jquery.cookie.js"></script>-->
<#--<script type="text/javascript" src="${basePath}/static/lib/jquery.base64.js"></script>-->
<#--<script type="text/javascript" src="${basePath}/static/lib/layui/layui.all.js"></script>-->
<#--<script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>-->
<#--<script type="text/javascript" src="${basePath}/static/lib/require.js"-->
<#--data-main="${basePath}/static/js/modules/app.js"></script>-->
<#--<script type="text/javascript" src="${basePath}/static/lib/browser5.5.23.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/polyfill7.4.4.js"></script>-->
<script type="text/javascript" src="${basePath}/static/lib/ol3/js/ol-debug.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/ol3/js/proj4-src.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/ol3/js/zondyClient.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/ol3/js/transferProjection.js"></script>


<script type="text/javascript" charset="utf-8">
    window.onload = function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    };
    // if (!window.top.windowQueue) {
    //     window.top.windowQueue = new Array();
    // }
    // var windowQueue = window.top.windowQueue;
    windowQueue = new Array();
    mui.back = function () {
        if (windowQueue.length == 0) {
            window.history.back();
            return false;
        }
        windowQueue.pop().close();
        return false;
    };
    mui.open = function (config) {
        windowQueue.push(config);
        if (config && config.open) {
            config.open();
        }
        // console.log("开启窗口");
    };
    mui.close = function () {
        if (windowQueue.length > 0) {
            var win = windowQueue.pop();
            if (win && win.close) {
                win.close();
            }
        } else {
            // window.history.back();
        }
        // console.log("关闭窗口");
    };
    mui.alert = function (bigTitle, content) {

        var html = "<div class=\"mui-popup mui-popup-in\" id='customAlert' style=\"display: block;\"><div class=\"mui-popup-inner\"><div class=\"mui-popup-title\">" + (bigTitle || content) + "</div><div class=\"mui-popup-text\">" + (bigTitle && content) + "</div></div><div class=\"mui-popup-buttons\"><span class=\"mui-popup-button mui-popup-button-bold\">确定</span></div></div>";
        $('body').append(html);
        $('body').append("<div id='customPromptBg' class='mui-popup-backdrop mui-active' style='display: block;'></div>");
        mui("#customAlert").on("tap", ".mui-popup-buttons span", function (e) {
            $('#customPromptBg').remove();
            $('#customAlert').remove();
        });
    };

    mui.prompt = function (bigTitle, config, title, btns, callback) {
        var html = "<div class=\"mui-popup mui-popup-in\" id='customPrompt' style=\"\">" +
            "<div class=\"mui-popup-inner\">" +
            "<div class=\"mui-popup-title\">" + (bigTitle || '') + "</div>" +
            "<div class=\"mui-popup-text\">" + (title || '') + "</div>\n" +
            (config.text == 'input' ? "<input  class=\"mui-popup-input\"/> " : "<div class=\"mui-popup-input\"><textarea></textarea></div>") +
            // "<div class=\"mui-popup-input\"><textarea></textarea></div>" +
            "</div>" +
            "<div class=\"mui-popup-buttons\"><span class=\"mui-popup-button\">取消</span><span class=\"mui-popup-button mui-popup-button-bold\">确定</span></div>" +
            "</div>";
        $('body').append(html);

        $('body').append("<div id='customPromptBg' class='mui-popup-backdrop mui-active' style='display: block;'></div>");

        mui("#customPrompt").on("tap", ".mui-popup-buttons span", function (e) {
            var index = $(e.target).index('#customPrompt .mui-popup-button');
            if (index > 0) {
                callback({
                    index: index,
                    value: ($('#customPrompt textarea').length > 0 ? $('#customPrompt textarea').val() : $('#customPrompt input').val())
                });
            }
            $('#customPromptBg').remove();
            $('#customPrompt').remove();
        });
    }
</script>
<script type="text/javascript">
    var basePath = '${basePath}';
    var shares = null, sharewx = null;
    $(document).ajaxError(function (event, request, settings) {
        if (request.status == 407) {
            mui.toast("请重新登录");
            if (window.top) {
                window.top.location.href = basePath;
            } else {
                location.href = basePath;
            }
        } else {
            var text = request.responseText || request.statusText;
            if (!text) {
                if (request.readyState == 0) {
                    text = "网络连接失败，请检查网络是否正常";
                }
            }
            mui.toast(text);
        }
    }).ajaxSend(function (event, request, settings) {
        if (settings.url.indexOf('?') != -1) {
            settings.url = settings.url + '&ajaxDate=' + Date.parse(new Date());
        } else {
            settings.url = settings.url + '?ajaxDate=' + Date.parse(new Date());
        }
    });

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    document.addEventListener('plusready', Plusready, false)

    function Plusready() {
        //监听接收透传消息事件
        plus.push.addEventListener('receive', function (msg) {
            //处理透传消息的业务逻辑代码
            var d = $.parseJSON(msg.content);
            var s = $.parseJSON(d.data), url = '';
            for (var key in s) {
                url += key + '=' + s[key] + '&';
            }
            if (d.type == 0) { // 流程
                window.location.href = basePath + '/oa/gw/gl/html/app/detail?' + url;
            } else if (d.type == 1) {   // 邮件
                window.location.href = basePath + '/oa/ems/html/app/ems/show?' + url;
            } else if (d.type == 2) {   // 通知
                window.location.href = basePath + '/oa/not/html/app/notice/tsxq?' + url;
            }
        }, false);
    }

    //    手机端loading
    function showLoading(msg) {
        if ($('.ajaxLoading').length > 0) {
            return
        }
        var dom = '<div class="ajaxLoading">' +
            '<style type="text/css"> ' +
            'html,body {height: 100%;margin: 0;padding: 0;}' +
            '.mapLoadingPanel{padding: 38px 0 10px;}' +
            '.ajaxLoading {width: 124px; background: rgba(0,0,0,.6);border-radius: 6px;position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 99999;margin: auto;height: 124px}' +
            '.mapLoading {' +
            'line-height: 1;font-size: 30px;text-align: center;color: #fff;' +
            'animation: rotateInfinite 1.5s linear infinite;}' +
            ' @keyframes rotateInfinite {\n' +
            '     0% {\n' +
            '         transform: rotate(0);\n' +
            '         transform-origin: center;\n' +
            '     }\n' +
            '     100% {\n' +
            '         transform: rotate(360deg);\n' +
            '         transform-origin: center;\n' +
            '     }\n' +
            ' }' +
            '</style>' +
            '<div>' +
            '<div class="mapLoadingPanel">' +
            '<div class="mapLoading iconfont icon-jiazailoading-B"></div>' +
            '</div>' +
            '</div>' +
            '<div style="color:#fff;font-size: 14px;text-align: center;line-height: 56px">'+(msg && msg.toString().substr(0,6) ||' 处理中...')+'</div>' +
            '</div>';
        $("body").append(dom)
    }

    function hideLoading() {
        $('.ajaxLoading').remove();
    }
</script>
<#-- 手机端 适配脚本 别删-->
<script type="text/javascript">
    var bw = (document.documentElement.clientWidth / 7.5) + "px";
    var htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.style.fontSize = bw;
</script>