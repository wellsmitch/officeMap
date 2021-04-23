package com.zy.gis.model.geometry;

import com.zy.gis.model.geometry.position.Line;
import com.zy.gis.model.geometry.position.Position;
import org.locationtech.jts.geom.LinearRing;

import java.util.List;

public class Polygon extends Geometry<org.locationtech.jts.geom.Polygon, com.zy.gis.model.geometry.position.Polygon> {

    public static final String TYPE_NAME = "Polygon";

    @Override
    public Position getPosition() {
        org.locationtech.jts.geom.Polygon polygon = this.jtsGeometry;
        Position position = new com.zy.gis.model.geometry.position.Polygon();
        position.add(new Line(polygon.getExteriorRing()));
        int numInteriorRing = polygon.getNumInteriorRing();
        for (int i = 0; i < numInteriorRing; i++) {
            position.add(new Line(polygon.getInteriorRingN(i)));
        }
        return position;
    }

    @Override
    public Geometry setPosition(com.zy.gis.model.geometry.position.Polygon position) {
        List<Line> lines = position.getLines();
        LinearRing shell = null;
        LinearRing[] holes = new LinearRing[lines.size() - 1];
        for (int i = 0, x = lines.size(); i < x; i++) {
            if (i == 0) {
                shell = lines.get(i).toLinearRing();
            } else {
                holes[i - 1] = lines.get(i).toLinearRing();
            }
        }
        this.jtsGeometry = new org.locationtech.jts.geom.Polygon(shell, holes, geometryFactory);
        return this;
    }

    @Override
    public String getType() {
        return Polygon.TYPE_NAME;
    }
}
