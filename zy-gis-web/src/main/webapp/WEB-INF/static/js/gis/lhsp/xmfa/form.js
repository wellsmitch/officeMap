layui.use(['form', 'table', 'laydate', 'upload','chooseByTree'], function () {
    var layer = layui.layer, laydate = layui.laydate, form = layui.form,currInfo = {layer: "DYCHY4101002020G"},chooseByTree = layui.chooseByTree;
    var id = getQueryString("id");
    var readonly = getQueryString("type") != 'write';
    var $infoPanel = $("#infoPanel");
    var lhspXmxxId = getQueryString("lhspXmxxId");
    var tmpKey = getQueryString("tmpKey");
    var landList = [];
    var removeList = [];
    var oldLandList = [];
    var hszt = 'hsgydk';

    var mainType = [],sideType = [],hyyType = [],xyyType = [];

    var xmfa = new gis.lhsp.xmfa({id: id});
    var mainFormVue = new Vue({
        el: '#mainForm',
        data: {
            xmfa:xmfa,
            readonly: readonly,
            landList:landList

        },
        methods: {
            removeTable:function (item) {
                landList.splice(landList.indexOf(item),1);
                var index = oldLandList.findIndex(function (item1) {
                    return item1.landCode == item.landCode;
                });
                if (index != -1){
                    removeList.push(item);
                    oldLandList.splice(index,1);
                }
            },
            selectLand:function (item) {
                //查看地块
            },
            getLandType:function(codeName,selectType,type,dataType,title,callBack){
                var that = this;
                $infoPanel.on('click','input[name="'+codeName+'"]',function() {
                    var _this = this;
                    var  treePross = {
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'parent',
                            rootPId: '/'
                        },
                        codeType:{
                            codeId : "codeId",
                            codeName : "codeName",
                            type :  "type"
                        },
                        key: {
                            name: 'cName'
                        }
                    };
                    var landData = [];
                    if (type != null){
                        treePross.type = type;
                    }
                    if (type == 1 && dataType == '1'){
                        treePross.otherCodeId = xmfa.sideTdytCode;
                    }
                    if (type == 0 && dataType == '2'){
                        treePross.mainCodeId = xmfa.tdytCode;
                    }
                    if (dataType == '1'){
                        Object.assign(landData,mainType);
                    } else if(dataType == '2'){
                        Object.assign(landData,sideType);
                    } else if(dataType == '3'){
                        Object.assign(landData,hyyType);
                    } else if(dataType == '4'){
                        Object.assign(landData,xyyType);
                    }

                    chooseByTree.tree("/gis/lhsp/xmfa/getLandType",title,treePross,selectType,landData,function(data){
                        var ltn = [],lt = [];
                        $.each(data,function(i,e) {
                            ltn.push(e.codeName);
                            lt.push(e.useCode);
                        });
                        xmfa[_this.name] = ltn.join(",");
                        xmfa[_this.name + 'Code'] = lt.join(",");
                        if (callBack && typeof callBack == 'function' ){
                            callBack(data)
                        }
                        renderForm();
                        that.$forceUpdate();
                    });
                });
            }
        },
        mounted: function () {
            this.getLandType("tdyt",'1,2',1,'1','主用途',function (data) {
                mainType = data;
            });
            this.getLandType("sideTdyt",'1,2',0,'2','副用途',function (data) {
                sideType = data;
            });

            this.getLandType("ghyt",'0,3',1,'3','原规划用途',function (data) {
                hyyType = data;
            });
            this.getLandType("xghyu",'0,3',1,'4','新规划用途',function (data) {
                xyyType = data;
            });

            var that = this;
            that.xmfa.lhspXmxxId = lhspXmxxId;
            if (xmfa.id) {
                xmfa.get(function () {
                    if (xmfa.issueType == '1' || xmfa.issueType == '2' || xmfa.issueType == '3'){
                        hszt = 'hsgydk';
                    } else {
                        hszt = 'hscbdk';
                    }
                    xmfa.mappingValue =  !!xmfa.mappingValue ? xmfa.mappingValue.replace(/'/ig,'') : '';
                    xmfa.mappingYt = !!xmfa.mappingYt ? xmfa.mappingYt.replace(/'/ig,'') : '';
                    if (!!xmfa.mappingValue){
                        var mappingValues = xmfa.mappingValue.split(",");
                        var mappingYts = xmfa.mappingYt.split(",");
                        for (var i = 0; i < mappingValues.length;i++){
                            var param = {landCode:!!mappingValues[i] ? mappingValues[i] : '',
                                purpose:!!mappingYts[i] ?mappingYts[i]:''
                            }
                            landList.push(param);
                            oldLandList.push(param)
                        }
                    }
                    var ltn = xmfa.tdyt;
                    var lt = xmfa.tdytCode;
                    if (!!ltn && !!lt){
                        ltn = ltn.split(",");
                        lt = lt.split(",");
                        $.each(ltn,function(i,e) {
                            mainType.push({useCode : lt[i],codeName : e});
                        });
                    }
                    ltn = xmfa.sideTdyt;
                    lt =  xmfa.sideTdytCode;
                    if (!!ltn && !!lt){
                        ltn = ltn.split(",");
                        lt = lt.split(",");
                        $.each(ltn,function(i,e) {
                            sideType.push({useCode : lt[i],codeName : e});
                        });
                    }
                    ltn = xmfa.ghyt;
                    lt =  xmfa.ghytCode;
                    if (!!ltn && !!lt){
                        ltn = ltn.split(",");
                        lt = lt.split(",");
                        $.each(ltn,function(i,e) {
                            hyyType.push({useCode : lt[i],codeName : e});
                        });
                    }
                    ltn = xmfa.xghyu;
                    lt =  xmfa.xghyuCode;
                    if (!!ltn && !!lt){
                        ltn = ltn.split(",");
                        lt = lt.split(",");
                        $.each(ltn,function(i,e) {
                            xyyType.push({useCode : lt[i],codeName : e});
                        });
                    }
                    mainFormVue.xmfa = xmfa;
                    renderForm();
                    that.$forceUpdate();
                });
            } else {
                that.xmfa.issueType = 1;
                hszt = 'hsgydk';
                that.xmfa.tmpKey = tmpKey;
                renderForm();
                that.$forceUpdate();
            }
        }
    });

    form.on('submit(*)', function () {
        var loadingIndex = layer.load(1, {shade: [0.1,'#fff']});
        try {
            xmfa.mappingKey = "LAND_CODE";
            var landCode = [];
            var yt = [];
            var olddK = [];
            landList.forEach(function (info) {
                landCode.push(info.landCode);
                yt.push(info.purpose);
                olddK.push(info);
            })
            xmfa.mappingYt = yt.length > 0 ? "'" + yt.join("','") + "'" : '';
            xmfa.mappingValue = landCode.length > 0 ? "'" + landCode.join("','") + "'" : '';
            xmfa.save(function (info) {
                if(window.successCallback && typeof window.successCallback == 'function'){
                    window.successCallback(info,oldLandList,landList,removeList,layer,loadingIndex);
                } else {
                    removeList = [];
                    oldLandList = olddK;
                    layer.close(loadingIndex);
                    layer.msg("保存成功！", {icon: 6});
                }
            }, function (text) {
                layer.close(loadingIndex);
                layer.open({title: '操作失败', content: text, icon: 5});
            });
        } catch (e) {
            layer.close(loadingIndex);
            layer.open({title: '操作失败', content: text, icon: 5});
        }
        return false;
    });


    form.on('select', function (data) {
        xmfa[data.elem.name] = data.value;
        if (data.value == '1' || data.value == '2' || data.value == '3'){
            hszt = 'hsgydk';
        } else {
            hszt = 'hscbdk';
        }
        mainType = [];
        xmfa.tdyt = '';
        xmfa.tdytCode = '';
        sideType = [];
        xmfa.sideTdyt = '';
        xmfa.sideTdytCode = '';
        xyyType = [];
        xmfa.xghyu = '';
        xmfa.xghyuCode = '';
        hyyType = [];
        xmfa.ghyt = '';
        xmfa.ghytCode = '';
        xmfa.compatible = '';
        mainFormVue.$forceUpdate();
    });

    function renderForm() {
        setTimeout(function () {
            form.render('select');
        });
    }

    window.saveMethod = function (success) {
        window.successCallback = success;
        $('#saveBtn').click();
    };

    $infoPanel.on('click','.selectLandBtn',function() {
        var landCode =  "";
        var content = basePath + '/gis/business/selectLand?businessType='+hszt+'&landCode=' + landCode;
        var btn = readonly == 'true' ? ['取消'] : ['保存', '取消'];
        var open = {
            title: "地块信息",
            skin: 'layui-layer-rim',
            id: 'landInfo',
            type: 2,
            area: ['97%', '97%'],
            btn: btn,
            content: content
        }
        open.yes = function (index, layero) {
            var iframeWin = layero.find('iframe')[0].contentWindow
            var objArr = iframeWin.getChooseLand();
            for (var i = 0; i < objArr.length; i++) {
                landList.push(objArr[i])
            }
            window.top.layui.layer.close(index);
            return false;
        }
        window.top.layui.layer.open(open);
        return false;
    });

    // window.getLandList = function(gisService){
    //     var list = landList.map(function (land) {
    //         return land.landCode;
    //     })
    //     var params = {
    //         layer: currInfo.layer,
    //         query_where:" LAND_CODE in ('" + list.join("','") + "')"
    //     };
    //     gisService.queryFeature(params, function (res) {
    //         if (res.success && res.data.length > 0) {
    //             //landList = [];
    //             res.data.forEach(function(item){
    //                 item.purpose = item['用途'];
    //                 landList.push(item);
    //                 oldLandList.push(item);
    //             });
    //         }
    //     });
    // }
});
