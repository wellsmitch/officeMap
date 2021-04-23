zy.util.provide('gis.lhsp.xmfa');
gis.lhsp.xmfa = function (data) {
    this.pagingFlag = false;
    if (data) {
        this.load(data);
    }
};
gis.lhsp.xmfa.url = {
    get: basePath + '/gis/lhsp/xmfa/get',
    list: basePath + '/gis/lhsp/xmfa/list',
    save: basePath + '/gis/lhsp/xmfa/save',
    delete: basePath + '/gis/lhsp/xmfa/delete',
    one: basePath + '/gis/lhsp/xmfa/one',
    form: basePath + '/gis/lhsp/xmfa/html/form'
};
gis.lhsp.xmfa.prototype.load = function (data) {
    if (data) {
        Object.assign(this, data);
    }
    return this;
};
gis.lhsp.xmfa.prototype.get = function (success, failure) {
    var gisLhspXmfa = this;
    $.ajax({
        url: gis.lhsp.xmfa.url.get + '/' + gisLhspXmfa.id,
        type: 'get',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            gisLhspXmfa.load(res.data);
            success && success(gisLhspXmfa);
        }
    });
    return gisLhspXmfa;
};

gis.lhsp.xmfa.prototype.save = function (success, failure) {
    var gisLhspXmfa = this;
    $.ajax({
        url: gis.lhsp.xmfa.url.save,
        type: 'post',
        data: JSON.stringify(gisLhspXmfa),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure(res.data);
                return;
            }
            gisLhspXmfa.load(res.data);
            success && success(gisLhspXmfa);
        }
    });
    return gisLhspXmfa;
};
gis.lhsp.xmfa.prototype.delete = function (success, failure) {
    var gisLhspXmfa = this;
    $.ajax({
        url: gis.lhsp.xmfa.url.delete,
        type: 'delete',
        data: JSON.stringify(gisLhspXmfa),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            success && success(res.data);
        }
    });
    return gisLhspXmfa;
};
gis.lhsp.xmfa.prototype.list = function (success, failure) {
    var list = [];
    var gisLhspXmfa = this;
    $.ajax({
        url: gis.lhsp.xmfa.url.list,
        type: 'get',
        data: Object.assign({}, gisLhspXmfa),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            res.results.forEach(function (item) {
                var gisLhspXmfa = new gis.lhsp.xmfa(item);
                list.push(gisLhspXmfa);
            });
            success && success(list);
        }
    });
    return list;
};
gis.lhsp.xmfa.prototype.one = function (success, failure) {
    var gisLhspXmfa = this;
    $.ajax({
        url: gis.lhsp.xmfa.url.one,
        type: 'get',
        data: Object.assign({}, gisLhspXmfa),
        success: function (res) {
            if (!res.success) {
                failure && failure(res.data);
                return;
            }
            gisLhspXmfa.load(res.data);
            success && success(gisLhspXmfa);
        }
    });
    return gisLhspXmfa;
};

gis.lhsp.xmfa.prototype.getFormUrl = function () {
    return gis.lhsp.xmfa.url.form + '?id=' + (this.id || '') + '&type=' + (this.type || 'done') + '&lhspXmxxId=' + (this.lhspXmxxId ||'') + '&tmpKey=' + (this.tmpKey ||'');
};
