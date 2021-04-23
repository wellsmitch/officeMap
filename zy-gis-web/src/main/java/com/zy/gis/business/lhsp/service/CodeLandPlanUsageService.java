package com.zy.gis.business.lhsp.service;

import com.zy.gis.business.lhsp.entity.CodeLandPlanUsage;
import com.zy.gis.business.lhsp.mapper.CodeLandPlanUsageMapper;
import com.zy.core.mvc.Page;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;


@Service
public class CodeLandPlanUsageService {

    @Resource
    private CodeLandPlanUsageMapper codeLandPlanUsageMapper;

    public List<CodeLandPlanUsage> list(Page<CodeLandPlanUsage> page) {
        return codeLandPlanUsageMapper.list(page);
    }

    public List<CodeLandPlanUsage> list(CodeLandPlanUsage codeLandPlanUsageVo) {
        Page<CodeLandPlanUsage> page = new Page<>();
        page.setPagingFlag(false);
        page.setParams(codeLandPlanUsageVo);
        return list(page);
    }
}