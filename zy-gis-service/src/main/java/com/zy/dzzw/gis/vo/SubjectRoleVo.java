package com.zy.dzzw.gis.vo;

import com.zy.dzzw.gis.entity.SubjectRole;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

public class SubjectRoleVo {

    /**
     * 角色id
     */
    @Field
    private String roleId;

    /**
     * 专题信息
     */
    private List<SubjectRole> subjectRoleList;


    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public List<SubjectRole> getSubjectRoleList() {
        return subjectRoleList;
    }

    public void setSubjectRoleList(List<SubjectRole> subjectRoleList) {
        this.subjectRoleList = subjectRoleList;
    }
}
