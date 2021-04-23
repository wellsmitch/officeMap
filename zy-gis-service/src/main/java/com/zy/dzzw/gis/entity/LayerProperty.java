package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

/**
 * 图层业务信息
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:49
 */
public class LayerProperty {

    /**
     * 图层信息
     */
    @DBRef
    private LayerInfo layerInfo;

    /**
     * 图层属性（可见，可选）
     */
    @Field
    private Map<String, Object> property;

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
}
