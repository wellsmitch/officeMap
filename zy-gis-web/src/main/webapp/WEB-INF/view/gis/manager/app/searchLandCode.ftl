<style>
    .searchWrap {
        position: absolute;
        top: 1%;
        left: 50%;
        z-index: 2;
        width: 68%;
        border: 1px solid #e2dddd;
        border-radius: 4px;
        line-height: 36px;
        font-size: 16px;
        background: #fff;
        transform: translateX(-50%);
        box-shadow: 0 0 20px -10px #000;
    }

    .SearchAndHistoryDiv {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 500;
        background: #ffffff;
        /*下面两行为了覆盖searchWrap的样式*/
        width: 100%;
        transform: translateX(0);
    }

    .SearchAndHistoryDiv_title input {
        margin: 0;
        padding: 0;
        height: 36px;
        border: none;
        outline: none;
        width: 150px;
        font-size: 16px;
        line-height: 30px;
    }

    .SearchAndHistoryDiv_title {
        overflow: hidden;
        border: 1px solid #d3d3d3;
        margin: 3px;
        box-shadow: 0 0 10px 0 #e8e7e7;
    }

    .SearchAndHistoryDiv_content {
        max-height: calc(100% - 80px);
        overflow: auto;
        margin: 0 3px;
        border: 1px solid #e0e0e0;
        box-shadow: 0 0 10px 0 #e0e0e0;
    }
</style>

<div id="searchAndHistory"  class="searchWrap SearchAndHistoryDiv" style="display: none;">
    <div class="SearchAndHistoryDiv_title">
        <div class="layui-icon layui-icon-left fl" style="font-size: 20px;width: 30px;text-align: center"
             @click="searchClose()"></div>
        <input class="fl" style="width: calc(100% - 76px);margin-bottom:0;"
               v-model="searchKey" <#--@input="toSearchlandMapping()"--> type="text" placeholder="请输入搜索信息">
        <div @click="toSearchlandMapping()" class="fl"
             style="font-size: 16px;  text-align: center; line-height: 18px; border-left: 1px solid #eee; margin-top: 10px; padding-left: 4px; box-sizing: border-box;color: #737373">
            搜索
        </div>
    </div>
    <div v-if="poiList.length>0" class="SearchAndHistoryDiv_content">
        <ul>
            <li v-for="(item,index) in poiList" @click="poiPosition(item)" class="mui-table-view-cell">
                <div v-if="item['名称']" style="font-weight: bold;">名称：{{item["名称"]}}</div>
                <div v-if="item['地址']">地址：{{item["地址"]}}</div>
                <div v-if="item.PRONAME" style="font-weight: bold;">项目名称：{{item.PRONAME}}</div>
                <div v-if="item.BUSINAME">业务类型：{{item.BUSINAME}}</div>
                <#--<span>{{item["类别"]}}</span>-->
            </li>
        </ul>
    </div>
    <div v-else class="SearchAndHistoryDiv_content" v-show="storeLandcodes.length != 0">
        <div style="text-indent: 8px;border-bottom: 1px solid #d2d2d2;">历史搜索</div>
        <div style="margin: 0 auto;border-bottom: 1px solid #eee;font-size: 14px" class="overflow"
             v-for="(landcode,index) in storeLandcodes" :key="index" @click="clickHisLandcode(landcode)">
            <div class="fl iconfont icon-chazhao" style="width: 30px;text-align: center"></div>
            <div class="fl"
                 style="width: calc(100% - 60px);overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                {{landcode}}
            </div>
            <div class="fr iconfont icon-iconfontshanchu" style="width: 30px;text-align: center"
                 @click.stop="delStoreLandcode(landcode)"></div>
        </div>
        <div v-show="storeLandcodes.length>0"
             style="text-align: center; font-size: 14px; letter-spacing: 2px; background: #f1f1f1; color: #333;"
             @click="delAllStoreLandcode()">清空历史记录
        </div>
    </div>


</div>