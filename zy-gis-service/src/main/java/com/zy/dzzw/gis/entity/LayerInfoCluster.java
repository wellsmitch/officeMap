package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Field;

public class LayerInfoCluster extends LayerInfo {

    /**
     * 聚类距离
     */
    @Field
    private Integer distance;

    /**
     * 分组排序字段
     */
    @Field
    private String sortField;

    /**
     * 分组排序类型：sum/count/avg
     */
    @Field
    private String sortType;


    /**
     * 显示字段后缀
     */
    @Field
    private String sortFieldSuffix;

    /**
     * 字体颜色
     */
    @Field
    private String fontColor;

    /**
     * 字体类型
     */
    @Field
    private String fontType;

    /**
     * 字体边线颜色
     */
    @Field
    private String fontStrokeColor;

    /**
     * 字体边线宽度
     */
    @Field
    private Double fontStrokeWidth;

    public Integer getDistance() {
        return distance;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getSortType() {
        return sortType;
    }

    public void setSortType(String sortType) {
        this.sortType = sortType;
    }

    public String getSortFieldSuffix() {
        return sortFieldSuffix;
    }

    public void setSortFieldSuffix(String sortFieldSuffix) {
        this.sortFieldSuffix = sortFieldSuffix;
    }

    public String getFontColor() {
        return fontColor;
    }

    public void setFontColor(String fontColor) {
        this.fontColor = fontColor;
    }

    public String getFontType() {
        return fontType;
    }

    public void setFontType(String fontType) {
        this.fontType = fontType;
    }

    public String getFontStrokeColor() {
        return fontStrokeColor;
    }

    public void setFontStrokeColor(String fontStrokeColor) {
        this.fontStrokeColor = fontStrokeColor;
    }

    public Double getFontStrokeWidth() {
        return fontStrokeWidth;
    }

    public void setFontStrokeWidth(Double fontStrokeWidth) {
        this.fontStrokeWidth = fontStrokeWidth;
    }
}
