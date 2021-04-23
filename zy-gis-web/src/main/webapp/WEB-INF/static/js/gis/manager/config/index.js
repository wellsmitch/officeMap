layui.use(['element', 'layer', 'form', 'jquery'], function () {
    var layer = layui.layer,
        $ = layui.jquery;

    var vm = new Vue({
        el: '#baseConfigSetting',
        data: {
            mapInfo:{},
            mapAppInfo:{},//App端
            mapInterFace:{},//PC端接口匹配值
            mapAppInterFace:{},//App端接口匹配值
        },
        methods: {
            dataSubmit:function(){
                var that = this;
                var data = {mapInfo:that.mapInfo,mapInterFace:that.mapInterFace,mapAppInterFace:that.mapAppInterFace,mapAppInfo:that.mapAppInfo};
                this.dbSave(data,function (dbdata) {
                    layer.msg('保存成功！', {icon: 6});
                })
            },
            dbInfo: function (callback) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/config/info',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            alert('ajax获取数据有异常！！')
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            },
            dbSave: function (data, callback) {
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/config/save',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            alert('ajax保存目录有异常！！')
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            },
        },
        created:function () {
            var that = this;
            this.dbInfo(function (dbdata) {
                if(dbdata.mapInfo){
                    that.mapInfo = dbdata.mapInfo;
                };
                if(dbdata.mapInterFace){
                    that.mapInterFace = dbdata.mapInterFace;
                };
                if(dbdata.mapAppInfo){
                    that.mapAppInfo = dbdata.mapAppInfo;
                };
                if(dbdata.mapAppInterFace){
                    that.mapAppInterFace = dbdata.mapAppInterFace;
                }
            })
        }
    });
})