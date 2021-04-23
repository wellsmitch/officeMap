zy.util.provide('xmxz.xmxx');
xmxz.xmxx = function (data) {
    this.pagingFlag = false;
    if (data) {
        this.load(data);
    }
};
xmxz.xmxx.url = {
    get: basePath + '/xmxz/xmxx/get',
    list: basePath + '/xmxz/xmxx/list',
    save: basePath + '/xmxz/xmxx/save',
    delete: basePath + '/xmxz/xmxx/delete',
    one: basePath + '/xmxz/xmxx/one',
    form: basePath + '/xmxz/xmxx/html/form'
};
xmxz.xmxx.prototype.load = function (data) {
    if (data) {
        Object.assign(this, data);
    }
    return this;
};
xmxz.xmxx.prototype.get = function (success, failure) {
    var xmxzXmxx = this;
    $.ajax({
        url: xmxz.xmxx.url.get + '/' + xmxzXmxx.id,
        type: 'get',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            xmxzXmxx.load(res.data);
            success && success(xmxzXmxx);
        }
    });
    return xmxzXmxx;
};
xmxz.xmxx.prototype.save = function (success, failure) {
    var xmxzXmxx = this;
    $.ajax({
        url: xmxz.xmxx.url.save,
        type: 'post',
        data: JSON.stringify(xmxzXmxx),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure(res.data);
                return;
            }
            xmxzXmxx.load(res.data);
            success && success(xmxzXmxx);
        }
    });
    return xmxzXmxx;
};
xmxz.xmxx.prototype.delete = function (success, failure) {
    var xmxzXmxx = this;
    $.ajax({
        url: xmxz.xmxx.url.delete,
        type: 'delete',
        data: JSON.stringify(xmxzXmxx),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            success && success(res.data);
        }
    });
    return xmxzXmxx;
};
xmxz.xmxx.prototype.list = function (success, failure) {
    var list = [];
    var xmxzXmxx = this;
    $.ajax({
        url: xmxz.xmxx.url.list,
        type: 'get',
        data: Object.assign({}, xmxzXmxx),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            res.results.forEach(function (item) {
                var xmxzXmxx = new xmxz.xmxx(item);
                list.push(xmxzXmxx);
            });
            success && success(list);
        }
    });
    return list;
};
xmxz.xmxx.prototype.one = function (success, failure) {
    var xmxzXmxx = this;
    $.ajax({
        url: xmxz.xmxx.url.one,
        type: 'get',
        data: Object.assign({}, xmxzXmxx),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            xmxzXmxx.load(res.data);
            success && success(xmxzXmxx);
        }
    });
    return xmxzXmxx;
};
