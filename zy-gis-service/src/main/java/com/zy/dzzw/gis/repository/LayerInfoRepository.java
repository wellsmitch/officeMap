package com.zy.dzzw.gis.repository;

import com.zy.dzzw.gis.entity.LayerInfo;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

/**
 * 图层库
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:38
 */
@Repository
public class LayerInfoRepository extends TreeRepository<LayerInfo> {

    public boolean existsByLayer(String layer) {
        return this.exists(new Query().addCriteria(Criteria.where("layer").is(layer)));
    }

    public LayerInfo findByLayer(String layer) {
        return this.findOne(new Query().addCriteria(Criteria.where("layer").is(layer)));
    }
}
