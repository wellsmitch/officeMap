<style type="text/css">
    .officeBlueBlock {
        position: relative;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        background: #499dff;
        text-align: center;
        line-height: 36px;
        color: #fff;
    }

    .officeDoneStatus {
        position: absolute;
        right: -6px;
        bottom: -6px;
        border-radius: 50%;
        background: #ffffff;
        width: 16px;
        height: 16px;
    }

    .officeDoneStatus > div {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        margin: auto;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        line-height: 14px;
        color: #ffffff;
        text-align: center
    }

    .officeDoneStatus .icon-jianhao {
        background: #abb633;
    }

    .officeDoneStatus .icon-duihao {
        background: #3ab97f;
    }

    .officeTitle {
        font-size: 16px;
        line-height: 42px;
        padding-left: 12px;
        font-weight: bold;
    }

    .officeTime {
        font-size: 14px;
        line-height: 42px;
        color: #333333;
    }

    .officeInfoCollapse {
        line-height: 42px;
        margin-left: 10px;
    }

    .officeContent {
        border-left: 2px solid #e6e0e7;
        margin: 0 0 6px 18px;
        padding-left: 10px;
    }

    .officeContent:nth-last-child(1) {
        /*border-left-color: transparent;*/
    }

    .ywInfoList {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: 200;
        display: none;
    }

    .detailTitle {
        line-height: 36px;
        background: #f2f2f2;
        color: #333;
        text-indent: 10px;
    }
    .zwsj{
        font-size:14px;
    }

</style>

<div id="ywInfoList" class="ywInfoList">
    <header id="header" class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="ywInfoClose"></a>
        <h1 class="mui-title">详情信息</h1>
    </header>
    <div class="mui-content ywInfoCon" style="overflow: auto;height:100%;">
        <div class="landInfo">
            <div class="detailTitle">土地信息</div>
            <div style="padding: 0 10px">
                <table style="width: 100%;border: none">
                    <tr v-for="(value,key) of content.filedMap" :key="key" style="line-height: 24px;">
                        <td>{{key}}</td>
                        <td>{{!!value ? value : ""}}</td>
                    </tr>
                </table>
            </div>

        </div>
        <div class="landInfo">
            <div class="detailTitle">土地生命周期信息</div>
            <div v-if="officeInfoDiv && content.landCode" style="padding: 10px 10px 0 10px;">
                <#--预审-->
                <div class="" v-if="Object.keys(ysInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(ysInfo)">
                        <div class="officeBlueBlock fl">
                            <span>规</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(ysInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">规划选址和预审</div>
                        <div
                             :class="(ysInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!ysInfo.endTime? ysInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!ysInfo.show">
                        <table>
                            <tr>
                                <td>项目名称</td>
                                <td>{{!!ysInfo.projectName ? ysInfo.projectName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>项目代码</td>
                                <td>{{!!ysInfo.projectCode ? ysInfo.projectCode : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>用地总规模</td>
                                <td>{{!!ysInfo.areaTotal ? ysInfo.areaTotal : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>建设单位</td>
                                <td>{{!!ysInfo.constructionUnit ? ysInfo.constructionUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>统一社会信<br/>用代码</td>
                                <td>{{!!ysInfo.certNo ? ysInfo.certNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>证书号</td>
                                <td>{{!!ysInfo.ghyxzyjszh ? ysInfo.ghyxzyjszh : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!ysInfo.areaName ? ysInfo.areaName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!ysInfo.createUser ? ysInfo.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--报批-->
                <div class="" v-if="Object.keys(bpInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(bpInfo)">
                        <div class="officeBlueBlock fl">
                            <span>用</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(bpInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">用地报批</div>
                        <div
                             :class="(bpInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!bpInfo.endTime? bpInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!bpInfo.show">
                        <table>
                            <tr>
                                <td>报批名称</td>
                                <td>{{!!bpInfo.approvalName ? bpInfo.approvalName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>报批面积<br/>(公顷)</td>
                                <td>{{!!bpInfo.approvalArea ? bpInfo.approvalArea : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>农转用批<br/>复文号</td>
                                <td>{{!!bpInfo.agriculturalReplyNo ? bpInfo.agriculturalReplyNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>批复日期</td>
                                <td>{{!!bpInfo.agriculturalReplyDate ? bpInfo.agriculturalReplyDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>用地批复文号</td>
                                <td>{{!!bpInfo.replyNo ? bpInfo.replyNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>批复日期</td>
                                <td>{{!!bpInfo.replyDate ? bpInfo.replyDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!bpInfo.licenseIssueUnit ? bpInfo.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!bpInfo.createUser ? bpInfo.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--储备-->
                <div class="" v-if="Object.keys(cbInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(cbInfo)">
                        <div class="officeBlueBlock fl">
                            <span>土</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(cbInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">土地储备</div>
                        <div
                             :class="(cbInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!cbInfo.endTime? cbInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!cbInfo.show">
                        <table>
                            <tr>
                                <td>审核审批<br/>表编号</td>
                                <td>{{!!cbInfo.checkNo ? cbInfo.checkNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>批准日期</td>
                                <td>{{!!cbInfo.replyDate ? cbInfo.replyDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>征收/收购总<br/>面积(公顷)</td>
                                <td>{{!!cbInfo.totalArea ? cbInfo.totalArea : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>征收/收购<br/>总费用</td>
                                <td>{{!!cbInfo.totalCost ? cbInfo.totalCost : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>征转用批<br/>复文号</td>
                                <td>{{!!cbInfo.replyNo ? cbInfo.replyNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>批复日期</td>
                                <td>{{!!cbInfo.checkReplyDate ? cbInfo.checkReplyDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!cbInfo.licenseIssueUnit ? cbInfo.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!cbInfo.createUser ? cbInfo.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--规划条件-->
                <div class=""  v-if="Object.keys(ghtjInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(ghtjInfo)">
                        <div class="officeBlueBlock fl">
                            <span>规</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(ghtjInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">规划条件</div>
                        <div
                             :class="(ghtjInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!ghtjInfo.endTime? ghtjInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!ghtjInfo.show">
                        <table>
                            <tr>
                                <td>申请人</td>
                                <td>{{!!ghtjInfo.certPerson ? ghtjInfo.certPerson : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>证书号</td>
                                <td>{{!!ghtjInfo.certNo ? ghtjInfo.certNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>发证日期</td>
                                <td>{{!!ghtjInfo.certCreateDate ? ghtjInfo.certCreateDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!ghtjInfo.licenseIssueUnit ? ghtjInfo.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!ghtjInfo.createUser ? ghtjInfo.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--供应-->
                <div class="" v-if="Object.keys(gyInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(gyInfo)">
                        <div class="officeBlueBlock fl">
                            <span>土</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(gyInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">土地供应</div>
                        <div
                             :class="(gyInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!gyInfo.endTime? gyInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!gyInfo.show">
                        <table>
                            <tr>
                                <td>合同/划拨决<br/>定书编号</td>
                                <td>{{!!gyInfo.contractNo ? gyInfo.contractNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>电子监管号</td>
                                <td>{{!!gyInfo.superviseNo ? gyInfo.superviseNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>受让人</td>
                                <td>{{!!gyInfo.partiesName ? gyInfo.partiesName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>出让金额</td>
                                <td>{{!!gyInfo.transderPrice ? gyInfo.transderPrice+"万元" : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>签订日期</td>
                                <td>{{!!gyInfo.contractSignDate ? gyInfo.contractSignDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>供应方案编号</td>
                                <td>{{!!gyInfo.planNo ? gyInfo.planNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>批复日期</td>
                                <td>{{!!gyInfo.planReplyDate ? gyInfo.planReplyDate : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--用地规划许可-->
                <div class="" v-if="Object.keys(ydghxkInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(ydghxkInfo)">
                        <div class="officeBlueBlock fl">
                            <span>用</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(ydghxkInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">用地规划许可</div>
                        <div
                             :class="(ydghxkInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!ydghxkInfo.endTime? ydghxkInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!ydghxkInfo.show">
                        <table>
                            <tr>
                                <td>项目名称</td>
                                <td>{{!!ydghxkInfo.projectName ? ydghxkInfo.projectName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>项目代码</td>
                                <td>{{!!ydghxkInfo.projectCode ? ydghxkInfo.projectCode : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>建设单位</td>
                                <td>{{!!ydghxkInfo.constructionUnit ? ydghxkInfo.constructionUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>统一社会信<br/>用代码</td>
                                <td>{{!!ydghxkInfo.projectCertNo ? ydghxkInfo.projectCertNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>证书号</td>
                                <td>{{!!ydghxkInfo.certNo ? ydghxkInfo.certNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!ydghxkInfo.licenseIssueUnit ? ydghxkInfo.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!ydghxkInfo.createUser ? ydghxkInfo.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--不动产登记-->
                <div class=""  v-if="Object.keys(bdcdeInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(bdcdeInfo)">
                        <div class="officeBlueBlock fl">
                            <span>不</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(bdcdeInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">不动产登记</div>
                        <div
                             :class="(bdcdjInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!bdcdjInfo["登记时间"]? bdcdjInfo["登记时间"]: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!bdcdeInfo.show">
                        <table>
                            <tr>
                                <td>宗地代码</td>
                                <td>{{!!bdcdjInfo["宗地代码"] ? bdcdjInfo["宗地代码"] : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>不动产权证号</td>
                                <td>{{!!bdcdjInfo["不动产权证号"] ? bdcdjInfo["不动产权证号"] : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>登簿人</td>
                                <td>{{!!bdcdjInfo["登簿人"] ? bdcdjInfo["登簿人"] : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>登簿时间</td>
                                <td>{{!!bdcdjInfo["登记时间"] ? bdcdjInfo["登记时间"] : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--工程规划许可list-->
                <div class="" v-if="Object.keys(gcghxkInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(gcghxkInfo)">
                        <div class="officeBlueBlock fl">
                            <span>工</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(gcghxkInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">工程规划许可</div>
                        <div
                             :class="(gcghxkInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!gcghxkInfo.endTime? gcghxkInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!gcghxkInfo.show">
                        <table>
                            <tr>
                                <td>项目名称</td>
                                <td>{{!!gcghxkInfo.projectName ? gcghxkInfo.projectName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>项目代码</td>
                                <td>{{!!gcghxkInfo.projectCode ? gcghxkInfo.projectCode : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>建设单位</td>
                                <td>{{!!gcghxkInfo.constructionUnit ? gcghxkInfo.constructionUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>统一社会信<br/>用代码</td>
                                <td>{{!!gcghxkInfo.projectCertNo ? gcghxkInfo.projectCertNo : "暂无数据"}}</td>
                            </tr>
                        </table>

                        <table style="margin-top:10px;" v-if="gcghxkList.length>0"
                               v-for="(gcghxkItem,i) in gcghxkList" :key="i">
                            <tr>
                                <td>证书号</td>
                                <td>{{!!gcghxkItem.certNo ? gcghxkItem.certNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>出证日期</td>
                                <td>{{!!gcghxkItem.certCreateDate ? gcghxkItem.certCreateDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!gcghxkItem.licenseIssueUnit ? gcghxkItem.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!gcghxkItem.createUser ? gcghxkItem.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <#--规划核实list-->
                <div class="" v-if="Object.keys(ghhsInfo).length>2">
                    <div class="overflow" style="height: 42px" @click="officeInfoCollapseAction(ghhsInfo)">
                        <div class="officeBlueBlock fl">
                            <span>规</span>
                            <#--<div class="officeDoneStatus">-->
                            <#--<div :class="(ghhsInfo.status ? 'iconfont icon-jianhao' : 'iconfont icon-duihao')"></div>-->
                            <#--</div>-->
                        </div>
                        <div class="fl officeTitle">规划核实</div>
                        <div
                             :class="(ghhsInfo.show ? 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-' : 'fr officeInfoCollapse iconfont icon-tubiaozhizuo-1')"
                        ></div>
                        <div class="fr officeTime">{{!!ghhsInfo.endTime? ghhsInfo.endTime: ""}}</div>
                    </div>
                    <div class="officeContent" v-show="!ghhsInfo.show">
                        <table>
                            <tr>
                                <td>项目名称</td>
                                <td>{{!!ghhsInfo.projectName ? ghhsInfo.projectName : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>项目代码</td>
                                <td>{{!!ghhsInfo.projectCode ? ghhsInfo.projectCode : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>建设单位</td>
                                <td>{{!!ghhsInfo.constructionUnit ? ghhsInfo.constructionUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>统一社会信<br/>用代码</td>
                                <td>{{!!ghhsInfo.projectCertNo ? ghhsInfo.projectCertNo : "暂无数据"}}</td>
                            </tr>
                        </table>

                        <table style="margin-top:10px;" v-if="ghhsList.length>0" v-for="(ghhsItem,j) in ghhsList"
                               :key="j">
                            <tr>
                                <td>证书号</td>
                                <td>{{!!ghhsItem.certNo ? ghhsItem.certNo : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>出证日期</td>
                                <td>{{!!ghhsItem.certCreateDate ? ghhsItem.certCreateDate : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办单位</td>
                                <td>{{!!ghhsItem.licenseIssueUnit ? ghhsItem.licenseIssueUnit : "暂无数据"}}</td>
                            </tr>
                            <tr>
                                <td>经办人</td>
                                <td>{{!!ghhsItem.createUser ? ghhsItem.createUser : "暂无数据"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-else style="text-align: center;color:#5c5c5c;font-weight: bold;line-height: 40px;font-size: 16px;">
                <span class="zwsj">暂无土地生命周期信息</span>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${basePath}/static/js/gis/manager/app/ywInfo.js"></script>