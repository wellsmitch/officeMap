package com.zy.dzzw.gis.bean;

/**
 * 2D坐标
 */
public class Point2D extends  Point {
    //凸度
    private double convexityDegree;

    private boolean isArc =false;

    public double getConvexityDegree() {
        return convexityDegree;
    }

    public void setConvexityDegree(double convexityDegree) {
        this.convexityDegree = convexityDegree;
    }

    public boolean isArc() {
        return isArc;
    }

    public void setArc(boolean arc) {
        isArc = arc;
    }
}
