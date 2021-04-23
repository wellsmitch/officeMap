package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 三维图层信息
 */
public class LayerInfoThreeDimension extends LayerInfo {

    /**
     * 三维加载方式
     */
    @Field
    private String threeDimensionLoadType;

    /**
     * 三维图层唯一编码
     */
    @Field
    private String layerCode;

    /**
     * 三维加载url
     */
    @Field
    private String threeDimensionLoadUrl;

    /**
     * 三维手机端url
     */
    @Field
    private String threeDimensionAppLoadUrl;

    public String getThreeDimensionLoadType() {
        return threeDimensionLoadType;
    }

    public void setThreeDimensionLoadType(String threeDimensionLoadType) {
        this.threeDimensionLoadType = threeDimensionLoadType;
    }

    public String getThreeDimensionLoadUrl() {
        return threeDimensionLoadUrl;
    }

    public void setThreeDimensionLoadUrl(String threeDimensionLoadUrl) {
        this.threeDimensionLoadUrl = threeDimensionLoadUrl;
    }

    public String getThreeDimensionAppLoadUrl() {
        return threeDimensionAppLoadUrl;
    }

    public void setThreeDimensionAppLoadUrl(String threeDimensionAppLoadUrl) {
        this.threeDimensionAppLoadUrl = threeDimensionAppLoadUrl;
    }

    public String getLayerCode() {
        return layerCode;
    }

    public void setLayerCode(String layerCode) {
        this.layerCode = layerCode;
    }
}
