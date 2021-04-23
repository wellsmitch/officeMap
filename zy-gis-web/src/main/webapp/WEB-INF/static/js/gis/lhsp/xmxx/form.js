layui.use(['form', 'table', 'laydate', 'upload'], function () {
    var layer = layui.layer, laydate = layui.laydate, form = layui.form;
    var id = getQueryString("id");
    var readonly = getQueryString("type") != 'write';

    var xmxx = new gis.lhsp.xmxx({xmbh: '',id: id});
    var mainFormVue = new Vue({
        el: '#mainForm',
        data: {
            xmxx: xmxx,
            readonly: readonly
        },
        methods: {},
        mounted: function () {

            if (xmxx.id) {
                xmxx.get(function () {
                    mainFormVue.xmxx = xmxx;
                    renderForm();
                });
            } else {
                renderForm();
            }
        }
    });

    form.on('submit(*)', function () {
        xmxx.save(function (info) {
            layer.msg("保存成功！", {icon: 6});
            window.successCallback && window.successCallback(info);
        }, function (text) {
            layer.open({title: '操作失败', content: text, icon: 5});
        });
        return false;
    });
    form.on('select', function (data) {
        xmxx[data.elem.name] = data.value;
    });
    function renderForm() {
        console.log(xmxx);
        setTimeout(function () {
            form.render('select');
        });
    }
    window.saveMethod = function (success) {
        window.successCallback = success;
        $('#saveBtn').click();
    };
});
