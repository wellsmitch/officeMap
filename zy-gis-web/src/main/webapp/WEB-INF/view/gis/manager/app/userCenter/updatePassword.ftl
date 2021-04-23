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
    <script type="text/javascript" src="${basePath}/static/lib/jsencrypt.min.js"></script>
    <style type="text/css">
        #onemapUpdatePassword .mui-input-row > div {
            background: #ffffff;
        }

        .overflow {
            overflow: hidden;
        }

        body, #userIndex {
            background: #f2f2f2;
        }

        html, body, #userIndex {
            height: 100%;
        }
    </style>
</head>
<body style="background-color: #f2f2f2;">
<div id="userIndex">


    <!-- 主页面容器 -->
    <header class="mui-bar mui-bar-nav" style="box-shadow: none">
        <a href="javascript:" @click="toUserCenter()" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
        <h1 class="mui-title">个人资料</h1>
    </header>
    <div class="mui-content" id="onemapUpdatePassword">
        <div class="mui-input-row" style="position: relative;">
            <div class="overflow" style="position:relative;margin-top: 5px">
                <label>原密码：</label>
                <input type="password" v-model="userInfo.oPwd" placeholder="请输入原密码" required="required" id="oPwd"
                       name="oPwd"
                       class="mui-input-password mui-input-clear" data-input-clear="3" data-input-password="3"><span
                    class="mui-icon mui-icon-eye"></span><span class="mui-icon mui-icon-clear mui-hidden"></span>
            </div>
            <div class="overflow" style="position:relative;margin-top: 10px">
                <label>新密码：</label>
                <input type="password" v-model="userInfo.nPwd" placeholder="请输入新密码" required="required" id="nPwd"
                       name="nPwd"
                       class="mui-input-password mui-input-clear" data-input-clear="4"
                       data-input-password="4"><span class="mui-icon mui-icon-eye"></span><span
                    class="mui-icon mui-icon-clear mui-hidden"></span>
            </div>
            <div class="overflow" style="position:relative;margin-top: 10px">
                <label>确认密码：</label>
                <input type="password" v-model="userInfo.nPWDAgain" placeholder="请输入确认密码" required="required" id="rPwd"
                       name="rPwd"
                       class="mui-input-password mui-input-clear" data-input-clear="5"
                       data-input-password="5"><span class="mui-icon mui-icon-eye"></span><span
                    class="mui-icon mui-icon-clear mui-hidden"></span>
            </div>
            <button type="button" @click="updatePassword()" class="mui-btn mui-btn-blue mui-btn-block"
                    style="width: 70%;margin: 20px auto 0;float: initial;">确认修改
            </button>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    // console.log(encrypt);
    var encrypt = new JSEncrypt()
    var basePath = '${basePath}';
    var vm = new Vue({
        el: "#userIndex",
        data: function () {
            return {
                userInfo: {}
            }
        },
        methods: {///common/user-modifyPwd
            toUserCenter: function () {
                plus.webview.close("onemapUpdatePassword", 'slide-in-left')
            },
            updatePassword: function () {
                var _this = this;
                if (this.nPWDAgain !== this.nPwd) {
                    mui.alert("新密码与确认密码不一致", "div");
                    return;
                }
                if (!_this.userInfo.oPwd || !_this.userInfo.nPwd) {
                    mui.alert("请输入旧密码与新密码", "div");
                    return
                }
                $.post(basePath + '/common/user-modifyPwd', {
                    oPwd: encrypt.encrypt(_this.userInfo.oPwd),
                    nPwd: encrypt.encrypt(_this.userInfo.oPwd)
                }, function (res) {
                    if (res.success) {
                        mui.toast("修改成功")
                    } else {
                        mui.alert(JSON.stringify(res), "div")
                    }
                })
            }
        }
    })
</script>

</html>
