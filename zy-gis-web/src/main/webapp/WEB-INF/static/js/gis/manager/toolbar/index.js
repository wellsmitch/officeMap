layui.use(['slider','layer', 'jquery', 'form'], function () {
    var slider = layui.slider,
        layer = layui.layer,
        $ = layui.jquery,
        form = layui.form;
    var openType = getQueryString("openType") || 'write';

    var vm = new Vue({
        el: '#wrapper',
        data: {
            gisService: null,
            treeData: [],//初始化树数据
            currentNode: {},
            baseTree: '',
            selectToolLayers:[],
            mapConfig:null,
            openType:openType
        },
        created: function () {
            var that = this;
            that.dbMapBaseInfo(function (dbdata) {
                that.mapConfig = dbdata;
                that.gisService = new GisService({layui: layui}, dbdata.mapInfo, dbdata.mapInterFace);
            });
        },
        watch: {
            gisService:function(val) {
                var map = this.gisService.createMap({
                    map: 'map',
                    coordinate: $(document.querySelector("#map")).find(".mouseCoordinateSpan")[0],//'mouseCoordinateSpan',
                    zoom: 'mapLevelSpan'
                });

                var toolBar = new ToolBar(this.gisService, {
                    ZoomIn: true,
                    ZoomOut: true,
                    layersFun: this.selectToolLayers,
                    featureQuery: {},
                    reSite: true,
                    treasureArea: true,
                    treasureLine: true,
                    rollingShutter: true,
                    multiScreenT:true,
                    clear: {
                        show: true,
                    },
                    search:{
                        placeholder:"请输入兴趣点名称",
                        queryType:"poi"
                    },
                    select: function (event) {
                        var xy = event.coordinate;
                        var x = xy[0], y = xy[1];
                        // var selectLayers = getSelectLayers();
                        var selectLayers = function () {
                            alert()
                        };
                    }
                });
            }
        },
        methods:{
            dbMapBaseInfo: function (callback) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/config/info',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
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
            }
        }
    });
})