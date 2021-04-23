package com.zy.dzzw.gis.service;

import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.dzzw.gis.entity.BaseObject;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerRole;
import com.zy.dzzw.gis.entity.TreeObject;
import com.zy.dzzw.gis.listener.LayerInfoListener;
import com.zy.dzzw.gis.repository.LayerInfoRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * 图层服务
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:42
 */
@Service
public class LayerInfoService {

    @Autowired(required = false)
    private List<LayerInfoListener> layerInfoListenerList;

    @Autowired
    LayerInfoRepository layerInfoRepository;

    @Autowired
    LayerRoleService layerRoleService;

    @Autowired(required = false)
    CommonService commonService;

    @Value("${sysId}")
    String sysId;

    //    @Cacheable(value = "gis:layer", key = "'gis:layer:list'")
    public List<LayerInfo> find() {
        return layerInfoRepository.find(Sort.by(Sort.Order.asc("lft")));
    }

    public LayerInfo findById(Long id) {
        return layerInfoRepository.findById(id);
    }


    public LayerInfo condition(LayerInfo layerInfo){
        if (StringUtils.isNotBlank(layerInfo.getLayer())) {
            LayerInfo layerInfo1 = layerInfoRepository.findByLayer(layerInfo.getLayer());
            if (layerInfo1 != null && !layerInfo1.getId().equals(layerInfo.getId())) {
                throw new ServiceRuntimeException("图层服务已存在");
            }
        }
        String fullPathName;
        if (layerInfo.getId() == null && layerInfo.getPid() != null) {
            fullPathName = this.findParent(layerInfo.getPid()).stream().map(LayerInfo::getName).collect(Collectors.joining("/"));
        } else {
            fullPathName = this.findParent(layerInfo).stream().map(LayerInfo::getName).collect(Collectors.joining("/"));
        }
        if (StringUtils.isNotBlank(fullPathName) && !fullPathName.endsWith("/")) {
            fullPathName += "/";
        }
        fullPathName += layerInfo.getName();
        layerInfo.setFullPathName(fullPathName);
        return layerInfo;
    }

    public LayerInfo insert(LayerInfo layerInfo) {
        this.condition(layerInfo);
        layerInfoRepository.insert(layerInfo);
        return layerInfo;
    }

    public LayerInfo findByLayer(String layer) {
        return layerInfoRepository.findByLayer(layer);
    }

    public LayerInfo save(LayerInfo layerInfo) {
        this.condition(layerInfo);
        layerInfoRepository.save(layerInfo);
        return layerInfo;
    }

    public void remove(Long id) {
        layerInfoListenerList.forEach(layerInfoListener -> layerInfoListener.remove(findById(id)));
        layerInfoRepository.remove(id);
    }

    public void move(Long sourceId, Long targetId, String type) {
        LayerInfo ro = layerInfoRepository.findById(targetId);
        if ("inner".equals(type) && ro.getType() == 0) {
            throw new ServiceRuntimeException("目标节点不是分类");
        }
        layerInfoRepository.move(sourceId, targetId, type);

        LayerInfo layerInfo = this.findById(sourceId);
        this.save(layerInfo);

        // 更新fullPathName
        List<LayerInfo> childrenList = this.findChildren(sourceId);
        childrenList.forEach(child -> {
            this.save(child);
        });
    }

    public List<LayerInfo> findParent(Long id) {
        return layerInfoRepository.findParent(id);
    }

    public List<LayerInfo> findParent(LayerInfo layerInfo) {
        return layerInfoRepository.findParent(layerInfo);
    }

    public List<LayerInfo> findChildren(Long id) {
        return layerInfoRepository.findChildren(id);
    }

    public List<LayerInfo> findChildren(LayerInfo layerInfo) {
        return layerInfoRepository.findChildren(layerInfo);
    }

    public List<LayerInfo> find(SysUser sysUser) {
        List<LayerInfo> resultList = new ArrayList<>(256);
        List<SysRole> roleList = commonService.getUserRoleInfo(sysId, sysUser.getUserId());
        List<String> roleIds = roleList.stream().map(sysRole -> sysRole.getOrgCode() + "_" + sysRole.getRoleId()).collect(Collectors.toList());
        // 超级管理员查看所有
        if (roleIds.contains("0_admin")) {
            return this.find();
        }
        List<LayerRole> layerRoleList = layerRoleService.findByRoleIds(roleIds);
        layerRoleList.forEach(layerRole -> {
            LayerInfo layerInfo = layerRole.getLayerInfo();
            resultList.addAll(this.findParent(layerInfo));
            resultList.add(layerInfo);
            resultList.addAll(this.findChildren(layerInfo));
        });
        return resultList.stream().filter(distinctByKey(BaseObject::getId)).sorted(Comparator.comparing(TreeObject::getLft)).collect(Collectors.toList());
    }

    private static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
        Set<Object> seen = ConcurrentHashMap.newKeySet();
        return t -> seen.add(keyExtractor.apply(t));
    }
}
