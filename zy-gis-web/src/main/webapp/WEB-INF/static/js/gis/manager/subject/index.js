layui.use(['element', 'slider', 'layer', 'jquery', 'form'], function () {
    var slider = layui.slider,
        layer = layui.layer,
        $ = layui.jquery,
        form = layui.form;


    form.on("switch(switch)", function (data) {
        var elem = data.elem;
        var id = data.value;
        var name = elem.getAttribute('name');
        // var list = vm.currentNode.layerInfoList;
        // for (var i = 0; i < list.length; i++) {
        //     if (list[i].layerInfo.id == id) {
        //         list[i].property[name] = !list[i].property[name];
        //     }
        // }
        var value = elem.checked;
        var selector = "." + elem.className.replace(/\s/ig, ".");
        $(elem).parents(".list-group-item:first").find(selector).each(function () {
            this.checked = value;
        });
        form.render('checkbox');
    });

    var vm = new Vue({
        el: '#wrapper',
        data: {
            gisService: null,
            subjectData: [],//初始化树数据
            subjectTree: null,
            layerData: [],
            layerDataMap: {},
            layerTree: null,
            currentNode: {mapInfo: {}, mapInterFace: {}, layerInfoList: []},
            businessLayers: [],
            title: '默认',
            baseMapConfig: {},
            selTempArr: []
        },
        components: {
            vuedraggable: vuedraggable,
        },
        created: function () {
            var that = this;

            that.dbMapBaseInfo(function (dbdata) {
                that.baseMapConfig = {mapInfo: dbdata.mapInfo, mapInterFace: dbdata.mapInterFace};
                that.gisService = new GisService({layui: layui}, dbdata.mapInfo, dbdata.mapInterFace);
            });

            that.dbSubjectList(function (dbdata) {
                dbdata.forEach(function (item) {
                    item['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                    item['drag'] = true;
                    if (!!item.layerInfoList) {
                        for (var i = item.layerInfoList.length - 1; i >= 0; i--) {
                            if (!item.layerInfoList[i].layerInfo) {//去掉空专题
                                item.layerInfoList.splice(i, 1);
                                break;
                            }
                            item.layerInfoList[i].property["opacity_show"] = item.layerInfoList[i].property.opacity * 100;

                            // if(!!item.mapInfo){
                            //     that.addRepeatAttr(that.baseMapConfig.mapInfo,item.mapInfo);
                            // }else{
                            //     item.mapInfo = Object.assign({},that.baseMapConfig.mapInfo);
                            // }
                        }
                    }
                });
                that.subjectData = dbdata;

                that.subjectTree = new zy.util.Tree({
                    id: 'subjectTree',
                    data: dbdata,
                    showCheck: true,
                    isMove: true,
                    checkType: "checkbox",
                    buttons:
                        {
                            add: {
                                type: "add",
                                icon: "",
                                title: '添加',
                                click: function (c) {
                                    that.currentNode = {mapInfo: {}, mapInterFace: {}, layerInfoList: []};
                                    that.currentNode.pid = c.id;
                                    that.saveSubject('addchildren');
                                }
                            },
                            remove: {
                                type: 'remove',
                                icon: "",
                                title: '删除',
                                class: "",
                                click: function (c) {
                                    var index = that.subjectData.indexOf(c);
                                    if (index === -1) {
                                        layer.msg('数据异常!', {icon: 5});
                                        return;
                                    }
                                    that.deleteNode(c.id, index);
                                    return false;
                                }
                            },
                            edit: {
                                type: 'edit',
                                icon: "",
                                title: '编辑',
                                class: "",
                                click: function (c) {
                                    var index = that.subjectData.indexOf(c);
                                    if (index === -1) {
                                        layer.msg('数据异常!', {icon: 5});
                                        return;
                                    }
                                    that.currentNode = JSON.parse(JSON.stringify(c));
                                    that.currentNode.mapInfo = {};
                                    that.currentNode.mapInterFace = {};
                                    that.currentNode.layerInfoList = that.currentNode.layerInfoList || [];
                                    that.saveSubject('update', index);
                                    return false;
                                }
                            },
                            export:{
                                type:'export',
                                icon:'iconfont icon-daochu treeCustomBtn',
                                title:'导出',
                                class:'',
                                click:function(c){
                                    that.export(c);
                                }
                            },
                            import:{
                                type:'import',
                                icon:'iconfont icon-daoru treeCustomBtn',
                                title:'导入',
                                class:'',
                                click:function(c){
                                    that.import(c);
                                }
                            }
                        },
                    showIcon: true,
                    onCheck: function (c, checkstatus) {
                        that.resetBusinessLayers();
                    },
                    onClick: function (c, checkstatus) {
                        this.onCheck(c, checkstatus)
                    },
                    beforeDrop: function (a, b, c) {
                        console.log("beforeDrop", a, b, c);
                        return true;
                    },
                    beforeDrop: function (sourceNode, targetNode, moveType) {
                        var data = {
                            sourceId: sourceNode.id,
                            targetId: targetNode.id,
                            type: moveType
                        };
                        if (that.dbMove(data)) {
                            return true;
                        } else {
                            layer.msg("不能拖动到该位置", {icon: 5});
                            return false;
                        }
                    }
                });

            });

            that.dbLayerList(function (dbdata) {
                that.layerData = dbdata;
                dbdata.forEach(function (item) {
                    that.layerDataMap[item.id] = item;
                });
                // dbdata.forEach(function (item) {
                //     var parent = that.layerDataMap[item.pid];
                //     if (parent) {
                //         if (!parent.children) {
                //             parent.children = [];
                //         }
                //         parent.children.push(item);
                //     }
                // });
            });
        },
        watch: {
            gisService: function (val) {
                var map = this.gisService.createMap({
                    map: 'map',
                    coordinate: 'mouseCoordinateSpan',
                    zoom: 'mapLevelSpan'
                });
                // 拖动
                Drag("#wrapper", "#resource", {
                    selector: "#configMap",
                    rightDomShow: true,
                    width: "80%",
                }, {}, this.gisService);

                var toolBar = new ToolBar(this.gisService, {
                    ZoomIn: true,
                    ZoomOut: true,
                    layersFun: this.businessLayers,
                    featureQuery: {},
                    reSite: true,
                    treasureArea: true,
                    treasureLine: true,
                    rollingShutter: true,
                    multiScreenT: true,
                    bufferAnalysis: true,
                    clear: {
                        show: true,
                    },
                    search: {
                        placeholder: "请输入兴趣点名称",
                        queryType: "poi"
                    },
                    select: function (event) {
                        var xy = event.coordinate;
                        var x = xy[0], y = xy[1];
                        var selectLayers = function () {
                            alert()
                        };
                    }
                });
            }
        },
        methods: {
            export:function(layer){
                this.findSubject(layer.code,function (data) {
                    console.log('导出',data);
                    if (data && data.length > 0){
                        data.forEach(function (subject) {
                            subject.mapInfo = {};
                            subject.mapInterFace = {};
                            if (subject.layerInfoList && subject.layerInfoList.length > 0){
                                subject.layerInfoList.forEach(function (layerInfo) {
                                    delete layerInfo.layerInfo.opacity;
                                    delete layerInfo.layerInfo.zoom;
                                    delete layerInfo.layerInfo.show;
                                    delete layerInfo.layerInfo.select;
                                    delete layerInfo.layerInfo.analysis;
                                })
                            }
                        })
                    }
                    var text = JSON.stringify(data, null, 4);
                    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, layer.name+'.json');
                },function () {

                })
            },
            import:function(layer){
                var that = this;
                $("#layerFile").val("")
                $("#layerFile").click();
                that.currentNode = {};
                var index = that.subjectData.indexOf(layer);
                that.currentNode = JSON.parse(JSON.stringify(layer));
            },
            layerFileChange:function(fileObj){
                var that = this;
                var files = fileObj.target.files;
                if (files != null && files.length > 0) {
                    that.gisService.fileResolveJson(files[0],function (data) {
                        data[0].pid = that.currentNode.id;
                        that.dbSaveImport(data,function (layers) {
                            console.log('导入成功')
                            layers.forEach(function (node) {
                                node['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                                that.subjectData.push(node);
                                that.resetBusinessLayers();
                            })
                        })
                    })
                }
            },
            saveSubject: function (type, i) {
                var that = this;
                if ('addRoot' === type) {
                    that.currentNode = {mapInfo: {}, mapInterFace: {}, layerInfoList: []};
                    that.currentNode.type = 1;
                }
                console.log(that.currentNode)
                var layer1 = layer.open({
                    type: 1
                    , id: "zyNavFixMarkLayer"
                    , title: 'addRoot' === type ? '配置根专题' : '配置子专题'
                    , offset: '20px'
                    , area: ['95%', '95%']
                    , shade: .6
                    , maxmin: true
                    , move: false
                    , content: $('#saveSubject')
                    , btn: ['提交', '关闭']
                    , success: function (layero, index) {
                        console.log("------------------------------------------------------------------------------------------------------------");
                        $('#layerInfoListDiv').empty();
                        new Sortable($('#layerInfoListDiv')[0], {
                            group: {
                                name: 'nested',
                                pull: false,
                                put: false
                            },
                            animation: 150,
                            fallbackOnBody: true
                        });

                        var layerInfoList = that.currentNode.layerInfoList;
                        layerInfoList.forEach(function (node) {
                            if(!node.layerInfo){
                                return;
                            }
                            var layerInfo = that.layerDataMap[node.layerInfo.id];
                            // 循环查找上级节点
                            var parentList = new Array();
                            var parent = that.layerDataMap[layerInfo.pid];
                            while (parent) {
                                parentList.unshift(parent);
                                parent = that.layerDataMap[parent.pid];
                            }
                            // 处理目录拖动
                            parentList.forEach(function (parent) {
                                if ($('#' + parent.id).length != 0) {
                                    return;
                                }
                                var dirDom = that.createDom(parent, {});
                                that.addDom(parent, dirDom);
                            });
                            // 添加最后一级节点
                            var layerInfoDom = that.createDom(layerInfo, node.property);
                            that.addDom(layerInfo, layerInfoDom);
                        });
                        form.render();
                        console.log("------------------------------------------------------------------------------------------------------------");
                    }
                    , yes: function (index, layero) {
                        if (!that.currentNode.name) {
                            layer.msg('专题名不能为空!', {icon: 5});
                            return;
                        }
                        that.romoveRepeatAttr(that.currentNode.mapInfo, that.baseMapConfig.mapInfo);
                        var layerInfoList = [];
                        $("#layerInfoListDiv").find(".list-group-item").each(function () {
                            var property = {};
                            // 设置属性信息
                            var layerOptionDom = $(this).children(".layer-option");
                            layerOptionDom.find("input[type='text']").each(function () {
                                var name = this.name;
                                var value = this.value;
                                if (name == "opacity") {
                                    value = value / 100;
                                }
                                property[name] = value;
                            });
                            layerOptionDom.find("input[type='checkbox']").each(function () {
                                property[this.name] = this.checked;
                            });
                            // 设置图层信息
                            var info = Object.assign({}, that.layerDataMap[this.id]);
                            var layerInfo = {layerInfo: info, property: property};
                            layerInfoList.push(layerInfo);
                        });
                        that.currentNode.layerInfoList = layerInfoList;
                        that.dbSaveSubjectClass(that.currentNode, function (dbdata) {
                            dbdata['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                            if (!!that.currentNode.id) {//编辑专题
                                that.subjectData[i] = dbdata;
                            } else {//新增目录或子专题
                                that.subjectData.push(dbdata);
                            }
                            layer.close(layer1);
                            $('#layerInfoListDiv').empty();
                            that.resetBusinessLayers();
                        });
                    },
                    btn2: function (index, layero) {
                        $('#layerInfoListDiv').empty();
                    },
                    cancel: function () {
                        $('#layerInfoListDiv').empty();
                    }
                });
            },
            removeDom(layerInfo) {
                $('#' + layerInfo.id).remove();
            },
            addDom(layerInfo, dom) {
                if (layerInfo.lvl <= 1) {
                    return;
                }
                // 添加子目录
                var parentHtml = $('#' + layerInfo.pid);
                if (parentHtml.length != 0) {
                    parentHtml.append(dom);
                } else {
                    $('#layerInfoListDiv').append(dom);
                }
            },
            createDom(node, property) {
                if (node.type == 1) {
                    return this.createDirDom(node, property);
                } else {
                    return this.createLayerDom(node, property);
                }
            },
            createDirDom(dir, property) {
                var dirDom = $("<div id=\"" + dir.id + "\" class=\"list-group-item nested-1\"><span class=\"dir-name no-sortable\">" + dir.name + "</span></div>");
                // 添加操作区域
                var optionDom = this.createOptionDom({layerInfo: dir, property: property});
                dirDom.append(optionDom);
                // 控制子级目录显示隐藏
                dirDom.find(".dir-name").click(function () {
                    $(this).parents(".list-group-item:first").children(".list-group-item").toggle();
                });
                // 层级超过2级的目录不展示
                if (dir.lvl > 2) {
                    dirDom.hide();
                }
                // 创建可拖动对象
                new Sortable(dirDom[0], {
                    group: {
                        name: 'nested',
                        pull: false,
                        put: false
                    },
                    animation: 150,
                    filter: '.no-sortable',
                    fallbackOnBody: true
                });
                return dirDom;
            },
            createLayerDom(layerInfo, property) {
                var layerInfoDom = $("<div id=\"" + layerInfo.id + "\" class=\"list-group-item nested-2\"><span class='no-sortable'>" + layerInfo.name + "</span></div>")

                if (layerInfo.lvl > 2) {
                    layerInfoDom.hide();
                }

                var optionDom = this.createOptionDom({layerInfo: layerInfo, property: property});
                layerInfoDom.append(optionDom);

                return layerInfoDom;
            },
            /**
             * 创建操作区元素
             * @param node
             * @returns {*|jQuery|HTMLElement}
             */
            createOptionDom(node) {
                var layerInfo = node.layerInfo;
                var property = node.property;
                var optionDom = $("<div class='layer-option no-sortable' style='float: right;'></div>");
                var opacityDom = $("<div class='layer-info-option'><input type=\"text\" name=\"opacity\" value=\"" + ((property.opacity * 100) || '') + "\" style='width: 50px' autocomplete=\"off\" class=\"layui-input layer-prop-opacity\"></div>");
                var zoomDom = $("<div class='layer-info-option'><input type=\"text\" name=\"zoom\" value=\"" + (property.zoom || '') + "\" style='width: 50px' autocomplete=\"off\" class=\"layui-input layer-prop-zoom\"></div>");
                var isDhowDom = $("<div class='layer-info-option'><input type=\"checkbox\" name=\"show\"" + (property.show ? 'checked=\"checked\" ' : '') + "lay-filter=\"switch\" lay-skin=\"switch\" lay-text=\"是|否\" class=\"layer-prop-show\"></div>");
                var isSelectDom = $("<div class='layer-info-option'><input type=\"checkbox\" name=\"select\"" + (property.select ? 'checked=\"checked\" ' : '') + "lay-filter=\"switch\" lay-skin=\"switch\" lay-text=\"是|否\" class=\"layer-prop-select\"></div>");
                var isAnalysis = $("<div class='layer-info-option'><input type=\"checkbox\" name=\"analysis\"" + (property.analysis ? 'checked=\"checked\" ' : '') + "lay-filter=\"switch\" lay-skin=\"switch\" lay-text=\"是|否\" class=\"layer-prop-analysis\"></div>")
                var deleteDom = $("<div class='layer-info-option'><a class=\"layui-btn layui-btn-danger layui-btn-xs\">删除</a></div>");
                optionDom.append(opacityDom).append(zoomDom).append(isDhowDom).append(isSelectDom).append(isAnalysis).append(deleteDom);
                // 设置文本框光
                // 标选中
                optionDom.children().click(function () {
                    var inputDom = $(this).find("input[type='text']");
                    if (inputDom.length == 0) {
                        return;
                    }
                    inputDom[0].selectionStart = inputDom.val().length;
                    inputDom[0].selectionEnd = inputDom.val().length;
                    inputDom.blur()
                    inputDom.focus();
                });
                // 设置文本框数据发生变化时，同步更新子节点数据
                optionDom.find("input").change(function () {
                    var value = this.value;
                    var selector = "." + this.className.replace(/\s/ig, ".");
                    $(this).parents(".list-group-item:first").find(selector).val(value);
                });
                // 删除事件
                deleteDom.click(function () {
                    optionDom.parents(".list-group-item:first").remove();
                });
                return optionDom;
            },
            selectLayer: function () {
                var that = this;
                var layer1 = layer.open({
                    type: 1
                    , title: '选择图层'
                    , skin: 'layui-layer-rim'
                    , area: ['400px', '500px']
                    , shade: .6
                    , maxmin: true
                    , content: $('#selectLayer')
                    , btn: ['提交', '关闭']
                    , success: function (layero, index) {
                        that.layerData.forEach(function (item) {
                            item.checked = false;
                        });

                        $('#layerInfoListDiv').find(".list-group-item").each(function () {
                            that.layerDataMap[this.id].checked = true;
                        });

                        that.layerTree = new zy.util.Tree({
                            id: 'layerTree',
                            data: that.layerData,
                            showCheck: true,
                            checkType: "checkbox",
                            buttons: {},
                            showIcon: true
                        });
                    }
                    , yes: function (index, layero) {
                        // 获取老数据
                        var oldIdList = [];
                        $('#layerInfoListDiv').find(".list-group-item").each(function () {
                            oldIdList.push(this.id);
                        });

                        // 插入新数据
                        var selectLayers = that.layerTree.getSelectData();
                        selectLayers.forEach(function (layer) {
                            var index = oldIdList.indexOf(layer.id);
                            if (index != -1) {
                                oldIdList.splice(index, 1);
                                return;
                            }
                            var property = {
                                opacity: 1,
                                zoom: '1-19',
                                show: false,
                                select: false,
                                analysis: false
                            };
                            var dom = that.createDom(layer, property);
                            that.addDom(layer, dom);
                            // 获取兄弟节点是否是展开状态
                            var brotherDom = $('#' + layer.id).prev(".list-group-item:first");
                            if (brotherDom.length == 0) {
                                brotherDom = $('#' + layer.id).next(".list-group-item:first");
                            }
                            if (brotherDom.length != 0) {
                                if (!brotherDom.is(":hidden")) {
                                    dom.show();
                                }
                            }
                        });

                        // 删除非勾选处理
                        oldIdList.forEach(function (oldId) {
                            that.removeDom({id: oldId});
                        })
                        // 重新渲染表单并关闭窗口
                        form.render('checkbox');
                        layer.close(layer1);
                    }
                });
            },
            updateSelectLayers: function (layers/*,flag*/) {
                var that = this;
                layers.forEach(function (layer) {
                    if (layer.checkstatus) {//新增
                        var property = {
                            opacity: 1,
                            opacity_show: 100,
                            zoom: '1-19',
                            show: true,
                            select: false,
                            analysis: false
                        };
                        var str = "";
                        that.getParentNodesArrById(layer.obj.id).splice(1).forEach(function (node, index) {
                            str += (index === 0) ? node.name : " / " + node.name;
                        });
                        that.currentNode.layerInfoList.unshift({layerInfo: layer.obj, property: property});
                    } else {//删除
                        var layerList = that.currentNode.layerInfoList;
                        for (var i = layerList.length - 1; i >= 0; i--) {
                            if (layer.obj.id == layerList[i].layerInfo.id) {
                                layerList.splice(i, 1);
                            }
                        }
                    }
                });
                /*if(flag){//新增
                    var property = {opacity: 1,opacity_show:100,zoom: '1-19',show: true,select: false,analysis: false};
                    layers.forEach(function (layer) {
                        var str = "";layer.newName = "";
                        that.getParentNodesArrById(layer.id).splice(1).forEach(function (node,index) {
                            str+=(index ===0)? node.name : " / "+node.name;
                        });
                        layer.newName = str;
                        that.currentNode.layerInfoList.unshift({layerInfo: layer, property: property});
                    });
                }else{//删除
                    layers.forEach(function (layer) {
                        var layerList = that.currentNode.layerInfoList;
                        for(var i = layerList.length-1;i>=0;i--){
                            if(layer.id == layerList[i].layerInfo.id){
                                layerList.splice(i,1);
                            }
                        }
                    })
                }*/
            },
            setSubjectMapInfo: function () {
                var that = this;
                var layer1 = layer.open({
                    type: 1
                    , title: '专题图基本信息配置'
                    , skin: 'layui-layer-rim'
                    , area: ['50%', '54%']
                    , shade: .6
                    , maxmin: true
                    , content: $('#setSubjectMapInfo')
                    , btn: ['提交', '关闭']
                    , success: function (layero, index) {
                        that.addRepeatAttr(that.baseMapConfig.mapInfo, that.currentNode.mapInfo);
                    }
                    , yes: function (index, layero) {
                        layer.close(layer1);
                    }
                });
            },
            resetBusinessLayers: function () {
                var that = this;
                var layerlist = this.subjectTree.getSelectData();
                /* this.subjectTree.getSelectData().forEach(function (item, index) {
                     if (item.layerInfoList && item.layerInfoList.length > 0) {
                         layerlist = layerlist.concat(item.layerInfoList);
                     }
                 });*/
                layerlist = layerlist.map(function (item) {
                    if (Array.isArray(item.layerInfoList)) {
                        item.layerInfoList.forEach(function (ele) {
                            Object.assign(ele, ele.layerInfo, ele.property);
                        })
                    }
                    return item;
                });

                //去重复
                // layerlist = this.distinct(layerlist);
                //增加
                layerlist.forEach(function (item) {
                    /*if (that.businessLayers.filter(function (busLayer) {
                        return item.layer == busLayer.layer;
                    }).length == 0) {
                        that.businessLayers.push(item);
                    }*/
                    if (that.businessLayers.filter(function (busLayer) {
                        return item.id === busLayer.id;
                    }).length === 0) {
                        that.businessLayers.push(item);
                    }
                    // that.businessLayers.push(item);
                });

                //删除
                for (var m = that.businessLayers.length - 1; m >= 0; m--) {
                    if (!layerlist.some(function (ele, i) {
                        return ele.id === that.businessLayers[m].id;
                    })) {
                        that.businessLayers.splice(m, 1);
                    }
                }
                /* var removeIndexList = [];
                 that.businessLayers.forEach(function (busLayer) {
                     if (layerlist.filter(function (item) {
                         return item.id == busLayer.id;
                     }).length == 0) {
                         removeIndexList.push(busLayer);
                     }
                 });
                 removeIndexList.forEach(function (busLayer) {
                     var index = that.businessLayers.indexOf(busLayer);
                     that.businessLayers.splice(index, 1);
                 });*/
            },
            deleteNode: function (id, index) {
                var that = this;
                layer.confirm("确认删除吗？", {title: '提示', icon: 3}, function (indexlay) {
                    that.dbDelete(id, function (dbdata) {
                        that.subjectData.splice(index, 1);
                        that.resetBusinessLayers();
                        layer.close(indexlay);
                    });
                });
            },
            forceUpdate: function () {
                this.$forceUpdate();
            },
            findLeafNodes: function (data, pid, arr, checkstatus) {
                var that = this;
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var z = data[i]
                    if (z.pid == pid) {
                        if (z.type == 0) {
                            arr.push({obj: z, checkstatus: checkstatus});
                        } else {
                            that.findLeafNodes(data, z.id, arr, checkstatus);
                        }
                    }
                }
            },
            delLayerProperty: function (index, type) {
                var that = this;
                if ('del' === type) {
                    var acindex = layer.confirm("确认删除吗？", {title: '提示', icon: 3}, function (indexlay) {
                        that.currentNode.layerInfoList.splice(Number(index), 1);
                        layer.close(acindex)
                    });
                }
                that.forceUpdate()
            },
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
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbSubjectList: function (callback) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/subject/list',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            findSubject: function (id, callback,errorBack) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/subject/findSubNodes/'+id,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof  errorBack == 'function' && errorBack();
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof  errorBack == 'function' && errorBack();
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbSaveImport:function(data, callback, errorBack){
                console.log(data)
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/subject/saveImportSubject',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        console.log(e);
                    }
                });
            },
            dbSaveSubjectClass: function (data, callback) {
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/subject/save',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbDelete: function (id, callback) {
                $.ajax({
                    type: "DELETE",
                    url: basePath + '/gis/subject/' + id,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data);
                        } else {
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbLayerList: function (callback) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/layer/list',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            distinct: function (arr) {
                var obj = {}
                var newArr = []
                for (var i = 0; i < arr.length; i++) {
                    if (!obj[arr[i].id]) {
                        obj[arr[i].id] = arr[i];
                        newArr.push(arr[i])
                    }
                }
                return newArr
            },
            dbMove: function (data) {
                var flag;
                $.ajax({
                    url: basePath + '/gis/subject/move',
                    type: 'POST',
                    data: data,
                    async: false,
                    success: function (res) {
                        if (res.success) {
                            flag = true;
                        } else {
                            layer.msg(res.data, {icon: 5});
                            flag = false;
                        }
                    },
                    error: function (e) {
                        layer.msg(e.data, {icon: 5});
                        flag = false;
                    }
                });
                return flag;
            },
            addRepeatAttr: function (dataA, dataB) {
                for (var key in dataA) {
                    if (!dataB[key]) {
                        dataB[key] = dataA[key];
                    }
                }
            },
            romoveRepeatAttr: function (dataA, dataB) {
                for (var key in dataA) {
                    for (var kk in dataB) {
                        if (dataA[key] == dataB[kk]) {
                            delete dataA[key];
                        }
                    }
                }
            },
            dragEnd: function () {
                form.render();
            },
            getParentNodesArrById: function (id) {
                var that = this;
                var pNodesArr = [];
                treeWalk(id);
                return pNodesArr;

                function treeWalk(id) {
                    var currentNode = that.layerDataMap[id];
                    pNodesArr.unshift(currentNode);
                    var pid = currentNode.pid;
                    if (that.layerDataMap[pid]) {
                        treeWalk(that.layerDataMap[pid].id);
                    }
                }
            }

        },
    });


})
