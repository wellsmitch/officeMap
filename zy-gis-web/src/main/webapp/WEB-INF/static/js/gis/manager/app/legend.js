define('legend', [], function (previewImage) {

    var config = {
        open: function () {
            $('#legendDv').show();
        },
        close: function () {
            $('#legendDv').hide();
            mui('#legendDv .mui-scroll-wrapper').scroll().scrollTo(0, 0);
            // $('#attachmentList').empty();

        }
    };

    return {
        show:function(data) {
            $('#legendDv').show();
        }
    }
})