package com.zy.dzzw.gis.repository;

import com.zy.dzzw.gis.entity.SubjectInfo;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 专题库
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:39
 */
@Repository
public class SubjectInfoRepository extends TreeRepository<SubjectInfo> {

    public SubjectInfo findByCode(String code) {
        return findOne(new Query().addCriteria(Criteria.where("code").is(code)));
    }

    public boolean existsByCode(String code) {
        return this.exists(new Query().addCriteria(Criteria.where("code").is(code)));
    }

    public List<SubjectInfo> findByLayerId(Long layerId) {
        return find(new Query().addCriteria(Criteria.where("layerInfoList.layerInfo").is(layerId)));
    }

    public List<SubjectInfo> findNodesByCode(String code) {
        Query query = new Query();
        query.fields().exclude("layerInfoList");
        query.addCriteria(Criteria.where("code").is(code));
        SubjectInfo t = findOne(query);
        Integer lft = t.getLft();
        Integer rgt = t.getRgt();
        Query queryNode = new Query();
        queryNode.fields().exclude("layerInfoList");
        queryNode.addCriteria(Criteria.where("lft").gte(lft).lte(rgt)).with(Sort.by(Sort.Order.asc("lft")));
        return find(queryNode);
    }
}
