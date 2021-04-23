package com.zy.dzzw.gis.service;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.zy.dzzw.gis.entity.SpatialTemporalInfo;
import com.zy.dzzw.gis.repository.SpatialTemporalRepository;

@Service
public class SpatialTemporalConfigService {


    @Autowired
    SpatialTemporalRepository spatialTemporalRepository;

    public List<SpatialTemporalInfo> find(String name) {
      if(StringUtils.isBlank(name)) {
        return spatialTemporalRepository.find();
      } else {
        return spatialTemporalRepository.find(new Query().addCriteria(Criteria.where("name").regex(name + ".*")));
      }
    }

    public SpatialTemporalInfo findById(long id) {
      return spatialTemporalRepository.findById(id);
    }

    
    public SpatialTemporalInfo save(SpatialTemporalInfo spatialTemporal) {
      spatialTemporalRepository.save(spatialTemporal);
      return spatialTemporal;
    }
    
    public long remove(SpatialTemporalInfo spatialTemporal) {
      return spatialTemporalRepository.delete(spatialTemporal);
    }
}
