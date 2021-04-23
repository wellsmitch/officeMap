package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 地图基本信息
 *
 * @Author wangxiaofeng
 * @Date 2020/3/30 9:47
 */
@Document(collection = "gis.map.info")
public class MapInfo extends BaseObject {

    /**
     * 坐标系
     */
    @Field
    private String localProjection;

    /**
     * 坐标系中文名称
     */
    @Field
    private String srsCnName;

    /**
     * 地图中心点X
     */
    @Field
    private Double viewCenterX;

    /**
     * 地图中心点Y
     */
    @Field
    private Double viewCenterY;

    /**
     * 最大分辨率
     */
    @Field
    private Double maxResolution;

    /**
     * 初始层级
     */
    @Field
    private Integer initZoom;

    /**
     * 最小层级
     */
    @Field
    private Integer minZoom;

    /**
     * 最大层级
     */
    @Field
    private Integer maxZoom;

    /**
     * 背景图层名称
     */
    @Field
    private String baseLayerName;

    /**
     * 背景图层url
     */
    @Field
    private String baseLayerUrl;

    public String getLocalProjection() {
        return localProjection;
    }

    public void setLocalProjection(String localProjection) {
        this.localProjection = localProjection;
    }

    public String getSrsCnName() {
        return srsCnName;
    }

    public void setSrsCnName(String srsCnName) {
        this.srsCnName = srsCnName;
    }

    public Double getViewCenterX() {
        return viewCenterX;
    }

    public void setViewCenterX(Double viewCenterX) {
        this.viewCenterX = viewCenterX;
    }

    public Double getViewCenterY() {
        return viewCenterY;
    }

    public void setViewCenterY(Double viewCenterY) {
        this.viewCenterY = viewCenterY;
    }

    public Double getMaxResolution() {
        return maxResolution;
    }

    public void setMaxResolution(Double maxResolution) {
        this.maxResolution = maxResolution;
    }

    public Integer getInitZoom() {
        return initZoom;
    }

    public void setInitZoom(Integer initZoom) {
        this.initZoom = initZoom;
    }

    public Integer getMinZoom() {
        return minZoom;
    }

    public void setMinZoom(Integer minZoom) {
        this.minZoom = minZoom;
    }

    public Integer getMaxZoom() {
        return maxZoom;
    }

    public void setMaxZoom(Integer maxZoom) {
        this.maxZoom = maxZoom;
    }

    public String getBaseLayerName() {
        return baseLayerName;
    }

    public void setBaseLayerName(String baseLayerName) {
        this.baseLayerName = baseLayerName;
    }

    public String getBaseLayerUrl() {
        return baseLayerUrl;
    }

    public void setBaseLayerUrl(String baseLayerUrl) {
        this.baseLayerUrl = baseLayerUrl;
    }
}
