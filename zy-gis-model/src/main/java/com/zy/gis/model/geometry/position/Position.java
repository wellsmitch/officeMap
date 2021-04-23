package com.zy.gis.model.geometry.position;

import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.GeometryFactory;

public abstract class Position<T extends Position> {

    public abstract Position add(T t);

    public abstract Position remove(T t);
}
