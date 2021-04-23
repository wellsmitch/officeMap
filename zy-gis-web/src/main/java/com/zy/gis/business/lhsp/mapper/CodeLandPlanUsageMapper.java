package com.zy.gis.business.lhsp.mapper;

import com.zy.core.mvc.Page;
import com.zy.gis.business.lhsp.entity.CodeLandPlanUsage;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CodeLandPlanUsageMapper {

    List<CodeLandPlanUsage> list(Page<CodeLandPlanUsage> page);
}
