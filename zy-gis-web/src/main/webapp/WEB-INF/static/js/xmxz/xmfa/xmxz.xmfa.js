zy.util.provide('xmxz.xmfa');
xmxz.xmfa = function (data) {
    this.pagingFlag = false;
    if (data) {
        this.load(data);
    }
};
xmxz.xmfa.url = {
    get: basePath + '/xmxz/xmfa/get',
    list: basePath + '/xmxz/xmfa/list',
    save: basePath + '/xmxz/xmfa/save',
    delete: basePath + '/xmxz/xmfa/delete',
    one: basePath + '/xmxz/xmfa/one',
    form: basePath + '/xmxz/xmfa/html/form'
};
xmxz.xmfa.prototype.load = function (data) {
    if (data) {
        Object.assign(this, data);
    }
    return this;
};
xmxz.xmfa.prototype.get = function (success, failure) {
    var xmxzXmfa = this;
    $.ajax({
        url: xmxz.xmfa.url.get + '/' + xmxzXmfa.id,
        type: 'get',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            xmxzXmfa.load(res.data);
            success && success(xmxzXmfa);
        }
    });
    return xmxzXmfa;
};
xmxz.xmfa.prototype.save = function (success, failure) {
    var xmxzXmfa = this;
    $.ajax({
        url: xmxz.xmfa.url.save,
        type: 'post',
        data: JSON.stringify(xmxzXmfa),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure(res.data);
                return;
            }
            xmxzXmfa.load(res.data);
            success && success(xmxzXmfa);
        }
    });
    return xmxzXmfa;
};
xmxz.xmfa.prototype.delete = function (success, failure) {
    var xmxzXmfa = this;
    $.ajax({
        url: xmxz.xmfa.url.delete,
        type: 'delete',
        data: JSON.stringify(xmxzXmfa),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            success && success(res.data);
        }
    });
    return xmxzXmfa;
};
xmxz.xmfa.prototype.list = function (success, failure) {
    var list = [];
    var xmxzXmfa = this;
    $.ajax({
        url: xmxz.xmfa.url.list,
        type: 'get',
        data: Object.assign({}, xmxzXmfa),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            res.results.forEach(function (item) {
                var xmxzXmfa = new xmxz.xmfa(item);
                list.push(xmxzXmfa);
            });
            success && success(list);
        }
    });
    return list;
};
xmxz.xmfa.prototype.one = function (success, failure) {
    var xmxzXmfa = this;
    $.ajax({
        url: xmxz.xmfa.url.one,
        type: 'get',
        data: Object.assign({}, xmxzXmfa),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            xmxzXmfa.load(res.data);
            success && success(xmxzXmfa);
        }
    });
    return xmxzXmfa;
};
