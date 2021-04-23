var type = getQueryString("type");  // type: 1/主用途 0/副用途
var mainCodeId = getQueryString("mainCodeId");
var otherCodeId = getQueryString("otherCodeId");

// var id = getQueryString("id");
var data = getQueryString("data");

data = JSON.parse(data);
type = data.type;
mainCodeId = data.mainCodeId;
otherCodeId = data.otherCodeId;
if(otherCodeId){
    otherCodeId = otherCodeId.split(",");
}
//使用
var landUse = [];

//树配置
var simplData = data.simpleData;
var key = data.key;
var codeType =  data.codeType;

$.each(treeData,function(i,e) {
    if (e.parent == simplData.rootPId) {
        var temp = {
            codeId:e.parent + "_" + e[codeType.type],
            parent:e.parent,
            codeName:'',
            remarks:'',
            type:e[codeType.type]
        };
        if (e[codeType.type] == '1') {
            temp.codeName = '07版';
        } else if (e[codeType.type] == '2') {
            temp.codeName = '17版';
        } else if (e[codeType.type] == '0') {
            temp.codeName = '11版';
        } else if (e[codeType.type] == '3') {
            temp.codeName = '90版';
        }
        if(JSON.stringify(treeData).indexOf(JSON.stringify(temp)) == -1){
            treeData.push(temp);
        }
    }
    e[codeType.codeId] =e[codeType.codeId] + "_" + e[codeType.type];
    e[simplData.pIdKey] = e[simplData.pIdKey] + "_" + e[codeType.type];
});


$.each(treeData,function(i,e) {
    if (e.parent == simplData.rootPId) {
        e[key.name] = e[codeType.codeName];
    } else {
        e[key.name] = e[codeType.codeId].split("_")[0] + '-' + e[codeType.codeName];
    }
    e.id = e[codeType.codeId];
});

layui.use(['form','table'],function() {
    var table = layui.table,
        layer = layui.layer,
        $ = layui.jquery,
        $usePanel = $("#usePanel");
    //加载树
    tree = $.fn.zTree.init($("#usageZTree"), {
        data : {
            simpleData : simplData,
            key : key
        },
        callback : {
            onClick : function(event, treeId, treeNode) {
                var exisit = false;
                // 根节点不能选择
                treeNode.codeId = treeNode.codeId.split("_")[0];
                if (treeNode.codeId == '/'){
                    return;
                }
                // if (treeNode.children) {
                //     return;
                // }
                if(type == 1){  // 主用途
                    var msg;
                    if(otherCodeId && otherCodeId.length > 0){
                        $.each(otherCodeId,function(i,v){
                            if(v == treeNode.codeId){
                                exisit = true;
                                msg='副用途已存在该用途';
                                return;
                            }
                        })
                    }
                    if(landUse && landUse.length > 0) {
                        $.each(landUse,function(i,e) {
                            if(e.useCode == treeNode.codeId) {
                                exisit = true;
                                msg='已存在该用途';
                                return;
                            } else {
                                landUse = [];
                            }
                        });
                    }
                    if(exisit){
                        layer.msg(msg,{icon : 5});
                        return;
                    }
                } else {  // 其它
                    if(type==0){
                        if(mainCodeId && mainCodeId == treeNode.codeId){
                            layer.msg('主用途已存在该用途',{icon : 5});
                            return;
                        }
                    }
                    if(landUse && landUse.length > 0) {
                        $.each(landUse,function(i,e) {
                            if(e.useCode == treeNode.codeId) {
                                exisit = true;
                                return;
                            }
                        });
                    }
                    if(exisit) {
                        layer.msg('已存在该用途',{icon : 5});
                        return;
                    }
                }
                var landUseInfo = {
                    useCode : treeNode.codeId,
                    codeName : treeNode.codeName,
                    mainFlag: type
                }
                landUse.push(landUseInfo);
                landUseTabReload();
            }
        }
    },treeData);

    var landUseTab = table.render({
        elem : '#landUseTab',
        id : 'landUseTab',
        height : '300',
        cols : [ [
            {field : 'useCode', title : '用途代码', width : 198, align : 'center'},
            {field : 'codeName', title : '用途', width : 280, align : 'center'},
            {field : 'right', title : '操作', width : 80, align : 'center', templet: function() {
                return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>';
                }}] ],
        done : function(res, curr, count) {
            var dataTableTrs = $usePanel.find("tbody").children(),tr,td;
            $.each(res.data,function(i,e) {
                if(e.mainFlag == 1) {
                    tr = $(dataTableTrs[i]);
                    tr.addClass("layui-table-click");
                    td = tr.find("td").eq(0);
                    td.find(".layui-form-radio").addClass("layui-form-radioed");
                    td.find(".layui-icon").addClass("layui-anim-scaleSpring");
                    td.find(".layui-icon").text("");
                }
            });
        }
    });

    table.on('tool(landUseTabFilter)',function(obj) {
        var event = obj.event,row = obj.tr[0].rowIndex;
        if(event == 'del') {
            landUse.splice(row,1);
            layer.msg('删除成功',{icon : 6});
            landUseTabReload();
        }
    });

    function landUseTabReload() {
        table.reload('landUseTab',{data : []});
        table.reload('landUseTab',{data : landUse});

    }
    landUseTabReload();
});
var callback = function(){
    var data = landUse;
    return data;
}
var sucessCallback = function(data){
    landUse = data;
}