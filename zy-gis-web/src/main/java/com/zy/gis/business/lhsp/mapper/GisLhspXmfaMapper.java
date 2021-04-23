package com.zy.gis.business.lhsp.mapper;

import com.zy.gis.business.lhsp.entity.GisLhspXmfa;
import com.zy.gis.business.lhsp.vo.GisLhspXmfaVo;
import com.zy.core.mvc.Page;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GisLhspXmfaMapper {

    int insert(GisLhspXmfa gisLhspXmfa);

    int update(GisLhspXmfa gisLhspXmfa);

    int updateSelective(GisLhspXmfa gisLhspXmfa);

    int delete(Long id);

    int deletes(Long[] ids);

    GisLhspXmfa getById(Long id);

    int queryCount(Page page);

    List<GisLhspXmfaVo> list(Page page);
}
