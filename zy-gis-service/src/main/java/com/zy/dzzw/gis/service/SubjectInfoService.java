package com.zy.dzzw.gis.service;

import com.zy.core.exception.ServiceRuntimeException;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.listener.LayerSubjectListener;
import com.zy.dzzw.gis.repository.SubjectInfoRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 专题服务
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:41
 */
@Service
public class SubjectInfoService {

    @Autowired
    SubjectInfoRepository subjectInfoRepository;

    @Autowired
    LayerConfigService layerConfigService;

    @Autowired(required = false)
    List<LayerSubjectListener> layerSubjectListenerList;

    /**
     * 获取所有专题信息
     *
     * @returngis/subject/findSubNodes/
     */
    @Cacheable(value = "gis:subject", key = "'gis:subject:list'")
    public List<SubjectInfo> find() {
        List<SubjectInfo> subjectInfoList = subjectInfoRepository.find(Sort.by(Sort.Order.asc("lft")));
        return subjectInfoList;
    }

    //@Cacheable(value = "gis:subject", key = "'gis:subject:list'")
    public List<SubjectInfo> findNodesExcludeByCode(String code){
        return subjectInfoRepository.findNodesByCode(code);
    }

    public SubjectInfo findById(Long id) {
        return subjectInfoRepository.findById(id);
    }

    /**
     * 查询包含layerId的专题
     *
     * @param layerId
     * @return
     */
    public List<SubjectInfo> findByLayerId(Long layerId) {
        return subjectInfoRepository.findByLayerId(layerId);
    }

    @CacheEvict(value = "gis:subject", allEntries = true)
    public SubjectInfo save(SubjectInfo subjectInfo) {
        if (StringUtils.isNotBlank(subjectInfo.getCode())) {
            SubjectInfo subjectInfo1 = subjectInfoRepository.findByCode(subjectInfo.getCode());
            if (subjectInfo1 != null && !subjectInfo1.getId().equals(subjectInfo.getId())) {
                throw new ServiceRuntimeException("专题编号已存在");
            }
        }
        return subjectInfoRepository.save(subjectInfo);
    }

    public SubjectInfo insert(SubjectInfo subjectInfo) {
        if (StringUtils.isNotBlank(subjectInfo.getCode())) {
            SubjectInfo subjectInfo1 = subjectInfoRepository.findByCode(subjectInfo.getCode());
            if (subjectInfo1 != null && !subjectInfo1.getId().equals(subjectInfo.getId())) {
                throw new ServiceRuntimeException("专题编号已存在");
            }
        }
        return subjectInfoRepository.insert(subjectInfo);
    }

    public SubjectInfo findByCode(String code) {
        SubjectInfo subjectInfo = subjectInfoRepository.findByCode(code);
        return subjectInfo;
    }

    public List<SubjectInfo> findSubNodesByCode(String code) {
        return subjectInfoRepository.findSubNodesByCode(code);
    }

    @CacheEvict(value = "gis:subject", allEntries = true)
    public void remove(Long id) {
        layerSubjectListenerList.forEach(layerSubjectListener -> layerSubjectListener.remove(findById(id)));
        subjectInfoRepository.remove(id);
    }

    @CacheEvict(value = "gis:subject", allEntries = true)
    public void move(Long sourceId, Long targetId, String type) {
        subjectInfoRepository.move(sourceId, targetId, type);
    }
}
