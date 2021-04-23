package com.zy.gis.business.xmxz.service;

import com.zy.core.util.SnowFlake;
import com.zy.gis.business.xmxz.entity.XmxzXmfa;
import com.zy.gis.business.xmxz.vo.XmxzXmfaVo;
import com.zy.gis.business.xmxz.mapper.XmxzXmfaMapper;
import com.zy.core.mvc.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Date;

@Service
public class XmxzXmfaService {

    @Resource(name = "busiIdGenerator")
    SnowFlake snowFlake;

    @Resource
    private XmxzXmfaMapper xmxzXmfaMapper;

    @Autowired
    private XmxzXmxxService xmxzXmxxService;

    public List<XmxzXmfaVo> list(Page<XmxzXmfaVo> page) {
        List<XmxzXmfaVo> list = xmxzXmfaMapper.list(page);
        list.forEach(xmxzXmfaVo -> {
            xmxzXmfaVo.setXmxx(xmxzXmxxService.findById(xmxzXmfaVo.getXmxxId()));
        });
        return list;
    }

    public List<XmxzXmfaVo> list(XmxzXmfaVo xmxzXmfaVo) {
        Page<XmxzXmfaVo> page = new Page<>();
        page.setPagingFlag(false);
        page.setParams(xmxzXmfaVo);
        return list(page);
    }

    public XmxzXmfaVo findById(Long id) {
        XmxzXmfaVo xmxzXmfaVo = new XmxzXmfaVo();
        xmxzXmfaVo.setId(id);
        return findOne(xmxzXmfaVo);
    }

    public XmxzXmfaVo findOne(XmxzXmfaVo xmxzXmfaVo) {
        return list(xmxzXmfaVo).stream().findFirst().orElse(null);
    }

    @Transactional
    public int save(XmxzXmfa xmxzXmfa) {
        if (xmxzXmfa.getId() == null) {
            xmxzXmfa.setId(snowFlake.nextId());
        }
        xmxzXmfa.setCreateTime(new Date());
        xmxzXmfa.setModifyTime(new Date());
        xmxzXmfa.setCreateUser(xmxzXmfa.getModifyUser());
        xmxzXmfa.setStatus(0L);
        int count = xmxzXmfaMapper.insert(xmxzXmfa);
        return count;
    }

    @Transactional
    public int update(XmxzXmfa xmxzXmfa) {
        xmxzXmfa.setModifyTime(new Date());
        return xmxzXmfaMapper.updateSelective(xmxzXmfa);
    }

    @Transactional
    public int saveOrUpdate(XmxzXmfa xmxzXmfa) {
        if (xmxzXmfa.getId() == null) {
            return save(xmxzXmfa);
        } else {
            return update(xmxzXmfa);
        }
    }

    @Transactional
    public Integer delete(Long id) {
        return xmxzXmfaMapper.delete(id);
    }
}
