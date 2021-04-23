package com.zy.gis.model.geometry.position;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.zy.gis.model.configure.PointSerialize;
import org.locationtech.jts.geom.Coordinate;

public class Point extends Position {

    @JsonSerialize(using = PointSerialize.class)
    private double x;
    @JsonSerialize(using = PointSerialize.class)
    private double y;

    private double z;

    public Point() {
    }

    public Point(Coordinate coordinate) {
        this.parsePoint(coordinate);
    }

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public Point(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public double getX() {
        return x;
    }

    public Point setX(double x) {
        this.x = x;
        return this;
    }

    public double getY() {
        return y;
    }

    public Point setY(double y) {
        this.y = y;
        return this;
    }

    public double getZ() {
        return z;
    }

    public Point setZ(double z) {
        this.z = z;
        return this;
    }

    @Override
    public Position add(Position o) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Position remove(Position o) {
        throw new UnsupportedOperationException();
    }

    public Coordinate toCoordinate() {
        return new Coordinate(this.x, this.y);
    }

    public Point parsePoint(Coordinate coordinate) {
        this.x = coordinate.getX();
        this.y = coordinate.getY();
        double z = coordinate.getZ();
        if (!"NaN".equals(String.valueOf(coordinate.getZ()))) {
            this.z = z;
        }
        return this;
    }

    public String toString() {
        return PointSerialize.formatDouble(this.x) + "," + PointSerialize.formatDouble(this.y);
    }

}
