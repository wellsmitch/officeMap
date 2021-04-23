package com.zy.gis.model.layer;

import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.Line;
import com.zy.gis.model.geometry.Polygon;
import com.zy.gis.model.geometry.relation.Condition;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.geotools.data.Query;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.util.factory.GeoTools;
import org.locationtech.jts.geom.MultiPolygon;
import org.opengis.feature.Feature;
import org.opengis.feature.GeometryAttribute;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.filter.Filter;
import org.opengis.filter.FilterFactory2;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WfsLayer extends Layer {

    private Map connectionParameters;
    private String geomName;
    private String typeName;
    private FeatureSource<SimpleFeatureType, SimpleFeature> featureSource;

    public WfsLayer() {}

    public WfsLayer(String url) {
        this.url = url;
    }

    public void init() throws IOException {
        Map connectionParameters = new HashMap();
        connectionParameters.put("WFSDataStoreFactory:GET_CAPABILITIES_URL", this.url);
        connectionParameters.put("WFSDataStoreFactory:PROTOCOL", false);
        connectionParameters.put("WFSDataStoreFactory:TIMEOUT", 30000);
//        connectionParameters.put("WFSDataStoreFactory:BUFFER_SIZE", 100);
        this.connectionParameters = connectionParameters;
        DataStore data = DataStoreFinder.getDataStore(connectionParameters);
        String typeNames[] = data.getTypeNames();
        this.typeName = typeNames[0];
        SimpleFeatureType schema = data.getSchema(typeName);
        this.featureSource = data.getFeatureSource(typeName);
        this.geomName = schema.getGeometryDescriptor().getLocalName();
    }

    @Override
    public List<Geometry> query(Condition condition) throws Exception {
        this.init();
        List<Geometry> geometries = new ArrayList<>();
        Query query = buildQueryCondition(condition);
        List<Feature> features = getFeatures(query);
        features.forEach(feature -> {
            GeometryAttribute geometryAttribute = feature.getDefaultGeometryProperty();
            Object jtsGeometry = geometryAttribute.getValue();
            if (jtsGeometry instanceof MultiPolygon) {
                MultiPolygon multiPolygon = (MultiPolygon) jtsGeometry;
                for (int i = 0, x = multiPolygon.getNumGeometries(); i < x; i++) {
                    Geometry geometry = new Polygon();
                    geometry.setJtsGeometry(multiPolygon.getGeometryN(i));
                    geometry.setFeature(feature, this.properties);
                    geometries.add(geometry);
                }
            } else if (jtsGeometry instanceof org.locationtech.jts.geom.Polygon) {
                Geometry geometry = new Polygon();
                geometry.setJtsGeometry((org.locationtech.jts.geom.Geometry) jtsGeometry);
                geometry.setFeature(feature, this.properties);
                geometries.add(geometry);
            } else if (jtsGeometry instanceof org.locationtech.jts.geom.LinearRing) {
                Geometry geometry = new Line();
                geometry.setJtsGeometry((org.locationtech.jts.geom.Geometry) jtsGeometry);
                geometry.setFeature(feature, this.properties);
                geometries.add(geometry);
            }
        });
        return geometries;
    }

    private List<Feature> getFeatures(Query query) throws IOException {
        FeatureCollection<SimpleFeatureType, SimpleFeature> features = featureSource.getFeatures(query);
        FeatureIterator<SimpleFeature> iterator = features.features();
        List<Feature> featureList = new ArrayList<>();
        while (iterator.hasNext()) {
            Feature feature = iterator.next();
            featureList.add(feature);
        }
        iterator.close();
        return featureList;
    }

    private Query buildQueryCondition(Condition condition) {
        FilterFactory2 ff = CommonFactoryFinder.getFilterFactory2(GeoTools.getDefaultHints());
        List<Filter> filters = new ArrayList<>();
        if (condition.getGeometry() != null) {
            filters.add(ff.intersects(ff.property(geomName), ff.literal(condition.getGeometry().getJtsGeometry())));
        }
        if (condition.getCriteria() != null) {

        }
        Query query = new Query(typeName, ff.and(filters));
        query.setMaxFeatures(condition.getPageCount());
        return query;
    }

}
