package com.zy.dzzw.gis.service;

import com.zy.dzzw.gis.entity.MapAppInfo;
import com.zy.dzzw.gis.entity.MapAppInterFace;
import com.zy.dzzw.gis.entity.MapInfo;
import com.zy.dzzw.gis.entity.MapInterFace;
import com.zy.dzzw.gis.repository.MapAppInfoRepository;
import com.zy.dzzw.gis.repository.MapAppInterfaceRepository;
import com.zy.dzzw.gis.repository.MapInfoRepository;
import com.zy.dzzw.gis.repository.MapInterfaceRepository;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class LayerConfigService {


    @Autowired
    MapInfoRepository mapInfoRepository;

    @Autowired
    MapAppInfoRepository mapAppInfoRepository;

    @Autowired
    MapInterfaceRepository mapInterfaceRepository;

    @Autowired
    MapAppInterfaceRepository mapAppInterfaceRepository;

    @Cacheable(value = "gis:config", key = "'gis:config:info'")
    public LayerConfigVo getLayerConfig() {
        MapInfo mapInfo = mapInfoRepository.find().stream().findFirst().orElse(null);
        MapAppInfo mapAppInfo = mapAppInfoRepository.find().stream().findFirst().orElse(null);
        MapInterFace mapInterFace = mapInterfaceRepository.find().stream().findFirst().orElse(null);
        MapAppInterFace mapAppInterFace = mapAppInterfaceRepository.find().stream().findFirst().orElse(null);
        LayerConfigVo layerConfigVo = new LayerConfigVo();
        layerConfigVo.setMapInfo(mapInfo);
        layerConfigVo.setMapAppInfo(mapAppInfo);
        layerConfigVo.setMapInterFace(mapInterFace);
        layerConfigVo.setMapAppInterFace(mapAppInterFace);
        return layerConfigVo;
    }

    @CachePut(value = "gis:config", key = "'gis:config:info'")
    public LayerConfigVo save(LayerConfigVo layerConfigVo) {
        if (layerConfigVo.getMapInfo() != null) {
            mapInfoRepository.save(layerConfigVo.getMapInfo());
        }
        if (layerConfigVo.getMapAppInfo() != null) {
            mapAppInfoRepository.save(layerConfigVo.getMapAppInfo());
        }
        if (layerConfigVo.getMapInterFace() != null) {
            mapInterfaceRepository.save(layerConfigVo.getMapInterFace());
        }
        if(layerConfigVo.getMapAppInterFace() != null){
            mapAppInterfaceRepository.save(layerConfigVo.getMapAppInterFace());
        }
        return layerConfigVo;
    }
}
