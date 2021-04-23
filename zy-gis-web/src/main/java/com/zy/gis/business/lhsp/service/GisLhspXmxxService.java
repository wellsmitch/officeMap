package com.zy.gis.business.lhsp.service;

import com.zy.core.mvc.Page;
import com.zy.core.util.SnowFlake;
import com.zy.gis.business.lhsp.entity.GisLhspXmxx;
import com.zy.gis.business.lhsp.mapper.GisLhspXmxxMapper;
import com.zy.gis.business.lhsp.vo.GisLhspXmfaVo;
import com.zy.gis.business.lhsp.vo.GisLhspXmxxVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class GisLhspXmxxService {

    @Resource(name = "busiIdGenerator")
    SnowFlake snowFlake;

    @Resource
    private GisLhspXmxxMapper gisLhspXmxxMapper;

    @Resource
    private GisLhspXmfaService gisLhspXmfaService;

    public List<GisLhspXmxxVo> list(Page<GisLhspXmxxVo> page) {
        return gisLhspXmxxMapper.list(page);
    }

    public List<GisLhspXmxxVo> list(GisLhspXmxxVo gisLhspXmxxVo) {
        Page<GisLhspXmxxVo> page = new Page<>();
        page.setPagingFlag(false);
        page.setParams(gisLhspXmxxVo);
        return list(page);
    }

    public GisLhspXmxxVo findById(Long id) {
        GisLhspXmxxVo gisLhspXmxxVo = new GisLhspXmxxVo();
        gisLhspXmxxVo.setId(id);
        return findOne(gisLhspXmxxVo);
    }

    public GisLhspXmxxVo findOne(GisLhspXmxxVo gisLhspXmxxVo) {
        return list(gisLhspXmxxVo).stream().findFirst().orElse(null);
    }

    @Transactional
    public int save(GisLhspXmxx gisLhspXmxx) {
        if (gisLhspXmxx.getId() == null) {
            gisLhspXmxx.setId(snowFlake.nextId());
        }
        gisLhspXmxx.setCreateTime(new Date());
        gisLhspXmxx.setModifyTime(new Date());
        gisLhspXmxx.setCreateUser(gisLhspXmxx.getModifyUser());
        gisLhspXmxx.setStatus(0L);
        int count = gisLhspXmxxMapper.insert(gisLhspXmxx);
        return count;
    }

    @Transactional
    public int update(GisLhspXmxx gisLhspXmxx) {
        gisLhspXmxx.setModifyTime(new Date());
        return gisLhspXmxxMapper.updateSelective(gisLhspXmxx);
    }

    @Transactional
    public int saveOrUpdate(GisLhspXmxx gisLhspXmxx) {
        if (gisLhspXmxx.getId() == null) {
            return save(gisLhspXmxx);
        } else {
            return update(gisLhspXmxx);
        }
    }

    @Transactional
    public Integer delete(Long id) {
        GisLhspXmfaVo gisLhspXmfaVo = new GisLhspXmfaVo();
        gisLhspXmfaVo.setLhspXmxxId(id);
        gisLhspXmfaService.list(gisLhspXmfaVo).forEach(vo -> {
            gisLhspXmfaService.delete(vo.getId());
        });
        return gisLhspXmxxMapper.delete(id);
    }
}
