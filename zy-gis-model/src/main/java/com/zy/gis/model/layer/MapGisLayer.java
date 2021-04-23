package com.zy.gis.model.layer;

import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.Line;
import com.zy.gis.model.geometry.Point;
import com.zy.gis.model.geometry.Polygon;
import com.zy.gis.model.geometry.relation.Condition;
import com.zy.gis.model.util.JsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.geotools.geometry.jts.Geometries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * @author Administrator
 */
public class MapGisLayer extends Layer {

    private String layer;
    private String docName;
    private String layerIndex;
    private String gdbpUrl;
    private String igsHost;
    private Integer igsPort;
    private String igsUrlPrefix = "";

    private static RestTemplate restTemplate;

    static {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(60000);
        requestFactory.setReadTimeout(60000);
        restTemplate = new RestTemplate(requestFactory);
        restTemplate.getMessageConverters().set(1, new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

    public MapGisLayer(String igsHost, Integer igsPort, String docName, String layerIndex,String externalWatchSqlTemplate) {
        this.docName = docName;
        this.layerIndex = layerIndex;
        this.igsHost = igsHost;
        this.igsPort = igsPort;
        this.externalWatchSqlTemplate = externalWatchSqlTemplate;
    }

    public MapGisLayer(String igsHost, Integer igsPort, String gdbpUrl,String externalWatchSqlTemplate) {
        this.gdbpUrl = gdbpUrl;
        this.igsHost = igsHost;
        this.igsPort = igsPort;
        this.externalWatchSqlTemplate = externalWatchSqlTemplate;
    }


    @Override
    public List<Geometry> query(Condition condition) throws Exception {
        List<Geometry> geometries = new ArrayList<>();
        String url = "";
        if (StringUtils.isNotBlank(this.gdbpUrl)) {
            url = "http://" + this.igsHost + ":" + this.igsPort + this.igsUrlPrefix + "/igs/rest/mrfs/layer/query";
        } else {
            url = "http://" + this.igsHost + ":" + this.igsPort + this.igsUrlPrefix + "/igs/rest/mrfs/docs/" + this.docName + "/0/" + this.layerIndex + "/query";
        }

        String where = condition.getWhere();
        Geometry conditionGeometry = condition.getGeometry();
        String geometryType = null;
        String coordinate = null;
        if (conditionGeometry != null) {
            if (conditionGeometry instanceof Point) {
                geometryType = "point";
            } else if (conditionGeometry instanceof Line) {
                geometryType = "line";
            } else if (conditionGeometry instanceof Polygon) {
                geometryType = "polygon";
            }

            coordinate = conditionGeometry.getPosition().toString().replaceAll(" ", ",");
        }
        Map<String, Object> param = new LinkedHashMap<>();
        param.put("f", "json");
        param.put("gdbp", this.gdbpUrl);
        param.put("isAsc", condition.getOrderByFields());
        param.put("geometryType", geometryType);
        param.put("geometry", coordinate);
        param.put("structs", "{IncludeAttribute:true,IncludeGeometry:true,IncludeWebGraphic:false}");
        param.put("rule", "{CompareRectOnly:false,EnableDisplayCondition:false,MustInside:false,Intersect:true}");
        param.put("page", condition.getPage());
        param.put("pageCount", condition.getPageCount());
        param.put("where", where);
        param.put("guid", UUID.randomUUID().toString());

        StringBuilder sb = new StringBuilder();
        param.forEach((k, v) -> {
            if (v != null) {
                sb.append(k + "=" + "{" + k + "}");
                sb.append("&");
            }
        });
        sb.deleteCharAt(sb.length() - 1);
        url = url + "?" + sb.toString();
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class, param);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            String resultText = responseEntity.getBody();
            Map<String, Object> result = JsonUtil.getObjectMapper().readValue(resultText, Map.class);
            Integer totalCount = Integer.valueOf(result.get("TotalCount").toString());
            Collection collection = (Collection) result.get("SFEleArray");
            Map<String, Object> attStruct = (Map<String, Object>) result.get("AttStruct");
            if (attStruct == null || totalCount == 0) {
                return geometries;
            }
            List<String> fldNames = (List<String>) attStruct.get("FldName");
            collection.forEach(o -> {
                Map<String, Object> sfele = (Map<String, Object>) o;
                Map<String, Object> fGeom = (Map<String, Object>) sfele.get("fGeom");
                List<Object> pntGeoms = (List<Object>) fGeom.get("PntGeom");
                List<Object> linGeoms = (List<Object>) fGeom.get("LinGeom");
                List<Object> regGeoms = (List<Object>) fGeom.get("RegGeom");
                Geometry geometry = null;
                if (pntGeoms != null && !pntGeoms.isEmpty()) {
                    geometry = new Point();
                    Map<String, Object> pntGeom = (Map<String, Object>) pntGeoms.get(0);
                    Map<String, Object> dot = (Map<String, Object>) pntGeom.get("Dot");
                    double x = Double.valueOf(dot.get("x").toString());
                    double y = Double.valueOf(dot.get("y").toString());
                    geometry.setPosition(new com.zy.gis.model.geometry.position.Point(x, y));
                } else if (linGeoms != null && !linGeoms.isEmpty()) {
                    geometry = new Line();
                    com.zy.gis.model.geometry.position.Line position = new com.zy.gis.model.geometry.position.Line();
                    for (int i = 0, m = linGeoms.size(); i < m; i++) {
                        Map<String, Object> linGeom = (Map<String, Object>) linGeoms.get(i);
                        Map<String, Object> line = (Map<String, Object>) linGeom.get("Line");
                        Collection arcs = (Collection) line.get("Arcs");
                        Map<String, Object> arc = (Map<String, Object>) arcs.iterator().next();
                        Collection dots = (Collection) arc.get("dots");
                        for (Object item : dots) {
                            Map<String, Object> dot = (Map<String, Object>) item;
                            double x = Double.valueOf(dot.get("x").toString());
                            double y = Double.valueOf(dot.get("y").toString());
                            position.add(new com.zy.gis.model.geometry.position.Point(x, y));
                        }
                    }
                    geometry.setPosition(position);
                } else if (regGeoms != null && !regGeoms.isEmpty()) {
                    geometry = new Polygon();
                    com.zy.gis.model.geometry.position.Polygon position = new com.zy.gis.model.geometry.position.Polygon();
                    for (Object item : regGeoms) {
                        Map<String, Object> regGeom = (Map<String, Object>) item;
                        List<Object> rings = (List<Object>) regGeom.get("Rings");
                        for (Object r : rings) {
                            Map<String, Object> ring = (Map<String, Object>) r;
                            List<Map> arcs = (List<Map>) ring.get("Arcs");
                            List<Map> dots = (List<Map>) arcs.get(0).get("Dots");
                            com.zy.gis.model.geometry.position.Line linePosition = new com.zy.gis.model.geometry.position.Line();
                            for (Map dot : dots) {
                                double x = Double.valueOf(dot.get("x").toString());
                                double y = Double.valueOf(dot.get("y").toString());
                                linePosition.add(new com.zy.gis.model.geometry.position.Point(x, y));
                            }
                            position.add(linePosition);
                        }
                    }
                    geometry.setPosition(position);
                }
                if (sfele.get("FID") != null){
                    geometry.put("long", "fid", sfele.get("FID"));
                }
                List<Object> attValue = (List<Object>) sfele.get("AttValue");
                if (attValue != null && !attValue.isEmpty()) {
                    Map<String, Object> feature = new HashMap(fldNames.size());
                    for (int i = 0, x = fldNames.size(); i < x; i++) {
                        feature.put(fldNames.get(i), attValue.get(i));
                    }

                    Object[] properties = this.properties;
                    for (int i1 = 0; i1 < properties.length; i1++) {
                        Map<String, Object> prop = (Map<String, Object>) properties[i1];
                        String namesStr = (String) prop.get("name");
                        String field = (String) prop.get("field");
                        String type = (String) prop.get("fieldType");
                        if (StringUtils.isNotEmpty(namesStr)){
                            String[] names = namesStr.split(",");
                            for (int i2 = 0; i2 < names.length; i2++) {
                                Object value = feature.get(names[i2]);
                                if (value != null) {
                                    geometry.put(type, field, value);
                                }
                            }
                        } else {
                            geometry.put(type, field, "");
                        }
                    }
                    // 外挂表查询
                    Map<String,Object> map = this.queryExternalWatch(geometry.getProperties());
                    geometry.setProperties(map);
                }
                if (geometry != null) {
                    geometries.add(geometry);
                }
            });
        }
        return geometries;
    }

    public String getIgsUrlPrefix() {
        return igsUrlPrefix;
    }

    public MapGisLayer setIgsUrlPrefix(String igsUrlPrefix) {
        this.igsUrlPrefix = igsUrlPrefix;
        return this;
    }

    public String getIgsHost() {
        return igsHost;
    }

    public MapGisLayer setIgsHost(String igsHost) {
        this.igsHost = igsHost;
        return this;
    }

    public Integer getIgsPort() {
        return igsPort;
    }

    public MapGisLayer setIgsPort(Integer igsPort) {
        this.igsPort = igsPort;
        return this;
    }

    public String getLayer() {
        return layer;
    }

    public MapGisLayer setLayer(String layer) {
        this.layer = layer;
        return this;
    }

    public String getDocName() {
        return docName;
    }

    public MapGisLayer setDocName(String docName) {
        this.docName = docName;
        return this;
    }

    public String getLayerIndex() {
        return layerIndex;
    }

    public MapGisLayer setLayerIndex(String layerIndex) {
        this.layerIndex = layerIndex;
        return this;
    }

    public String getGdbpUrl() {
        return gdbpUrl;
    }

    public MapGisLayer setGdbpUrl(String gdbpUrl) {
        this.gdbpUrl = gdbpUrl;
        return this;
    }

    public RestTemplate getRestTemplate() {
        return restTemplate;
    }

    public MapGisLayer setRestTemplate(RestTemplate restTemplate) {
        MapGisLayer.restTemplate = restTemplate;
        return this;
    }
}
