package com.zy.dzzw.gis.vo;

import com.zy.dzzw.gis.entity.LayerRole;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

/**
 * 权限控制
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:50
 */
public class LayerRoleVo {

    /**
     * 角色id
     */
    @Field
    private String roleId;

    /**
     * 图层信息
     */
    private List<LayerRole> layerList;

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public List<LayerRole> getLayerList() {
        return layerList;
    }

    public void setLayerList(List<LayerRole> layerList) {
        this.layerList = layerList;
    }
}
