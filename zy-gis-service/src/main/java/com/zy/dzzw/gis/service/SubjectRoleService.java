package com.zy.dzzw.gis.service;

import com.zy.dzzw.gis.entity.SubjectRole;
import com.zy.dzzw.gis.repository.SubjectRoleRepository;
import com.zy.dzzw.gis.vo.SubjectRoleVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class SubjectRoleService {

    @Autowired
    SubjectRoleRepository subjectRoleRepository;

    public SubjectRole save(SubjectRole layerRoleSubject){
        return subjectRoleRepository.save(layerRoleSubject);
    }

    public SubjectRoleVo save(SubjectRoleVo subjectRoleVo){
        subjectRoleRepository.removeByRoleId(subjectRoleVo.getRoleId());
        subjectRoleVo.getSubjectRoleList().forEach(subjectRole -> subjectRoleRepository.save(subjectRole));
        return subjectRoleVo;
    }

    public SubjectRole findByRoleId(String roleId, String subjectCode){
        return subjectRoleRepository.findByRoleId(roleId,subjectCode);
    }

    public List<SubjectRole> findByRoleId(String roleId){
        return subjectRoleRepository.findByRoleId(roleId);
    }

    public void removeBySubjectCode(String subjectCode) {
        subjectRoleRepository.removeBySubjectCode(subjectCode);
    }
}
