zy.util.provide('gis.lhsp.xmxx');
gis.lhsp.xmxx = function (data) {
    this.pagingFlag = false;
    if (data) {
        this.load(data);
    }
};
gis.lhsp.xmxx.url = {
    get: basePath + '/gis/lhsp/xmxx/get',
    list: basePath + '/gis/lhsp/xmxx/list',
    save: basePath + '/gis/lhsp/xmxx/save',
    delete: basePath + '/gis/lhsp/xmxx/delete',
    one: basePath + '/gis/lhsp/xmxx/one',
    //form: basePath + '/gis/lhsp/xmxx/html/form'
    form: basePath + '/gis/lhsp/xmxx/html/form'
};
gis.lhsp.xmxx.prototype.load = function (data) {
    if (data) {
        Object.assign(this, data);
    }
    return this;
};
gis.lhsp.xmxx.prototype.get = function (success, failure) {
    var gisLhspXmxx = this;
    $.ajax({
        url: gis.lhsp.xmxx.url.get + '/' + gisLhspXmxx.id,
        type: 'get',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            gisLhspXmxx.load(res.data);
            success && success(gisLhspXmxx);
        }
    });
    return gisLhspXmxx;
};
gis.lhsp.xmxx.prototype.save = function (success, failure) {
    var gisLhspXmxx = this;
    $.ajax({
        url: gis.lhsp.xmxx.url.save,
        type: 'post',
        data: JSON.stringify(gisLhspXmxx),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure(res.data);
                return;
            }
            gisLhspXmxx.load(res.data);
            success && success(gisLhspXmxx);
        }
    });
    return gisLhspXmxx;
};
gis.lhsp.xmxx.prototype.delete = function (success, failure) {
    var gisLhspXmxx = this;
    $.ajax({
        url: gis.lhsp.xmxx.url.delete,
        type: 'delete',
        data: JSON.stringify(gisLhspXmxx),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            success && success(res.data);
        }
    });
    return gisLhspXmxx;
};
gis.lhsp.xmxx.prototype.list = function (success, failure) {
    var list = [];
    var gisLhspXmxx = this;
    $.ajax({
        url: gis.lhsp.xmxx.url.list,
        type: 'get',
        data: Object.assign({}, gisLhspXmxx),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            res.results.forEach(function (item) {
                var gisLhspXmxx = new gis.lhsp.xmxx(item);
                list.push(gisLhspXmxx);
            });
            success && success(list);
        }
    });
    return list;
};
gis.lhsp.xmxx.prototype.one = function (success, failure) {
    var gisLhspXmxx = this;
    $.ajax({
        url: gis.lhsp.xmxx.url.one,
        type: 'get',
        data: Object.assign({}, gisLhspXmxx),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            gisLhspXmxx.load(res.data);
            success && success(gisLhspXmxx);
        }
    });
    return gisLhspXmxx;
};
gis.lhsp.xmxx.prototype.getFormUrl = function () {
    return gis.lhsp.xmxx.url.form + '?id=' + (this.id || '') + '&type=' + (this.type || 'done');
};
