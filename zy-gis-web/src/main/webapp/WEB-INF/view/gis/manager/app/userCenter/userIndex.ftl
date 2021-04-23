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
    <link rel="stylesheet" href="${basePath}/static/lib/layui/css/layui.css">
    <#--<#include "../include.ftl"/>-->
    <script src="${basePath}/static/lib/mui/js/mui.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>
    <!--<link rel="stylesheet" type="text/css" href="http://localhost:8088/dzzw/static/fonts/iconfont.css">
    <link rel="stylesheet" type="text/css" href="http://localhost:8088/dzzw/static/appMapFont/iconfont.css">-->
    <style type="text/css">
        #userImg {
            font-size: 80px;
            color: #f7f7f7;
            text-align: center;
            line-height: 130px;
        }
        a{
            color: #ffffff;
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
            padding: 0 0.5rem 0 6px;
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


        html, body, #userIndex {
            height: 100%;
        }
    </style>
</head>
<body>
<div id="userIndex">
    <!-- 主页面容器 -->
    <header class="mui-bar mui-bar-nav" style="box-shadow: none">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="toUserCenter"></a>
        <h1 class="mui-title">个人中心</h1>
    </header>
    <div class="mui-content" id="userIndex">
        <!-- 主界面具体展示内容 -->
        <div class="">
            <div class="aui-take-content" style="height: 200px;">
                <div class="layui-icon layui-icon-friends" id="userImg"></div>
                <div class="userNameInfo">{{userInfo.userName}}</div>
            </div>
        </div>
        <div class="aui-course-list">
            <a href="javascript:" @click="userInfoDetail()" class="aui-flex userInfo">
                <div class="aui-cou-img">
                    <img src="${basePath}/static/image/icon-li-001.png" alt="">
                    <#--<img src="http://localhost:8088/dzzw/static/image/icon-li-001.png" alt="">-->
                </div>
                <div class="aui-flex-box">
                    <span>个人资料</span>
                </div>
            </a>
            <a href="javascript:" style="display: none" @click="updatePassword()" class="aui-flex passwordUpdate">
                <div class="aui-cou-img">
                    <img src="${basePath}/static/image/icon-li-002.png" alt="">
                    <#--<img src="http://localhost:8088/dzzw/static/image/icon-li-002.png" alt="">-->
                </div>
                <div class="aui-flex-box">
                    <span>密码修改</span>
                </div>
            </a>

            <a href="javascript:" @click="onemapApkShare()" class="aui-flex">
                <div class="layui-icon layui-icon-share apkShare">
                </div>
                <div class="aui-flex-box" style="float: left">
                    <span>分享给朋友</span>
                </div>
            </a>
        </div>
        <div style="padding: 15px;">
            <a id="tuichu" href="javascript:" @click="loginOut()" class="btn_qh">
                <i class="iconfont icon-qiehuan"></i><span>切换用户</span>
            </a>
            <iframe src="" ref="onemapLoginout" frameborder="0"></iframe>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    var basePath = '${basePath}';
    mui.back = function () {
        plus.webview.close("onemapUserCenter", '')
    };

    var vm = new Vue({
        el: "#userIndex",
        data: function () {
            return {
                userInfo: {}
            }
        },
        mounted: function () {
            this.getUserInfo()
        },
        methods: {
            loginOut: function () {
                $(this.$refs.onemapLoginout).attr("src", basePath + "/sso/logout");
                var list = plus.webview.currentWebview().opener();
                //触发列表界面的自定义事件（refresh）,从而进行数据刷新
                mui.fire(list, 'onemapIndex');
            },
            toUserCenter: function () {
                plus.webview.close("onemapUserCenter", 'slide-in-left')
            },
            userInfoDetail: function () {
                plus.webview.open(
                    window.location.origin + basePath + '/gis/app/onemapUserInfoDetail'
                    , 'onemapUserInfoDetail'
                    , {
                        top: '0', bottom: '0px'
                    }
                    , 'slide-in-right'
                );

                mui.open({
                    close: function () {
                        plus.webview.close("onemapUserInfoDetail", 'slide-in-left')
                    }
                })
            },
            updatePassword: function () {
                plus.webview.open(
                    window.location.origin + basePath + '/gis/app/onemapUpdatePassword'
                    , 'onemapUpdatePassword'
                    , {
                        top: '0', bottom: '0px'
                    }// style
                    , 'slide-in-right'
                );
                mui.open({
                    close: function () {
                        plus.webview.close("onemapUpdatePassword", 'slide-in-left')
                    }
                })
            },
            onemapApkShare: function () {
                plus.share.sendWithSystem({
                    content: '',
                    href: window.localStorage.getItem("onemapApkDownHtml") + "#" + window.localStorage.getItem("onemapApkDownUrl")
                }, function (e) {
                }, function (e) {
                });

            },
            //获取用户基本信息
            getUserInfo: function () {
                var _this = this;
                $.get(basePath + '/common/user/info', function (res) {
                    if (res.success) {
                        _this.userInfo = res.data
                    }
                })
            }
        }
    })
</script>
</html>
