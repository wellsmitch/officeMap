package com.zy.dzzw.gis.entity;

import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 树形存储对象
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:54
 */
public class TreeObject extends BaseObject {

    /**
     * 上级ID
     */
    @Field
    private Long pid;

    /**
     * 层级
     */
    @Field
    private Integer lvl;

    /**
     * 左值
     */
    @Field(order = 1)
    private Integer lft;

    /**
     * 右值
     */
    @Field
    private Integer rgt;

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Integer getLvl() {
        return lvl;
    }

    public void setLvl(Integer lvl) {
        this.lvl = lvl;
    }

    public Integer getLft() {
        return lft;
    }

    public void setLft(Integer lft) {
        this.lft = lft;
    }

    public Integer getRgt() {
        return rgt;
    }

    public void setRgt(Integer rgt) {
        this.rgt = rgt;
    }
}
