package com.zy.gis.model.geometry.position;

import com.zy.gis.model.geometry.Geometry;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.CoordinateSequence;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.impl.CoordinateArraySequence;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Line extends Position<Point> {

    private List<Point> points = new ArrayList<>();

    public Line() {
    }

    public Line(LinearRing linearRing) {
        this(linearRing.getCoordinates());
    }

    public Line(Coordinate[] coordinates) {
        this.parseLine(coordinates);
    }

    public Line(List<Point> points) {
        this.points = points;
    }

    public List<Point> getPoints() {
        return points;
    }

    public Line add(Point point) {
        this.points.add(point);
        return this;
    }

    public Line remove(Point point) {
        this.points.remove(point);
        return this;
    }

    public Coordinate[] toCoordinates() {
        return points.stream().map(point -> point.toCoordinate()).toArray(Coordinate[]::new);
    }

    public LinearRing toLinearRing() {
        return this.toLinearRing(Geometry.geometryFactory);
    }

    public LinearRing toLinearRing(GeometryFactory geometryFactory) {
        return new LinearRing(new CoordinateArraySequence(this.toCoordinates()), geometryFactory);
    }

    public Line parseLine(Coordinate[] coordinates) {
        points.clear();
        for (Coordinate coordinate : coordinates) {
            points.add(new Point(coordinate));
        }
        return this;
    }

    public String toString() {
        return this.points.stream().map(point -> point.toString()).collect(Collectors.joining(" "));
    }
}
