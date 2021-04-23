<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>联合审批</title>
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
        .first-label{width: 150px;}
        .second-label{width: 190px;}
        .one-line{width: 690px !important;}
        .btn-toolbar{cursor: pointer;transition:.3s}
        [v-cloak] {
            display: none;
        }
        .layui-layer-tab .layui-layer-title span.layui-this {
            height:34px;
            color: #000;
        }
    </style>
</head>
<body>
<div id="infoPanel" style="height: 100%; overflow: auto;">
    <form id="mainForm" v-cloak class="layui-form" style="width: 920px; margin: 0 auto;">
        <div class="myPanel">
            <div class="module-sub-title">
                <span>议题</span>
            </div>
            <div class="form-box">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">议题类型</label>
                    <div class="layui-input-inline ">
                        <select lay-verify="required"  :disabled="readonly" v-init="xmfa.issueType=xmfa.issueType||''" name="issueType" v-model="xmfa.issueType">
                            <option value="1">招拍挂出让</option>
                            <option value="2">协议出让</option>
                            <option value="3">划拨供应</option>
                            <option value="4">新征地收储</option>
                            <option value="5">国有地收储</option>
                        </select>
                    </div>
                    <label class="layui-form-label second-label label-required">议题序号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ytxh" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

<#--                <div class="layui-form-item">-->
<#--                    <label class="layui-form-label first-label label-required">地块代码</label>-->
<#--                    <div class="layui-input-inline">-->
<#--                        <input v-model="xmfa.mappingValue"  id="landCode" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>-->
<#--                    </div>-->

<#--                    <div class="layui-form-mid selectLandDiv" style="padding: 0 !important; height: 32px; line-height: 32px;">-->
<#--                        <button type="button" class="layui-btn layui-btn-sm selectLandBtn" style="float: none;">选择地块</button>-->
<#--                    </div>-->
<#--                </div>-->
            </div>

            <div class="module-sub-title">
                <span style="margin-right: 150px;">会商地块</span>
                <button v-if="!readonly" type="button" class="layui-btn layui-btn-sm selectLandBtn" style="float: right;"><i class="layui-icon">&#xe654;</i> 选择地块</button>
            </div>
            <table id="road" class="layui-table">
                <colgroup>
                    <col style="width: 46%">
                    <col style="width: 44%">
                    <col v-if="!readonly" style="width: 10%">
                </colgroup>
                <thead>
                <tr>
                    <th >地块代码</th>
                    <th >土地用途</th>
                    <th v-if="!readonly">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in landList">
                    <td><input type="text" v-model="item.landCode"  lay-verify="required" :disabled="true" class="layui-input" autocomplete="off"></td>
                    <td><input type="text" v-model="item.purpose" lay-verify="required" :disabled="readonly" class="layui-input" autocomplete="off"></td>
                    <td  v-if="!readonly" style="text-align: center;">
                        <a v-if="!readonly" class="layui-btn layui-btn-xs layui-btn-danger" @click="removeTable(item)">删除</a>
<#--                        <self v-if="readonly">-->
<#--                            <a class="layui-btn layui-btn-xs" @click="selectLand(item)" >查看地块</a>-->
<#--                        </self>-->
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="module-sub-title">
                <span>地块信息</span>
            </div>
            <div class="form-box"  v-if="xmfa.issueType == 1">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">项目名称</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.famc" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">使用权面积</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.mj" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>

                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">位置</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zl" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">挂牌方式</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.gpfs" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">土地主用途 </label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.tdytCode" name="tdytCode" type="hidden" class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.tdyt" name="tdyt" type="text"  :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">土地副用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.sideTdytCode" name="sideTdytCode" type="hidden" class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.sideTdyt" name="sideTdyt" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">兼容比例</label>
                    <div class="layui-input-inline " style="width: 79%">
                        <input v-model="xmfa.compatible" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">地下空间用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.dxkjyt" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">安置/开发区</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.kfq" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">容积率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.rjl" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">建筑高度(米)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.jzgd" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label">绿地率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ldl" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>

                    <label class="layui-form-label second-label ">建筑密度</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.jzmd" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>

                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">挂牌起始价（万元）</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.gpqsj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">挂牌起始单价(楼面价)</br>（元/平方米)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.gpqsdj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">熔断价（万元）</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.rdj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">最高限价（万元）</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zgxj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>

<#--            <div class="module-sub-title" v-if="xmfa.issueType == 2 || xmfa.issueType == 3">-->
<#--                <span v-if="xmfa.issueType == 2">协议出让</span>-->
<#--                <span v-if="xmfa.issueType == 3">供应划拨</span>-->
<#--            </div>-->
            <div class="form-box"  v-if="xmfa.issueType == 2 || xmfa.issueType == 3">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">项目名称</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.famc" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">办理类型</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.bllx" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">位置</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zl" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">拟办面积</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.mj" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">拟供应宗地编号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ngyzdbh" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">拟办单位</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.nbdw" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">拟办类型</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.nblx" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">登记权属</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.djqs" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">土地主用途 </label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.tdytCode" name="tdytCode" type="hidden" class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.tdyt" name="tdyt" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">土地副用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.sideTdytCode" name="sideTdytCode" type="hidden" class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.sideTdyt" name="sideTdyt" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label">兼容比例</label>
                    <div class="layui-input-inline " style="width: 79%">
                        <input v-model="xmfa.compatible" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label">容积率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.rjl" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">建筑高度(米)</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.jzgd" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">建筑密度</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.jzmd" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">绿地率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ldl" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">评估总价</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.pgzj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">单价</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.pgdj" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">土地价款</label>
                    <div class="layui-input-inline" style="width: 79%">
                        <textarea class="layui-textarea" v-model="xmfa.tdjk" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>

                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">现场情况</label>
                    <div class="layui-input-inline" style="width: 79%">
                        <textarea class="layui-textarea" v-model="xmfa.xcqk" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">安全区情况</label>
                    <div class="layui-input-inline"  style="width: 79%">
                        <textarea class="layui-textarea" v-model="xmfa.aqqqk" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">地下空间情况</label>
                    <div class="layui-input-inline" style="width: 79%">
                        <textarea class="layui-textarea" v-model="xmfa.dxkj" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>

                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">其他</label>
                    <div class="layui-input-inline" style="width: 79%">
                        <textarea class="layui-textarea" v-model="xmfa.other" :disabled="readonly" style="width: 100%;height: 50px;"></textarea>
                    </div>
                </div>
            </div>


<#--            <div class="module-sub-title" v-if="xmfa.issueType == 4">-->
<#--                <span>新征地收储</span>-->
<#--            </div>-->
            <div class="form-box"  v-if="xmfa.issueType == 4">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">项目名称</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.famc" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">面  积</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.mj" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">位   置</label>
                    <div class="layui-input-inline " >
                        <input v-model="xmfa.zl" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>

                    <label class="layui-form-label second-label label-required">改造方案批复文号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.gzfaph" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">规划用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ghytCode" type="hidden"  class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.ghyt" name="ghyt" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">主用途容积率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zytrjl" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">原土地权属单位</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.qsdw" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">所属批次</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.sspc" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label first-label ">补偿总费用</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.bcfy" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label ">是否安置区</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.azq" type="text" :disabled="readonly" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

            </div>

<#--            <div class="module-sub-title" v-if="xmfa.issueType == 5">-->
<#--                <span>国有地收储</span>-->
<#--            </div>-->
            <div class="form-box"  v-if="xmfa.issueType == 5">
                <div class="layui-form-item">
                    <label class="layui-form-label first-label">项目名称</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.famc" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label label-required">面  积</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.mj" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label label-required">位   置</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zl" type="text" :disabled="readonly" lay-verify="required" class="layui-input" autocomplete="off"/>
                    </div>

                    <label class="layui-form-label second-label label-required">改造方案批复文号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.gzfaph" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">原土地使用者</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.tdsyz" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">原使用权类型</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.syqlx" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">土地证号</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.tdzh" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">收购补偿依据</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.sgbc" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label first-label">原规划用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.ghytCode" type="hidden"  class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.ghyt" name="ghyt" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">新规划用途</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.xghyuCode" type="hidden"  class="layui-input" autocomplete="off"/>
                        <input v-model="xmfa.xghyu" name="xghyu" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>


                <div class="layui-form-item">
                    <label class="layui-form-label first-label">主用途容积率</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.zytrjl" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                    <label class="layui-form-label second-label">收购补偿款</label>
                    <div class="layui-input-inline ">
                        <input v-model="xmfa.bcfy" type="text" :disabled="readonly"  class="layui-input" autocomplete="off"/>
                    </div>
                </div>
            </div>
            <button id="saveBtn" lay-submit class="layui-hide" lay-filter="*">提交</button>
        </div>
    </form>
</div>
<script src="${basePath}/static/js/gis/lhsp/xmfa/gis.lhsp.xmfa.js"></script>
<script src="${basePath}/static/js/gis/lhsp/xmfa/form.js"></script>

</body>
</html>
