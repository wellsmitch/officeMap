<meta http-equiv="pragma" content="no-cache"/>
<meta http-equiv="content-type" content="no-cache, must-revalidate"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Cache" content="no-cache"/>
<meta http-equiv="expires" content="Wed, 26 Feb 1997 08:21:57 GMT"/>
<script type="text/javascript">
    var basePath = '${basePath}';
</script>
<script type="text/javascript" src="${basePath}/static/lib/jquery-1.12.4.min.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jQuery.resize.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jquery.ext.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jquery.cookie.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jqwidgets/jqxsplitter.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/layui/layui.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/jquery.nicescroll.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/layui/xm-select.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/util/zy.util.provide.js"></script>
<script type="text/javascript" src="${basePath}/static/lib/util/zy.util.common.js"></script>
<script type="text/javascript">

    layui.extend({
        chooseByTree: basePath + '/static/js/gis/lhsp/common/chooseByTree'
    });

    layui.use(['layer'], function () {
        layui.layer.config({anim: -1});

    });

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
</script>
