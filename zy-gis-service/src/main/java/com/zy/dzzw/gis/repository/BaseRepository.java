package com.zy.dzzw.gis.repository;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.zy.core.util.SnowFlake;
import com.zy.dzzw.gis.entity.BaseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.repository.NoRepositoryBean;

import java.lang.reflect.ParameterizedType;
import java.util.Date;
import java.util.List;

/**
 * 数据库基本操作
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:38
 */
@NoRepositoryBean
public class BaseRepository<T extends BaseObject> {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    SnowFlake busiIdGenerator;

    protected Class clazz;

    public BaseRepository() {
        ParameterizedType pt = (ParameterizedType) this.getClass().getGenericSuperclass();
        this.clazz = (Class<T>) pt.getActualTypeArguments()[0];
    }

    /**
     * 数据保存
     *
     * @param obj
     * @return
     */
    public T save(T obj) {
        if (obj.getId() == null) {
            return this.insert(obj);
        }
        return update(obj);
    }

    /**
     * 数据插入
     *
     * @param obj
     * @return
     */
    public T insert(T obj) {
        if (obj.getId() == null){
            obj.setId(busiIdGenerator.nextId());
        }
        obj.setModifyTime(new Date());
        obj.setCreateTime(new Date());
        obj.setCreateUser(obj.getModifyUser());
        return mongoTemplate.insert(obj);
    }

    /**
     * 数据更新（null值不更新）
     *
     * @param obj
     * @return
     */
    public T update(T obj) {
        obj.setModifyTime(new Date());
        BasicDBObject dbDoc = new BasicDBObject();
        mongoTemplate.getConverter().write(obj, dbDoc);
        Update update = fromDBObjectExcludeNullFields(dbDoc);
        mongoTemplate.updateFirst(new Query().addCriteria(Criteria.where("id").is(obj.getId())), update, clazz);
        return obj;
    }

    /**
     * 获取所有数据
     *
     * @return
     */
    public List<T> find() {
        return find(new Query());
    }


    /**
     * 数据排序
     *
     * @param sort
     * @return
     * @see Sort.Order#asc;
     */
    public List<T> find(Sort sort) {
        return find(new Query().with(sort));
    }

    /**
     * 根据条件获取数据
     *
     * @param query
     * @return
     */
    public List<T> find(Query query) {
        return mongoTemplate.find(query, clazz);
    }

    /**
     * 根据查询条件获取一条数据
     *
     * @param query
     * @return
     */
    public T findOne(Query query) {
        return this.find(query).stream().findFirst().orElse(null);
    }

    /**
     * 根据id获取数据
     *
     * @param id
     * @return
     */
    public T findById(Long id) {
        return (T) mongoTemplate.findById(id, clazz);
    }

    /**
     * 根据id删除单条数据
     *
     * @param obj
     * @return
     */
    public long delete(T obj) {
        return mongoTemplate.remove(obj).getDeletedCount();
    }

    /**
     * 根据条件删除数据
     *
     * @param query
     * @return
     */
    public long delete(Query query) {
        return mongoTemplate.remove(query, clazz).getDeletedCount();
    }

    /**
     * 获取全部数据总条数
     *
     * @return
     */
    public long count() {
        return count(new Query());
    }

    /**
     * 根据条件获取总数
     *
     * @param query
     * @return
     */
    public long count(Query query) {
        return mongoTemplate.count(query, clazz);
    }

    /**
     * 自增（减），类似于set field=field+1
     *
     * @param query 查询条件
     * @param space 自增（减）值
     * @param field 字段值
     * @return
     */
    public long inc(Query query, int space, String... field) {
        Update update = new Update();
        for (int i = 0; i < field.length; i++) {
            update.inc(field[i], space);
        }
        return mongoTemplate.updateMulti(query, update, clazz).getMatchedCount();
    }

    /**
     * 判断是否存在
     *
     * @param query
     * @return
     */
    public boolean exists(Query query) {
        return mongoTemplate.exists(query, this.clazz);
    }

    /**
     * 过滤null值
     *
     * @param object
     * @return
     */
    private static Update fromDBObjectExcludeNullFields(DBObject object) {
        Update update = new Update();
        for (String key : object.keySet()) {
            Object value = object.get(key);
            if (value != null) {
                update.set(key, value);
            }
        }
        return update;
    }
}
