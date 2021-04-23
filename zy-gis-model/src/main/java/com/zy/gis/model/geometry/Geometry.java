package com.zy.gis.model.geometry;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.zy.gis.model.geometry.position.Position;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.*;
import org.opengis.feature.Feature;
import org.opengis.feature.Property;
import org.opengis.feature.type.Name;

import java.text.ParseException;
import java.util.*;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes(value = {
        @JsonSubTypes.Type(value = Point.class, name = Point.TYPE_NAME),
        @JsonSubTypes.Type(value = Line.class, name = Line.TYPE_NAME),
        @JsonSubTypes.Type(value = Polygon.class, name = Polygon.TYPE_NAME)
})
public abstract class Geometry<G extends org.locationtech.jts.geom.Geometry, P extends Position> {

    public final static GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();

    public final static Integer quadrantSegments = 20;

    @JsonIgnore
    protected G jtsGeometry;

    @JsonIgnore
    protected Object[] propertiesMeta;

    protected Long layerInfoId;

    public Geometry() {

    }

    private Map<String, Object> properties = new LinkedHashMap<>();

    public Geometry(org.locationtech.jts.geom.Geometry g) {
        this.jtsGeometry = (G) g;
    }

    public Geometry(P p) {
        this.setPosition(p);
    }

    public abstract Position getPosition();

    public abstract Geometry setPosition(P p);

    @JsonIgnore
    public abstract String getType();

    public Position buffer(int distance) {
        Geometry data = null;
        org.locationtech.jts.geom.Geometry bufferGeometry = this.jtsGeometry.buffer(distance, quadrantSegments);
        if (bufferGeometry instanceof org.locationtech.jts.geom.Polygon) {
            data = new com.zy.gis.model.geometry.Polygon();
            data.setJtsGeometry(bufferGeometry);
        }
        return data == null ? null : data.getPosition();
    }

    public List<Geometry> intersection(Geometry geometry) {
        List<Geometry> geometryList = new ArrayList<>();
        org.locationtech.jts.geom.Geometry intersection = this.jtsGeometry.intersection(geometry.jtsGeometry);
        if (intersection instanceof org.locationtech.jts.geom.Polygon) {
            Geometry data = new com.zy.gis.model.geometry.Polygon();
            data.setJtsGeometry(intersection);
            geometryList.add(data);
        } else if (intersection instanceof MultiPolygon) {
            MultiPolygon multiPolygon = (MultiPolygon) intersection;
            for (int i = 0, x = multiPolygon.getNumGeometries(); i < x; i++) {
                Geometry data = new com.zy.gis.model.geometry.Polygon();
                data.setJtsGeometry(multiPolygon.getGeometryN(i));
                geometryList.add(data);
            }
        }
        return geometryList;
    }

    public Geometry setFeature(Feature feature, Object[] properties) {
        this.propertiesMeta = properties;
        return this.setFeature(feature);
    }

    public Geometry setFeature(Feature feature) {
        if (this.propertiesMeta != null && this.propertiesMeta.length > 0) {
            for (Object property : this.propertiesMeta) {
                Map<String, String> col = (Map<String, String>) property;
                String field = col.get("field");
                String type = col.get("type");
                String namesStr = col.get("name");
                if (StringUtils.isBlank(field)) {
                    continue;
                }
                String[] names = namesStr.split(",");
                for (String name : names) {
                    if (StringUtils.isBlank(name) || "null".equals(name)) {
                        continue;
                    }
                    Collection<Property> properties = feature.getProperties(name);
                    if (properties.isEmpty()) {
                        this.put(field, null);
                    } else {
                        Property p = properties.stream().findFirst().get();
                        this.put(field, p.getValue());
                        break;
                    }
                }
            }
        } else {
            for (Property property : feature.getProperties()) {
                Object value = property.getValue();
                Name name = property.getName();
                if (value instanceof org.locationtech.jts.geom.Geometry) {
                    continue;
                }
                this.put(name.toString(), value);
            }
        }
        return this;
    }

    public Object get(String key) {
        return this.properties.get(key);
    }

    public Geometry put(String type, String key, Object value) {
        String str = String.valueOf(value);
        if (StringUtils.isNotBlank(str)) {
            if ("string".equals(type)) {
                value = str;
            } else if ("double".equals(type)) {
                value = Double.valueOf(str);
            } else if ("long".equals(type)) {
                value = Long.valueOf(str);
            } else if ("float".equals(type)){
                value = Float.valueOf(str);
            } else if ("datetime".equals(type)) {
                try {
                    value = DateUtils.parseDate(str, "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss");
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        this.properties.put(key, value);
        return this;
    }

    public Geometry put(String key, Object value) {
        this.properties.put(key, value);
        return this;
    }

    public Geometry putAll(Geometry geometry) {
        this.properties.putAll(geometry.properties);
        return this;
    }


    public Geometry putAll(Map<String, Object> map) {
        this.properties.putAll(map);
        return this;
    }

    public Geometry remove(String key) {
        this.properties.remove(key);
        return this;
    }

    public Set<String> keySet() {
        return this.properties.keySet();
    }

    public Collection<Object> values() {
        return this.properties.values();
    }

    @JsonIgnore
    public Set<String> getFields() {
        return new LinkedHashSet<>(this.keySet());
    }

    @JsonIgnore
    public List<Object> getValues() {
        return new ArrayList<>(this.values());
    }

    public Map<String, Object> getProperties() {
        return new LinkedHashMap<>(this.properties);
    }

    public Double getArea() {
        return this.jtsGeometry.getArea();
    }

    public Double getLength() {
        return this.jtsGeometry.getLength();
    }

    public Geometry setJtsGeometry(G jtsGeometry) {
        this.jtsGeometry = jtsGeometry;
        return this;
    }

    public G getJtsGeometry() {
        return jtsGeometry;
    }

    public Geometry<G, P> setPropertiesMeta(Object[] propertiesMeta) {
        this.propertiesMeta = propertiesMeta;
        return this;
    }

    public Geometry<G, P> setProperties(Map<String, Object> properties) {
        this.properties = properties;
        return this;
    }

    public Long getLayerInfoId() {
        return layerInfoId;
    }

    public void setLayerInfoId(Long layerInfoId) {
        this.layerInfoId = layerInfoId;
    }
}
