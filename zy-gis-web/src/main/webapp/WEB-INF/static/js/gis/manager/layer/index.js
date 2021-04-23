layui.use(['slider', 'layer', 'jquery', 'form'], function () {
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
            selectToolLayers: [],
            mapConfig: null,
            openType: openType
        },
        created: function () {
            var that = this;
            that.dbMapBaseInfo(function (dbdata) {
                that.mapConfig = dbdata;
                that.gisService = new GisService({layui: layui}, dbdata.mapInfo, dbdata.mapInterFace);
            });
            that.dbLayerList(function (data) {
                data.forEach(function (item) {
                    if (item.type === 0) {
                        item['event'] = ['edit', 'remove','export'].reverse();
                    } else {
                        item['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                    }
                    item['drag'] = true;
                });
                that.treeData = data;
                //初始化tree----------
                var buttons = (openType === 'read') ? "" : {
                    add: {
                        type: "add",
                        icon: "",
                        title: '添加',
                        click: function (c) {
                            if (c.type == 1) {
                                that.currentNode = {};
                                that.currentNode.id = c.id;
                                that.currentNode.saveType = 1;//默认添加目录
                                that.currentNode.properties = c.properties || [];
                                that.currentNode.docName = c.docName || '';
                                //that.currentNode.loadUrl = c.loadUrl;
                                that.currentNode.layerIndex = c.layerIndex || 0;
                                that.saveCatalogOrLayer('add', 0);
                            } else {
                                layer.msg('该节点不能新增！', {icon: 5});
                            }
                        }
                    },
                    remove: {
                        type: 'remove',
                        icon: "",
                        title: '删除',
                        class: "",
                        click: function (c) {
                            var index = that.treeData.indexOf(c);
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
                            var index = that.treeData.indexOf(c);
                            if (index === -1) {
                                layer.msg('数据异常!', {icon: 5});
                                return;
                            }
                            that.currentNode = JSON.parse(JSON.stringify(c));
                            if (c.type == 0) {//修改图层信息
                                that.currentNode.saveType = 0;
                                that.saveCatalogOrLayer('update', index);
                            } else {//修改目录
                                that.currentNode.saveType = 1;
                                that.saveCatalog('update', index);
                            }
                            ;
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
                }
                that.baseTree = new zy.util.Tree({
                    id: 'baseTree',
                    data: data,
                    showCheck: true,
                    checkType: "checkbox",
                    isMove: true,
                    buttons: buttons,
                    showIcon: true,
                    onCheck: function (node, checkstatus) {
                        that.setMapLayers();
                    },
                    onClick: function (c, checkstatus) {
                        //开关图层
                        this.onCheck(c, checkstatus)
                    },
                    view:{

                    },
                    beforeDrop: function (sourceNode, targetNode, moveType) {
                        if ('inner' === moveType && targetNode.type == 0) {
                            layer.msg("不能拖动到该位置", {icon: 5});
                            return false;
                        }
                        var data = {
                            sourceId: sourceNode.id,
                            targetId: targetNode.id,
                            type: moveType
                        };
                        if (that.dbMove(data)) {

                            that.findSubject(sourceNode.id, function (data) {
                                if (data && data.length > 0) {
                                    data.forEach(function (node) {
                                        var index = that.treeData.findIndex(function (item) {
                                            return node.id == item.id;
                                        })
                                        if (node.type === 0) {
                                            node['event'] = ['edit', 'remove','export'].reverse();
                                        } else {
                                            node['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                                        }
                                        node['drag'] = true;
                                        var oldData = that.treeData[index];
                                        $.extend(oldData, node);
                                        that.treeData[index] = oldData;
                                    })
                                }
                            });
                            return true;
                        } else {
                            layer.msg("不能拖动到该位置", {icon: 5});
                            return false;
                        }
                    }
                });
            });
        },
        watch: {
            gisService: function (val) {
                var map = this.gisService.createMap({
                    map: 'map',
                    coordinate: $(document.querySelector("#map")).find(".mouseCoordinateSpan")[0],//'mouseCoordinateSpan',
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
                    layersFun: this.selectToolLayers,
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
                    }
                });
            }
        },
        components: {
            vuedraggable: vuedraggable,
        },
        methods: {
            export:function(layer){
                this.findSubject(layer.id,function (data) {
                    console.log('导出',data);
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
                var index = that.treeData.indexOf(layer);
                // if (index === -1) {
                //     layer.msg('数据异常!', {icon: 5});
                //     return;
                // }
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
                                if (node.type === 0) {
                                    node['event'] = ['edit', 'remove','export'].reverse();
                                } else {
                                    node['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                                }
                                that.treeData.push(node);
                            })
                        })
                    })
                }
            },
            orderEnter: function (item, index) {
                var currentIndex = Number(this.currentNode.properties.indexOf(item));
                index = Number(index);
                var targetIndex = index - 1;
                if (index < 1) {
                    layui.layer.open({icon: 5, content: "序号不能小于1"});
                    return
                }

                //获取剪出节点
                var cutElement = this.currentNode.properties.slice(currentIndex, currentIndex + 1)[0];

                this.currentNode.properties.splice(currentIndex, 1);
                this.currentNode.properties.splice(targetIndex, 0, cutElement);
                setTimeout(function () {
                    form.render('checkbox');
                })
            },
            datadragEnd: function (evt) {
                form.render('checkbox');
            },
            getParents: function (data, treeArr) {
                var that = this;
                if (!treeArr) {
                    treeArr = [];
                }
                that.treeData.forEach(function (item) {
                    if (item.id == data.pid) {
                        treeArr.push(item);
                        that.getParents(item, treeArr);
                    }
                })
                return treeArr;
            },
            getChildren: function (data, treeArr) {
                var that = this;
                if (!treeArr) {
                    treeArr = [];
                }
                that.treeData.forEach(function (item) {
                    if (item.pid == data.id) {
                        treeArr.push(item);
                        that.getChildren(item, treeArr);
                    }
                })
                return treeArr;
            },
            /**updateTreeData:function(dbdata){
                var that = this;
                var  childrenLayer = that.getChildren(dbdata);
                childrenLayer.forEach(function (item) {
                    if (item.type == 0){
                        var parentLayer = that.getParents(item);
                        if (!!parentLayer){
                            var selfProperties = Object.assign([],item.selfProperties);
                            if (!selfProperties){
                                selfProperties = [];
                            }
                            parentLayer.forEach(function (value) {
                                if(!!selfProperties){
                                    selfProperties.push.apply(selfProperties,value.selfProperties);
                                }
                            });
                            item.properties = selfProperties;
                            // var index = that.treeData.findIndex(function(layer) {
                            //     return layer.id == item.id;
                            // });
                            // that.treeData[index] = item;
                        }
                    }
                })
            },**/
            setMapLayers: function () {
                var that = this;
                var selectedLayers = this.baseTree.getSelectData();
                //选中到图层 selectedLayers   工具中到图层 selectToolLayers

                //增加时：选中了新到图层，工具条中没有，需要push进去
                for (var m = 0; m < selectedLayers.length; m++) {
                    var temp = selectedLayers[m];
                    var flag = this.selectToolLayers.some(function (item) {
                        return item.id === temp.id;
                    })
                    if (!flag) {
                        $.extend(temp, {opacity: 1, select: false, show: true});
                        this.selectToolLayers.push(temp);
                    }
                }

                //删除时：选中图层少，工具条中多，需要splice
                for (var n = this.selectToolLayers.length; n > 0; n--) {
                    var temp = this.selectToolLayers[n - 1];
                    var flag = selectedLayers.some(function (item) {
                        return item.id === temp.id;
                    })
                    if (!flag) {
                        this.selectToolLayers.splice(n - 1, 1);
                    }
                }
            },
            getSelectData: function () {
                //console.log(this.baseTree.getSelectData());
            },
            saveCatalog: function (type, i) {
                var that = this;
                if ('add' === type) {
                    that.currentNode = {};
                    this.currentNode.saveType = 1
                };
                var layer1 = layer.open({
                    id: "zyMenuMarkLayer"
                    , type: 1
                    , title: 'add' === type ? '添加目录' : '编辑目录'
                    , offset: '20px'
                    , area: ['95%', '95%']
                    , shade: .6
                    , maxmin: true
                    , move: false
                    , content: $('#saveCatalog')
                    , btn: ['提交', '关闭']
                    , success: function (layero, index) {
                        setTimeout(function () {
                            form.render();
                        }, 200);

                        var parents = [];
                        if (!$.isEmptyObject(that.currentNode)) {
                            var data = that.currentNode;
                            parents = that.getParents(data);
                            parents = parents.filter(function (item) {
                                return item.type == 1;
                            });
                            var a = [];
                            if (!!that.currentNode.properties) {
                                that.currentNode.properties.forEach(function (item) {
                                    if (item != null && !!item) {
                                        if (!item['refId'] || item['refId'] == that.currentNode.id) {
                                            item['refName'] = that.currentNode.name;
                                            item['refId'] = that.currentNode.id
                                            a.push(item);
                                        }
                                    }
                                })
                            }
                            parents.forEach(function (item) {
                                if (item.properties) {
                                    item.properties.forEach(function (item1) {
                                        item1['refName'] = item.name;
                                        item1['refId'] = item.id
                                        var make = a.some(function (value) {
                                            return value.field == item1.field
                                        })
                                        if (!make) {
                                            a.push(item1);
                                        }
                                    })
                                }
                            });
                            that.currentNode.properties = a;
                        }
                        document.querySelector("#zyMenuMarkLayer").onscroll = function (e) {
                            var $zyNavFix = $(".zyMenu");
                            //var position = "";
                            if (e.target.scrollTop >= $zyNavFix.height()) {
                                // if (that.currentNode.saveType == 0){
                                //     position = 'fixed'
                                // }
                                var $zyNavFixMarkLayer = $('#zyMenuMarkLayer');
                                $(".configTableTitleMenu").css({
                                    position: 'fixed',
                                    top: $zyNavFixMarkLayer.parent().position().top + $zyNavFixMarkLayer.prev().height(),
                                    width: $zyNavFix.width(),
                                    zIndex: 10
                                })
                            } else {
                                $(".configTableTitleMenu").css({
                                    position: "initial"
                                })
                            }
                        };
                    }
                    , yes: function (index, layero) {
                        if (!that.currentNode.name) {
                            layer.msg('名称不能为空!', {icon: 5});
                            return;
                        }
                        var mask = layer.load(1);
                        var properties = [];
                        if (!!that.currentNode.properties) {
                            properties = that.currentNode.properties.filter(function (item) {
                                return item.refId == that.currentNode.id
                            })
                        }
                        // that.currentNode.selfProperties = properties;
                        that.currentNode.properties = properties;
                        that.dbSaveClass(that.currentNode, function (dbdata) {
                            dbdata['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                            if (!!that.currentNode.id) {//编辑目录
                                var oldData = that.treeData[i];
                                $.extend(oldData, dbdata);
                                that.treeData[i] = oldData;
                                //that.updateTreeData(dbdata);
                                that.findSubject(dbdata.id, function (data) {
                                    if (data && data.length > 0) {
                                        data.forEach(function (node) {
                                            var index = that.treeData.findIndex(function (item) {
                                                return node.id == item.id;
                                            })
                                            if (node.type === 0) {
                                                node['event'] = ['edit', 'remove','export'].reverse();
                                            } else {
                                                node['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                                            }
                                            node['drag'] = true;
                                            var oldData1 = that.treeData[index];
                                            $.extend(oldData1, node);
                                            that.treeData[index] = oldData1;
                                        })
                                    }
                                });
                            } else {//新增目录
                                that.treeData.push(dbdata);
                            }
                            layer.close(mask);
                            layer.close(layer1);

                        }, function () {
                            layer.close(mask);
                            layer.close(layer1);
                        });
                    }
                });
            },
            saveCatalogOrLayer: function (type, i) {
                var that = this;
                var layer1 = layer.open({
                    type: 1
                    , id: "zyNavFixMarkLayer"
                    , title: 'add' === type ? '添加目录或图层信息' : '编辑图层信息'
                    , offset: '20px'
                    , area: ['95%', '95%']
                    , shade: .6
                    , maxmin: true
                    , move: false
                    , content: $('#saveCatalogOrLayer')
                    , btn: ['提交', '关闭']
                    , success: function (layero, index) {
                        setTimeout(function () {
                            form.render();
                        }, 200);
                        var parents = [];
                        if ('add' === type) {
                            var parentData = that.treeData.filter(function (item) {
                                return item.id == that.currentNode.id && item.type == 1;
                            });
                            parents = that.getParents(parentData[0]);
                            parents.push(parentData[0]);
                            parents = parents.filter(function (item) {
                                return item.type == 1;
                            });
                            var a = [];
                            if (!!that.currentNode.properties) {
                                that.currentNode.properties.forEach(function (item) {
                                    if (item != null && !!item) {
                                        if (!item['refId'] || item['refId'] == that.currentNode.id) {
                                            item['refName'] = that.currentNode.name;
                                            item['refId'] = that.currentNode.id;
                                            a.push(item);
                                        }
                                    }
                                })
                            }
                            parents.forEach(function (item) {
                                if (item.properties) {
                                    item.properties.forEach(function (item1) {
                                        if (item1 != null && !!item) {
                                            item1['refName'] = item.name;
                                            item1['refId'] = item.id
                                            var make = a.some(function (value) {
                                                return value.field == item1.field
                                            })
                                            if (!make) {
                                                a.push(item1);
                                            }
                                        }
                                    })
                                }
                            });
                            that.currentNode.properties = a;
                        } else if ('update' === type) {
                            if (!!that.currentNode.properties) {
                                that.currentNode.properties.forEach(function (item) {
                                    if (item != null && !!item) {
                                        if (!item['refId'] || item['refId'] == that.currentNode.id) {
                                            item['refName'] = that.currentNode.name;
                                            item['refId'] = that.currentNode.id;
                                        }
                                    }
                                })
                            }
                        }
                        // else if ('update' === type){
                        //     var data = that.currentNode;
                        //     parents = that.getParents(data);
                        //     parents = parents.filter(function (item) {
                        //         return item.type == 1;
                        //     });
                        // }
                        document.querySelector("#zyNavFixMarkLayer").onscroll = function (e) {
                            var $zyNavFix = $(".zyNavFix");
                            var position = "";
                            if (e.target.scrollTop >= $zyNavFix.height()) {
                                if (that.currentNode.saveType == 0) {
                                    position = 'fixed'
                                }
                                var $zyNavFixMarkLayer = $('#zyNavFixMarkLayer');
                                $(".configTableTitle").css({
                                    position: position,
                                    top: $zyNavFixMarkLayer.parent().position().top + $zyNavFixMarkLayer.prev().height(),
                                    width: $zyNavFix.width(),
                                    zIndex: 10
                                })
                            } else {
                                $(".configTableTitle").css({
                                    position: "initial"
                                })
                            }
                        };
                    }
                    , yes: function () {
                        if (!that.currentNode.name) {
                            layer.msg('名称不能为空!', {icon: 5});
                            return;
                        }
                        var mask = layer.load(1);
                        if ('add' === type && that.currentNode.saveType == 1) {//添加目录
                            var properties = that.currentNode.properties.filter(function (item) {
                                return item.refId == that.currentNode.id
                            })
                            var data = {
                                name: that.currentNode.name, pid: that.currentNode.id, type: 1, properties: properties,
                                docName: that.currentNode.docName, layerIndex: that.currentNode.layerIndex
                            }
                            that.dbSaveClass(data, function (dbdata) {
                                dbdata['event'] = ['add', 'edit', 'remove','export','import'].reverse();
                                that.treeData.push(dbdata);
                                layer.close(mask);
                            }, function () {
                                layer.close(mask);
                            })
                        } else if ('add' === type && that.currentNode.saveType == 0) {//添加图层
                            var properties = that.currentNode.properties.filter(function (item) {
                                return item.refId == that.currentNode.id
                            })
                            that.currentNode['properties'] = properties;
                            that.currentNode['pid'] = that.currentNode.id;
                            that.currentNode['id'] = null;
                            that.currentNode.type = 0;
                            var data = that.currentNode;
                            var value = data.layerIndex;
                            // if (!!value && typeof value != 'number') {
                            //     layer.close(mask);
                            //     layer.msg('图层索引必须为数字!', {icon: 5});
                            //     return;
                            // }
                            that.dbSaveInfo(data, function (dbdata) {
                                dbdata['event'] = ['edit', 'remove','export'].reverse();
                                that.treeData.push(dbdata);
                                layer.close(mask);
                            }, function () {
                                layer.close(mask);
                            })
                        } else if ('update' === type && that.currentNode.saveType == 0) {//编辑图层
                            //var properties = that.currentNode.properties.filter(function (item) { return item.refId == that.currentNode.id })
                            //that.currentNode['properties'] = properties;
                            that.currentNode.type = 0;
                            var data = that.currentNode;
                            var value = data.layerIndex;
                            // if (!!value && typeof value != 'number') {
                            //     layer.close(mask);
                            //     layer.msg('图层索引必须为数字!', {icon: 5});
                            //     return;
                            // }
                            that.dbSaveInfo(data, function (dbdata) {
                                dbdata['event'] = ['edit', 'remove','export'].reverse();
                                var oldData = that.treeData[i];
                                $.extend(oldData, dbdata);
                                that.treeData[i] = oldData;
                                layer.close(mask);
                            }, function () {
                                layer.close(mask);
                            })
                        }
                        layer.close(layer1);
                        that.forceUpdate();
                        setTimeout(function () {
                            form.render('checkbox');
                        }, 200)
                    }
                    , end: function () {
                        $(".configTableTitle").css({
                            position: "initial"
                        })
                    }
                });
            },
            deleteNode: function (id, index) {
                var that = this;
                var mask = layer.load(1);
                layer.confirm("确认删除吗？", {title: '提示', icon: 3}, function (indexlay) {
                    that.dbDelete(id, function (dbdata) {
                        that.treeData.splice(index, 1);
                        that.setMapLayers();
                        layer.close(indexlay);
                        layer.close(mask);
                    });
                }, function (indexlay) {
                    layer.close(indexlay);
                    layer.close(mask);
                });
            },
            addProperties: function () {
                if (!this.currentNode.properties) {
                    this.$set(this.currentNode, "properties", [{
                        refId: this.currentNode.id,
                        refName: this.currentNode.name,
                        show: true
                    }]);
                }
                this.currentNode.properties.unshift({
                    refId: this.currentNode.id,
                    refName: this.currentNode.name,
                    show: true
                });
                this.forceUpdate();
            },
            delProperty: function (index) {
                this.$delete(this.currentNode.properties, index);
                this.forceUpdate();
            },
            forceUpdate: function () {
                this.$forceUpdate();
                setTimeout(function () {
                    form.render('checkbox');
                })
            },
            findLeafNodes: function (data, pid, arr) {
                var that = this;
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var z = data[i]
                    if (z.pid == pid) {
                        if (z.type == 0) {
                            arr.push(z);
                        } else {
                            that.findLeafNodes(data, z.id, arr);
                        }
                    }
                }
            },
            /**toggleLayer: function (c, checkstatus) {
                var that = this;
                if (checkstatus) {
                    that.gisService.addLayer(c);
                } else {
                    that.gisService.removeLayer(c.layer);
                }
            },**/
            resetProperties: function (node, callback, errorBack) {
                var that = this;
                var node = this.currentNode;
                var ip = this.mapConfig.mapInterFace.serverIp;
                var port = this.mapConfig.mapInterFace.serverPort;
                // if(node.loadType === 'wmts'){
                //     this.resetPropertiesWMTS(ip,port,callback);
                //     return;
                // }
                var data = {
                    "f": "json",
                    "gdbp": node.gdbpUrl,
                    "cursorType": "",
                    "dataService": "",
                    "fields": "",
                    "guid": "",
                    "isAsc": false,
                    "layerIdxs": "",
                    "geometryType": "point",
                    "geometry": "0,0",
                    "structs": "{IncludeAttribute:true,IncludeGeometry:true,IncludeWebGraphic:false}",
                    "rule": "{CompareRectOnly:false,EnableDisplayCondition:false,MustInside:false,Intersect:true}",
                    "page": "0",
                    "pageCount": "200",
                    "where": ""
                };
                var url = 'http://' + ip + ':' + port + '/igs/rest/mrfs/docs/' + node.docName + "/0/" + node.layerIndex + "/query";
                if (node.gdbpUrl) {
                    url = "http://" + ip + ":" + port + "/igs/rest/mrfs/layer/query";
                }
                $.post({
                    url: url,
                    dataType: 'json',
                    data: JSON.stringify(data)
                }).done(function (res) {
                    var FldName = res.AttStruct.FldName;
                    var FldAlias = res.AttStruct.FldAlias;
                    var FldType = res.AttStruct.FldType;
                    var propertiesList = [];
                    for (var m = 0; m < FldName.length; m++) {
                        var temp = {
                            field: FldName[m] || '',
                            name: (FldName[m] || '') + (!!FldAlias[m] ? ("," + FldAlias[m] || "") : ""),
                            fieldType: FldType[m] || '',
                            show: true,
                            title: FldAlias[m] || FldName[m],
                            refId: that.currentNode.id,
                            refName: that.currentNode.name
                        };
                        propertiesList.push(temp);
                    }
                    ;
                    if (!!that.currentNode.properties) {
                        var tmp = [];
                        that.currentNode.properties.forEach(function (item, index) {
                            if (!item.refId || item.refId == that.currentNode.id) {
                                tmp.push(item);
                            }
                            var maker = propertiesList.some(function (value) {
                                return value.field == item.field
                            });
                            if (maker) {
                                tmp.push(item);
                            }
                        })
                        tmp.forEach(function (item) {
                            var index = that.currentNode.properties.indexOf(item);
                            that.currentNode.properties.splice(index, 1);
                        })
                        // propertiesList.forEach(function (value) {
                        //     that.currentNode.properties.unshift(value);
                        // })
                        that.currentNode.properties.push.apply(that.currentNode.properties, propertiesList);
                    } else {
                        that.currentNode.properties = propertiesList;
                    }
                    that.forceUpdate();
                    layer.msg("重置成功！", {icon: 1});
                    callback && typeof callback == 'function' && callback();
                }).fail(function (res) {
                    errorBack && typeof errorBack == 'function' && errorBack();
                    layer.msg("服务器忙，请稍后重试！", {icon: 5});
                });
            },
            /**resetPropertiesWMTS:function(ip,port,callback,errorBack){
                var that = this;
                var node = this.currentNode;
                if(!node.strLayersInfo){
                    layer.msg("wmts服务必须输入通用查询参数！",{icon:5});
                    return;
                }
                var data = {
                    "strLayersInfo":node.strLayersInfo,
                    "geometry":"38389524.785946414,3861285.978158565 38455091.84323808,3876979.0771168983 38519584.03073808,3870744.8323252313 38524743.40573808,3825170.353158565 38486263.067196414,3796363.8427418983 38437678.95261308,3787119.962533565 38377916.192196414,3797223.7385752313 38385655.254696414,3835274.1292002313 38389524.785946414,3861285.978158565",
                    "geomType":14,
                    "geomSRSName":"高斯大地坐标系_中国2000_38带3_北2",
                    "OutSRSName":"高斯大地坐标系_中国2000_38带3_北2",
                    "strSpatialRelation":"Intersect",
                    "pageSize":1,
                    "pageIndex":10,
                    "returnGeometry":true
                };
                $.post({
                    url:'http://'+ip+':'+port+'/lnd/rest/comms/QueryFeature',
                    dataType:'json',
                    data:JSON.stringify(data),
                    contentType:'application/json; charset=utf-8'
                }).done(function (res) {
                    try{
                        res = res[0].LstFeatureResult[0].FeatureAttr;
                        res = Object.keys(JSON.parse(res));
                        var propertiesList = [];
                        for(var m=0;m<res.length;m++){
                            var temp ={
                                field: res[m],
                                name: res[m],
                                show: true,
                                title: res[m],
                                isEdit : true
                            };
                            propertiesList.push(temp);
                        };
                        if (!!that.currentNode.properties) {
                            var tmp = [];
                            that.currentNode.properties.forEach( function (item,index) {
                                var maker = propertiesList.some(function (value) { return value.field == item.field });
                                if(maker){
                                    tmp.push(item);
                                }
                            })
                            tmp.forEach(function(item){
                                var index  = that.currentNode.properties.indexOf(item);
                                that.currentNode.properties.splice(index,1);
                            })
                            that.currentNode.properties.push.apply(that.currentNode.properties,propertiesList);
                        } else {
                            that.currentNode.properties = propertiesList;
                        }
                        that.$forceUpdate();
                        layer.msg("重置成功！",{icon:1});
                        callback && typeof callback == 'function' && callback();
                    }catch(e){
                        console.log(e);
                        layer.msg("服务器忙，请稍后重试！",{icon:5});
                    }
                }).fail(function (res) {
                    errorBack && typeof errorBack == 'function' && errorBack();
                    layer.msg("服务器忙，请稍后重试！",{icon:5});
                })
            },**/
            dbMapBaseInfo: function (callback, errorBack) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/config/info',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg('获取数据异常', {icon: 5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        console.log(e);
                    }
                });
            },
            dbLayerList: function (callback, errorBack) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/layer/list',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg('获取数据异常', {icon: 5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        console.log(e);
                    }
                });
            },
            /**dbSubjectList: function (callback,errorBack) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/subject/list',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg(res.data,{icon:5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        layer.msg(e.data,{icon:5});
                    }
                });
            },**/
            dbSaveImport:function(data, callback, errorBack){
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/layer/saveImportLayer',
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
            dbSaveClass: function (data, callback, errorBack) {
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/layer/class/save',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            //alert('ajax保存目录有异常！！')
                            layer.msg(res.data, {icon: 5});
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        console.log(e);
                    }
                });
            },
            dbSaveInfo: function (data, callback, errorBack) {
                $.ajax({
                    type: "POST",
                    url: basePath + '/gis/layer/info/save',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data)
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg(res.data, {icon: 5})
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbDelete: function (id, callback, errorBack) {
                $.ajax({
                    type: "DELETE",
                    url: basePath + '/gis/layer/' + id,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {//res后台返回的数据
                        if (res.success) {
                            callback && typeof callback == 'function' && callback(res.data);
                        } else {
                            errorBack && typeof errorBack == 'function' && errorBack(res.data);
                            layer.msg('删除失败', {icon: 5})
                        }
                    },
                    error: function (e) {
                        errorBack && typeof errorBack == 'function' && errorBack();
                        layer.msg(e.data, {icon: 5});
                    }
                });
            },
            dbMove: function (data) {
                var flag;
                $.ajax({
                    url: basePath + '/gis/layer/move',
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
                })
                return flag;
            },
            findSubject: function (id, callback, errorBack) {
                $.ajax({
                    type: "GET",
                    url: basePath + '/gis/layer/findSubject/' + id,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
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
                        layer.msg(e.data, {icon: 5});
                    }
                });
            }
        }
    });
})
