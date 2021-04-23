package com.zy.gis.model.geometry.relation;

import com.zy.gis.model.geometry.Geometry;

public class Condition {

    private String text;
    private String where;
    private Geometry geometry;
    private String orderByFields;
    private SpatialRelEnum spatialRel;
    private Criteria criteria;
    private Integer page = 0;
    private Integer pageCount = 10000;

    public String getText() {
        return text;
    }

    public Condition setText(String text) {
        this.text = text;
        return this;
    }

    public String getWhere() {
        return where;
    }

    public Condition setWhere(String where) {
        this.where = where;
        return this;
    }

    public Geometry getGeometry() {
        return geometry;
    }

    public Condition setGeometry(Geometry geometry) {
        this.geometry = geometry;
        return this;
    }

    public String getOrderByFields() {
        return orderByFields;
    }

    public Condition setOrderByFields(String orderByFields) {
        this.orderByFields = orderByFields;
        return this;
    }

    public SpatialRelEnum getSpatialRel() {
        return spatialRel;
    }

    public Condition setSpatialRel(SpatialRelEnum spatialRel) {
        this.spatialRel = spatialRel;
        return this;
    }

    public Criteria getCriteria() {
        return criteria;
    }

    public Condition setCriteria(Criteria criteria) {
        this.criteria = criteria;
        return this;
    }

    public Integer getPage() {
        return page;
    }

    public Condition setPage(Integer page) {
        this.page = page;
        return this;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public Condition setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
        return this;
    }

    public enum SpatialRelEnum {
        Intersects(1, "相交"),
        Contains(2, "包含"),
        Crosses(3, "交叉"),
        EnvelopeIntersects(4, ""),
        IndexIntersects(5, ""),
        Overlaps(6, "重叠"),
        Touches(7, ""),
        Within(8, ""),
        Relation(9, "");
        private Integer code;
        private String text;

        SpatialRelEnum(Integer code, String text) {
            this.code = code;
            this.text = text;
        }

        public Integer getCode() {
            return code;
        }

        public String getText() {
            return text;
        }
    }
}
