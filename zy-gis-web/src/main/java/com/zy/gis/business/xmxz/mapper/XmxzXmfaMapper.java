package com.zy.gis.business.xmxz.mapper;

import com.zy.gis.business.xmxz.entity.XmxzXmfa;
import com.zy.gis.business.xmxz.vo.XmxzXmfaVo;
import com.zy.core.mvc.Page;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface XmxzXmfaMapper {

    int insert(XmxzXmfa xmxzXmfa);

    int update(XmxzXmfa xmxzXmfa);

    int updateSelective(XmxzXmfa xmxzXmfa);

    int delete(Long id);

    int deletes(Long[] ids);

    XmxzXmfa getById(Long id);

    int queryCount(Page page);

    List<XmxzXmfaVo> list(Page page);
}
