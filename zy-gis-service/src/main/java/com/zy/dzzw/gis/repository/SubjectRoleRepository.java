package com.zy.dzzw.gis.repository;

import com.zy.dzzw.gis.entity.SubjectRole;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SubjectRoleRepository extends BaseRepository<SubjectRole>{


    public SubjectRole findByRoleId(String roleId, String subjectCode) {
        return findOne(new Query().addCriteria(Criteria.where("roleId").is(roleId).and("subjectCode").is(subjectCode)));
    }

    public List<SubjectRole> findByRoleId(String roleId) {
        return find(new Query().addCriteria(Criteria.where("roleId").is(roleId)));
    }

    public Long removeByRoleId(String roleId) {
        return super.delete(new Query().addCriteria(Criteria.where("roleId").is(roleId)));
    }

    public Long removeBySubjectCode(String subjectCode) {
        return super.delete(new Query().addCriteria(Criteria.where("subjectCode").is(subjectCode)));
    }
}
