<#assign basePath=request.contextPath />
<!DOCTYPE html>
<html>
<head>
    <title>辅助选址</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- No Baidu Siteapp-->
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Set render engine for 360 browser -->
    <meta name="renderer" content="webkit">
    <#include "/css.ftl"/>

    <link rel="stylesheet" type="text/css" href="${basePath}/static/css/gis/manager/gis.css">
    <#include "/js.ftl"/>
    <link rel="stylesheet" href="${basePath}/static/css/gis/xmxzgis/index.css">
</head>
<body class="hbody" style="margin: 0">
<div class="layout-main auto" v-cloak style="padding: 0" id="xmxzGis">
    <div id="xmxxEditDv" style="display: none;">
        <table class="faxxTable">
            <tr>
                <td class="faxxLabel">
                    方案名称
                </td>
                <td>
                    <input class="faxxInput" type="text" placeholder="请输入方案名称" v-model="faxx.famc"/>
                </td>
            </tr>
            <tr>
                <td class="faxxLabel">坐落</td>
                <td>
                    <input class="faxxInput" type="text" placeholder="请输入坐落信息" v-model="faxx.zl"/>
                </td>
            </tr>
        </table>
    </div>
    <div class='gis_lanchCodeMap auto overflow' style="width: 100%;height: 100%">
        <div id="leftMapOutDiv" class='left_wraper' style="border: 1px solid #000;">
            <div class="endEditBtn" v-show="modifyFeatureEndObj" @click="modifyFeatureEnd()">保存编辑</div>
            <div class="endEditBtn" style="right: 100px;" v-show="modifyFeatureEndObj" @click="modifyFeatureCancel()">
                取消编辑
            </div>
            <#--<div style="width: 30px;position: absolute;top: 0;right: -10;bottom:0;z-index: 10;/*background: #eee*/"></div>-->
            <#--<div-->
            <#--style="height: 30px;position: absolute;left: 0;right: 0;bottom:0;z-index: 10;/*background: #eee*/"></div>-->
            <div style="height: 100%">
                <iframe id="xmxzGisIframe" width="100%" height="100%" :src="'${basePath}/gis/map/index/fzxz'"
                        frameborder="0"></iframe>
            </div>
        </div>
        <div id="rightDiv" class="customTabCls">
            <div class="msgCon" style="height:100%">
                <div v-show="isAdd" style="height:100%">
                    <div class="overflow itemXzTitle" style="line-height: 45px;border-bottom: 1px solid  #e6e6e6">
                        <p class="fl blue_block"></p>
                        <p class="fl">新增关联业务地块:</p>
                    </div>
                </div>

                <#--列表-->
                <div v-show="!isAdd" style="height:100%">
                    <div class="overflow itemXzTitle" style="/*line-height: 45px;border-bottom: 1px solid  #e6e6e6*/">
                        <p class="fl blue_block"></p>
                        <#--已选关联-->
                        <p class="fl">选址项目</p>
                        <div @click="projectDetail(xmxx)" class="fr xmxzAction xmxzLocation  layui-icon layui-icon-form"
                             title="项目详情"></div>
                        <div @click="newProjectAction()" class="fr xmxzAction xmxzAdd  layui-icon layui-icon-add-1"
                             title="新增项目"></div>
                        <div @click="projectdelte()" class="fr xmxzAction xmxzDelete  layui-icon layui-icon-delete"
                             title="删除项目"></div>
                        <div @click="projectSite()" class="fr xmxzAction xmxzLocation  layui-icon layui-icon-location"
                             title="定位项目"></div>
                    </div>
                    <div class="addedProject">
                        <div style="height: 100%">
                            <div class="zyAddItem" style="padding: 12x">
                                <div class="overflow">
                                    <div class="fl zyAddLabel">项目名称</div>
                                    <input v-show="newProjectShow" type="text" v-model="xmxx.xmmcInput"
                                           style="width: calc(100% - 90px)"
                                           class="fl zyAddInput">
                                    <select v-show="!newProjectShow" @change="xmmxChange($event)" name="" id=""
                                            style="width: calc(100% - 90px)"
                                            class="fl zyAddInput">
                                        <option v-for="(item,index) in xmList" :value="index">{{item.xmmc}}</option>
                                    </select>
                                    <button type="button" v-show="newProjectShow" class="fr layui-btn layui-btn-sm"
                                            @click="newProjectActionBack()"
                                            style="margin: 0 6px;">返回
                                    </button>
                                </div>
                                <div class="overflow">
                                    <div class="fl zyAddLabel">建设单位</div>
                                    <input type="text" v-model="xmxx.jsdw" class="fl zyAddInput">
                                </div>
                                <#--                                <div class="overflow">-->
                                <#--                                    <div class="fl zyAddLabel"></div>-->
                                <#--                                    <button type="button" class="layui-btn" @click="projectDetail(xmxx)">项目详情</button>-->
                                <#--                                </div>-->
                                <#--<div class="overflow">-->
                                <#--<div class="fl zyAddLabel">建设性质</div>-->
                                <#--<input type="text" v-model="xmxx.jsxz" class="fl zyAddInput">-->
                                <#--</div>-->
                            </div>
                            <div class="addPanel" v-if="false">
                                <div class="overflow addAction">
                                    <div v-show="newProjectShow" class="fl addSave" @click="addSave()">保存</div>
                                    <div class="fl"></div>
                                </div>
                            </div>
                            <div class="overflow xzTitle">
                                <div class="fl blue_block"></div>
                                <div class="fl">选址方案</div>
                                <div class="fr proAddAction layui-icon layui-icon-add-1" @click="addScheme()"
                                     title="新增方案"></div>
                            </div>
                            <div class="addedOverflow" style="height: calc(100% - 120px);overflow: auto">
                                <input type="file" id="coordinatesFile" @change="coordinatesFileChange($event)"
                                       style="display: none;">
                                <div class="projectListSingle" v-for="(item, index) in projectList">
                                    <div class="projectTitle overflow">
                                        <div class="fl projectTitleText" :title="item.famc">{{index+1}}、<span>{{item.famc}}</span>
                                        </div>

                                        <div @click="deleteProject(item)"
                                             class="fr deleteProjectClass layui-icon layui-icon-delete"
                                             title="删除方案"></div>
                                        <div class="fr layui-icon layui-icon-location" title="定位方案"
                                             @click="fixedFa(item)"
                                             style="margin-right: 6px;cursor:pointer"></div>
                                        <#--<div class="fr" style="font-size: 12px; padding: 0 3px;color: #a5a5a5">{{item.mj | integerFun}}亩</div>-->
                                    </div>
                                    <div style="padding: 6px 0px 6px 22px;box-sizing: border-box">
                                        <div class="overflow">
                                            <div class="overflow fl proSingleItem">
                                                <table>
                                                    <tr>
                                                        <td style="width: 62px">项目名称:</td>
                                                        <td>{{item.xmxx.xmmc}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>建设单位:</td>
                                                        <td>{{item.xmxx.jsdw}}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>项目面积:</td>
                                                        <td>{{item.mj | integerFun}}亩</td>
                                                    </tr>
                                                </table>
                                            </div>

                                            <div>
                                                <table class="fl actionBtn">
                                                    <tr>
                                                        <td @click="exportRange(item)">
                                                            <div>导出</div>
                                                        </td>
                                                        <td @click="analysisProject(item)">
                                                            <div>
                                                                <span v-show="!item.analysisResloading">分析 </span>
                                                                <span v-show="item.analysisResloading"
                                                                      class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></span>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td @click="importRange(item)">
                                                            <div>导入</div>
                                                        </td>
                                                        <td @click="editProject(item)">
                                                            <div>编辑</div>
                                                        </td>
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
                                                                class="layui-icon layui-icon-location"></span>{{land.analysisName||land.name}}叠加分析(平方米/亩)
                                                        </div>
<#--                                                        <div v-html="land.basicInfoStr">-->
<#--                                                        </div>-->
                                                        <#--之前的 start-->
                                                        <#--<table class="basicInfoStr" v-html="land.basicInfoStr">-->
                                                        <#--</table> v-html="createAnalysisResDom(land.basicInfoList)"-->
                                                        <div v-html="createAnalysisResDom(land.basicInfoList)"></div>
                                                        <#--之前的 end-->
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
        <div id="bottomDiv" v-if="false" class="customTabCls">
        </div>
    </div>
</div>
<script type="text/javascript">
    function analysisDiv() {

    }

    /**
     * 拖动
     * @param containterObj
     * @param leftDomObj
     * @param rightDomObj
     * @param bottomDivObj
     * @param GisService
     * @param viewObj 禁止拖动
     * @constructor
     */
    var Drag = function (containterObj, leftDomObj, rightDomObj, bottomDivObj, GisService, viewObj) {

        var handle = document.createElement('div'),
            bottomHandle = document.createElement('div'),

            containter = typeof containterObj === "string" ? containterObj : containterObj.selector,
            containterStyle = typeof containterObj === "object" ? (containterObj.style ? containterObj.style : {}) : {},


            leftDom = typeof leftDomObj === "string" ? leftDomObj : leftDomObj.selector,
            leftDomStyle = (typeof leftDomObj === "object") ? (leftDomObj.style ? leftDomObj.style : {}) : {},

            rightDom = typeof rightDomObj === "string" ? rightDomObj : rightDomObj.selector,
            rightDomStyle = typeof rightDomObj === "object" ? (rightDomObj.style ? rightDomObj.style : {}) : {},
            rightDomShow = typeof rightDomObj === "object" ? (rightDomObj.show != undefined ? rightDomObj.show : true) : true,

            bottomDiv = typeof bottomDivObj === "string" ? bottomDivObj : bottomDivObj.selector,
            bottomDivStyle = typeof bottomDivObj === "object" ? (bottomDivObj.style ? bottomDivObj.style : {}) : {},
            bottomDivShow = typeof bottomDivObj === "object" ? (bottomDivObj.show != undefined ? bottomDivObj.show : true) : true;

        // 是否允许拖动
        var accept = true;
        if (viewObj && (viewObj.acceptDrag != undefined)) {
            accept = viewObj.acceptDrag
        }
        if (!($('#handle').length !== 0 && $('#bottomHandle') !== 0)) {
            handle.setAttribute('id', 'handle');
            bottomHandle.setAttribute('id', 'bottomHandle');
            $(rightDom).append(handle);
            $(bottomDiv).append(bottomHandle);
        }


        $(handle).css({
            position: 'absolute',
            left: '-4px',
            left: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            cursor: 'w-resize',
            'zIndex': 99999
        });
        $(bottomHandle).css({
            position: 'absolute',
            left: 0,
            top: '-4px',
            top: 0,
            right: 0,
            height: '8px',
            cursor: 'n-resize',
            'zIndex': 99999
        });
        /*样式初始化  start*/
        $(containter).css({
            position: 'relative'
        }).css(containterStyle);
        $(leftDom).css({
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: $('#bottomDiv').length > 0 ? (bottomDivShow ? 200 : 0) : 0,
            right: rightDomShow && rightDomObj.width ? rightDomObj.width : rightDomShow ? 320 : 0   //
            // background: '#fff5a1'
        })
            .css(leftDomStyle)
            .css($('#bottomDiv').length > 0 ? leftDomStyle : {bottom: 0})

        /**
         *  浏览器视窗变化处理
         */
        function rightBottomByWindowResize() {
            if (GisService) {
                GisService.getMap().updateSize();
            }

            // return
            $(rightDom).css({
                position: 'absolute',
                right: 0,
                top: 0,
                left: $(leftDom).width(),
                bottom: 0,
                width: rightDomShow ? "auto" : '0px',
                display: rightDomShow ? 'block' : 'none'
                // background: '#85fff3'
            }).css(rightDomStyle);
            if ($(bottomDiv).length !== 0) {
                $(bottomDiv).css({
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    top: $(leftDom).height(),
                    height: bottomDivShow ? "auto" : '0px',
                    display: bottomDivShow ? 'block' : 'none'
                    // background: '#ad72ff'
                }).css(bottomDivStyle);
            }
        }

        rightBottomByWindowResize();

        /*样式初始化  end*/
        var isResizing = false,//横向控制
            isResizing1 = false,//纵向控制
            lastDownX = 0,
            lastDownY = 0,
            $containter = $(containter),
            $leftDiv = $(leftDom),
            $rightDiv = $(rightDom),
            $bottomDiv = $(bottomDiv);
        $bottomDiv.css({
            top: $leftDiv.height(),
            right: $rightDiv.width()
        });

        $('#handle').on('mousedown', function (e) {
            isResizing = true;
            isResizing1 = false;
            lastDownX = e.clientX;
            analysisDiv();

            mouseMove()

        });

        function mouseMove() {
            $(document).on('mousemove', function (e) {
                if (!accept) {
                    return
                }
                if (!isResizing1 && isResizing) {
                    var offsetRight = $containter.width() - (e.clientX - $containter.offset().left);
                    offsetRight = (offsetRight < 100) ? 100 : offsetRight;
                    $leftDiv.css({
                        'right': rightDomShow ? offsetRight : 0,
                        width: "auto"
                    });
                    $rightDiv.css({
                        'left': $(containter).width() - Number($leftDiv.css("right").replace(/px/ig, '')),
                        display: rightDomShow ? 'block' : 'none' //bottomDivShow
                    });
                    $bottomDiv.css({
                        top: $leftDiv.height(),
                        right: rightDomShow ? $rightDiv.width() : '0',
                        // height: bottomDivShow ? 'auto' : '0',
                        display: bottomDivShow ? 'block' : 'none'
                    });


                } else if (!isResizing && isResizing1) {
                    var offsetBottom = $containter.height() - (e.clientY - $containter.offset().top);
                    offsetBottom = (offsetBottom < 100) ? 100 : offsetBottom;
                    $leftDiv.css({
                        'bottom': bottomDivShow ? offsetBottom : 0
                    });
                    $bottomDiv.css({
                        // height: bottomDivShow ? 'auto' : 0,
                        display: bottomDivShow ? 'block' : 'none',
                        top: $leftDiv.height(),
                        right: $rightDiv.width()
                    });
                }
                if (GisService) {
                    GisService.getMap().updateSize();
                }
                $(document).on('mouseup', function () {
                    isResizing = false;
                    isResizing1 = false;
                    analysisDiv();
                });
                e.preventDefault();

            })
        }

        if (GisService) {
            //dom 生成后调用防止地图变形
            GisService.getMap().updateSize();
        }

        window.onresize = function () {
            $(rightDom).css({
                position: 'absolute',
                right: 0,
                top: 0,
                left: $(leftDom).width(),
                bottom: 0,
                // background: '#85fff3'
            }).css(rightDomStyle);
            $(bottomDiv).css({
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: $(leftDom).height(),
                // background: '#ad72ff'
            }).css(bottomDivStyle);
            analysisDiv();
        };


        // 上下
        $('#bottomHandle').on('mousedown', function (e) {
            isResizing1 = true;
            isResizing = false;
            lastDownY = e.clientY;
            analysisDiv();
            mouseMove()
        });
    };

</script>
<script type="text/javascript" src="${basePath}/static/lib/jquery.nicescroll.js"></script>
<script src="${basePath}/static/js/xmxz/xmfa/xmxz.xmfa.js"></script>
<script src="${basePath}/static/js/xmxz/xmxx/xmxz.xmxx.js"></script>
<script src="${basePath}/static/js/gis/xmxzgis/indexT.js"></script>
</body>
</html>
