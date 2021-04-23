package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "gis.subject.role")
public class SubjectRole extends BaseObject{

    /**
     * 角色id
     */
    @Field
    private String roleId;

    /**
     * 专题code
     */
    @Field
    private String subjectCode;


    /**
     * 地图基本信息
     */
    @Field
    private MapInfo mapInfo;

    /**
     * 图层操作接口
     */
    @Field
    private MapInterFace mapInterFace;


    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
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
}
