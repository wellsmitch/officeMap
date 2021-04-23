package com.zy.dzzw.gis.listener;

import com.zy.dzzw.gis.entity.SubjectInfo;

/**
 * 专题删除事件
 *
 * @Author wangxiaofeng
 * @Date 2020/4/20 16:32
 */
public interface LayerSubjectListener {
    void remove(SubjectInfo subjectInfo);
}
