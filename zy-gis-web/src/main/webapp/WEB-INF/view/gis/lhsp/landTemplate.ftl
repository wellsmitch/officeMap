<div id="rightDiv" class="customTabCls" style="height: 100%;">
    <div class="msgCon" style="height:100%">
        <#--列表-->
        <div class="layui-tab layui-tab-card" style="height:100%">
            <ul class="layui-tab-title ulcon" style="height: 30px">
                <li class="layui-this" style="margin-right: 6px">选择地块</li>
            </ul>
            <div id="rightContentDiv" class="layui-tab-content"
                 style="position: relative;background: #fff;overflow:hidden;box-sizing:border-box;height: calc(100% - 30px);">
                <div class="overflow" style="line-height:45px">
                    <p class="fl blue_block"></p>
                    <p class="fl">已选业务地块:</p>
                </div>
                <ul id="fildMsgCon2"
                    style="width: 100%;max-height:calc(100% - 45px);
                    min-height:100px;background:#f2f2f2;line-height: 28px;overflow:auto;padding: 10px;box-sizing: border-box">
                    <li v-for="item in landMappingInfo"
                        style="border-bottom: 1px dashed #aaa ">
                        <div>
                            <span style='font-weight:800'>土地代码：</span>
                            <span>{{item.landCode}}</span>
                        </div>
                        <div>
                            <span style='font-weight:800'>土地坐落：</span>
                            <span>{{item.location}}</span>
                        </div>
                        <div class='overflow'>
<#--                            <p style='cursor: pointer;color: #1269d3' class='fl'>地块详情</p>-->
                            <p class='fr'><a style='color: #f00' href='javascript:'
                                             @click="removeRela(item)" class=''>取消</a>
                            </p>
                        </div>
                    </li>
<#--                <form id="data_in_base" class="layui-form layui-tab-item ulcon1 layui-show"-->
<#--                      style="box-sizing: border-box;padding:0">-->

<#--                    <div id="import_result_0" class="layui-form-item"-->
<#--                         style="display:block;position:relative;box-sizing:border-box;height: 100%">-->
<#--                        <div id="fildMsgPicked" style="height: 100%">-->
<#--                            <div class="overflow" style="line-height:45px">-->
<#--                                <p class="fl blue_block"></p>-->
<#--                                <p class="fl">已选业务地块:</p>-->
<#--                            </div>-->
<#--                            <ul id="fildMsgCon2"-->
<#--                                style="width: 100%;max-height:calc(100% - 45px);min-height:100px;background:#f2f2f2;line-height: 28px;overflow:auto;padding: 10px;box-sizing: border-box">-->
<#--                                <li v-for="item in landMappingInfo.infoList"-->
<#--                                    style="border-bottom: 1px dashed #aaa ">-->
<#--                                    <div>-->
<#--                                        <span style='font-weight:800'>土地代码：</span>-->
<#--                                        <span>{{item.landCode}}</span>-->
<#--                                    </div>-->
<#--                                    <div>-->
<#--                                        <span style='font-weight:800'>土地坐落：</span>-->
<#--                                        <span>{{item.location}}</span>-->
<#--                                    </div>-->
<#--                                    <div class='overflow'>-->
<#--&lt;#&ndash;                                        @click="item.autoHide=false,fixedPosition(parentLayer,item)"-->
<#-- @mouseover="showDetail(parentLayer,item,$event)"-->
<#--                                           @mouseout="hideDetail(parentLayer,item)">地块详情</p>-->
<#--                                             @click="removeRela(parentLayer,item)-->
<#--&ndash;&gt;-->
<#--                                        <p style='cursor: pointer;color: #1269d3' class='fl'>地块详情</p>-->
<#--&lt;#&ndash;                                        <p class='fr' v-if="uploadLayer">&ndash;&gt;-->
<#--&lt;#&ndash;                                            <a style='color: #f00' href='javascript:' class=''&ndash;&gt;-->
<#--&lt;#&ndash;                                             ">取消</a>&ndash;&gt;-->
<#--&lt;#&ndash;                                        </p>&ndash;&gt;-->

<#--                                        <p class='fr' >-->
<#--                                            <a style='color: #f00' href='javascript:' class=''>取消</a>-->
<#--                                        </p>-->
<#--                                    </div>-->
<#--                                </li>-->
<#--                            </ul>-->
<#--                        </div>-->
<#--                    </div>-->





                </div>
<#--            </form>-->
        </div>
    </div>
</div>
