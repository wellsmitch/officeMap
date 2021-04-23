package com.zy.dzzw.gis.event;

import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.listener.LayerSubjectListener;
import com.zy.dzzw.gis.service.SubjectRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SubjectRoleEvent implements LayerSubjectListener {

    @Autowired
    private SubjectRoleService subjectRoleService;

    @Override
    public void remove(SubjectInfo subjectInfo) {
        subjectRoleService.removeBySubjectCode(subjectInfo.getCode());
    }
}
