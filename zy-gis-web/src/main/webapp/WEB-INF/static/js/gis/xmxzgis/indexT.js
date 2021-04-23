var gisService, subjectInfo, currInfo = {layer: "X410100XMXZ2020GHBHXMXZ"}, myChart, mainWindow;
var mapLoadEndEventList = [];

function mapLoadEnd() {
    var iframeWindow = document.querySelector("#xmxzGisIframe").contentWindow;
    mainWindow = iframeWindow;
    gisService = iframeWindow.getGisService();
    subjectInfo = iframeWindow.subjectInfo;
    mapLoadEndEventList.forEach(function (event) {
        event && event(gisService);
    });
    // initEchart();
}

function gisServiceInit() {
    if (window.parent && window.parent.getGisService) {
        mainWindow = window.parent;
        gisService = window.parent.getGisService();
        subjectInfo = window.parent.subjectInfo;
        $("#rightDiv").css({
            width: "100%"
        })
        mapLoadEndEventList.forEach(function (event) {
            event && event(gisService);
        });

        // initEchart();
    }
}

layui.use(['table', 'jquery', 'element', 'layer'], function () {
    var table = layui.table;
    var $ = layui.jquery;
    var uIlayer = layui.layer;
    var element = layui.element;
    var gisVue = new Vue({
        el: '#xmxzGis',
        data: {
            //项目列表
            xmList: [],
            //方案列表
            projectList: [],
            //别删  很有可能再次启用页面
            isAdd: false,
            //项目信息
            xmxx: {},
            //方案信息
            faxx: {famc: ''},
            //新增项目 or 选择项目
            newProjectShow: false,
            //用于定位地图所有方案的图元
            allMappingObj: {
                mappingKey: "ID",
                mappingValue: ""
            },
            //结束编辑参数
            modifyFeatureEndObj: false,
            //编辑图元时存储的编辑图元信息（用于结束编辑）
            editingList: [],
            //项目选址对象
            xmxz: {},
            //已画图元
            drawedFeatures: [],
            //绘制导入的图元
            drawedAndImport: {},
            currXmfa: {},
            d: ""
        },
        methods: {
            toogleSpread: function (ev) {
                if (window.getComputedStyle($(ev.currentTarget).parent().next()[0]).display == "block") {
                    $(ev.currentTarget).html("展开")
                } else {
                    $(ev.currentTarget).html("收起")
                }
                $(ev.currentTarget).parent().next().toggle()
            },
            //新增项目 按钮事件
            newProjectAction: function () {
                // this.newProjectShow = true;
                // this.xmxx = {}
                this.editHtml({});
            },
            //返回
            newProjectActionBack: function () {
                this.newProjectShow = false;
                this.xmmxChange(0)
            },
            editHtml: function (data) {
                var that = this;
                var xmxx = new xmxz.xmxx(data);
                xmxx.type = 'write';
                layer.open({
                    title: data.id ? "编辑" : "新增",
                    skin: 'layui-layer-rim',
                    type: 2,
                    area: ['97%', '97%'],
                    content: xmxx.getFormUrl(),
                    btn: ['保存', '取消'],
                    yes: function (index, layero) {
                        var iframeObj = layero.find("iframe");
                        iframeObj[0].contentWindow.saveMethod(function (res) {
                            that.xmmxChange(0)
                        });
                    },
                    end: function (index, layero) {
                    }
                });
            },
            projectDetail(data) {
                this.editHtml(data);
            },
            //添加项目  保存按钮
            addSave: function () {
                var _this = this;
                // this.isAdd = false;
                // xmmcInput
                if (!this.xmxx.xmmcInput) {
                    uIlayer.open({
                        icon: 5,
                        title: '提示'
                        , content: '项目名称不能为空'
                    });
                    return
                }
                if (!this.xmxx.jsdw) {
                    uIlayer.open({
                        icon: 5,
                        title: '提示'
                        , content: '建设单位不能为空'
                    });
                    return
                }
                if (!this.xmxx.jsxz) {
                    uIlayer.open({
                        icon: 5,
                        title: '提示'
                        , content: '建设性质不能为空'
                    });
                    return
                }
                _this.xmxx.xmmc = _this.xmxx.xmmcInput;
                var xmxx_ = new xmxz.xmxx(_this.xmxx);
                xmxx_.save(function (data) {
                    console.log("保存ajax:", data);
                    location.reload()
                });
            },
            //获取项目列表
            getXmlist: function (callback) {
                var _this = this;
                var xmxx_ = new xmxz.xmxx();
                xmxx_.list(function (data) {
                    // console.log("获取项目list:", data);
                    _this.xmList = data;
                    if (typeof callback === "function") {
                        callback()
                    }
                })
            },
            // 项目删除
            projectdelte: function () {
                var _this = this;
                // if (_this.xmxx.xmmc === "花博园项目") {
                //     return;
                // }
                var xmxx_ = new xmxz.xmxx(_this.xmxx);
                xmxx_.delete(function (data) {
                    console.log("项目删除 ajax:", data);
                    location.reload()
                });
            },
            //项目定位
            projectSite: function () {
                var _this = this;
                _this.fixedPosition(this.allMappingObj, function () {
                    // 选中地块颜色闪烁
                    _this.twinkle(_this.currSchemeLand, 5);
                })
            },

            //新增选址方案
            newProjectItem: function (callback) {
                var _this = this;
                // this.isAdd = false;
                // if (!this.xmxx.xmmc) {
                //     uIlayer.open({
                //         icon: 5,
                //         title: '提示'
                //         , content: '项目名称不能为空'
                //     });
                //     return
                // }
                // if (!this.xmxx.jsdw) {
                //     uIlayer.open({
                //         icon: 5,
                //         title: '提示'
                //         , content: '建设单位不能为空'
                //     });
                //     return
                // }
                // if (!this.xmxx.jsxz) {
                //     uIlayer.open({
                //         icon: 5,
                //         title: '提示'
                //         , content: '建设性质不能为空'
                //     });
                //     return
                // }
                // if (!this.faxx.famc) {
                //     uIlayer.open({
                //         icon: 5,
                //         title: '提示'
                //         , content: '方案名称不能为空'
                //     });
                //     return
                // }


                _this.faxx.save(function (data) {
                    console.log("新增选址方案 ajax:", data);
                    _this.getProjectList(_this.xmxx["id"]);
                    // location.reload()
                    callback()
                });
            },
            //获取方案列表
            getProjectList: function (itemId) {
                var _this = this;
                var faxx_ = new xmxz.xmfa({
                    xmxxId: itemId
                });
                faxx_.list(function (data) {
                    // console.log("获取方案列表 ajax:", data);
                    // location.reload()
                    _this.projectList = data;
                    _this.allMappingObj.mappingValue = '';
                    _this.projectList.forEach(function (ele, index) {
                        if (index === 0) {
                            _this.allMappingObj.mappingKey = ele.mappingKey;
                        }
                        if (ele.mappingValue !== undefined && ele.mappingValue != null) {
                            if (index === _this.projectList.length - 1) {
                                _this.allMappingObj.mappingValue += (ele.mappingValue + "")
                            } else {
                                _this.allMappingObj.mappingValue += (ele.mappingValue + ",");
                            }
                        }
                    })
                    _this.drawLand(data);
                });
            },
            //删除方案
            deleteProject: function (item) {
                var _this = this;
                this.faxx.xmxxId = this.xmxx.id;
                // if (item.xmxx.xmmc === "花博园项目") {
                //     return;
                // }
                // return;
                this.fixedPosition(item, function () {
                    var layerA_ = uIlayer.confirm('确认删除' + item.famc + '？', {
                        btn: ['是', '否'] //按钮
                    }, function () {
                        function deleteFaxx() {
                            item.delete(function () {
                                _this.getProjectList(item.xmxxId);
                                uIlayer.close(layerA_);
                                _this.currSchemeLand = [];
                                this.currXmfa = {};
                            });
                        }

                        if (_this.currSchemeLand && _this.currSchemeLand.length != 0) {
                            var i = _this.currSchemeLand.length;
                            _this.currSchemeLand.forEach(function (land) {
                                gisService.deleteFeature(land, function (res) {
                                    if (!res.success) {
                                        gisService.openErrorInfo("图元删除失败");
                                        return;
                                    }
                                    gisService.removeFeature(land);
                                    i--;
                                    if (i == 0) {
                                        deleteFaxx();
                                        gisService.layerRefresh(land);
                                    }
                                });
                            });
                        } else {
                            deleteFaxx();
                        }
                    });
                });
            },
            //导入范围
            importRange: function (item) {
                this.currXmfa = item;
                this.currSchemeLand = [];
                $("#coordinatesFile").click();
            },
            //导出范围
            exportRange: function (item) {
                var _this = this;
                this.fixedPosition(item, function () {
                    // 选中地块颜色闪烁
                    _this.twinkle(_this.currSchemeLand, 5);
                    gisService.exportFeatureJson(_this.currSchemeLand, _this.currXmfa.famc + ".json");
                })
            },
            coordinatesFileChange: function (e) {
                var that = this;
                var files = e.target.files;
                if (files != null && files.length > 0) {
                    gisService.fileResolve(files[0], function (infoList) {
                        var featureList = [];
                        infoList.forEach(function (info) {
                            var coordinate = info.coordinate;
                            var feature = Object.assign({
                                coordinate: coordinate,
                                layer: currInfo.layer,
                                mappingId: gisService.generateUUID('long'),
                                famc: that.currXmfa.famc,
                                zl: that.currXmfa.zl,
                                style: gisService.getDefaultStyleSelector().transparent()
                            }, that.currXmfa);
                            gisService.drawFeature(feature);
                            featureList.push(feature);
                        });
                        var i = 0;
                        var mappingIdList = [];
                        featureList.forEach(function (feature) {
                            gisService.insertFeature(feature, function (res) {
                                i++;
                                if (res.success) {
                                    mappingIdList.push(feature.mappingId);
                                }
                                if (i == featureList.length) {
                                    gisService.layerRefresh(currInfo.layer);
                                    // 新导入地块需要先进行查询，得到fid后才能删除
                                    var params = {
                                        layer: feature.layer,
                                        query_where: that.currXmfa.mappingKey + " in (" + mappingIdList.join() + ")"
                                    };
                                    gisService.queryFeature(params, function (res) {
                                        if (res.success && res.data.length > 0) {
                                            // 当前方案地块添加新地块
                                            res.data.forEach(function (data) {
                                                that.currSchemeLand.push(data);
                                            })
                                        }
                                    });
                                    // 保存方案信息
                                    var xmfa = new xmxz.xmfa(that.currXmfa);
                                    xmfa.mappingValue = (that.currXmfa.mappingValue == undefined || that.currXmfa.mappingValue == null || that.currXmfa.mappingValue == '') ? mappingIdList.join() : that.currXmfa.mappingValue + "," + mappingIdList.join();
                                    var mpArea = featureList.map(function (feature) {
                                        return gisService.getFeatureArea(feature);
                                    }).reduce(function (a, b) {
                                        return a + b;
                                    });
                                    // 处理方案面积
                                    if (xmfa.mj) {
                                        xmfa.mj = (Number(xmfa.mj) + (mpArea / 667)).toFixed(2);
                                    } else {
                                        xmfa.mj = (mpArea / 667).toFixed(2);
                                    }

                                    xmfa.save(function () {
                                        that.currXmfa.mappingValue = xmfa.mappingValue;
                                        that.currXmfa.mj = xmfa.mj;
                                    });
                                }
                            });
                        });
                    });
                }
            },
            //绘制范围
            drawRange: function (item) {
                var that = this;
                console.log("绘制范围", item);
                var itemBark = JSON.parse(JSON.stringify(item)); //drawedAndImport

                function drawPolygon() {
                    gisService.drawPolygon(currInfo.layer, function (feature) {
                        var xmfa = new xmxz.xmfa(that.currXmfa);
                        xmfa.mappingValue = (that.currXmfa.mappingValue == undefined || that.currXmfa.mappingValue == null || that.currXmfa.mappingValue == '') ? feature.mappingId : that.currXmfa.mappingValue + "," + feature.mappingId;
                        that.saveXmfa(xmfa, feature);
                    })
                }

                if (this.currXmfa == item) {
                    drawPolygon();
                } else {
                    this.fixedPosition(item, function () {
                        // 选中地块颜色闪烁
                        that.twinkle(that.currSchemeLand, 5);
                        drawPolygon();
                    });
                }
            },
            saveXmfa: function (xmfa, feature) {
                var that = this;
                xmfa.save(function (res) {
                    try {
                        gisService.insertFeature(feature, function (res) {
                            // 地块入库失败时，还原方案信息
                            if (!res.success) {
                                that.currXmfa.save();
                                return;
                            }
                            gisService.layerRefresh(currInfo.layer);
                            var newMappingValue = xmfa.mappingValue.substring(xmfa.mappingValue.lastIndexOf(",") + 1);
                            var params = {
                                layer: feature.layer,
                                query_where: xmfa.mappingKey + " in (" + newMappingValue + ")"
                            };
                            gisService.queryFeature(params, function (res) {
                                if (res.success && res.data.length > 0) {
                                    // 当前方案地块添加新地块
                                    that.currSchemeLand.push(res.data[0]);
                                }
                            });
                            that.currXmfa.mappingValue = xmfa.mappingValue;
                        });
                    } catch (e) {
                        console.error(e);
                        // 还原方案信息
                        that.currXmfa.save();
                    }
                });
            },
            xmmxChange: function (a) {
                var _this = this;
                var selectIndex;
                if (!isNaN(Number(a))) {
                    selectIndex = a
                } else {
                    selectIndex = $(a.target).val();
                }
                if (selectIndex) {
                    _this.xmxx = this.xmList[selectIndex];
                    for (var key in _this.xmxx) {
                        _this.$set(_this.xmxx, key, _this.xmxx[key]);
                    }
                }
                _this.getProjectList(_this.xmxx["id"]);
                console.log(_this.xmxx);
            },
            //编辑 地图 图元
            editProject: function (item) {
                var _this = this;
                this.modifyFeatureEndObj = true;
                if (_this.editMark) {
                    return;
                }
                _this.editMark = true;
                this.fixedPosition(item, function () {
                    _this.currSchemeLand.forEach(function (land) {
                        gisService.setFeatureStyle(land, gisService.getDefaultStyleSelector().upload());
                        gisService.modifyFeature(land);
                    });

                    treeWalk(currInfo.layer);

                    function treeWalk(layer) {
                        gisService.drawPolygon(layer, function (res) {
                            res.famc = _this.currXmfa.famc;
                            res.zl = _this.currXmfa.zl;
                            gisService.modifyFeature(res);
                            treeWalk(layer);
                        });
                    }
                });
            },
            //结束编辑
            modifyFeatureEnd: function () {
                var _this = this;
                this.modifyFeatureEndObj = false;
                if (!_this.editMark) {
                    return;
                }
                _this.editMark = false;
                gisService.drawPolygonEnd(currInfo.layer);
                var count = 0, removeLandList = [], addlandList = [], updateLandlist = [],
                    mapingValueList = (_this.currXmfa.mappingValue == undefined || _this.currXmfa.mappingValue == null) ? [] : _this.currXmfa.mappingValue.split(','),
                    currLandIds = _this.currSchemeLand.map(function (land) {
                        return land.mappingId;
                    });
                _this.currSchemeLand.forEach(function (land) {
                    gisService.setFeatureStyle(land, gisService.getDefaultStyleSelector().transparent());
                    var feature = gisService.getFeature(land.layer, land.mappingId);
                    //删除
                    if (!feature) {
                        removeLandList.push(land);
                        mapingValueList.splice(mapingValueList.indexOf(land.mappingId), 1);
                        return;
                    }
                    //编辑
                    var coordinate = gisService.modifyFeatureEnd(land);
                    if (gisService.coordinateCorrect(coordinate) != gisService.coordinateCorrect(land.coordinate)) {
                        land.coordinate = coordinate;
                        updateLandlist.push(land);
                    }
                });
                //新增
                var landInfoList = gisService.getAllFeature(currInfo.layer);
                landInfoList.forEach(function (land) {
                    if (currLandIds.indexOf(land.mappingId) == -1) {
                        gisService.setFeatureStyle(land, gisService.getDefaultStyleSelector().transparent());
                        gisService.modifyFeatureEnd(land);
                        addlandList.push(land);
                        mapingValueList.push(land.mappingId);
                    }
                });

                var maxCount = removeLandList.length + addlandList.length + updateLandlist.length;

                removeLandList.forEach(function (land) {
                    gisService.deleteFeature(land, callback)
                })

                addlandList.forEach(function (land) {
                    gisService.insertFeature(land, callback);
                })

                updateLandlist.forEach(function (land) {
                    gisService.updateFeature(land, callback);
                })

                function callback(res) {
                    if (!res.success) {
                        gisService.openErrorInfo(res.data);
                        return;
                    }
                    count++;
                    if (maxCount == 0 || count == maxCount) {
                        gisService.layerRefresh(currInfo.layer);
                        removeLandList.forEach(function (land) {
                            _this.currSchemeLand.splice(_this.currSchemeLand.indexOf(land), 1);
                        });

                        var mappingIdList = addlandList.map(function (land) {
                            return land.mappingId;
                        });
                        // 新导入地块需要先进行查询，得到fid后才能删除
                        var params = {
                            layer: currInfo.layer,
                            query_where: _this.currXmfa.mappingKey + " in (" + mappingIdList.join() + ")"
                        };

                        gisService.queryFeature(params, function (res) {
                            if (res.success && res.data.length > 0) {
                                // 当前方案地块添加新地块
                                res.data.forEach(function (data) {
                                    _this.currSchemeLand.push(data);
                                });
                            }
                            var xmfa = new xmxz.xmfa(_this.currXmfa);
                            xmfa.mappingValue = mapingValueList.join(',');
                            var mpArea = _this.currSchemeLand.map(function (feature) {
                                return gisService.getFeatureArea(feature);
                            }).reduce(function (a, b) {
                                return a + b;
                            });
                            // 处理方案面积
                            xmfa.mj = (mpArea / 667).toFixed(2);
                            xmfa.save();
                            _this.currXmfa.mappingValue = xmfa.mappingValue;
                            _this.currXmfa.mj = xmfa.mj;
                        });
                        // addlandList.forEach(function (land) {
                        //     _this.currSchemeLand.push(land);
                        // });
                    }
                }
            },
            // 取消编辑
            modifyFeatureCancel: function () {
                var _this = this;
                this.modifyFeatureEndObj = false;
                if (!_this.editMark) {
                    return;
                }
                _this.editMark = false;
                gisService.drawPolygonEnd(currInfo.layer);
                var currLandIds = _this.currSchemeLand.map(function (land) {
                    return land.mappingId;
                });
                var landInfoList = gisService.getAllFeature(currInfo.layer);
                landInfoList.forEach(function (land) {
                    if (currLandIds.indexOf(land.mappingId) == -1) {
                        gisService.modifyFeatureEnd(land);
                        gisService.removeFeature(land);
                    }
                });
                _this.currSchemeLand.forEach(function (land) {
                    land.isShowCenter = false;
                    land.style = gisService.getDefaultStyleSelector().transparent();
                    gisService.drawFeature(land);
                });
            },
            //分析 方法
            analysisFun: function (callback) {
                var _this = this;
                if (!_this.currSchemeLand) {
                    return;
                }
                var analysisLayerList = subjectInfo.layerInfoList.filter(function (item) {
                    return item.type == 0 && item.analysis && item.analysisTopicTableName && item.analysisTopicName;
                });

                var list = [];
                var count = 0;
                analysisLayerList.forEach(function (layer, index) {
                    Object.assign(layer, {
                        name: layer.name,
                        landSize: "",
                        totalMpArea: 0,
                        landList: [],
                        loadind: false
                    });
                    var layerOverlayInfo = layer;
                    list.push(layerOverlayInfo);
                    (function (layerOverlayInfo) {
                        var coordinate = _this.currSchemeLand.map(function (land) {
                            return gisService.coordinateCorrect(land.coordinate);
                        }).join("#");
                        gisService.analysisClipCondition({
                            layer: layer,
                            coordinate: coordinate
                        }, function (result) {
                            count++;
                            var mappingIds = [];
                            layerOverlayInfo.loadind = true;
                            if (result.success) {
                                layerOverlayInfo.landSize = result.data.length;
                                if (result.data.length > 0) {
                                    var landList = result.data;
                                    layerOverlayInfo.basicInfoStr = result.basicInfoStr;
                                    layerOverlayInfo.basicInfoList = result.basicInfoList;
                                    layerOverlayInfo.totalMpArea = landList.map(function (a) {
                                        a.mpArea = parseFloat(gisService.getFeatureArea(a));
                                        return a.mpArea;
                                    }).reduce(function (a, b) {
                                        return (a + b);
                                    });
                                    landList = landList.sort(function (a, b) {
                                        return Number(gisService.getFeatureArea(a)) - Number(gisService.getFeatureArea(b))
                                    });
                                    landList && landList.forEach(function (land) {
                                        land.style = gisService.getDefaultStyleSelector().upload();
                                        land.isShowCenter = false;
                                        // 只对第一个图层画图
                                        if (index == 0) {
                                            _this.currAnalysisLayer = layer;
                                            gisService.drawFeature(land);
                                        }
                                        mappingIds.push(land.mappingId);
                                        layerOverlayInfo.landList.push(land);
                                    });
                                }
                            } else {
                                layerOverlayInfo.landSize = 0;
                            }
                            callback(list, count == analysisLayerList.length);
                        });
                    })(layerOverlayInfo);
                });
            },
            //分析 事件
            analysisProject: function (item) {
                var _this = this;

                this.fixedPosition(item, function () {
                    _this.twinkle(_this.currSchemeLand, 5);
                    _this.$set(item, "analysisResloading", true);
                    _this.analysisFun(function (analysisResData, anasisEnd) {
                        // _this.$set(item, "analysisResShow", true);
                        _this.$set(item, "analysisResTotal", true);
                        if (anasisEnd) {
                            _this.$set(item, "analysisResloading", false);
                        }
                        _this.$set(item, "analysisResData", analysisResData);
                    });
                })

                // item.analysisResShow = true
            },
            //递归创建分析结构dom
            recursion: function (childrenData, $innerDiv) {
                var that = this;
                childrenData.forEach(function (children_) {
                    // console.log(children_);
                    var $child = "";
                    if (children_.children && children_.children.length > 0) {
                        $child = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px'><span class='analysisTitle'>" + children_.name + children_.value + "</span></div>");
                    } else {
                        $child = $("<div class='indent10px'>" + children_.name + children_.value + "</div>");

                    }
                    $innerDiv.append($child);
                    if (children_.children) {
                        that.recursion(children_.children, $child)
                    }
                })
            },
            //获取空格数量
            getBlank(param) {
                var count = 0;
                while (true) {
                    count++;
                    var d = param.substr(1, count).trim();
                    if (d !== '') {
                        return count
                    }
                }
            },
            //将数据增加id pid 属性
            analysisDataFn: function (tempData) {
                var that = this;
                tempData.map(function (ele, index, tempDataArr) {
                    if (index === 0) {
                        ele.pid = 0;
                        ele.id = ele.name;
                    } else {
                        var count = index - 1;
                        while (count > -1) {
                            if (that.getBlank(tempDataArr[count].name) < that.getBlank(ele.name)) {
                                ele.id = ele.name;
                                ele.pid = tempDataArr[count]["id"];
                                return
                            }
                            if (count === 0) {
                                ele.id = ele.name;
                                ele.pid = 0;
                            }
                            count--;
                        }
                    }
                    return ele
                });
                return tempData
            },
            createAnalysisResDom: function (resData) {
                // console.log(resData);
                if (!resData || resData.length === 0) {
                    return
                }
                var that = this;
                var $panelDiv = $("<div></div>");
                resData = this.toTree(that.analysisDataFn(resData));
                resData.forEach(function (ele) {
                    // console.log(ele);
                    $panelDiv = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d'></div>");
                    $panelDiv = $("<div class='toggleAnalysisRes'></div>");
                    var $innerDom = $("<div class='toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px'><span class='analysisTitle'>" + ele.name + ele.value + "</span></div>");
                    $panelDiv.append($innerDom);
                    if (ele.children) {
                        that.recursion(ele.children, $innerDom)
                    }
                });
                var returnDom = $panelDiv.html();
                return returnDom
            },
            //平行数据结构转换成嵌套数据结构
            toTree: function (data) {
                var result = [];
                if (!Array.isArray(data)) {
                    return result
                }
                data.forEach(item => {
                    delete item.children;
                });
                var map = {};
                data.forEach(item => {
                    map[item.id] = item;
                });
                data.forEach(item => {
                    var parent = map[item.pid];
                    if (parent) {
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        result.push(item);
                    }
                });
                return result;
            },
            //控制分析结果的显示与隐藏
            toggleTable: function (item) {
                this.$set(item, "analysisResShow", !item.analysisResShow);
            },
            selfDeleteFeature: function (fid) {
                currInfo.fid = 17;
                gisService.deleteFeatureByFid({
                    layer: "X410100XMXZ2020GHBHXMXZ",
                    fid: fid,
                }, function (res) {
                    // console.log("selfDeleteFeature:::", res);
                });
            },
            query: function (item, callback) {
                var params = {
                    layer: currInfo.layer,
                    query_where: item.mappingKey + " in (" + item.mappingValue + ")"
                };
                gisService.queryFeature(params, function (res) {
                    if (res.data.length === 0) {
                        callback && callback([]);
                        return;
                    }
                    if (res.success) {
                        // res.data.forEach(function (item) {
                        //     item.style = gisService.getDefaultStyleSelector().transparent();
                        //     gisService.drawFeature(item);
                        // });
                        callback && callback(res.data);
                    }
                });
            },
            setCurrXmfa: function (item, callback) {

            },
            fixedFa: function (item) {
                var _this = this;
                this.fixedPosition(item, function () {
                    // 选中地块颜色闪烁
                    _this.twinkle(_this.currSchemeLand, 5);
                })
            },
            //定位方法(支持编辑)
            fixedPosition: function (item, callback) {
                var _this = this;
                // 同一个方案，直接定位
                if (this.currXmfa == item && this.currSchemeLand.length > 0) {
                    var mappingIds = this.currSchemeLand.map(function (item) {
                        return item.mappingId;
                    });
                    gisService.fixedPosition(currInfo.layer, mappingIds);
                    callback && callback();
                    return;
                }
                gisService.clearAllFeature();
                this.currXmfa = item;
                this.currSchemeLand = [];

                this.query(item, function (data) {
                    if (data.length > 0) {
                        var mappingIds = [];
                        data.forEach(function (item) {
                            mappingIds.push(item.mappingId);
                            // 保存当前方案所有地块信息
                            _this.currSchemeLand.push(item);
                        });
                        gisService.fixedPosition(currInfo.layer, mappingIds);
                    }
                    callback && callback();
                });
            },
            twinkle: function (data, count) {
                if (data && data.length == 0) {
                    return;
                }
                var that = this;
                setTimeout(function () {
                    var styleList = [];

                    data.forEach(function (item) {
                        var style = gisService.getFeatureStyle(item);
                        styleList.push(style);
                        gisService.setFeatureStyle(item, gisService.getDefaultStyleSelector().analysis());
                    });
                    setTimeout(function () {
                        data.forEach(function (item, index) {
                            gisService.setFeatureStyle(item, styleList[index]);
                        });
                        if (count > 0) {
                            that.twinkle(data, --count);
                        }
                    }, 500);
                }, 500);
            },
            addScheme: function () {
                var that = this;
                that.faxx = new xmxz.xmfa({xmxxId: that.xmxx.id});
                var uIlayerObj = uIlayer.open({
                    type: 1,
                    skin: 'layui-layer-rim', //加上边框
                    area: ['420px', '240px'], //宽高
                    content: $('#xmxxEditDv'),
                    btn: ['保存', '取消'],
                    yes: function (index, layero) {
                        console.log(that.faxx.famc);
                        that.newProjectItem(function () {
                            uIlayer.close(uIlayerObj)
                        });
                    },
                    btn2: function (index, layero) {
                    }
                });
            },
            selectLand: function (land, analysisLayer, scheme) {
                if (this.currAnalysisLayer) {
                    if (this.currAnalysisLayer != analysisLayer || scheme != this.currXmfa) {
                        this.currSelectLand = null;
                        gisService.removeAllFeature(this.currAnalysisLayer);
                        analysisLayer.landList.forEach(function (feature) {
                            gisService.drawFeature(feature);
                        });
                    }
                }
                this.currAnalysisLayer = analysisLayer;
                if (this.currSelectLand) {
                    gisService.setFeatureStyle(this.currSelectLand, gisService.getDefaultStyleSelector().upload());
                }

                this.currSelectLand = land;
                gisService.setFeatureStyle(land, gisService.getDefaultStyleSelector().select2());
                gisService.fixedPosition(land);
                // this.twinkle([land],5);
            },
            selectAnalysisLayer: function (analysisLayer, scheme) {
                if (this.currAnalysisLayer != analysisLayer || scheme != this.currXmfa) {
                    this.currSelectLand = null;
                    gisService.removeAllFeature(this.currAnalysisLayer);
                    analysisLayer.landList.forEach(function (feature) {
                        gisService.drawFeature(feature);
                    });
                }
                this.currAnalysisLayer = analysisLayer;
            },
            mpPerimeterSort: function (value) {
                if (!value) {
                    return null;
                }
                return value.sort(function (a, b) {
                    return Number(a.mpPerimeter) - Number(b.mpPerimeter)
                })
            },
            drawLand(projectList) {
                var _this = this;
                if (projectList && gisService) {
                    gisService.removeAllFeature(currInfo.layer);
                    gisService.getLayer(currInfo.layer).autoClear = false;
                    if (projectList.length == 0) {
                        return;
                    }

                    var mappingValue = projectList.map(function (item) {
                        return item.mappingValue;
                    }).reduce(function (a, b) {
                        return a + "," + b
                    });

                    _this.query({
                        mappingKey: projectList[0].mappingKey,
                        mappingValue: mappingValue
                    }, function (featureList) {
                        var mclist = [];
                        featureList.forEach(function (feature, index) {
                            feature.isShowCenter = false;
                            if (mclist.indexOf(feature.famc) == -1) {
                                feature.style = gisService.getDefaultStyleSelector().greenLand(feature.famc);
                                mclist.push(feature.famc);
                            } else {
                                feature.style = gisService.getDefaultStyleSelector().greenLand();
                            }
                            gisService.drawFeature(feature);
                        });
                    });
                }
            }

            //新增方案html ctrl
            // addProject: function () {
            //     this.isAdd = true
            // },
            //选择项目
            // selectProjectAction: function () {
            //     this.newProjectShow = false
            // }
            // addCancel: function () {
            //     this.isAdd = false
            // },
        },
        filters: {
            toFixed2: function (value) {
                if (!value) {
                    return ''
                }
                return Number(value).toFixed(2)
            },
            integerFun: function (value) {
                value = value + "";
                if (value == '') {
                    return "";
                }
                return Number(value).toFixed(0);
            }
        },
        mounted: function () {
            var _this = this;
            mapLoadEndEventList.push(function () {
                _this.getXmlist(function () {
                    for (var key in _this.xmList[0]) {
                        _this.$set(_this.xmxx, key, _this.xmList[0][key]);
                    }
                    _this.getProjectList(_this.xmList[0].id);
                });
            });
            gisServiceInit();
            Drag('.gis_lanchCodeMap', '#leftMapOutDiv',
                {
                    selector: '#rightDiv',
                    show: true
                }, {
                    selector: '#bottomDiv',
                    show: $('#bottomDiv').length > 0
                }, undefined, {acceptDrag: true});
            //分析结果折叠效果
            $("body").click(".toggleAnalysisRes", function (e) {
                if (!$(e.target).hasClass("toggleAnalysisRes")) {
                    return
                }
                if ($(e.target).hasClass("layui-icon-triangle-r")) {
                    $(e.target).attr({
                        "class": "toggleAnalysisRes layui-icon layui-icon-triangle-d indent10px"
                    });
                    $(e.target).find(">div").show()
                } else {
                    $(e.target).attr({
                        "class": "toggleAnalysisRes layui-icon layui-icon-triangle-r indent10px"
                    });
                    $(e.target).find(">div").hide()
                }
                return false
            });
            $('.addedOverflow').niceScroll({
                cursorcolor: "#7dc6ff", //滚动条的颜色
                cursoropacitymax: 0.9, //滚动条的透明度，从0-1
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 true滚动条拖动不可用
                cursorwidth: "5px", //滚动条的宽度  单位默认px
                cursorborder: "0", // 游标边框css定义
                cursorborderradius: "3px", //滚动条两头的圆角
                autohidemode: true, //是否隐藏滚动条  true的时候默认不显示滚动条，当鼠标经过的时候显示滚动条
                zindex: "auto", //给滚动条设置z-index值
                railvalign: 'defaul',
                railpadding: {
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                }, //滚动条的位置
            })
        }

    })
});
