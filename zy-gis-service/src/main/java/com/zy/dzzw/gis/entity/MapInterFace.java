package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 接口信息
 *
 * @Author wangxiaofeng
 * @Date 2020/3/30 9:44
 */
@Document(collection = "gis.map.interface")
public class MapInterFace extends BaseObject {

    /**
     * 服务器IP（逐渐废弃）
     */
    @Field
    private String serverIp;

    /**
     * 服务器端口号（逐渐废弃）
     */
    @Field
    private String serverPort;

    /**
     * 删除图元接口地址
     */
    @Field
    private String removeUrl;

    /**
     * 添加图元接口地址
     */
    @Field
    private String addUrl;

    /**
     * 叠加分析接口地址
     */
    @Field
    private String analysisRequestUrl;

    /**
     * 面积接口地址
     */
    @Field
    private String areaRequestUrl;

    public String getServerIp() {
        return serverIp;
    }

    public void setServerIp(String serverIp) {
        this.serverIp = serverIp;
    }

    public String getServerPort() {
        return serverPort;
    }

    public void setServerPort(String serverPort) {
        this.serverPort = serverPort;
    }

    public String getRemoveUrl() {
        return removeUrl;
    }

    public void setRemoveUrl(String removeUrl) {
        this.removeUrl = removeUrl;
    }

    public String getAddUrl() {
        return addUrl;
    }

    public void setAddUrl(String addUrl) {
        this.addUrl = addUrl;
    }

    public String getAnalysisRequestUrl() {
        return analysisRequestUrl;
    }

    public void setAnalysisRequestUrl(String analysisRequestUrl) {
        this.analysisRequestUrl = analysisRequestUrl;
    }

    public String getAreaRequestUrl() {
        return areaRequestUrl;
    }

    public void setAreaRequestUrl(String areaRequestUrl) {
        this.areaRequestUrl = areaRequestUrl;
    }
}
