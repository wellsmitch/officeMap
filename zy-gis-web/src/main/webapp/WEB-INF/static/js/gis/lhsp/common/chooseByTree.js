layui.define(["layer","jquery"],function (exports) {

    var obj = {
        tree : function (url,title,data,id,openData,callback) {
            layer.open({
                title : title,
                skin : 'layui-layer-rim',
                type : 2,
                area : ['890px','420px'],
                content : basePath + url+"?id="+id+"&data=" +encodeURIComponent(JSON.stringify(data)),
                btn : ['确定','关闭'],
                success: function(layero, index){
                    window["layui-layer-iframe" + index].sucessCallback(openData);
                    //弹出页面
                    // var iframeObj = layero.children().eq(1).children();
                    // var data = iframeObj[0].callback();
                    // callback(data);
                },
                yes : function(index, layero) {
                    var data = window["layui-layer-iframe" + index].callback();
                    callback(data);
                    layer.close(index);
                },
                end : function() {
                }
            });
        }
    }
    exports("chooseByTree",obj);
});
