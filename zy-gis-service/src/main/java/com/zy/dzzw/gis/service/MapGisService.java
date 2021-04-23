package com.zy.dzzw.gis.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.exception.BusinessRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.util.ObjectMapper;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.MapInterFace;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.relation.Condition;
import com.zy.gis.model.layer.Layer;
import com.zy.gis.model.layer.MapGisLayer;
import com.zy.gis.model.layer.WfsLayer;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

/**
 * @author Administrator
 */
@Service
public class MapGisService {

    private static final Logger logger = LoggerFactory.getLogger(MapGisService.class);

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    LayerConfigService layerConfigService;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    ObjectMapper objectMapper;

    /**
     * 属性查询
     * @param layerInfo 查询层的layerId
     * @param condition 查询条件
     * @return
     */
    public List<Geometry> queryFeature(LayerInfo layerInfo, Condition condition){
        List<Geometry> queryGeometries;
        Layer layer = null;
        MapInterFace mapInterFace = layerConfigService.getLayerConfig().getMapInterFace();
        if (StringUtils.isNotBlank(layerInfo.getWfsUrl())) {
            layer = new WfsLayer("http://" + mapInterFace.getServerIp() + ":" + mapInterFace.getServerPort() + layerInfo.getWfsUrl().replaceFirst("/mapgis", ""));
        } else if (StringUtils.isNotBlank(layerInfo.getGdbpUrl())) {
            layer = new MapGisLayer(mapInterFace.getServerIp(), Integer.valueOf(mapInterFace.getServerPort()), layerInfo.getGdbpUrl(),layerInfo.getExternalWatchSqlTemplate());
        } else if (StringUtils.isNoneBlank(layerInfo.getDocName(), layerInfo.getLayerIndex())) {
            layer = new MapGisLayer(mapInterFace.getServerIp(), Integer.valueOf(mapInterFace.getServerPort()), layerInfo.getDocName(), layerInfo.getLayerIndex(),layerInfo.getExternalWatchSqlTemplate());
        } else {
            throw new ServiceRuntimeException(layerInfo.getLayer() + "：图层查询参数未找到");
        }
        layer.setJdbcTemplate(jdbcTemplate);
        layer.setProperties(layerInfo.getProperties());
        try {
            queryGeometries = layer.query(condition);
        } catch (Exception e) {
            logger.error(e.getMessage(),e);
            throw new ServiceRuntimeException("属性查询失败。");
        }
        return queryGeometries;
    }

    /**
     * 插入图元信息
     *
     * @param layerInfo
     * @param dataList  map <>coordinates:坐标串</>
     *                      <>Mapgis字段名称:字段值</>
     * @return
     * @throws UnsupportedEncodingException
     * @throws JsonProcessingException
     */

    public Object insertFeature(LayerInfo layerInfo, List<Map> dataList) throws UnsupportedEncodingException, JsonProcessingException {
        LayerConfigVo layerConfigVo = layerConfigService.getLayerConfig();
        String ip = layerConfigVo.getMapInterFace().getServerIp();
        String port = layerConfigVo.getMapInterFace().getServerPort();
        String url = "http://" + ip + ":" + port + "/igs/rest/mrfs/docs/" + layerInfo.getDocName() + "/0/" + layerInfo.getLayerIndex() + "/addFeatures?f=json";
        if (StringUtils.isNotBlank(layerInfo.getGdbpUrl())) {
            url = "http://" + ip + ":" + port + "/igs/rest/mrfs/layer/addFeatures?f=json&gdbp=" + URLEncoder.encode(layerInfo.getGdbpUrl(), "UTF-8");
        }
        Map<String, Object> params = buildParams(layerInfo, dataList);
        String requestBody = objectMapper.writeValueAsString(params);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.TEXT_PLAIN);
        HttpEntity httpEntity = new HttpEntity(requestBody, httpHeaders);
//        ResponseEntity responseEntity = restTemplate.postForEntity(url, httpEntity, String.class);
        String result = restTemplate.postForObject(url, httpEntity, String.class);
//        if (responseEntity.getStatusCodeValue() == 200) {
//            return responseEntity.getBody();
//        }
        return result;
    }

    /**
     * 删除图元
     *
     * @param layerInfo 图层信息
     * @param params    删除参数
     *                  1、objectIds:要素的OID值 多个objectIds间以“,”分隔
     *                  (gdbp类型时 各个图层的objectIds间以“;”分隔。
     *                  示例:objectIds=1,2;2,8;10,11 示例解析：删除第一个图层的ObjectID为1,2的要素、第二个图层的ObjectID为2,8的要素，以及第三个图层的ObjectID为10,11的要素 )
     *                  2、Where 条件（objectIds有值时Where不生效）
     * @return
     * @throws JsonProcessingException
     */
    public Object deleteFeature(LayerInfo layerInfo, Map<String, Object> params) throws JsonProcessingException, UnsupportedEncodingException {
        if (params.isEmpty() || params.size() == 0) {
            throw new BusinessRuntimeException("删除图元参数不能为空");
        }
        LayerConfigVo layerConfigVo = layerConfigService.getLayerConfig();
        String ip = layerConfigVo.getMapInterFace().getServerIp();
        String port = layerConfigVo.getMapInterFace().getServerPort();
        String url = "http://" + ip + ":" + port + "/igs/rest/mrfs/docs/" + layerInfo.getDocName() + "/0/" + layerInfo.getLayerIndex() + "/deleteFeatures?f=json";
        if (StringUtils.isNotBlank(layerInfo.getGdbpUrl())) {
            url = "http://" + ip + ":" + port + "/igs/rest/mrfs/layer/deleteFeatures?f=json&gdbp=" + URLEncoder.encode(layerInfo.getGdbpUrl(), "UTF-8");
        }
        HttpHeaders httpHeaders = new HttpHeaders();
        String requestBody = objectMapper.writeValueAsString(params);
        httpHeaders.setContentType(MediaType.TEXT_PLAIN);
        HttpEntity httpEntity = new HttpEntity(requestBody, httpHeaders);
        String result = restTemplate.postForObject(url, httpEntity, String.class);
        return result;
    }


    /**
     * 更新图元信息
     *
     * @param layerInfo
     * @param dataList  map <>coordinates:坐标串</>
     *                  <>Mapgis字段名称:字段值</>
     * @return
     * @throws JsonProcessingException
     * @throws UnsupportedEncodingException
     */
    public Object updateFeature(LayerInfo layerInfo, List<Map> dataList) throws JsonProcessingException, UnsupportedEncodingException {
        LayerConfigVo layerConfigVo = layerConfigService.getLayerConfig();
        String ip = layerConfigVo.getMapInterFace().getServerIp();
        String port = layerConfigVo.getMapInterFace().getServerPort();
        String url = "http://" + ip + ":" + port + "/igs/rest/mrfs/docs/" + layerInfo.getDocName() + "/0/" + layerInfo.getLayerIndex() + "/updateFeatures?f=json";
        if (StringUtils.isNotBlank(layerInfo.getGdbpUrl())) {
            url = "http://" + ip + ":" + port + "/igs/rest/mrfs/layer/updateFeatures?f=json&gdbp=" + URLEncoder.encode(layerInfo.getGdbpUrl(), "UTF-8");
        }

        Map<String, Object> params = buildParams(layerInfo, dataList);
        HttpHeaders httpHeaders = new HttpHeaders();
        String requestBody = objectMapper.writeValueAsString(params);
        httpHeaders.setContentType(MediaType.TEXT_PLAIN);
        HttpEntity httpEntity = new HttpEntity(requestBody, httpHeaders);
        String result = restTemplate.postForObject(url, httpEntity, String.class);
        return result;
    }

    public Map<String, Object> buildParams(LayerInfo layerInfo, List<Map> dataList) {

        Map<String, Object> params = new LinkedHashMap<>();
        Map<String, Object> attStruct = new LinkedHashMap<>();
        List<String> fldName = new ArrayList<>();
        List<String> fldType = new ArrayList<>();
        List<Object> sFEleArray = new ArrayList<>();

        Object[] propertiesList = layerInfo.getProperties();
        for (Object o : propertiesList) {
            Map<String, String> properties = (Map<String, String>) o;
            String field = properties.get("field");
            String name = properties.get("name");
            String fieldType = properties.get("fieldType");
            if (StringUtils.isBlank(field) || StringUtils.isBlank(name) || StringUtils.isBlank(fieldType)) {
                continue;
            }
            if ("mpArea".equals(field) || "mpPerimeter".equals(field) || "mpLayer".equals(field)) {
                continue;
            }
            fldName.add(name.split(",")[0]);
            fldType.add(fieldType);
        }

        attStruct.put("FldName", fldName);
        attStruct.put("FldNumber", fldName.size());
        attStruct.put("FldType", fldType);

        for (Map data : dataList) {
            List<Object> attValue = new ArrayList<>();
            Map sfele = new LinkedHashMap();
            Map<String, Object> fGeom = new LinkedHashMap<>();
            List<Object> pntGeom = null;
            List<Object> linGeom = null;
            List<Object> regGeom = null;
            List<Object> rings = null;
            String coordinates = (String) data.get("coordinates");
            if (StringUtils.isNotBlank(coordinates)) {
                String[] coordinateList = coordinates.split("\\*");
                for (String coordinate : coordinateList) {
                    List<Object> dots = new ArrayList<>();
                    Map arc = new LinkedHashMap();
                    arc.put("Dots", dots);

                    List arcs = new ArrayList();
                    arcs.add(arc);
                    String[] points = coordinate.split(" ");
                    try {
                        for (String pointStr : points) {
                            pointStr = pointStr.trim();
                            if (pointStr.length() == 0) {
                                continue;
                            }
                            Map point = new LinkedHashMap(2);
                            String[] list = pointStr.split(",");
                            String x = list[0];
                            String y = list[1];
                            point.put("x", x.trim());
                            point.put("y", y.trim());
                            dots.add(point);
                        }
                    } catch (Exception e) {
                        throw new ServiceRuntimeException(e.toString());
                    }

                    // 点要素
                    if (points.length == 1) {

                    }
                    // 线要素
                    else if (!points[0].equals(points[points.length - 1])) {
                        if (linGeom == null) {
                            linGeom = new ArrayList<>();
                        }
                        Map line = new LinkedHashMap();
                        line.put("Arcs", arcs);
                        Map geom = new LinkedHashMap();
                        geom.put("Line", line);
                        linGeom.add(geom);
                    }
                    // 面要素
                    else if (points[0].equals(points[points.length - 1])) {
                        if (regGeom == null) {
                            regGeom = new ArrayList<>();
                        }
                        if (rings == null) {
                            rings = new ArrayList<>();
                            Map geom = new LinkedHashMap();
                            geom.put("Rings", rings);
                            regGeom.add(geom);
                        }
                        Map ring = new LinkedHashMap();
                        ring.put("Arcs", arcs);
                        rings.add(ring);
                    }
                }
            }
            if (pntGeom != null) {
                fGeom.put("PntGeom", pntGeom);
            }
            if (linGeom != null) {
                fGeom.put("LinGeom", linGeom);
            }
            if (regGeom != null) {
                fGeom.put("RegGeom", regGeom);
            }
            for (int i = 0; i < fldName.size(); i++) {
                String name = fldName.get(i);
                String type = fldType.get(i);
                Object value = data.get(name);
                if (value != null) {
                    switch (type) {
                        case "string":
                            value = value.toString();
                            break;
                        case "double":
                            value = Double.valueOf(value.toString().trim());
                            break;
                        case "long":
                            value = Long.valueOf(value.toString().trim());
                            break;
                        default:
                            value = value.toString().trim();
                            break;
                    }
                }
                attValue.add(value);
            }
            sfele.put("fGeom", fGeom);
            sfele.put("ftype", pntGeom != null ? 1 : (linGeom != null ? 2 : 3));
            sfele.put("AttValue", attValue);

            Map graphicInfo = new LinkedHashMap();
            graphicInfo.put("InfoType", sfele.get("ftype"));
            sfele.put("GraphicInfo", graphicInfo);
            sFEleArray.add(sfele);
        }

        params.put("AttStruct", attStruct);
        params.put("SFEleArray", sFEleArray);
        return params;
    }
}
