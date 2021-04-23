package com.zy.dzzw.gis.repository;

import com.zy.dzzw.gis.entity.TreeObject;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

/**
 * 树形库统一操作
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:25
 */
@NoRepositoryBean
public abstract class TreeRepository<T extends TreeObject> extends BaseRepository<T> {

    /**
     * 插入树型数据，自动扩容空间
     *
     * @param obj
     * @return
     */
    public T insert(T obj) {
        grow(obj);
        return super.insert(obj);
    }

    /**
     * 更新数据，不更新左值，右值，层级
     *
     * @param obj
     * @return
     */
    public T update(T obj) {
        obj.setLft(null);
        obj.setRgt(null);
        obj.setLvl(null);
        return super.update(obj);
    }

    /**
     * 节点移动
     *
     * @param sourceId 源节点ID
     * @param targetId 目标节点ID
     * @param type     移动类型
     */
    public void move(Long sourceId, Long targetId, String type) {
        T ro = this.findById(targetId);
        T co = this.findById(sourceId);
        int key;
        int lftFrom = co.getLft();
        int rgtFrom = co.getRgt();
        int lftTo;
        int lvl;
        Long parent;
        if ("prev".equals(type)) {
            lftTo = ro.getLft();
            parent = ro.getPid();
            lvl = ro.getLvl() - co.getLvl();
        } else if ("inner".equals(type)) {
            lftTo = ro.getRgt();
            parent = ro.getId();
            lvl = ro.getLvl() - co.getLvl() + 1;
        } else {
            lftTo = ro.getRgt() + 1;
            parent = ro.getPid();
            lvl = ro.getLvl() - co.getLvl();
        }
        int space = rgtFrom - lftFrom + 1;
        int diff = space;
        if (lftFrom - lftTo > 0) {
            key = lftFrom - lftTo + space;
        } else {
            diff = 0;
            key = lftFrom - lftTo;
        }
        this.grow(lftTo, space);
        this.updateMoveFrom(parent, lvl, key, lftFrom, rgtFrom, diff);
        this.updateMoveBack(lftFrom, space, diff);
    }

    /**
     * 扩容空间
     *
     * @param obj
     */
    public void grow(T obj) {
        TreeObject tree = obj;
        if (tree.getPid() == null || tree.getPid() == 0) {
            Long count = this.count();
            tree.setPid(0l);
            tree.setLvl(1);
            tree.setLft(count.intValue() * 2 + 1);
            tree.setRgt(count.intValue() * 2 + 2);
        } else {
            TreeObject parent = this.findById(tree.getPid());
            tree.setLft(parent.getRgt());
            tree.setRgt(parent.getRgt() + 1);
            tree.setLvl(parent.getLvl() + 1);
            this.grow(parent.getRgt(), 2);
        }
    }

    /**
     * 扩容空间
     *
     * @param start
     * @param space
     */
    public void grow(int start, int space) {
//        Update downUpdate = new Update();
//        downUpdate.inc("lft", space);
//        downUpdate.inc("rgt", space);
//        mongoTemplate.updateMulti(new Query().addCriteria(Criteria.where("lft").gt(start)), downUpdate, clazz);
//        Update upUpdate = new Update();
//        upUpdate.inc("rgt", space);
//        mongoTemplate.updateMulti(new Query().addCriteria(Criteria.where("lft").lte(start).and("rgt").gte(start)), upUpdate, clazz);

        List<T> list = this.find(new Query().addCriteria(new Criteria().orOperator(Criteria.where("lft").gte(start), Criteria.where("rgt").gte(start))));
        list.forEach(t -> {
            if (t.getLft() >= start) {
                t.setLft(t.getLft() + space);
            }
            t.setRgt(t.getRgt() + space);
            mongoTemplate.save(t);
        });

    }

    public void updateMoveFrom(Long parent, int lvl, int key, int lftFrom, int rgtFrom, int diff) {
//        {
//            Query query = new Query().addCriteria(Criteria.where("lft").gte(lftFrom + diff).and("rgt").lte(rgtFrom + diff));
//            Update update = new Update().inc("lft", -key).inc("rgt", -key).inc("lvl", lvl);
//            mongoTemplate.updateMulti(query, update, LayerInfo.class);
//        }
//        {
//            Query query = new Query().addCriteria(Criteria.where("lft").is(lftFrom + diff).and("rgt").lte(rgtFrom + diff));
//            Update update = new Update().inc("lft", -key).inc("rgt", -key).inc("lvl", lvl).set("pid", parent);
//            mongoTemplate.updateMulti(query, update, LayerInfo.class);
//        }

        List<T> list = this.find(new Query().addCriteria(Criteria.where("lft").gte(lftFrom + diff).and("rgt").lte(rgtFrom + diff)));
        list.forEach(t -> {
            if (t.getLft().equals(lftFrom + diff)) {
                t.setPid(parent);
            }
            t.setLft(t.getLft() - key);
            t.setRgt(t.getRgt() - key);
            t.setLvl(t.getLvl() + lvl);
            mongoTemplate.save(t);
        });
    }

    public void updateMoveBack(int lftFrom, int space, int diff) {
//        {
//            Query query = new Query().addCriteria(Criteria.where("rgt").gt(lftFrom + diff));
//            Update update = new Update().inc("lft", -space);
//            mongoTemplate.updateMulti(query, update, LayerInfo.class);
//        }
//        {
//            Query query = new Query().addCriteria(Criteria.where("lft").gt(lftFrom + diff).and("rgt").lt(lftFrom + diff));
//            Update update = new Update().inc("lft", -space).inc("rgt", -space);
//            mongoTemplate.updateMulti(query, update, LayerInfo.class);
//        }

        List<T> list = this.find(new Query().addCriteria(new Criteria().orOperator(Criteria.where("lft").gt(lftFrom + diff), Criteria.where("rgt").gt(lftFrom + diff))));
        list.forEach(t -> {
            if (t.getLft() > lftFrom + diff) {
                t.setLft(t.getLft() - space);
            }
            t.setRgt(t.getRgt() - space);
            mongoTemplate.save(t);
        });
    }

    /**
     * 删除树操作，并且缩减空间
     *
     * @param id
     */
    public void remove(Long id) {
        this.remove(this.findById(id));
    }

    /**
     * 删除树操作，并且缩减空间
     *
     * @param obj
     */
    public void remove(T obj) {
        int start = obj.getLft();
        int end = obj.getRgt();
        Query query = new Query();
        query.addCriteria(Criteria.where("lft").gte(start).and("rgt").lte(end));
        super.delete(query);
        this.grow(start, start - end - 1);
    }

    public List<T> findSubNodesByCode(String code) {
        T t = findOne(new Query().addCriteria(Criteria.where("code").is(code)));
        Integer lft = t.getLft();
        Integer rgt = t.getRgt();

        return find(new Query().addCriteria(Criteria.where("lft").gte(lft).lte(rgt)).with(Sort.by(Sort.Order.asc("lft"))));
    }

    /**
     * 获取上级节点列表
     *
     * @param id
     * @return
     */
    public List<T> findParent(Long id) {
        T t = findById(id);
        return findParent(t);
    }

    /**
     * 获取所有上级节点
     * @param t
     * @return
     */
    public List<T> findParent(T t) {
        return find(new Query().addCriteria(Criteria.where("lft").lt(t.getLft()).and("rgt").gt(t.getRgt())).with(Sort.by(Sort.Order.asc("lft"))));
    }

    /**
     * 获取所有子节点，按lft属性正序排序
     * @param id
     * @return
     */
    public List<T> findChildren(Long id) {
        T t = findById(id);
        return findChildren(t);
    }

    /**
     * 获取所有子节点，按lft属性正序排序
     * @param t
     * @return
     */
    public List<T> findChildren(T t) {
        return find(new Query().addCriteria(Criteria.where("lft").gt(t.getLft()).lt(t.getRgt())).with(Sort.by(Sort.Order.asc("lft"))));
    }

}
