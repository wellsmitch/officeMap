package com.zy.dzzw.gis.bean;

public class PolylineArc{
    //圆点
    private Point2D centerPoint;
    private Point2D startPoint;
    private Point2D endPoint;
    private double angle;
    //半径
    private double redius;
    //弧点
    private Point2D arcPoint;
    //顺时针
    private boolean clockwise;

    public Point2D getCenterPoint() {
        return centerPoint;
    }

    public void setCenterPoint(Point2D centerPoint) {
        this.centerPoint = centerPoint;
    }

    public Point2D getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(Point2D startPoint) {
        this.startPoint = startPoint;
    }

    public Point2D getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(Point2D endPoint) {
        this.endPoint = endPoint;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public double getRedius() {
        return redius;
    }

    public void setRedius(double redius) {
        this.redius = redius;
    }

    public Point2D getArcPoint() {
        return arcPoint;
    }

    public void setArcPoint(Point2D arcPoint) {
        this.arcPoint = arcPoint;
    }

    public boolean isClockwise() {
        return clockwise;
    }

    public void setClockwise(boolean clockwise) {
        this.clockwise = clockwise;
    }
}
