package com.zy.dzzw.gis.bean;

public class Text extends Point{
    private String layerId;
    private String value;
    public String getLayerId() {
        return layerId;
    }

    public void setLayerId(String layerId) {
        this.layerId = layerId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
