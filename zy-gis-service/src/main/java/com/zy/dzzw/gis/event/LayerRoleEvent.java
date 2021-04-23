package com.zy.dzzw.gis.event;

import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.listener.LayerInfoListener;
import com.zy.dzzw.gis.service.LayerRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LayerRoleEvent implements LayerInfoListener {

    @Autowired
    LayerRoleService layerRoleService;

    @Override
    public void remove(LayerInfo layerInfo) {
        layerRoleService.removeByLayerId(layerInfo.getId());
    }
}
