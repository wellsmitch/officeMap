package com.zy.dzzw.gis.util;

import com.zy.core.exception.BusinessRuntimeException;
import org.apache.commons.io.FileUtils;
import org.geotools.data.FeatureWriter;
import org.geotools.data.Transaction;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.*;
import org.locationtech.jts.geom.impl.CoordinateArraySequence;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.*;

public class ShapeUtil {

    private static final Logger logger = LoggerFactory.getLogger(ShapeUtil.class);

    public File writeShape(String fileName, String coordinate) {
        List<Geometry> geometryList = new ArrayList<>();
        int index = coordinate.split(" ").length;
        String type;
        // 点
        if (index == 1) {
            geometryList.add(createPoint(coordinate));
            type = Geometry.TYPENAME_POINT;
        } else if (index < 3) {
            // 线
            geometryList.add(createLine(coordinate));
            type = Geometry.TYPENAME_LINESTRING;
        } else {
            // 面
            geometryList.add(createPolygon(coordinate));
            type = Geometry.TYPENAME_POLYGON;
        }
        File file = this.write2Shape(fileName, type, geometryList);
        return file;
    }

    /**
     * 生成shape文件
     *
     * @param geoType 图幅类型，Point和Rolygon
     * @param geoms   图幅集合
     */
    public File write2Shape(String fileName, String geoType, List<Geometry> geoms) {
        try {
            long time = System.currentTimeMillis();
            // 根路径
            String basePath = this.getClass().getClassLoader().getResource("/").getPath() + "shp" + File.separator + time;
            try {
                basePath = URLDecoder.decode(basePath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            File doc = new File(basePath);
            if (!doc.exists()) {
                doc.mkdirs();
            }
            // shp文件路径
			String path = basePath + File.separator + fileName;
            File file = new File(path);
            Map<String, Serializable> params = new HashMap();
            params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
            params.put(ShapefileDataStoreFactory.CREATE_SPATIAL_INDEX.key,Boolean.TRUE);
            ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
            //设置编码
            Charset charset = Charset.forName("UTF-8");
            ds.setCharset(charset);
            //定义图形信息和属性信息
            SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
            // 设置坐标系
            tb.setCRS(CRS.decode("EPSG:4526"));
            // 设置文件名
            tb.setName(fileName);

            if (Geometry.TYPENAME_POLYGON.equals(geoType)) {
                tb.add("the_geom", Polygon.class);
            } else if (Geometry.TYPENAME_MULTIPOLYGON.equals(geoType)) {
                tb.add("the_geom", MultiPolygon.class);
            } else if (Geometry.TYPENAME_POINT.equals(geoType)) {
                tb.add("the_geom", Point.class);
            } else if (Geometry.TYPENAME_MULTIPOINT.equals(geoType)) {
                tb.add("the_geom", MultiPoint.class);
            } else if (Geometry.TYPENAME_LINESTRING.equals(geoType)) {
                tb.add("the_geom", LineString.class);
            } else if (Geometry.TYPENAME_MULTILINESTRING.equals(geoType)) {
                tb.add("the_geom", MultiLineString.class);
            } else {
                throw new Exception("Geometry中没有该类型：" + geoType);
            }
            ds.createSchema(tb.buildFeatureType());
            //设置Writer
            FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
            for (Geometry geom : geoms) {
                SimpleFeature feature = writer.next();
                feature.setAttribute("the_geom", geom);
            }
            writer.write();
            writer.close();
            ds.dispose();
            return zipShapeFile(basePath,fileName);
        } catch (Throwable e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return null;
        }
    }

    private File zipShapeFile(String shpPath,String fileName){
        FileOutputStream fos = null;
        File doc = null;
        File shpFlie = null;
        try {
            String basePath = this.getClass().getClassLoader().getResource("/").getPath() + "shp";
            try {
                basePath = URLDecoder.decode(basePath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            doc = new File(basePath);
            if (!doc.exists()) {
                doc.mkdirs();
            }
            String zipName = fileName.substring(0, fileName.lastIndexOf("."));
            String zipPath = basePath + zipName + ".zip";
            try {
                zipPath = URLDecoder.decode(zipPath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            try {
                fos = new FileOutputStream(new File(zipPath));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
            shpFlie = new File(shpPath);
            ZipUtils.toZip(Arrays.asList(shpFlie.listFiles()), fos);
            return new File(zipPath);
        }catch (Throwable e){
            e.printStackTrace();
            logger.error(e.getMessage());
            return null;
        } finally {
            if (fos != null){
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (shpFlie != null){
                try {
                    FileUtils.deleteQuietly(shpFlie);
                    FileUtils.deleteDirectory(shpFlie);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private Geometry createPoint(String coordinate){
        String [] coordinates = coordinate.split(",");
        if (coordinates.length != 2){
            throw new BusinessRuntimeException("坐标格式错误");
        }
        Coordinate pointCoordinate = new Coordinate(Double.valueOf(coordinates[0]), Double.valueOf(coordinates[1]));
        GeometryFactory geometryFactory = new GeometryFactory();
        return geometryFactory.createPoint(pointCoordinate);
    }

    private Geometry createPolygon(String coordinate){
        GeometryFactory geometryFactory = new GeometryFactory();
        String[] coordinates = coordinate.split("\\*");
        LinearRing shell = null;
        List<LinearRing> holes = new ArrayList();
        for (int i = 0; i < coordinates.length; i++) {
            String coordinate1 = coordinates[i];
            Coordinate [] coordinateArr = point(coordinate1);
            if (i == 0) {
                CoordinateArraySequence c = new CoordinateArraySequence(coordinateArr);
                shell = new LinearRing(c, geometryFactory);
            } else {
                CoordinateArraySequence c = new CoordinateArraySequence(coordinateArr);
                LinearRing hole = new LinearRing(c, geometryFactory);
                holes.add(hole);
            }
        }
        return new Polygon(shell, holes.toArray(new LinearRing[holes.size()]), geometryFactory);
    }

    private Geometry createLine(String coordinate){
        String [] coordinates = coordinate.split(" ");
        if (coordinates.length < 2){
            throw new BusinessRuntimeException("坐标格式错误");
        }
        GeometryFactory geometryFactory = new GeometryFactory();
        Coordinate [] coordinateArr = point(coordinate);
        return geometryFactory.createLineString(coordinateArr);
    }

    private Coordinate [] point(String coordinate){
        String[] points = coordinate.split(" ");
        Coordinate [] coordinateArr = new Coordinate[points.length];
        for (int a = 0; a < points.length; a++) {
            String point = points[a];
            double x = Double.valueOf(point.split(",")[0]);
            double y = Double.valueOf(point.split(",")[1]);
            coordinateArr[a] = new Coordinate(x, y);
        }
        return coordinateArr;
    }

    /**
     * 生成shape文件
     *
     * @param shpPath  生成shape文件路径（包含文件名称）
     * @param encode   编码
     * @param geoType  图幅类型，Point和Rolygon
     * @param shpKey   data中图幅的key
     * @param attrKeys 属性key集合
     * @param data     图幅和属性集合
     */
//    public static void write2Shape(String shpPath, String encode, String geoType, String shpKey, List<String> attrKeys, List<Map<String, Object>> data) {
//        try {
//            if (data == null || data.size() == 0) {
//                return;
//            }
//            //创建shape文件对象
//            File file = new File(shpPath);
//            Map<String, Serializable> params = new HashMap<>();
//            params.put(ShapefileDataStoreFactory.URLP.key, file.toURI().toURL());
//            ShapefileDataStore ds = (ShapefileDataStore) new ShapefileDataStoreFactory().createNewDataStore(params);
//
//            //定义图形信息和属性信息
//            SimpleFeatureTypeBuilder tb = new SimpleFeatureTypeBuilder();
//            tb.setCRS(DefaultGeographicCRS.WGS84);
//            tb.setName("shapefile");
//
//            if ("Polygon".equals(geoType)) {
//                tb.add("the_geom", Polygon.class);
//            } else if ("MultiPolygon".equals(geoType)) {
//                tb.add("the_geom", MultiPolygon.class);
//            } else if ("Point".equals(geoType)) {
//                tb.add("the_geom", Point.class);
//            } else if ("MultiPoint".equals(geoType)) {
//                tb.add("the_geom", MultiPoint.class);
//            } else if ("LineString".equals(geoType)) {
//                tb.add("the_geom", LineString.class);
//            } else if ("MultiLineString".equals(geoType)) {
//                tb.add("the_geom", MultiLineString.class);
//            } else {
//                throw new Exception("Geometry中没有该类型：" + geoType);
//            }
//
//            for (String field : attrKeys) {
//                tb.add(field.toUpperCase(), String.class);
//            }
//
//            ds.createSchema(tb.buildFeatureType());
//            //设置编码
//            Charset charset = Charset.forName(encode);
//            ds.setCharset(charset);
//            //设置Writer
//            FeatureWriter<SimpleFeatureType, SimpleFeature> writer = ds.getFeatureWriter(ds.getTypeNames()[0], Transaction.AUTO_COMMIT);
//            //写入文件信息
//            for (int i = 0; i < data.size(); i++) {
//                SimpleFeature feature = writer.next();
//                Map<String, Object> row = data.get(i);
//                Geometry geom = (Geometry) row.get(shpKey);
//                feature.setAttribute("the_geom", geom);
//                for (String key : row.keySet()) {
//                    if (!key.equals(shpKey)) {
//                        if (row.get(key) != null) {
//                            feature.setAttribute(key.toUpperCase(), row.get(key).toString());
//                        } else {
//                            feature.setAttribute(key.toUpperCase(), "");
//                        }
//                    }
//                }
//            }
//            writer.write();
//            writer.close();
//            ds.dispose();
//
//            //添加到压缩文件
//            //zipShapeFile(shpPath);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
}
