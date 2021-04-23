define('ywInfo', [], function () {

    var config = {
        open: function () {
            $('#ywInfoList').show();
            $('#ywInfoList .ywInfoCon').scrollTop(0);
        },
        close: function () {
            $('#ywInfoList').hide();
        }
    };

    var ywInfoVm = new Vue({
        el: '#ywInfoList',
        data: {
            ysInfo: {},
            bpInfo: {},
            cbInfo: {},
            ghtjInfo: {},
            gyInfo: {},
            bdcdjInfo:{},
            ydghxkInfo: {},
            bdcdeInfo: {},
            gcghxkList: [],
            gcghxkInfo: {},
            ghhsList: [],
            ghhsInfo: {},
            content:{},
            officeInfoDiv: false
        },
        methods: {
            ywInfoClose: function () {
                mui.close();
            },
            officeInfoCollapseAction: function (info) {
                this.$set(info, 'show', !info.show);
            },
        }
    });
    function getObjectKeyNum(obj) {
        return Object.keys(obj).length >　2 ? true : false
    }

    function getYWInfo(landCode) {
        // TDCB-41010500000137---TDGY-41010000009841
        mui.get(basePath + '/gis/app/ywinfo', {landCode: landCode}, function (res) {
            var data = {};
            ywInfoVm.officeInfoDiv = false;
            if (res.success && Object.keys(res.data).length > 0) {
                for (var key in res.data) {
                    var r = res.data;
                    if (!r[key]) {
                        r[key] = {};
                    }else if(key != "planVerifyVoList" && key != "planProjectVoList") {
                        ywInfoVm.officeInfoDiv = true
                    }
                    var rt = r[key];
                    rt["show"] = false;
                    rt["status"] = true;
                }
                data = res.data;
            }
            /*if(
                getObjectKeyNum(data.reservePreApprovalVo) || data.reserveApproval || data.reserveInfo || data.planCondition ||
                data.reserveSupplyInfo || data.bdcdjVo || data.landPlanPermissionVo || data.planCondition ||
                (data.planProjectVoList && data.planProjectVoList.length > 0)
            ) {
                ywInfoVm.officeInfoDiv = true
            }else {
                ywInfoVm.officeInfoDiv = false
            }*/

            ywInfoVm.ysInfo = data.reservePreApprovalVo || {};
            ywInfoVm.bpInfo = data.reserveApproval || {};
            ywInfoVm.cbInfo = data.reserveInfo || {};
            ywInfoVm.ghtjInfo = data.planCondition || {};

            ywInfoVm.gyInfo = data.reserveSupplyInfo || {};
            ywInfoVm.bdcdjInfo = data.bdcdjVo || {};
            ywInfoVm.ydghxkInfo = data.landPlanPermissionVo || {};
            ywInfoVm.gcghxkInfo = (data.planProjectVoList && data.planProjectVoList.length > 0) ? data.planProjectVoList[data.planProjectVoList.length-1] : {};

            ywInfoVm.ghhsInfo = (data.planVerifyVoList && data.planVerifyVoList.length > 0) ? data.planVerifyVoList[data.planVerifyVoList.length-1] : {};


            ywInfoVm.ghhsList = data.planVerifyVoList || [];
            ywInfoVm.gcghxkList = data.planProjectVoList || [];

        })
    }

    return {
        show: function (params) {
            ywInfoVm.content = params;
            if(params.landCode){
                getYWInfo(params.landCode);
            }
            mui.open(config);
        }
    }


})