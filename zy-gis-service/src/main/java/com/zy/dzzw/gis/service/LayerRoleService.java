package com.zy.dzzw.gis.service;

import com.zy.core.cache.RedisCacheManager;
import com.zy.core.cache.TopicConstants;
import com.zy.dzzw.gis.entity.LayerRole;
import com.zy.dzzw.gis.repository.LayerRoleRepository;
import com.zy.dzzw.gis.vo.LayerRoleVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * 图层权限服务
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:42
 */
@Service
public class LayerRoleService {

    @Autowired
    LayerRoleRepository layerRoleRepository;

    @Autowired(required = false)
    RedisCacheManager redisCacheManager;

    public List<LayerRole> find() {
        return layerRoleRepository.find();
    }

    public List<LayerRole> findByRoleId(String roleId) {
        return layerRoleRepository.findByRoleId(roleId);
    }

    public List<LayerRole> findByRoleIds(List<String> roleIds) {
        return layerRoleRepository.findByRoleIds(roleIds);
    }

    public LayerRoleVo save(LayerRoleVo layerRoleVo) {
        layerRoleRepository.removeByRoleId(layerRoleVo.getRoleId());
        layerRoleVo.getLayerList().forEach(layerRole -> layerRoleRepository.save(layerRole));
        if (redisCacheManager != null) {
            this.redisCacheManager.convertAndSend(new TopicConstants() {
                public String getTopic() {
                    return "layer_role";
                }
            }, "change");
        }
        return layerRoleVo;
    }

    public List<LayerRole> findByLayerId(Long layerId) {
        return layerRoleRepository.findByLayerId(layerId);
    }

    public List<LayerRole> findByRoleIdAndLayerIdList(String roleId, List<Long> layerIdList) {
        return findByRoleIdAndLayerIdList(Arrays.asList(roleId), layerIdList);
    }

    public List<LayerRole> findByRoleIdAndLayerIdList(List<String> roleIdList, List<Long> layerIdList) {
        return layerRoleRepository.findByRoleIdAndLayerIdList(roleIdList, layerIdList);
    }

    public long remove(LayerRole layerRole) {
        return layerRoleRepository.delete(layerRole);
    }

    public long removeByLayerId(Long layerId) {
        return layerRoleRepository.removeByLayerId(layerId);
    }
}
