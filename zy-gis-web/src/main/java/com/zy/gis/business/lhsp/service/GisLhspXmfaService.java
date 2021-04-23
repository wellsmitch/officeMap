package com.zy.gis.business.lhsp.service;

import com.zy.common.dataform.mapper.UploadMapper;
import com.zy.core.util.SnowFlake;
import com.zy.gis.business.lhsp.entity.GisLhspXmfa;
import com.zy.gis.business.lhsp.vo.GisLhspXmfaVo;
import com.zy.gis.business.lhsp.mapper.GisLhspXmfaMapper;
import com.zy.core.mvc.Page;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Date;

@Service
public class GisLhspXmfaService {

    @Resource(name = "busiIdGenerator")
    SnowFlake snowFlake;

    @Resource
    private GisLhspXmfaMapper gisLhspXmfaMapper;

    @Resource
    private UploadMapper uploadMapper;

    public List<GisLhspXmfaVo> list(Page<GisLhspXmfaVo> page) {
        return gisLhspXmfaMapper.list(page);
    }

    public List<GisLhspXmfaVo> list(GisLhspXmfaVo gisLhspXmfaVo) {
        Page<GisLhspXmfaVo> page = new Page<>();
        page.setPagingFlag(false);
        page.setParams(gisLhspXmfaVo);
        return list(page);
    }

    public GisLhspXmfaVo findById(Long id) {
        GisLhspXmfaVo gisLhspXmfaVo = new GisLhspXmfaVo();
        gisLhspXmfaVo.setId(id);
        return findOne(gisLhspXmfaVo);
    }

    public GisLhspXmfaVo findOne(GisLhspXmfaVo gisLhspXmfaVo) {
        return list(gisLhspXmfaVo).stream().findFirst().orElse(null);
    }

    @Transactional
    public int save(GisLhspXmfa gisLhspXmfa) {
        if (gisLhspXmfa.getId() == null) {
            gisLhspXmfa.setId(snowFlake.nextId());
        }
        gisLhspXmfa.setCreateTime(new Date());
        gisLhspXmfa.setModifyTime(new Date());
        gisLhspXmfa.setCreateUser(gisLhspXmfa.getModifyUser());
        gisLhspXmfa.setStatus(0L);
        int count = gisLhspXmfaMapper.insert(gisLhspXmfa);
        if (count > 0){
            if (StringUtils.isNotBlank(gisLhspXmfa.getTmpKey())) {
                uploadMapper.insertDataUploadFileFromTemp(String.valueOf(gisLhspXmfa.getId()), gisLhspXmfa.getTmpKey());
                uploadMapper.insertDataFileFromTemp(gisLhspXmfa.getTmpKey());
                uploadMapper.deleteDataFileTmpForClean(gisLhspXmfa.getTmpKey());
            }
        }
        return count;
    }

    @Transactional
    public int update(GisLhspXmfa gisLhspXmfa) {
        gisLhspXmfa.setModifyTime(new Date());
        int index = gisLhspXmfaMapper.updateSelective(gisLhspXmfa);
        return index;
    }

    @Transactional
    public int saveOrUpdate(GisLhspXmfa gisLhspXmfa) {
        if (gisLhspXmfa.getId() == null) {
            return save(gisLhspXmfa);
        } else {
            return update(gisLhspXmfa);
        }
    }

    @Transactional
    public Integer delete(Long id) {
        return gisLhspXmfaMapper.delete(id);
    }
}
