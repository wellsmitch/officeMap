<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>郑州市自然资源和规划局电子政务</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
    <link rel="icon" type="image/x-icon" href="${basePath}/static/image/favicon.ico"/>
    <script>
        if (window.top != window) {
            window.top.location.href = '${basePath}/login';
        }
    </script>
    <#--<link rel="stylesheet" type="text/css" href="${basePath}/static/css/login-page.css">-->
    <#include "/js.ftl"/>
    <style type="text/css">
        html {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
        }

        body {
            margin: 0px;
            padding: 0px;
            background: url("${basePath}/static/image/login-bg2.jpg") no-repeat center top;
            background-size: cover;
            min-width: 100%;
            height: 100%;
        }

        /**logo**/
        .login_title {
            width: 100%;
            height: 150px;
            height: 100px;
            background-color: #fff;
            overflow: hidden;
        }

        .login_title > img {
            width: auto;
            height: 60px;
            margin-top: 23px;
        }

        /*.login_title > img {*/
        /*    width: auto;*/
        /*    height: 60px;*/
        /*    margin-top: 45px;*/
        /*}*/

        /**banner背景图-登录**/
        .bannerbox {
            width: 100%;
            height: 647px;
            height: auto;
        }

        .login_box {
            width: 274px;
            height: 392px;
            padding: 20px;
            overflow: hidden;
            position: absolute;
            right: 110px;
            top: 50%;
            margin-top: -213px;
            background: url(${basePath}/static/image/login_bottom.png) bottom center no-repeat #fff;
            background-size: 100%;
        }

        .module-sub-title {
            line-height: 25px;
            height: 25px;
            padding: 12px 10px;
            border-bottom: 1px dashed #ccc;
            margin-bottom: 20px;
            padding-top: 0px;
        }

        .btmbox {
            position: absolute;
            bottom: 0px;
            left: 0px;
            height: 120px;
            width: 100%;
            background-color: #fff;
        }

        .wj_title {
            overflow: hidden;
        }

        .wj_title .ti {
            font-size: 20px;
            font-weight: bold;
            color: #108ee9;
            margin-top: 24px;
            float: left;
            margin-left: 20px;
        }

        .wj_main {
            margin: 0px auto;
            overflow: hidden;
            margin-top: 30px;
        }

        .wj_input_box_input {
            width: 99%;
            height: 45px;
            line-height: 45px;
            background: none;
            border: none;
            text-indent: 34px;
            font-size: 16px;
        }

        .wj_input_box_icon {
            position: absolute;
            left: 7px;
            top: 8%;
        }

        .wj_input_box {
            height: 45px;
            line-height: 45px;
            border-radius: 6px 6px 0 0;
            border: 1px solid #e3e3e3;
            position: relative;
            margin-bottom: 1px;
            margin-bottom: 30px;
        }

        .wj_input_box4 {
            width: 100%;
            height: 45px;
            line-height: 45px;
        }

        .wj_input_box4 .wj_input_box_submit {
            color: #fff;
            background-color: #108ee9;
            border-color: #108ee9;
            width: 100%;
            height: 45px;
            border: none;
            display: block;
            margin-top: 20px;
            border-radius: 6px;
            margin-top: 50px !important;
        }

        /**自适应1366像素**/
        @media screen and (max-width: 1365px) {
            .login_title {
                height: 100px;
                overflow: hidden;
            }

            .login_title > img {
                width: auto;
                height: 60px;
                margin-top: 23px;
            }

            .bannerbox {
                height: auto;
            }

            .btmbox {
                height: 48px;
            }

            .login_box {
                width: 225px;
                height: 320px;
                overflow: hidden;
                padding: 14px;
            }

            .wj_main {
                overflow: hidden;
            }

            .wj_input_box4 .wj_input_box_submit {
                margin-top: 40px !important;
                height: 37px;
            }

            .login_box {
                margin-top: -160px;
            }

            .wj_title .ti {
                margin-top: 14px;
                font-size: 16px;
            }

            .wj_main {
                margin-top: 25px;
            }

            .wj_input_box {
                height: 36px;
                line-height: 35px;
            }

            .wj_input_box_input {
                height: 35px;
                line-height: 35px;
                font-size: 14px;
            }

            .wj_input_box_icon {
                top: 11%;
            }
        }

        @media screen and (min-width: 1366px) and (max-width: 1599px) {
            .login_title {
                height: 100px;
                overflow: hidden;
            }

            .login_title > img {
                width: auto;
                height: 60px;
                margin-top: 23px;
            }

            .bannerbox {
                height: auto;
            }

            .btmbox {
                height: 48px;
            }

            .login_box {
                width: 225px;
                height: 320px;
                overflow: hidden;
                padding: 14px;
            }

            .wj_main {
                overflow: hidden;
            }

            .wj_input_box4 .wj_input_box_submit {
                margin-top: 40px !important;
                height: 37px;
            }

            .login_box {
                margin-top: -160px;
            }

            .wj_title .ti {
                margin-top: 14px;
                font-size: 16px;
            }

            .wj_main {
                margin-top: 25px;
            }

            .wj_input_box {
                height: 36px;
                line-height: 35px;
            }

            .wj_input_box_input {
                height: 35px;
                line-height: 35px;
                font-size: 14px;
            }

            .wj_input_box_icon {
                top: 11%;
            }

        }

        /*@media screen and (min-width: 1600px) and (max-width: 1919px) {*/
        /*    .login_title {*/
        /*        height: 130px;*/
        /*        overflow: hidden;*/
        /*    }*/

        /*    .bannerbox {*/
        /*        height: 579px;*/
        /*    }*/

        /*    .btmbox {*/
        /*        height: 85px;*/
        /*    }*/

        /*    .login_title > img {*/
        /*        width: auto;*/
        /*        height: 60px;*/
        /*        margin-top: 35px;*/
        /*    }*/

        /*    .login_box {*/
        /*        width: 237px;*/
        /*        height: 332px;*/
        /*        overflow: hidden;*/
        /*        padding: 18px;*/
        /*    }*/

        /*    .wj_input_box4 .wj_input_box_submit {*/
        /*        margin-top: 50px !important;*/
        /*        height: 40px;*/
        /*    }*/

        /*    .login_box {*/
        /*        margin-top: -183px;*/
        /*    }*/

        /*    .wj_title .ti {*/
        /*        margin-top: 14px;*/
        /*        font-size: 16px;*/
        /*    }*/

        /*    .wj_main {*/
        /*        margin-top: 25px;*/
        /*    }*/

        /*    .wj_input_box {*/
        /*        height: 36px;*/
        /*        line-height: 35px;*/
        /*    }*/

        /*    .wj_input_box_input {*/
        /*        height: 35px;*/
        /*        line-height: 35px;*/
        /*    }*/

        /*}*/

        @media screen and(min-width: 1920px) {
            .login_title {
                height: 150px;
                overflow: hidden;
            }

            .bannerbox {
                height: 647px;
            }

            .btmbox {
                height: 110px;
            }

            .login_title > img {
                width: auto;
                height: 60px;
                margin-top: 45px;
            }

            .login_box {
                width: 274px;
                height: 393px;
                overflow: hidden;
                padding: 20px;
            }

            .wj_input_box4 .wj_input_box_submit {
                margin-top: 50px !important;
            }

            .login_box {
                margin-top: -205px;
            }

            .wj_title .ti {
                margin-top: 14px;
                font-size: 22px;
            }

            .wj_main {
                margin-top: 25px;
            }

            .wj_input_box {
                height: 46px;
                line-height: 45px;
            }

            .wj_input_box_input {
                height: 45px;
                line-height: 45px;
            }
        }
    </style>
    <script type="text/javascript" src="${basePath}/static/lib/jsencrypt.min.js"></script>

</head>
<body>
<div class="login_title"><img src="${basePath}/static/image/logo2.png" alt=""></div>
<div class="bannerbox">
    <div class="login_box">
        <form id="loginForm" method='post' action="${basePath}/doLogin">
            <div class="wj_title" style=" padding-bottom:20px;  "><span class="ti">用户登录</span></div>
            <div class="xian" style="  border-bottom:1px solid #118ee9; "></div>
            <div class="wj_main" style=" ">
                <div class="wj_input_box" style=""><span class="wj_input_box_icon"><img
                                src="${basePath}/static/image/ic_username.png"></span>
                    <input class="wj_input_box_input" id="name" type="text" name="userId" lay-verify="required"
                           type="text" placeholder="请输入用户名">
                </div>
                <div class="wj_input_box input_box2" style=""><span class="wj_input_box_icon"><img
                                src="${basePath}/static/image/ic_password.png"></span>
                    <input class="wj_input_box_input" id="userPwd" type="password" name="userPwd" lay-verify="userPwd"
                           placeholder="请输入密码">
                </div>
                <div class="wj_input_box4" id="inputSubmit">
                    <button type="submit" lay-filter="*" lay-submit class="wj_input_box_submit"
                            style=" cursor: pointer;"><span>登&nbsp;&nbsp;录</span>
                    </button>
                </div>
                <div class="clear">
                    <div style="color: red;">${msg!}</div>
                </div>
            </div>
        </form>
    </div>
</div>
<div class="btmbox"></div>
<script type="text/javascript">
    var publicKey = '${publicKey?js_string}';

</script>
<script src="${basePath}/static/js/loginView.js"></script>
</body>
</html>