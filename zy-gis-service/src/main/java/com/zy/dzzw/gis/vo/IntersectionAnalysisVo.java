package com.zy.dzzw.gis.vo;

import com.zy.gis.model.geometry.Geometry;

import java.util.List;

public class IntersectionAnalysisVo {

    private List<Long> layerInfoIds;

    private List<Geometry> geometries;

    public List<Long> getLayerInfoIds() {
        return layerInfoIds;
    }

    public void setLayerInfoIds(List<Long> layerInfoIds) {
        this.layerInfoIds = layerInfoIds;
    }

    public List<Geometry> getGeometries() {
        return geometries;
    }

    public void setGeometries(List<Geometry> geometries) {
        this.geometries = geometries;
    }
}
