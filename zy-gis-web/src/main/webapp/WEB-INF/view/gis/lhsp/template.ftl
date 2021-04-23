<div id="rightDiv" class="customTabCls" style="height: 100%;">
    <div class="msgCon" style="height:100%">
        <#--                <div v-show="isAdd" style="height:100%">-->
        <#--                    <div class="overflow itemXzTitle" style="line-height: 45px;border-bottom: 1px solid  #e6e6e6">-->
        <#--                        <p class="fl blue_block"></p>-->
        <#--                        <p class="fl">新增关联业务地块:</p>-->
        <#--                    </div>-->
        <#--                </div>-->

        <#--列表-->
        <div v-show="!isAdd" style="height:100%">
            <div class="addedProject" style="height: 100%">
                <div style="height: 100%">
                    <#--                            <div class="addPanel" v-if="false">-->
                    <#--                                <div class="overflow addAction">-->
                    <#--                                    <div v-show="newProjectShow" class="fl addSave" @click="addSave()">保存</div>-->
                    <#--                                    <div class="fl"></div>-->
                    <#--                                </div>-->
                    <#--                            </div>-->
                    <div class="overflow xzTitle">
                        <div class="fl blue_block"></div>
                        <div class="fl">会议</div>
                        <div class="fr proAddAction layui-icon layui-icon-add-1" @click="addMeeting()"
                             title="新增会议"></div>
                        <div @click="projectSite()" class="fr xmxzAction xmxzLocation  layui-icon layui-icon-location"
                             title="定位所有地块"></div>
                    </div>
                    <div class="zyAddItem" style="padding: 12x">
                        <div class="overflow">
                            <div class="fl zyAddLabel">会议名称</div>
                            <input v-show="newProjectShow" type="text" v-model="xmxx.xmmcInput"
                                   style="width: calc(100% - 90px)"
                                   class="fl zyAddInput">
                            <select v-show="!newProjectShow" @change="xmmxChange($event)" name="" id=""
                                    style="width: calc(100% - 90px)"
                                    class="fl zyAddInput">
                                <option v-for="(item,index) in xmList" :value="index">{{item.xmmc}}</option>
                            </select>
                            <#--                                    <button type="button" v-show="newProjectShow" class="fr layui-btn layui-btn-sm"-->
                            <#--                                            @click="newProjectActionBack()"-->
                            <#--                                            style="margin: 0 6px;">返回-->
                            <#--                                    </button>-->
                        </div>
                        <#--                                <div class="overflow">-->
                        <#--                                    <div class="fl zyAddLabel">建设单位</div>-->
                        <#--                                    <input type="text" v-model="xmxx.jsdw" class="fl zyAddInput">-->
                        <#--                                </div>-->
                    </div>

                    <div class="overflow xzTitle">
                        <div class="fl blue_block" style="background: #cbd7ff;"></div>
                        <div class="fl" style="color: #5c5c5c">议题</div>
                        <#--                                <div class="fr proAddAction layui-icon layui-icon-add-1" @click="addScheme()"-->
                        <#--                                     title="新增议题"></div>-->
                        <div class="fr proAddAction layui-icon layui-icon-add-1" @click="newProjectAction()"  title="新增议题"></div>
                    </div>


                    <#--<div class="addedOverflow" style="height: calc(100% - 42px);overflow: auto">-->
                    <div class="addedOverflow" style="height: calc(100% - 130px);overflow: auto">
                        <#--                                <input type="file" id="coordinatesFile" @change="coordinatesFileChange($event)"-->
                        <#--                                       style="display: none;">-->
                        <div class="projectListSingle" v-for="(item, index) in projectList">
                            <div class="projectTitle overflow">
                                <div class="fl projectTitleText" :title="item.famc"><span style="cursor: pointer;" @click="landDetail(item)">{{item.ytxh}}</span>
                                </div>

                                <div @click="projectDetail(item)"
                                     class="fr deleteProjectClass layui-icon layui-icon-edit"
                                     title="编辑"></div>
                                <div @click="deleteProject(item)"
                                     class="fr deleteProjectClass layui-icon layui-icon-delete"
                                     title="删除"></div>
                                <div class="fr layui-icon layui-icon-location" title="定位议题"
                                     @click="fixedFa(item)"
                                     style="margin-right: 6px;cursor:pointer"></div>
                                <#--<div class="fr" style="font-size: 12px; padding: 0 3px;color: #a5a5a5">{{item.mj | integerFun}}亩</div>-->
                            </div>
                            <div style="padding: 6px 0px 6px 0px;box-sizing: border-box">
                                <div class="overflow">
                                    <div class="overflow fl proSingleItem">
                                        <table>

                                            <tr>
                                                <td>项目名称:</td>
                                                <td :title="item.famc">{{item.famc && item.famc.length> 10 ? item.famc.substring(0,10) + "..." : item.famc}}</td>
<#--                                                <td>{{item.famc}}</td>-->
                                            </tr>
                                            <tr>
                                                <td>坐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;落:</td>

                                                <td :title="item.zl">{{item.zl && item.zl.length> 10 ? item.zl.substring(0,10) + "...": item.zl}}</td>

<#--                                                <td>{{item.zl}}</td>-->
                                            </tr>
                                            <#--                                                    <tr>-->
                                            <#--                                                        <td>建设单位:</td>-->
                                            <#--                                                        <td>{{item.xmxx}}</td>-->
                                            <#--                                                    </tr>-->
                                            <#--                                                    <tr>-->
                                            <#--                                                        <td>项目面积:</td>-->
                                            <#--                                                        <td>{{item.mj | integerFun}}亩</td>-->
                                            <#--                                                    </tr>-->
                                        </table>
                                    </div>
                                    <div>
                                        <table class="fl actionBtn">
                                            <tr>
                                                <td @click="exportRange(item)">
                                                    <div>导出</div>
                                                </td>

                                                <td @click="landDetail(item)">

                                                    <div>详情</div>
                                                </td>

<#--                                                <td @click="peripheryLandPrice(item)">-->
<#--                                                    <div>-->
<#--                                                        <span v-show="!item.analysisResloading">分析 </span>-->
<#--                                                        <span v-show="item.analysisResloading"-->
<#--                                                              class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></span>-->
<#--                                                    </div>-->
<#--                                                </td>-->

                                            </tr>
                                            <tr>

                                                <#--<td @click="editProject(item)">-->
                                                <#--<div>编辑</div>-->
                                                <#--</td>-->
<#--                                                <td @click="importRange(item)">-->
<#--                                                    <div>导入</div>-->
<#--                                                </td>-->
<#--                                                <td @click="editProject(item)">-->
<#--                                                    <div>编辑</div>-->
<#--                                                </td>-->
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="overflow" v-show="item.analysisResData" style="color: #909090">
                                    <div class="fl">分析结果</div>
                                    <div class="fr" style="cursor: pointer" @click="toogleSpread($event)">收起</div>
                                </div>
                                <div>
                                    <div v-for="(land, index) in item.analysisResData">
                                        <div class="overflow">
                                            <div class="fl" style="padding-top: 6px;font-size: 13px;width: 100%"
                                                 v-show="item.analysisResTotal"
                                            >
                                                <div style="color: #5952c3;line-height: 18px;cursor: pointer;"
                                                     @click="selectAnalysisLayer(land,item)"><span
                                                            class="layui-icon layui-icon-triangle-r"></span>{{land.name}}叠加分析
                                                </div>
                                                <#--                                                        <div v-html="land.basicInfoStr">-->
                                                <#--                                                        </div>-->
                                                <table class="basicInfoStr" v-html="land.basicInfoStr">
                                                </table>
                                                <#--<div>-->
                                                <#--<span>压占面积:</span>-->
                                                <#--<span>{{land.totalMpArea | toFixed2}}</span>-->
                                                <#--<span>平方米</span>-->
                                                <#--<span>({{land.totalMpArea / 667 | toFixed2}}亩)</span>-->
                                                <#--</div>-->
                                                <div class="overflow">
                                                    <div class="fl">
                                                        <span>压占地块: </span>
                                                        <span>{{land.landSize | integerFun}}</span>
                                                        <span v-if="land.loadind">块</span>
                                                    </div>
                                                    <div @click="toggleTable(land)"
                                                         :class="'fr layui-icon '+(land.analysisResShow ? 'layui-icon-up' : 'layui-icon-down')"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <table class="analysisResTable" v-show="land.analysisResShow">
                                            <tr>
                                                <td>序号</td>
                                                <#--<td>图层</td>-->
                                                <#--<td>地块数</td>-->
                                                <td>面积(平方米)</td>
                                            </tr>
                                            <tr style="cursor: pointer"
                                                v-for="(landSingle, index1) in land.landList"
                                                @click="selectLand(landSingle,land,item)">
                                                <td>{{index1 + 1}}</td>
                                                <#--<td>{{item1.name}}</td>-->
                                                <#--<td>{{item1.landSize}}</td>-->
                                                <td>{{landSingle.mpArea | toFixed2}}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
