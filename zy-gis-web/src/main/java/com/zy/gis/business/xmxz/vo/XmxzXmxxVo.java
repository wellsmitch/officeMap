package com.zy.gis.business.xmxz.vo;

import com.zy.gis.business.xmxz.entity.XmxzXmxx;

import java.util.Calendar;
import java.util.Date;

public class XmxzXmxxVo extends XmxzXmxx {

    private String keyword;
    private Date beginDate;
    private Date endDate;
    private String fileTempId;

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        if (beginDate != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(beginDate);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            beginDate = calendar.getTime();
        }
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        if (endDate != null) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(endDate);
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            endDate = calendar.getTime();
        }
        this.endDate = endDate;
    }

    public String getFileTempId() {
        return fileTempId;
    }

    public void setFileTempId(String fileTempId) {
        this.fileTempId = fileTempId;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }
}
