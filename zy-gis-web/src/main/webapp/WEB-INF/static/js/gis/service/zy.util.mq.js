zy.util.provide("zy.util.global.mq");
/**
 * 全局消息对象，放置所有的消息对象实体
 */
zy.util.global.mq = {
    data: {},
    get: function (name) {
        return this.data[name];
    },
    put: function (name, obj) {
        this.data[name] = obj;
        // console.log(this.data);
        return this;
    }
};
zy.util.provide("zy.util.mq");
/**
 * 声明一个消息监听对象，使数据发生变化时能够通知消息给订阅对象，支持数组类型的添加、删除、修改、修改元素属性事件
 * @param topic 消息名称
 * @param data 消息体（目前只支持数组类型）
 * @param listenerKeyList 需要监听的元素key值
 * @warning 使用for(var i in data)循环时会发生i值为push和splice问题，建议使用data.forEach或者for(var i = 0;i < data.length; i++)来解决，以后将会对此进行修正
 */
zy.util.mq = function (topic, data, listenerKeyList) {
    // console.log(topic);
    zy.util.global.mq.put(topic, this);
    this.data = data;
    this.subscribeList = [];
    this.listenerKeyList = listenerKeyList;
    var that = this;
    // 目前只支持数组类型的监听
    if (this.data instanceof Array) {

        // 重写push方法来进行添加事件的监听
        this.data.push = function (info) {
            that.add(info);
        };
        // 重写splice来进行删除事件的监听
        this.data.splice = function (index, length) {
            that.remove(index, length);
        };

        this.tempData = this.data.concat();

        // 监听元素修改
        this.tempData.forEach(function (item, index) {
            that.addListener(index);
        });
    }
};
/**
 * 消息订阅，支持数组的：添加、删除、修改、修改对象内部属性的监听操作
 * @deprecated 注册与监听是两种不同的意义，请调用subscribe方法，以后有可能删除该方法
 * @see zy.util.mq.prototype.subscribe
 * @param obj 函数名：add/remove/update/modifyProperties
 */
zy.util.mq.prototype.register = function (obj) {
    this.subscribe(obj);
};
/**
 * 消息订阅，支持数组的：添加、删除、修改、修改对象内部属性的监听操作
 * @param obj 函数名：add/remove/update/modifyProperties
 */
zy.util.mq.prototype.subscribe = function (obj) {
    this.subscribeList.push(obj);
};

/**
 * 对数组元素进行监听
 * @param index
 */
zy.util.mq.prototype.addListener = function (index) {
    var that = this;
    if (this.data instanceof Array) {
        // 检查该对象是否已经进行过监听，每个对象只能被监听一次
        if (Object.getOwnPropertyDescriptor(that.data, index).get) {
            return;
        }
        Object.defineProperty(that.data, index, {
            get: function () {
                return that.tempData[index];
            },
            set: function (newValue) {
                // 重写该下标值时，触发update方法，如:data[0]={};
                var oldInfo = that.tempData[index];
                that.tempData[index] = newValue;
                // 检查当前状态是否是删除状态，删除状态也会触发set事件，因为数组是队列模型，删除某一个元素时，后面的元素会
                if (!that.removing) {
                    that.update(newValue, oldInfo);
                }
            }
        });
    }

    // 监听元素发生变化
    this.listenerKeyList.forEach(function (key) {
        // 元素类型必须为object类型，只有object类型才有属性，其它基本类型使用会调用update事件
        if (typeof that.data[index] != 'object') {
            return;
        }
        // 检查该对象是否已经进行过监听，每个对象只能被监听一次
        if (Object.getOwnPropertyDescriptor(that.data[index], key) && Object.getOwnPropertyDescriptor(that.data[index], key).get) {
            return;
        }
        // 对象不能对自身进行监听，否则会造成自身对象调用自身对象的监听，使用对象隔离可以解决此问题，但内存消耗将增大一倍，以后会对此优化
        var data = JSON.parse(JSON.stringify(that.data[index]));
        (function (data) {
            Object.defineProperty(that.data[index], key, {
                get: function () {
                    return data[key];
                },
                set: function (newValue) {
                    // 如果新值没有发生变化，将不进行通知
                    if (data[key] != newValue) {
                        data[key] = newValue;
                        that.modifyProperties(that.data[index], key, newValue);
                    }
                }
            });
        })(data);
    });
};
/**
 * 监听新增事件
 * @param info 新添加的元素信息
 */
zy.util.mq.prototype.add = function (info) {
    Array.prototype.push.call(this.data, info);
    Array.prototype.push.call(this.tempData, info);
    // 对新元素进行监听
    this.addListener(this.data.length - 1);
    this.subscribeList.forEach(function (item) {
        try {
            item.add && item.add(info);
        } catch (e) {
            console.error(e);
        }
    });
};
/**
 * 监听修改事件
 * @param newInfo 新元素信息
 * @param oldInfo 老元素信息
 */
zy.util.mq.prototype.update = function (newInfo, oldInfo) {
    this.subscribeList.forEach(function (item) {
        try {
            item.update && item.update(newInfo, oldInfo);
        } catch (e) {
            console.error(e);
        }
    });
};
/**
 * 监听删除事件
 * @param index  删除的索引
 * @param length 删除长度
 */
zy.util.mq.prototype.remove = function (index, length) {
    var info = this.data[index];
    // 原数据删除前标记
    this.removing = true;
    Array.prototype.splice.call(this.data, index, length);
    Array.prototype.pop.call(this.tempData);
    // 原数据删除后取消标记
    this.removing = false;
    this.subscribeList.forEach(function (item) {
        try {
            item.remove && item.remove(info, index);
        } catch (e) {
            console.error(e);
        }
    });
};
/**
 * 监听元素内信息变化事件
 * @param info
 * @param key
 * @param value
 */
zy.util.mq.prototype.modifyProperties = function (info, key, value) {
    this.subscribeList.forEach(function (item) {
        try {
            item.modifyProperties && item.modifyProperties(info, key, value);
        } catch (e) {
            console.error(e);
        }
    });
};
/**
 * 获取监听的数据对象
 * @returns {*}
 */
zy.util.mq.prototype.getData = function () {
    return this.data;
};