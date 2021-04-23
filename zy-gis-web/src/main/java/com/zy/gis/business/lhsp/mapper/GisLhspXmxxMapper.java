package com.zy.gis.business.lhsp.mapper;

import com.zy.gis.business.lhsp.entity.GisLhspXmxx;
import com.zy.gis.business.lhsp.vo.GisLhspXmxxVo;
import com.zy.core.mvc.Page;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GisLhspXmxxMapper {

    int insert(GisLhspXmxx gisLhspXmxx);

    int update(GisLhspXmxx gisLhspXmxx);

    int updateSelective(GisLhspXmxx gisLhspXmxx);

    int delete(Long id);

    int deletes(Long[] ids);

    GisLhspXmxx getById(Long id);

    int queryCount(Page page);

    List<GisLhspXmxxVo> list(Page page);
}
