package com.zy.gis.business.xmxz.mapper;

import com.zy.gis.business.xmxz.entity.XmxzXmxx;
import com.zy.gis.business.xmxz.vo.XmxzXmxxVo;
import com.zy.core.mvc.Page;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface XmxzXmxxMapper {

    int insert(XmxzXmxx xmxzXmxx);

    int update(XmxzXmxx xmxzXmxx);

    int updateSelective(XmxzXmxx xmxzXmxx);

    int delete(Long id);

    int deletes(Long[] ids);

    XmxzXmxx getById(Long id);

    int queryCount(Page page);

    List<XmxzXmxxVo> list(Page page);
}
