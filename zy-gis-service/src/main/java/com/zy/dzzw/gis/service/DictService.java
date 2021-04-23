package com.zy.dzzw.gis.service;


import com.zy.dzzw.gis.bo.LndDatadictionary;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 图层属性转换类
 * @author Administrator
 * @date 2021/04/02 15:34
 **/

@Service
public class DictService {

    @Autowired(required = false)
    @Qualifier("mpDbMasterJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    private Map<String, List<LndDatadictionary>> dictMap = new HashMap<>(256);

    @PostConstruct
    public void init() {
        if (jdbcTemplate != null && jdbcTemplate.getDataSource() != null) {
            List<LndDatadictionary> lndDatadictionaryList = jdbcTemplate.query("select id,代码名称 as name,代码类型 as type,代码 as code,备注 as mark,专题描述 as description,专题简称 as ztjc from mpdbmaster.lnd_datadictionary", new BeanPropertyRowMapper<>(LndDatadictionary.class));
            this.dictMap = lndDatadictionaryList.stream().collect(Collectors.groupingBy(LndDatadictionary::getZtjc));
        }
    }

    public List<Map<String, Object>> getNameList(String ztjc, List<Map<String, Object>> featureList) {

        List<LndDatadictionary> lndDatadictionaryList = this.dictMap.get(ztjc);
        if (lndDatadictionaryList != null && lndDatadictionaryList.size() > 0) {
            Map<String, List<LndDatadictionary>> map = lndDatadictionaryList.stream().collect(Collectors.groupingBy(LndDatadictionary::getType));
            if (map != null && map.size() > 0) {

                featureList.forEach(feature -> {
                    featurePropTranslate(map, feature);
                });
            }
        }
        return featureList;
    }

    private void featurePropTranslate(Map<String, List<LndDatadictionary>> map, Map<String, Object> feature) {
        feature.forEach((k, v) -> {
            if (!(v instanceof String)) {
                return;
            }
            String value = v.toString();
            if (StringUtils.isBlank(value)) {
                return;
            }
            List<LndDatadictionary> lndDatadictionaryList = map.get(k);
            if (lndDatadictionaryList == null || lndDatadictionaryList.size() == 0) {
                return;
            }
            for (LndDatadictionary lndDatadictionary : lndDatadictionaryList) {
                if (v.equals(lndDatadictionary.getCode())) {
                    feature.put(k, lndDatadictionary.getName());
                }
            }
        });
    }
}
