package com.zy.dzzw.gis.bean;

import java.util.ArrayList;
import java.util.List;

public class LWPolyline {
    private int pointCount;

    private List<Point2D> points = new ArrayList<>();

    private String layerId;

    private List text;

    public List getText() {
        return text;
    }

    public void setText(List text) {
        this.text = text;
    }

    public int getPointCount() {
        return pointCount;
    }

    public void setPointCount(int pointCount) {
        this.pointCount = pointCount;
    }

    public List<Point2D> getPoints() {
        return points;
    }

    public void setPoints(List<Point2D> points) {
        this.points = points;
    }

    public String getLayerId() {
        return layerId;
    }

    public void setLayerId(String layerId) {
        this.layerId = layerId;
    }
}
