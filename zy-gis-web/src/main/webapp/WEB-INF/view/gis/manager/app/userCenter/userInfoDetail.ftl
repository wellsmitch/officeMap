<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"/>
    <title></title>
    <link rel="stylesheet" href="${basePath}/static/css/oa/address/personal.css">
    <link href="${basePath}/static/css/oa/address/personal.css" rel="stylesheet"/>
    <link href="${basePath}/static/lib/mui/css/mui.min.css" rel="stylesheet"/>

    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>

    <style type="text/css">
        #userImg {
            font-size: 80px;
            color: #f7f7f7;
            text-align: center;
            line-height: 130px;
        }

        .userNameInfo {
            font-size: 18px;
            line-height: 20px;
            text-align: center;
            color: #ffffff;
        }

        .apkShare {
            color: #1269d3;
            padding-right: 12px;
            font-size: 18px;
            padding: 0 12px 0 4px;
        }

        .btn_qh {
            width: 100%;
            height: 44px;
            line-height: 44px;
            border-radius: 4px;
            background-color: #2c8ef1;
            font-size: 14px;
            color: #ffffff;
            display: flex;
            text-align: center;
            justify-content: center;
        }

        body, #userIndex {
            background: #f2f2f2;
        }

        html, body, #userIndex {
            height: 100%;
        }

        .overflow {
            overflow: hidden;
        }

        #onemapUserInfoDetail .phoneNumber {
            border-left: 1px solid #f1eaea;
            border-radius: 0;
        }

    </style>
</head>
<body>
<div id="userIndex">


    <!-- 主页面容器 -->
    <header class="mui-bar mui-bar-nav" style="box-shadow: none">
        <a href="javascript:" @click="toUserCenter()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">个人资料</h1>
    </header>
    <div class="mui-content" id="onemapUserInfoDetail" style="background-color: transparent;">
        <div class="mui-input-row">
            <div class="overflow" style="position:relative;margin-top: 5px;background: #fff">
                <label style="text-align: center">手机号：</label>
                <input type="text" v-model="userInfo.mobilePhone" class="mui-input mui-input-clear phoneNumber"
                       data-input-clear="3">
                <span class="mui-icon mui-icon-clear mui-hidden"></span>
            </div>
            <button type="button" @click="saveUserInfo()" class="mui-btn mui-btn-blue mui-btn-block"
                    style="width: 70%;margin: 20px auto 0;float: initial;">确认修改
            </button>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    var basePath = '${basePath}';
    var vm = new Vue({
        el: "#userIndex",
        data: function () {
            return {
                userInfo: {
                    phoneNumber: ""
                }
            }
        },
        mounted: function () {
            this.getUserInfo()
        },
        methods: {
            toUserCenter: function () {
                plus.webview.close("onemapUserInfoDetail", 'slide-in-left')
            },
            getUserInfo: function () {
                var _this = this;
                $.get(basePath + '/common/user/info', function (res) {
                    if (res.success) {
                        _this.userInfo = res.data;
                        mui.alert(JSON.stringify(_this.userInfo), "div")
                    }
                })
            },
            saveUserInfo: function () {
                var _this = this;
                $.post(basePath + '/common/user-modifyInfo', _this.userInfo, function (res) {
                    if (res.success) {
                        console.log(JSON.stringify(res));
                        if (res.success) {
                            mui.toast("修改成功")
                        } else {
                            mui.alert(JSON.stringify(res), "div")
                        }
                    }
                })
            }
        }
    })
</script>

</html>
