package com.zy.gis.business.xmxz.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.util.Date;

@Table(name = "XMXZ_XMFA")
public class XmxzXmfa implements java.io.Serializable {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "FAMC")
    private String famc;

    @Column(name = "ZL")
    private String zl;

    @Column(name = "MJ")
    private String mj;

    @Column(name = "MAPPING_VALUE")
    private String mappingValue;

    @Column(name = "MAPPING_KEY")
    private String mappingKey = "ID";

    @Column(name = "CREATE_TIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @Column(name = "CREATE_USER")
    private String createUser;

    @Column(name = "MODIFY_TIME")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifyTime;

    @Column(name = "MODIFY_USER")
    private String modifyUser;

    @Column(name = "STATUS")
    private Long status;

    @Column(name = "DEL_FLAG")
    private Long delFlag = 0L;

    @Column(name = "XMXX_ID")
    private Long xmxxId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFamc() {
        return famc;
    }

    public void setFamc(String famc) {
        this.famc = famc;
    }


    public String getZl() {
        return zl;
    }

    public void setZl(String zl) {
        this.zl = zl;
    }


    public String getMj() {
        return mj;
    }

    public void setMj(String mj) {
        this.mj = mj;
    }


    public String getMappingValue() {
        return mappingValue;
    }

    public void setMappingValue(String mappingValue) {
        this.mappingValue = mappingValue;
    }


    public String getMappingKey() {
        return mappingKey;
    }

    public void setMappingKey(String mappingKey) {
        this.mappingKey = mappingKey;
    }


    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }


    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }


    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }


    public String getModifyUser() {
        return modifyUser;
    }

    public void setModifyUser(String modifyUser) {
        this.modifyUser = modifyUser;
    }


    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }


    public Long getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Long delFlag) {
        this.delFlag = delFlag;
    }


    public Long getXmxxId() {
        return xmxxId;
    }

    public void setXmxxId(Long xmxxId) {
        this.xmxxId = xmxxId;
    }

}
