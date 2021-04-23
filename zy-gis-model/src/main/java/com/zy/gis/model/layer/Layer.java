package com.zy.gis.model.layer;

import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.relation.Condition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

public abstract class Layer {

    protected String url;

    protected Object[] properties;

    protected String externalWatchSqlTemplate;

    protected JdbcTemplate jdbcTemplate;

    public abstract List<Geometry> query(Condition condition) throws Exception;

    public Set<String> getFields() {
        if (this.properties == null) {
            return null;
        }
        Set<String> fields = new LinkedHashSet<>();
        for (Object property : this.properties) {
            Map<String, String> col = (Map<String, String>) property;
            String field = col.get("field");
            String type = col.get("type");
            if (StringUtils.isBlank(field)) {
                continue;
            }
            fields.add(field);
        }
        return fields;
    }

    public String getUrl() {
        return url;
    }

    public Layer setUrl(String url) {
        this.url = url;
        return this;
    }

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    public Layer setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        return this;
    }

    public String getExternalWatchSqlTemplate() {
        return externalWatchSqlTemplate;
    }

    public Layer setExternalWatchSqlTemplate(String externalWatchSqlTemplate) {
        this.externalWatchSqlTemplate = externalWatchSqlTemplate;
        return this;
    }

    public Object[] getProperties() {
        return properties;
    }

    public Layer setProperties(Object[] properties) {
        this.properties = properties;
        return this;
    }

    protected Map<String,Object> queryExternalWatch(Map<String,Object> param){
        Map <String,Object> resultMap = null;
        if (this.jdbcTemplate != null){
            if (StringUtils.isNotEmpty(this.externalWatchSqlTemplate)){
                String[] paramNames = StringUtils.substringsBetween(this.externalWatchSqlTemplate, "#{", "}");
                Object [] args = new Object[paramNames.length];
                if (paramNames != null) {
                    for (int a = 0; a < paramNames.length; a++){
                        this.externalWatchSqlTemplate = this.externalWatchSqlTemplate.replace("#{" + paramNames[a] + "}", "?");
                        args[a] = param.get(paramNames[a]);
                    }
                }
                List<Map<String, Object>> queryList = this.jdbcTemplate.queryForList(this.externalWatchSqlTemplate,args);
                Map queryMap = queryList.stream().findFirst().orElse(null);
                if (queryMap != null){
                    resultMap = new HashMap<>(this.properties.length);
                    for (Map.Entry<String,Object> entry : param.entrySet()){
                        if (queryMap.get(entry.getKey()) != null){
                            resultMap.put(entry.getKey(),queryMap.get(entry.getKey()));
                        } else {
                            resultMap.put(entry.getKey(),entry.getValue());
                        }
                    }
                }
            }
        }
        if (resultMap == null){
            resultMap = param;
        }
        return resultMap;
    }
}
