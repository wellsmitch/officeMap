package com.zy.dzzw.gis.service;

import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.util.SnowFlake;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.MapInterFace;
import com.zy.dzzw.gis.vo.IntersectionAnalysisVo;
import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.relation.Condition;
import com.zy.gis.model.layer.Layer;
import com.zy.gis.model.layer.MapGisLayer;
import com.zy.gis.model.layer.WfsLayer;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 分析服务
 */
@Service
public class AnalysisService {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    LayerConfigService layerConfigService;

    @Autowired
    LayerInfoService layerInfoService;

    SnowFlake snowFlake = new SnowFlake(0, 0);

    /**
     * 相交分析
     */
    public Map<String, Object> intersectionAnalysis(LayerInfo layerInfo, Geometry searchGeometry) throws Exception {
        return intersectionAnalysis(layerInfo, Arrays.asList(new Geometry[]{searchGeometry}));
    }

    /**
     * 相交分析
     */
    public Map<String, Object> intersectionAnalysis(LayerInfo layerInfo, List<Geometry> searchGeometries) throws Exception {
        List<Geometry> analysisGeometries = intersectionSearch(layerInfo, searchGeometries);
        Long bid = insertResult(layerInfo, analysisGeometries);
        Map<String, Object> resultMap = resultAnalysis(layerInfo, bid);
        resultMap.put("analysisGeometries", analysisGeometries);
        analysisGeometries.forEach(geometry -> geometry.remove("id").remove("bid").remove("analysis_area").remove("analysis_length").remove("analysis_geom_coordinates"));
        return resultMap;
    }

    public List<Map<String, Object>> intersectionAnalysis(IntersectionAnalysisVo intersectionAnalysisVo) throws Exception {
//        try {
//
//        } catch (Exception e) {
//            throw e;
//        }
        List<Long> layerInfoIds = intersectionAnalysisVo.getLayerInfoIds();
        Map<String, LayerInfo> layerInfoMap = new HashMap<>();
        Map<LayerInfo, List<Geometry>> group = new LinkedHashMap<>();
        Map<LayerInfo, Long> bidMaps = new HashMap<>();
        for (Long layerInfoId : layerInfoIds) {
            LayerInfo layerInfo = layerInfoService.findById(layerInfoId);
            layerInfo = layerInfo.clone();
            LayerInfo analysisLayer = null;
            if (StringUtils.isNoneBlank(layerInfo.getAnalysisResultTable(), layerInfo.getAnalysisSqlTemplate())) {
                analysisLayer = layerInfo;
            } else {
                if (StringUtils.isBlank(layerInfo.getAnalysisResultTable()) || StringUtils.isBlank(layerInfo.getAnalysisSqlTemplate())) {
                    List<LayerInfo> parentLayerInfos = layerInfoService.findParent(layerInfoId);
                    for (int i = parentLayerInfos.size() - 1; i >= 0; i--) {
                        LayerInfo parent = parentLayerInfos.get(i);
                        if (StringUtils.isNoneBlank(parent.getAnalysisResultTable(), parent.getAnalysisSqlTemplate())) {
                            analysisLayer = parent;
                            break;
                        }
                    }
                }
            }

            if (analysisLayer == null) {
                List<Geometry> analysisGeometries = intersectionSearch(snowFlake.nextId(), layerInfo, intersectionAnalysisVo.getGeometries());
                group.put(layerInfo, analysisGeometries);
                continue;
//                throw new ServiceRuntimeException(layerInfo.getName() + "" + layerInfo.getLayer() + "：叠加分析配置不存在");
            }
            layerInfo.setAnalysisResultTable(analysisLayer.getAnalysisResultTable());
            String key = layerInfo.getAnalysisResultTable() + layerInfo.getAnalysisSqlTemplate();
            LayerInfo info = layerInfoMap.get(key);
            if (info == null) {
                info = analysisLayer;
                layerInfoMap.put(key, info);
                group.put(analysisLayer, new ArrayList<>());
                bidMaps.put(analysisLayer, snowFlake.nextId());
            }
            // 插入分析图元数据
            List<Geometry> analysisGeometries = intersectionSearch(bidMaps.get(info), layerInfo, intersectionAnalysisVo.getGeometries());
            insertResult(layerInfo, analysisGeometries);
            group.get(info).addAll(analysisGeometries);
        }

        List<Map<String, Object>> allResults = new ArrayList<>();
        for (LayerInfo layerInfo : group.keySet()) {
            Map<String, Object> resultMap = new LinkedHashMap<>();
            if (StringUtils.isNoneBlank(layerInfo.getAnalysisResultTable(), layerInfo.getAnalysisSqlTemplate())) {
                Map<String, Object> resultAnalysis = resultAnalysis(layerInfo, bidMaps.get(layerInfo));
                resultMap.putAll(resultAnalysis);
            }
            resultMap.put("analysisGeometries", group.get(layerInfo));
            group.get(layerInfo).forEach(geometry -> geometry.remove("id").remove("bid").remove("analysis_area").remove("analysis_length").remove("analysis_geom_coordinates"));
            allResults.add(resultMap);
        }
        return allResults;
    }

    private List<Geometry> intersectionSearch(LayerInfo layerInfo, List<Geometry> searchGeometries) throws Exception {
        return intersectionSearch(snowFlake.nextId(), layerInfo, searchGeometries);
    }

    /**
     * 相交查询
     *
     * @param layerInfo
     * @param searchGeometries
     * @return
     * @throws IOException
     */
    private List<Geometry> intersectionSearch(Long bid, LayerInfo layerInfo, List<Geometry> searchGeometries) throws Exception {
        Layer layer = null;
        MapInterFace mapInterFace = layerConfigService.getLayerConfig().getMapInterFace();
        if (StringUtils.isNotBlank(layerInfo.getWfsUrl())) {
            layer = new WfsLayer("http://" + mapInterFace.getServerIp() + ":" + mapInterFace.getServerPort() + layerInfo.getWfsUrl().replaceFirst("/mapgis", ""));
        } else if (StringUtils.isNotBlank(layerInfo.getGdbpUrl())) {
            layer = new MapGisLayer(mapInterFace.getServerIp(), Integer.valueOf(mapInterFace.getServerPort()), layerInfo.getGdbpUrl(), layerInfo.getExternalWatchSqlTemplate());
        } else if (StringUtils.isNoneBlank(layerInfo.getDocName(), layerInfo.getLayerIndex())) {
            layer = new MapGisLayer(mapInterFace.getServerIp(), Integer.valueOf(mapInterFace.getServerPort()), layerInfo.getDocName(), layerInfo.getLayerIndex(), layerInfo.getExternalWatchSqlTemplate());
        } else {
            throw new ServiceRuntimeException(layerInfo.getLayer() + "：图层查询参数未找到");
        }
        layer.setJdbcTemplate(jdbcTemplate);
        layer.setProperties(layerInfo.getProperties());
        List<Geometry> analysisGeometries = new ArrayList<>();
        for (Geometry searchGeometry : searchGeometries) {
            Condition condition = new Condition();
            condition.setGeometry(searchGeometry);
            List<Geometry> queryGeometries = layer.query(condition);
            for (Geometry geometry : queryGeometries) {
                List<Geometry> intersectionResults = geometry.intersection(searchGeometry);
                for (Geometry intersectionResult : intersectionResults) {
                    intersectionResult.putAll(geometry);
                    intersectionResult.put("id", snowFlake.nextId());
                    intersectionResult.put("bid", bid);
                    intersectionResult.put("analysis_area", intersectionResult.getArea());
                    intersectionResult.put("analysis_length", intersectionResult.getLength());
                    intersectionResult.put("analysis_geom_coordinates", intersectionResult.getPosition().toString());
                    intersectionResult.setLayerInfoId(layerInfo.getId());
                    analysisGeometries.add(intersectionResult);
                }
            }
        }
        return analysisGeometries;
    }

    /**
     * 结果分析
     *
     * @param layerInfo
     * @param bid
     * @return
     */
    private Map<String, Object> resultAnalysis(LayerInfo layerInfo, Long bid) {
        Map<String, Object> param = new HashMap<>();
        param.put("bid", bid);
        List<Map<String, Object>> trees = getTreeSql(layerInfo);
        List<Map<String, Object>> analysisResult = sqlAnalysis(trees, param);
        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("bid", bid);
        resultMap.put("analysisLayerInfoId", layerInfo.getId());
        resultMap.put("analysisLayerInfoName", layerInfo.getName());
        resultMap.put("analysisInfoResult", analysisResult);
        return resultMap;
    }

    /**
     * 构建sql树型模板
     *
     * @param layerInfo
     * @return
     */
    private List<Map<String, Object>> getTreeSql(LayerInfo layerInfo) {
        String analysisSqlTemplate = layerInfo.getAnalysisSqlTemplate();
        String[] sqls = analysisSqlTemplate.split("\\n");
        Map[] parents = new Map[20];
        List<Map<String, Object>> trees = new ArrayList<>();
        for (int i = 0; i < sqls.length; i++) {
            String sql = sqls[i];
            Map<String, Object> m = new HashMap<>();
            int index = 0;
            while (sql.indexOf("\t", index) == index) {
                index++;
            }
            m.put("sql", sql.substring(index));
            m.put("children", new ArrayList<>());
            parents[index] = m;
            if (index == 0) {
                trees.add(m);
            } else {
                Map<String, Object> parent = parents[index - 1];
                List<Map<String, Object>> children = (List<Map<String, Object>>) parent.get("children");
                children.add(m);
            }
        }
        return trees;
    }

    /**
     * 根据sql模板分析表结果
     *
     * @param sqlDataList
     * @param param
     * @return
     */
    private List<Map<String, Object>> sqlAnalysis(List<Map<String, Object>> sqlDataList, Map<String, Object> param) {
        List<Map<String, Object>> dataResults = new ArrayList<>();
        for (Map<String, Object> m : sqlDataList) {
            List child = (List) m.get("children");
            String sql = (String) m.get("sql");

            String[] paramNames = StringUtils.substringsBetween(sql, "#{", "}");
            if (paramNames != null) {
                for (String paramName : paramNames) {
                    sql = sql.replace("#{" + paramName + "}", String.valueOf(param.get(paramName)));
                }
            }
            List<Map<String, Object>> searchResults = jdbcTemplate.queryForList(sql);
            for (Map<String, Object> searchResult : searchResults) {
                Map<String, Object> info = new LinkedHashMap<>();
                dataResults.add(info);
                Collection collection = searchResult.values();
                int mark = 1;
                // 奇数为key，偶数为value
                String key = null;
                for (Object o : collection) {
                    if (mark == 1) {
                        key = o.toString();
                    } else {
                        info.put(key, o);
                    }
                    mark = mark == 0 ? 1 : 0;
                }
                Map<String, Object> childParam = new HashMap<>(param);
                childParam.putAll(searchResult);
                info.put("children", sqlAnalysis(child, childParam));
            }
        }
        return dataResults;
    }

    /**
     * 插入叠加分析结果
     *
     * @param layerInfo
     * @param geometries
     * @return
     */
    private Long insertResult(LayerInfo layerInfo, List<Geometry> geometries) {
        this.buildTable(layerInfo);
        String analysisResultTable = layerInfo.getAnalysisResultTable();
        int count = geometries.stream().map(geometry -> {
            Set<String> fields = geometry.getFields();
            Collection<Object> values = geometry.getValues();
            List<String> employList = new ArrayList<>();
            for (int i = 0, x = values.size(); i < x; i++) {
                employList.add("?");
            }
            String columnsSql = String.join(",", fields);
            String employSql = String.join(",", employList);
            String insertSql = "insert into " + analysisResultTable + "(" + columnsSql + ") values(" + employSql + ")";
            int resultCount = jdbcTemplate.update(insertSql, values.toArray());
            return resultCount;
        }).reduce((a, b) -> a + b).orElse(0);
        Geometry geometry = geometries.stream().findFirst().orElse(null);
        if (geometry == null) {
            return snowFlake.nextId();
        }
        return Long.valueOf(geometry.get("bid").toString());
    }

    /**
     * 创建叠加分析结果表结构
     *
     * @param layerInfo
     */
    private void buildTable(LayerInfo layerInfo) {
        String checkSql = "select column_name from user_tab_columns where upper(table_name)=upper('" + layerInfo.getAnalysisResultTable() + "')";
        List<String> oldColumns = jdbcTemplate.queryForList(checkSql, String.class).stream().map(String::toUpperCase).collect(Collectors.toList());
        String tableName = layerInfo.getAnalysisResultTable();
        Object[] properties = layerInfo.getProperties();
        List<String> insertColumnSql = new ArrayList<>(properties.length);
        List<String> modifySql = new ArrayList<>(properties.length);
        List<String> commentSql = new ArrayList<>(properties.length);
        List<Object> allColumns = loadDefaultColumn();
        allColumns.addAll(Arrays.asList(properties));
        for (int i = 0, x = allColumns.size(); i < x; i++) {
            Map<String, Object> prop = (Map<String, Object>) allColumns.get(i);
            String field = (String) prop.get("field");
            String type = (String) prop.get("fieldType");
            String title = (String) prop.get("title");
            if (StringUtils.isNoneBlank(field, type)) {
                if (oldColumns.contains(field.toUpperCase())) {
                    continue;
                }
                if (type.equals("string")) {
                    insertColumnSql.add(field + "    VARCHAR2(1000)");
                    modifySql.add("alter table " + tableName + " add " + field + " VARCHAR2(1000)");
                } else if (type.equals("double")) {
                    insertColumnSql.add(field + "    NUMBER");
                    modifySql.add("alter table " + tableName + " add " + field + " NUMBER");
                } else if (type.equals("long")) {
                    insertColumnSql.add(field + "    NUMBER");
                    modifySql.add("alter table " + tableName + " add " + field + " NUMBER");
                } else if (type.equals("clob")) {
                    insertColumnSql.add(field + "    CLOB");
                    modifySql.add("alter table " + tableName + " add " + field + " CLOB");
                } else if (type.equals("datetime")) {
                    insertColumnSql.add(field + "    DATE");
                    modifySql.add("alter table " + tableName + " add " + field + " DATE");
                } else {
                    insertColumnSql.add(field + "    VARCHAR2(1000)");
                    modifySql.add("alter table " + tableName + " add " + field + " VARCHAR2(1000)");
                }
                commentSql.add("comment on column " + tableName + "." + field + " is '" + title + "'");
            }
        }
        // 创建表结构
        if (oldColumns.isEmpty()) {
            String sql = String.join(",", insertColumnSql);
            jdbcTemplate.execute("create table " + tableName + "(" + sql + ")");
            createIndex(layerInfo);
        }
        // 修改表结构
        else {
            for (String sql : modifySql) {
                jdbcTemplate.execute(sql);
            }
        }
        // 添加字段注释
        for (String sql : commentSql) {
            jdbcTemplate.execute(sql);
        }
    }

    /**
     * 加载默认列
     *
     * @return
     */
    private List<Object> loadDefaultColumn() {
        List<Object> properties = new ArrayList<>();
        Map<String, String> id = new HashMap<>();
        id.put("field", "id");
        id.put("fieldType", "long");
        id.put("title", "id");

        Map<String, String> bid = new HashMap<>();
        bid.put("field", "bid");
        bid.put("fieldType", "long");
        bid.put("title", "查询请求ID");

        Map<String, String> analysisArea = new HashMap<>();
        analysisArea.put("field", "analysis_area");
        analysisArea.put("fieldType", "long");
        analysisArea.put("title", "分析面积");

        Map<String, String> analysisLength = new HashMap<>();
        analysisLength.put("field", "analysis_length");
        analysisLength.put("fieldType", "long");
        analysisLength.put("title", "分析周长");

        Map<String, String> analysisGeomCoordinates = new HashMap<>();
        analysisGeomCoordinates.put("field", "analysis_geom_coordinates");
        analysisGeomCoordinates.put("fieldType", "clob");
        analysisGeomCoordinates.put("title", "图元坐标");

        properties.add(id);
        properties.add(bid);
        properties.add(analysisArea);
        properties.add(analysisLength);
        properties.add(analysisGeomCoordinates);

        return properties;
    }

    /**
     * 创建索引
     *
     * @param layerInfo
     */
    private void createIndex(LayerInfo layerInfo) {
        String tableName = layerInfo.getAnalysisResultTable();
        jdbcTemplate.execute("create index " + tableName + "_bid on " + tableName + " (bid)");
        jdbcTemplate.execute("create index " + tableName + "_analysis_area on " + tableName + " (analysis_area)");
        jdbcTemplate.execute("alter table " + tableName + " add constraint " + tableName + "_id primary key (ID)");
    }
}
