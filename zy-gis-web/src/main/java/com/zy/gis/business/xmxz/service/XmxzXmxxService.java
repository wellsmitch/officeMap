package com.zy.gis.business.xmxz.service;

import com.zy.core.mvc.Page;
import com.zy.core.util.SnowFlake;
import com.zy.gis.business.xmxz.entity.XmxzXmxx;
import com.zy.gis.business.xmxz.mapper.XmxzXmxxMapper;
import com.zy.gis.business.xmxz.vo.XmxzXmfaVo;
import com.zy.gis.business.xmxz.vo.XmxzXmxxVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class XmxzXmxxService {

    @Resource(name = "busiIdGenerator")
    SnowFlake snowFlake;

    @Resource
    private XmxzXmxxMapper xmxzXmxxMapper;

    @Resource
    private XmxzXmfaService xmxzXmfaService;

    public List<XmxzXmxxVo> list(Page<XmxzXmxxVo> page) {
        return xmxzXmxxMapper.list(page);
    }

    public List<XmxzXmxxVo> list(XmxzXmxxVo xmxzXmxxVo) {
        Page<XmxzXmxxVo> page = new Page<>();
        page.setPagingFlag(false);
        page.setParams(xmxzXmxxVo);
        return list(page);
    }

    public XmxzXmxxVo findById(Long id) {
        XmxzXmxxVo xmxzXmxxVo = new XmxzXmxxVo();
        xmxzXmxxVo.setId(id);
        return findOne(xmxzXmxxVo);
    }

    public XmxzXmxxVo findOne(XmxzXmxxVo xmxzXmxxVo) {
        return list(xmxzXmxxVo).stream().findFirst().orElse(null);
    }

    @Transactional
    public int save(XmxzXmxx xmxzXmxx) {
        if (xmxzXmxx.getId() == null) {
            xmxzXmxx.setId(snowFlake.nextId());
        }
        xmxzXmxx.setCreateTime(new Date());
        xmxzXmxx.setModifyTime(new Date());
        xmxzXmxx.setCreateUser(xmxzXmxx.getModifyUser());
        xmxzXmxx.setStatus(0L);
        int count = xmxzXmxxMapper.insert(xmxzXmxx);
        return count;
    }

    @Transactional
    public int update(XmxzXmxx xmxzXmxx) {
        xmxzXmxx.setModifyTime(new Date());
        return xmxzXmxxMapper.updateSelective(xmxzXmxx);
    }

    @Transactional
    public int saveOrUpdate(XmxzXmxx xmxzXmxx) {
        if (xmxzXmxx.getId() == null) {
            return save(xmxzXmxx);
        } else {
            return update(xmxzXmxx);
        }
    }

    @Transactional
    public Integer delete(Long id) {
        XmxzXmfaVo xmxzXmfaVo = new XmxzXmfaVo();
        xmxzXmfaVo.setXmxxId(id);
        xmxzXmfaService.list(xmxzXmfaVo).forEach(vo -> {
            xmxzXmfaService.delete(vo.getId());
        });
        return xmxzXmxxMapper.delete(id);
    }
}
