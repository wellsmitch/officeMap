package com.zy.dzzw.gis.repository;

import com.zy.dzzw.gis.entity.LayerRole;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 权限库
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:38
 */
@Repository
public class LayerRoleRepository extends BaseRepository<LayerRole> {

    public LayerRole save(LayerRole layerRole) {
        return this.insert(layerRole);
    }

    public long removeByRoleId(String roleId) {
        return super.delete(new Query().addCriteria(Criteria.where("roleId").is(roleId)));
    }

    public long removeByLayerId(Long layerId){
        return super.delete(new Query().addCriteria(Criteria.where("layerId").is(layerId)));
    }

    public List<LayerRole> findByRoleId(String roleId) {
        return find(new Query().addCriteria(Criteria.where("roleId").is(roleId)));
    }

    public List<LayerRole> findByRoleIds(List<String> roleIds){
        return find(new Query().addCriteria(Criteria.where("roleId").in(roleIds)));
    }

    public List<LayerRole> findByLayerId(Long layerId) {
        return find(new Query().addCriteria(Criteria.where("layerId").is(layerId)));
    }

    public List<LayerRole> findByRoleIdAndLayerIdList(List<String> roleIdList, List<Long> layerIdList) {
        return find(new Query().addCriteria(Criteria.where("roleId").in(roleIdList).and("layerId").in(layerIdList)));
    }
}
