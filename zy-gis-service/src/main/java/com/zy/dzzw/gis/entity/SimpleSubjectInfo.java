package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Field;

public class SimpleSubjectInfo extends TreeObject {

    /**
     * 专题名称（中文）
     */
    @Field
    private String name;

    /**
     * 专题编码，全局唯一
     */
    @Field
    private String code;

    @Field
    private Integer type;

    /**
     * 地图信息
     */
    private MapInfo mapInfo;

    /**
     * 图层操作接口
     */
    private MapInterFace mapInterFace;

    /**
     * 专题图标
     */
    @Field
    private String subjectIcon;

    /**
     * 表单地址
     */
    @Field
    private String formUrl;

    public String getFormUrl() {
        return formUrl;
    }

    public void setFormUrl(String formUrl) {
        this.formUrl = formUrl;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public MapInfo getMapInfo() {
        return mapInfo;
    }

    public void setMapInfo(MapInfo mapInfo) {
        this.mapInfo = mapInfo;
    }

    public MapInterFace getMapInterFace() {
        return mapInterFace;
    }

    public void setMapInterFace(MapInterFace mapInterFace) {
        this.mapInterFace = mapInterFace;
    }

    public String getSubjectIcon() {
        return subjectIcon;
    }

    public void setSubjectIcon(String subjectIcon) {
        this.subjectIcon = subjectIcon;
    }
}
