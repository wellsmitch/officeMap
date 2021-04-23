package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

/**
 * 图层专题
 *
 * @Author wangxiaofeng
 * @Date 2020/3/30 9:07
 */
@Document(collection = "gis.subject.info")
public class SubjectInfo extends SimpleSubjectInfo {

    /**
     * 图层信息列表
     */
//    @Field
    private List<LayerProperty> layerInfoList = new ArrayList<>();

    public List<LayerProperty> getLayerInfoList() {
        return layerInfoList;
    }

    public void setLayerInfoList(List<LayerProperty> layerInfoList) {
        this.layerInfoList = layerInfoList;
    }

}
