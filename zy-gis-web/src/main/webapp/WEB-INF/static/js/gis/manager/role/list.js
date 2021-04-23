layui.use(['form', 'table', 'layer'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer;
    // 表格数据
    var tableObj = table.render({
        // table的ID
        elem: '#roleTable',
        // table的高度
        height: 'full-90',
        page: true, // 是否分页
        // 调用的方法
        url: basePath + '/sys/role-getPage?date=' + new Date().getTime(),
        where: {
            sysId: sysId
        },
        // 分页
        page: {
            limits: [10, 50, 100]
        },
        // table表格
        cols: [[{
            title: '序号',
            type: 'numbers',
            width: 60,
            fixed: 'left'
        }, {
            field: 'roleId',
            title: '角色编号',
            width: 200
            // sort : true
        }, {
            field: 'roleName',
            title: '角色名称',
            width: 300
        }, {
            field: 'remarks',
            title: '备注',
            width: 300
        }, {
            field: 'right',
            title: '操作',
            width: 280,
            align: 'center',
            toolbar: "#barRole",
            fixed: 'right'
        }]],
        response: {
            statusName: 'success',
            statusCode: true,
            msgName: 'data',
            countName: 'totalCount',
            dataName: 'results'
        }
    });

    // 查询
    form.on('submit(search)', function (data) {
        table.reload('roleTable', {
            // 这里使用的data.field中,field里面是data的数据
            where: data.field,
            page: {
                curr: 1
                // 重新从第 1 页开始
            }
        });
        return false;
    });

    var layerList = [];
    var layerMap = {};
    var treeObject;
    var subjectList = [];
    var subjectTree;
    $.ajax({
        url: basePath + '/gis/layer/list',
        type: "get",
        success: function (res) {
            if (res.success) {
                layerList = res.data;
                layerList.forEach(function (item) {
                    layerMap[item.id] = item;
                });
            } else {
                layer.msg("查询失败！");
            }
        }
    });
    $.ajax({
        url: basePath + '/gis/subject/list',
        type: "get",
        success: function (res) {
            if (res.success) {
                subjectList = res.data;
            } else {
                layer.msg("查询失败！");
            }
        }
    });

    var vm = new Vue({
        el:'#mapinfo',
        data:{
            title:'默认',
            mapInfo:{},
            mapInfoMap:{},
            baseMapInfo:{},
        },
        created:function(){
            var that = this;
            $.ajax({
                type: "GET",
                url: basePath + '/gis/config/info',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (res) {
                    if (res.success) {
                        that.baseMapInfo = res.data;
                    } else {
                        alert('ajax获取数据有异常！！')
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        methods:{
            forceUpdate: function () {
                this.$forceUpdate();
            },
            update:function(mapInfo){
                this.mapInfo = mapInfo;
            }
        }
    });

    table.on('tool(roleAll)', function (obj) {
        var data = obj.data;
        if (obj.event == 'setLayerPermission') {
            $.ajax({
                url: basePath + '/gis/layer/role/' + data.orgCode + '_' + data.roleId,
                type: "get",
                success: function (res) {
                    if (res.success) {
                        layerList.forEach(function (item) {
                            item.checked = false;
                        });
                        res.data && res.data.forEach(function (item) {
                            if (!item.layerInfo) {
                                return;
                            }
                            layerMap[item.layerInfo.id].checked = true;
                        });
                        treeObject = new zy.util.Tree({id: 'treeDemo', data: layerList, cascadeSelect: false});
                        layer.open({
                            title: '设置资源信息',
                            type: 1,
                            skin: 'layui-layer-rim',
                            area: ['400px'], // 宽高
                            content: $('#treeDemo'),
                            btn: ['确定', '取消'],
                            yes: function () {
                                console.log(data);
                                var layerList = treeObject.getSelectData().map(function (layer) {
                                    return {layerInfo: layer};
                                });
                                var body = {
                                    roleId: data.orgCode + '_' + data.roleId,
                                    layerList: layerList,
                                    orgCode: data.orgCode
                                };

                                $.ajax({
                                    url: basePath + '/gis/layer/role/save',
                                    type: "POST",
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify(body),
                                    success: function (res) {
                                        layer.closeAll('page');
                                        layer.msg("操作成功", {
                                            icon: 6
                                        });
                                    },
                                    error: function () {
                                        layer.closeAll('page');
                                        layer.msg("操作失败", {
                                            icon: 5
                                        });
                                    }
                                });

                                console.log(body);
                            }
                        });
                    } else {
                        layer.msg("查询失败！");
                    }
                }
            });
        } else if (obj.event == 'setSubjectPermission') {
            $.ajax({
                url: basePath + '/gis/subject/role//' + data.orgCode + '_' + data.roleId,
                type: "get",
                success: function (res) {//根据roleId获取该角色自定义配置到mapInfoList
                    vm.mapInfo = vm.baseMapInfo.mapInfo;//设置默认值

                    if (res.success) {
                        vm.subjectRoleList = res.data;
                        vm.subjectRoleList.forEach(function (item) {
                            if (!item.mapInfo) {
                                return;
                            }
                            addRepeatAttr(vm.baseMapInfo.mapInfo,item.mapInfo);
                            vm.mapInfoMap[item["subjectCode"]] = item.mapInfo;
                        });

                        treeObject = new zy.util.Tree({
                            id: 'subjectTree',
                            showCheck:false,
                            data: subjectList,
                            onClick: function (c, checkstatus) {
                                if (!vm.mapInfoMap[c.code]) {
                                    if(c.mapInfo == null){
                                        c.mapInfo = {};
                                    }
                                    vm.$set(vm.mapInfoMap, c.code, c.mapInfo);
                                }
                                addRepeatAttr(vm.baseMapInfo.mapInfo,c.mapInfo);
                                vm.title = c.name;
                                vm.mapInfo = vm.mapInfoMap[c.code];
                            }
                        });


                        layer.open({
                            title: '设置资源信息',
                            type: 1,
                            skin: 'layui-layer-rim',
                            area: ['80%','80%'], // 宽高
                            content: $('#setSubject'),
                            btn: ['确定', '取消'],
                            yes: function () {
                                var subjectRoleList = [];
                                for(var key in vm.mapInfoMap){
                                    if(key && vm.mapInfoMap[key]){
                                        romoveRepeatAttr(vm.mapInfoMap[key],vm.baseMapInfo.mapInfo);
                                        if(JSON.stringify(vm.mapInfoMap[key]) != "{}"){
                                            subjectRoleList.push({
                                                subjectCode:key,
                                                mapInfo:vm.mapInfoMap[key]
                                            });
                                        }
                                    }
                                }
                                var body = {
                                    roleId: data.orgCode + '_' + data.roleId,
                                    subjectRoleList: subjectRoleList,
                                };

                                $.ajax({
                                    url: basePath + '/gis/subject/role/save',
                                    type: "POST",
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    data: JSON.stringify(body),
                                    success: function (res) {
                                        layer.closeAll('page');
                                        layer.msg("操作成功", {
                                            icon: 6
                                        });
                                    },
                                    error: function () {
                                        layer.closeAll('page');
                                        layer.msg("操作失败", {
                                            icon: 5
                                        });
                                    }
                                });

                                console.log(body);
                            }
                        });
                    } else {
                        layer.msg("查询失败！");
                    }
                }
            });
        }
    });

    function addRepeatAttr (dataA, dataB) {
        for(var key in dataA){
            if(!dataB[key]){
                dataB[key] = dataA[key];
            }
        }
    }

    function romoveRepeatAttr (dataA, dataB) {
        for(var key in dataA){
            for(var kk in dataB){
                if(dataA[key] == dataB[kk]){
                    delete dataA[key];
                }
            }
        }
    }



});