package com.zy.dzzw.gis.service;

import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerProperty;
import com.zy.dzzw.gis.entity.LayerRole;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.enums.LayerInfoEnums;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 图层业务数据服务
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:43
 */
@Service
public class LayerBusinessService {

    @Autowired
    LayerRoleService layerRoleService;

    @Autowired
    LayerInfoService layerInfoService;

    @Autowired
    SubjectInfoService subjectInfoService;

    @Autowired
    LayerConfigService layerConfigService;

    /**
     * 根据角色id，专题名称获取专题服务
     *
     * @param businessName 专题名称
     * @param roleId       角色id
     * @return
     */
    public SubjectInfo getSubject(String businessName, String roleId) {
        return getSubject(businessName, new String[]{roleId});
    }

    /**
     * 根据角色列表，专题名称获取专题服务
     *
     * @param code    专题编码
     * @param roleIds 角色id列表
     * @return
     */
    public SubjectInfo getSubject(String code, String... roleIds) {
        SubjectInfo subjectInfo = subjectInfoService.findByCode(code);
        return this.getSubject(subjectInfo, roleIds);
    }

    /**
     * 专题图层权限过滤
     *
     * @param subjectInfo
     * @param roleIds
     * @return
     */
    public SubjectInfo getSubject(SubjectInfo subjectInfo, String... roleIds) {
        LayerConfigVo configVo = layerConfigService.getLayerConfig();
        subjectInfo.setMapInfo(configVo.getMapInfo());
        subjectInfo.setMapInterFace(configVo.getMapInterFace());
        List<LayerRole> layerRoleList = layerRoleService.findByRoleIds(Arrays.asList(roleIds));
        List<LayerRole> childLayerRoleList = new ArrayList<>(256);
        layerRoleList.forEach(layerRole -> {
            LayerInfo layerInfo = layerRole.getLayerInfo();
            // 查询目录下的子节点数据
            if (LayerInfoEnums.Type.classify.getCode().equals(layerInfo.getType())) {
                if (layerInfo.getRgt() - layerInfo.getLft() > 2) {
                    List<LayerInfo> layerInfos = layerInfoService.findChildren(layerInfo);
                    layerInfos.forEach(layerInfo1 -> {
                        LayerRole role = new LayerRole();
                        role.setLayerId(layerInfo1.getId());
                        role.setLayerInfo(layerInfo1);
                        role.setRoleId(layerRole.getRoleId());
                        role.setProperty(layerRole.getProperty());
                        childLayerRoleList.add(role);
                    });
                }
            }
        });

        layerRoleList.addAll(childLayerRoleList);

        Map<Long, LayerRole> layerRoleMap = layerRoleList.stream().collect(Collectors.toMap(x -> x.getLayerInfo().getId(), Function.identity(), (v1, v2) -> v2));
        // 权限过滤，只返回
        subjectInfo.setLayerInfoList(subjectInfo.getLayerInfoList().stream().filter(layerProperty -> {
            if (layerProperty.getLayerInfo() == null) {
                return false;
            }
            Long id = layerProperty.getLayerInfo().getId();
            LayerRole l = layerRoleMap.get(id);
            if (l != null && LayerInfoEnums.Type.layer.getCode().equals(l.getLayerInfo().getType())) {
                if (layerProperty.getProperty() == null) {
                    layerProperty.setProperty(new HashMap<>());
                }
                if (l.getProperty() != null) {
                    layerProperty.getProperty().putAll(l.getProperty());
                }
                return true;
            }
            return false;
        }).collect(Collectors.toList()));

        // 返回带图层目录结果
        return this.setCatalog(subjectInfo);
    }

    /**
     * 设置目录
     *
     * @param subjectInfo
     * @return
     */
    private SubjectInfo setCatalog(SubjectInfo subjectInfo) {
        Map<Long, LayerProperty> parentLayer = new LinkedHashMap<>();
        subjectInfo.getLayerInfoList().forEach(layerProperty -> {
            if (parentLayer.containsKey(layerProperty.getLayerInfo().getPid())) {
                return;
            }
            // 查找图层上级目录
            List<LayerInfo> parentList = layerInfoService.findParent(layerProperty.getLayerInfo());
            parentList.forEach(layerInfo -> {
                if (layerInfo.getPid() != 0) {
                    // 图层属性信息
                    Map<String, Object> childProperty = layerProperty.getProperty();
                    // 目录属性信息
                    Map<String, Object> parentProperty = Optional.ofNullable(parentLayer.get(layerInfo.getId())).map(a -> a.getProperty()).orElse(null);
                    Map<String, Object> property = parentProperty;
                    if (parentProperty == null) {
                        property = childProperty;
                    } else {
                        childProperty.forEach((k, v) -> {
                            if (v instanceof Boolean) {
                                if (Boolean.TRUE.equals(parentProperty.get(k)) || Boolean.TRUE.equals(v)) {
                                    parentProperty.put(k, true);
                                } else {
                                    parentProperty.put(k, false);
                                }
                            }
                        });
                    }
                    // 将上级目录添加到专题图层中
                    LayerProperty parentLayerProperty = new LayerProperty();
                    parentLayerProperty.setLayerInfo(layerInfo);
                    parentLayerProperty.setProperty(property);
                    parentLayer.put(layerInfo.getId(), parentLayerProperty);
                }
            });
        });
        subjectInfo.getLayerInfoList().addAll(parentLayer.values());
        return subjectInfo;
    }
}
