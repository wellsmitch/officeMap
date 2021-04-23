package com.zy.gis.model.geometry;

import com.zy.gis.model.geometry.position.Position;

public class Point extends Geometry {

    public static final String TYPE_NAME = "Point";

    @Override
    public Position getPosition() {
        return null;
    }

    @Override
    public Geometry setPosition(Position position) {
        return null;
    }

    @Override
    public String getType() {
        return Point.TYPE_NAME;
    }
}
