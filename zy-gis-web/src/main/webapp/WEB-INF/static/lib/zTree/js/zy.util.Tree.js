/**
 * 例子 end
 * */

zy.util.Tree = function (obj) {
    this.treeObj = null;
    this.treeDataMap = {};
    this.obj = obj;
    this.init(obj);
};

zy.util.Tree.prototype.getTreeOBj = function () {
  return this.treeObj;
};
zy.util.Tree.prototype.addHoverDom = function (obj, treeId, treeNode) {
    var _this = this;
    treeId = $("#" + treeNode.tId + "_span");
    var events = _this.treeDataMap[treeNode.id].event;

    for (key in obj.buttons) {
        for (var i = 0; events && i < events.length; i++) {
            if (0 < $("#zy_tree_btn_custom_" + events[i] + "_" + treeNode.tId).length) {
                return
            }
        }
        events && events.forEach(function (ele, index) {
            var html = $("<span action=" + obj.buttons[key].type + " class='button " + ele +" " + obj.buttons[ele].icon + " ' id='zy_tree_btn_custom_" + ele + "_" + treeNode.tId + "' title='" + (obj.buttons[ele].title || '') + "' ></span>");
            treeId.after(html);
            html.bind('click', function (e) {
                obj.buttons[ele].click(_this.treeDataMap[treeNode.id.toString()]);
                ///////////
                e.stopPropagation()
            });
        });
    }
};


function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    return targetNode ? targetNode.drop !== false : true;
}


zy.util.Tree.prototype.removeHoverDom = function (obj, treeNode) {
    for (key in obj.buttons) {
        $("#zy_tree_btn_custom_" + obj.buttons[key].type + "_" + treeNode.tId) && $("#zy_tree_btn_custom_" + obj.buttons[key].type + "_" + treeNode.tId).unbind().remove();
    }
};


//获取选中节点的数据
zy.util.Tree.prototype.getSelectData = function () {
    var selectData = [];
    var nodes = this.treeObj.getCheckedNodes(true);
    for (var i = 0; i < nodes.length; i++) {
        var singleData = this.treeDataMap[nodes[i].id];
        selectData.push(singleData)
    }
    return selectData

};
/**
 *
 * 订阅逻辑开始
 *
 */
zy.util.Tree.prototype.updateNode = function (key, value) {
    if (key) {
        var node = this.getNode(key, value);
        this.treeObj.updateNode(node);
    } else {
        var nodes = this.getNode();
        for (var i = 0; i < nodes.length; i++) {
            treeObj.updateNode(nodes[i]);
        }
    }
};

zy.util.Tree.prototype.getNode = function (key, value) {
    if (key) {
        return this.treeObj.getNodeByParam(key, value, null);
    } else {
        return nodes = this.treeObj.getNodes();
    }
};

// 添加节点
zy.util.Tree.prototype.add = function (info) {
    var that = this;
    console.log('树添加了信息', info);
    this.treeDataMap[info.id.toString()] = info;
    this.treeObj.addNodes(that.getNode("id", info.pid), info);
    // this.update();
};

// 更新节点
zy.util.Tree.prototype.update = function (newInfo, oldInfo) {
    // 更新树
    var that = this;
    var node = this.getNode("id", oldInfo.id);
    Object.keys(newInfo).forEach(function (ele) {
        node[ele] = newInfo[ele];

    });
    that.treeDataMap[oldInfo.id] = newInfo;
    this.treeObj.updateNode(node);
};

// 删除节点
zy.util.Tree.prototype.remove = function (info, index) {
    console.log('树删除了信息：', info, '索引为：', index);
    var node = this.getNode("id", info.id, null);
    this.treeObj.removeNode(node);
    delete this.treeDataMap[info.id.toString()];
};

// 更新节点属性
zy.util.Tree.prototype.modifyProperties = function (info, key, value) {
    var node = this.getNode("id", info.id);
    node[key] = value;
    this.treeObj.updateNode(node);
};
/**
 *
 * 订阅逻辑结束
 *
 */

zy.util.Tree.prototype.init = function (obj_) {
    var obj = obj_ || {};
    var _this = this;

    var layerListener = new zy.util.mq(obj_.id, obj.data, ["checked", "name"]);

    layerListener.register(_this);

    // 生成索引对象 treeDataMap
    for (var f = 0; f < obj.data.length; f++) {
        this.treeDataMap[obj.data[f]["id"].toString()] = obj.data[f];
    }
    // 设置
    var setting = {
        check: {
            //控制显示勾选框
            enable: obj.showCheck !== undefined ? obj.showCheck : true,
            chkStyle: obj.checkType !== undefined ? obj.checkType : 'checkbox',
            autoCheckTrigger: false,
            chkboxType: obj.cascadeSelect == false ? {"Y": "", "N": ""} : { "Y": "ps", "N": "ps" }
        },
        view: {
            dblClickExpand: false,
            //是否显示虚线
            showLine: true,
            //是否显示文件图标
            showIcon: obj.showIcon !== undefined ? obj.showIcon : true,
            addHoverDom: (function (obj) {
                return function (treeId, treeNode) {
                    _this.addHoverDom(obj, treeId, treeNode);
                }
            })(obj),   // 用于当鼠标移动到节点上时，显示用户自定义控件，显示隐藏状态同 zTree 内部的编辑、删除按钮
            removeHoverDom: (function (obj) {
                return function (treeId, treeNode) {
                    _this.removeHoverDom(obj, treeNode)
                }
            })(obj)
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
            onClick: function (a, b, c, d) {
                // 点击节点回调
                var isCheck = _this.obj.data[_this.obj.data.indexOf(_this.treeDataMap[c.id])].checked;
                if (isCheck) {
                    _this.treeObj.checkNode(c, false, true);
                } else {
                    _this.treeObj.checkNode(c, true, true);
                }
                _this.obj.data[_this.obj.data.indexOf(_this.treeDataMap[c.id])].checked = !isCheck;
                _this.treeDataMap[c.id].checked = !isCheck;
                // 点击节点回调

                obj_.onClick && obj_.onClick(_this.treeDataMap[c.id], c.checked)
            },
            onCheck: function (a, b, c) {
                _this.treeDataMap[c.id].checked = c.checked;
                obj_.onCheck && obj_.onCheck(_this.treeDataMap[c.id], c.checked)
            },
            onExpand: function () {
            },
            /*    beforeDrag: function (event, treeData) {
                    for (var i = 0, l = treeData.length; i < l; i++) {
                        if (treeData[i].drag === false) {
                            return false;
                        }
                    }
                },*/
            beforeDrop: function (treeId, treeNodes_, targetNode, moveType) {
                return obj_.beforeDrop(_this.treeDataMap[treeNodes_[0].id], _this.treeDataMap[targetNode.id], moveType);
            },
            onDrop: function (event, treeId, treeNodes_, targetNode, moveType) {
                console.log(targetNode, moveType);
                if(targetNode) {
                    switch (moveType) {
                        case "inner":
                            _this.treeDataMap[treeNodes_[0].id].pid = targetNode.id;
                            break;
                        case "prev":
                            _this.treeDataMap[treeNodes_[0].id].pid = targetNode.pid;
                            break;
                        case "next":
                            _this.treeDataMap[treeNodes_[0].id].pid = targetNode.pid;
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            removeTitle: "删除",
            renameTitle: "编辑",
            drag: {
                isCopy: typeof obj.isCopy == "boolean" ? obj.isCopy : false,//所有操作都是move
                isMove: typeof obj.isMove == "boolean" ? obj.isMove : false,
                next: true,
                prev: true,
                inner: true
            }
        }
    };
    this.treeObj = $.fn.zTree.init($("#" + obj.id), setting, obj.data);
};
