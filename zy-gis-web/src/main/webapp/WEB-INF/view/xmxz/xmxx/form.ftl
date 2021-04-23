<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>项目信息</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
<#include "/css.ftl" />
<#include "/js.ftl" />
    <script type="text/javascript" src="${basePath}/static/lib/vue/vue.min.js"></script>

    <style type="text/css">
        .layui-table th{text-align: center;}
        .module-title {background-color: #01a5e7;margin-top: 5px;padding: 0;height: 36px;line-height: 36px;position: relative;}
        .module-title span {padding-left: 16px;font-weight: bold;display: inline-block;}
        .module-title button {position: absolute;top: 3px;right: 5px}
        .myPanel {border: 1px solid #e3e3e3;padding: 10px 5px;position: relative;}
        .myPanel .layui-input-inline {width: 240px;}
        .module-sub-title {margin-top: 10px;margin-bottom: 10px;height: 25px;line-height: 25px;padding-top: 0px;}
        .module-sub-title span {border-left: 5px solid #01a5e8;padding-left: 8px;font-weight: bold;display: inline-block;}
        .module-sub-title button {float: right;}
        .layui-btn-sm {margin-left: 15px;padding: 0 8px;height: 28px;line-height: 28px;float: right;}
        .layui-btn i:only-child {margin: 0;}
        .form-box{background-color: #f2f2f2;padding: 8px 0 0 0;}
        .layui-form-mid button{margin-left: 0;}
        .first-label{width: 120px;}
        .second-label{width: 180px;}
        .one-line{width: 690px !important;}
        .btn-toolbar{cursor: pointer;trasition:.3s}
    </style>
</head>
<body>
<div id="infoPanel" style="height: 100%; overflow: auto;">
    <form id="mainForm" class="layui-form" style="width: 900px; margin: 0 auto;">
        <div class="layui-card-header module-title">
            <span id="title">策划项目</span>
        </div>
        <div class="myPanel">
            <div class="module-sub-title">
                <span>项目基本信息</span>
            </div>
            <div class="form-box">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">项目编号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.xmbh" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">项目代码</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.xmdm" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label label-required">项目名称</label>
                    <div class="layui-input-inline one-line">
                        <input v-model="xmxx.xmmc" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">行政区划</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.xzqh=xmxx.xzqh||''" v-model="xmxx.xzqh" :disabled="readonly" name="xzqh">
                            <option value=""></option>
                            <option value="410102">中原区</option>
                            <option value="410103">二七区</option>
                            <option value="410104">管城回族区</option>
                            <option value="410105">金水区</option>
                            <option value="410106">上街区</option>
                            <option value="410108">惠济区</option>
                            <option value="410181">巩义市</option>
                            <option value="410182">荥阳市</option>
                            <option value="410183">新密市</option>
                            <option value="410184">新郑市</option>
                            <option value="410185">登封市</option>
                            <option value="410122">中牟县</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label label-required">项目所在区</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.xmszq" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">生成策划类型</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.scchlx" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">建设地址</label>
                    <div class="layui-input-inline one-line">
                        <input v-model="xmxx.jsdd" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">建设规模及内容</label>
                    <div class="layui-input-inline one-line">
                        <textarea class="layui-textarea" v-model="xmxx.jsgmjnr" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">拟开工时间</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.nkgsj" name="nkgsj" type="text" :disabled="readonly" class="layui-input layui-date" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">拟建成时间</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.njcsj" name="njcsj" type="text" :disabled="readonly" class="layui-input layui-date" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">建设性质</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.jsxz=xmxx.jsxz||''" v-model="xmxx.jsxz" :disabled="readonly" name="jsxz" lay-verify="required">
                            <option value=""></option>
                            <option value="新建">新建</option>
                            <option value="扩建">扩建</option>
                            <option value="改建">改建</option>
                            <option value="迁建">迁建</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label">项目关联编号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.xmglbh" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">用地面积(平方米)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.ydmj" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">建筑面积(平方米)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.jzmj" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>
            <div class="module-sub-title">
                <span>项目分类指标信息</span>
            </div>
            <div class="form-box">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">项目资金属性</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.xmzjsx=xmxx.xmzjsx||''" v-model="xmxx.xmzjsx" :disabled="readonly" name="xmzjsx" lay-verify="required">
                            <option value=""></option>
                            <option value="民间固定资产投资项目">民间固定资产投资项目</option>
                            <option value="国有控股项目">国有控股项目</option>
                            <option value="其他项目">其他项目</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label label-required">立项类型</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.lxlx=xmxx.lxlx||''" v-model="xmxx.lxlx" :disabled="readonly" name="lxlx" lay-verify="required">
                            <option value=""></option>
                            <option value="审批">审批</option>
                            <option value="核准">核准</option>
                            <option value="备案">备案</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">项目类型</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.xmlx=xmxx.xmlx||''" v-model="xmxx.xmlx" :disabled="readonly" name="xmlx">
                            <option value=""></option>
                            <option value="财政性投融资工程建设项目">财政性投融资工程建设项目</option>
                            <option value="小型社会投资项目">小型社会投资项目</option>
                            <option value="一般社会投资项目">一般社会投资项目</option>
                            <option value="带方案出让用地的社会投资项目">带方案出让用地的社会投资项目</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label">国标行业</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.gbhy" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>
            <div class="module-sub-title">
                <span>项目建设单位信息</span>
            </div>
            <div class="form-box">
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label label-required">建设单位</label>
                    <div class="layui-input-inline one-line">
                        <input v-model="xmxx.jsdw" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">单位证照类型</label>
                    <div class="layui-input-inline ">
                        <select v-init="xmxx.dwzzlx=xmxx.dwzzlx||''" v-model="xmxx.dwzzlx" :disabled="readonly" name="dwzzlx" lay-verify="required">
                            <option  value=""></option>
                            <option value="企业营业执照（工商注册号）">企业营业执照（工商注册号）</option>
                            <option value="组织机构代码证（企业法人）">组织机构代码证（企业法人）</option>
                            <option value="组织机构代码证（国家机关法人）">组织机构代码证（国家机关法人）</option>
                            <option value="组织机构代码证（事业单位法人、社会团体法人）">组织机构代码证（事业单位法人、社会团体法人）</option>
                            <option value="统一社会信息代码">统一社会信息代码</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label label-required">单位证照号码</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.dwzzhm" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">联系人</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.lxr" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">联系人证件号码</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.lxrzjhm" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">联系人电话</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.lxrdh" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">联系人电子邮件</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.lxrdzyj" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>
            <div class="module-sub-title">
                <span>项目投资与进度计划</span>
            </div>
            <div class="form-box">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">总投资额(万元)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.ztze" type="text" :disabled="readonly" lay-verify="required|number" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">当前年度预计总投资</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmxx.dqndztz" type="text" :disabled="readonly" lay-verify="required|number" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">其他年度计划投资</label>
                    <div class="layui-input-inline one-line">
                        <textarea class="layui-textarea" v-model="xmxx.qtndjhtz" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">当前年度进度计划</label>
                    <div class="layui-input-inline one-line">
                        <textarea class="layui-textarea" v-model="xmxx.dqndjdjh" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">其他年度进度计划</label>
                    <div class="layui-input-inline one-line">
                        <textarea class="layui-textarea" v-model="xmxx.qtndjdjh" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
                <div class="layui-form-item alone">
                    <label class="layui-form-label first-label">目前进展情况</label>
                    <div class="layui-input-inline one-line">
                        <textarea class="layui-textarea" v-model="xmxx.mqjzqk" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
            </div>
            <div id="dgspyjDiv" style="display: none">
                <div class="module-sub-title">
                    <span class="label-required">审批意见</span>
                </div>
                <div class="form-box" id="yj">
                    <div class="layui-form-item">
                        <div class="layui-input-inline" style="width: 868px;">
                            <textarea style="resize: none;" name="" class="layui-textarea"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <button id="saveBtn" lay-submit class="layui-hide" lay-filter="*">提交</button>
        </div>
    </form>
</div>
<script src="${basePath}/static/js/xmxz/xmxx/xmxz.xmxx.js"></script>
<script src="${basePath}/static/js/xmxz/xmxx/form.js"></script>
</body>
</html>
