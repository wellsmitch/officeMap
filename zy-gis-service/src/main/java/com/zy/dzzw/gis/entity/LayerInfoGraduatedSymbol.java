package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 等级符号类型
 *
 * @Author wangxiaofeng
 * @Date 2021/4/7 10:33
 */
public class LayerInfoGraduatedSymbol extends LayerInfo {

    /**
     * 分组字段
     */
    private String groupByField;

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
     * 显示
     */
    @Field
    private String sortFieldFilterFunction;

    /**
     * 背景颜色
     */
    private String backgroundColor;

    /**
     * 背景边线颜色
     */
    private String backgroundStrokeColor;

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

    public String getSortFieldFilterFunction() {
        return sortFieldFilterFunction;
    }

    public LayerInfoGraduatedSymbol setSortFieldFilterFunction(String sortFieldFilterFunction) {
        this.sortFieldFilterFunction = sortFieldFilterFunction;
        return this;
    }

    public String getGroupByField() {
        return groupByField;
    }

    public LayerInfoGraduatedSymbol setGroupByField(String groupByField) {
        this.groupByField = groupByField;
        return this;
    }

    public String getSortField() {
        return sortField;
    }

    public LayerInfoGraduatedSymbol setSortField(String sortField) {
        this.sortField = sortField;
        return this;
    }

    public String getSortType() {
        return sortType;
    }

    public LayerInfoGraduatedSymbol setSortType(String sortType) {
        this.sortType = sortType;
        return this;
    }

    public String getSortFieldSuffix() {
        return sortFieldSuffix;
    }

    public LayerInfoGraduatedSymbol setSortFieldSuffix(String sortFieldSuffix) {
        this.sortFieldSuffix = sortFieldSuffix;
        return this;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public LayerInfoGraduatedSymbol setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
        return this;
    }

    public String getBackgroundStrokeColor() {
        return backgroundStrokeColor;
    }

    public LayerInfoGraduatedSymbol setBackgroundStrokeColor(String backgroundStrokeColor) {
        this.backgroundStrokeColor = backgroundStrokeColor;
        return this;
    }

    public String getFontColor() {
        return fontColor;
    }

    public LayerInfoGraduatedSymbol setFontColor(String fontColor) {
        this.fontColor = fontColor;
        return this;
    }

    public String getFontType() {
        return fontType;
    }

    public LayerInfoGraduatedSymbol setFontType(String fontType) {
        this.fontType = fontType;
        return this;
    }

    public String getFontStrokeColor() {
        return fontStrokeColor;
    }

    public LayerInfoGraduatedSymbol setFontStrokeColor(String fontStrokeColor) {
        this.fontStrokeColor = fontStrokeColor;
        return this;
    }

    public Double getFontStrokeWidth() {
        return fontStrokeWidth;
    }

    public LayerInfoGraduatedSymbol setFontStrokeWidth(Double fontStrokeWidth) {
        this.fontStrokeWidth = fontStrokeWidth;
        return this;
    }
}
