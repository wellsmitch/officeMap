package com.zy.dzzw.gis.event;

import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerProperty;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.listener.LayerInfoListener;
import com.zy.dzzw.gis.service.SubjectInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LayerSubjectEvent implements LayerInfoListener {

    @Autowired
    private SubjectInfoService subjectInfoService;

    @Override
    public void remove(LayerInfo layerInfo) {
        List<SubjectInfo> subjectInfoList = subjectInfoService.findByLayerId(layerInfo.getId());
        subjectInfoList.forEach(layerSubject -> {
            LayerProperty layer = layerSubject.getLayerInfoList().stream().filter(layerProperty -> layerProperty.getLayerInfo().getId().equals(layerInfo.getId())).findFirst().orElse(null);
            layerSubject.getLayerInfoList().remove(layer);
            subjectInfoService.save(layerSubject);
        });
    }
}
