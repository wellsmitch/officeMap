package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

/**
 * 权限控制
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:50
 */
@Document(collection = "gis.layer.role")
public class LayerRole extends BaseObject {

    /**
     * 角色id
     */
    @Field
    private String roleId;

    /**
     * 图层信息
     */
    @DBRef
    private LayerInfo layerInfo;

    /**
     * 图层ID
     */
    @Field
    private Long layerId;

    /**
     * 扩展图层属性
     */
    @Field
    private Map<String, Object> property;

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public LayerInfo getLayerInfo() {
        return layerInfo;
    }

    public void setLayerInfo(LayerInfo layerInfo) {
        this.layerInfo = layerInfo;
    }

    public Map<String, Object> getProperty() {
        return property;
    }

    public void setProperty(Map<String, Object> property) {
        this.property = property;
    }

    public Long getLayerId() {
        return layerId;
    }

    public void setLayerId(Long layerId) {
        this.layerId = layerId;
    }
}
