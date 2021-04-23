package com.zy.gis.business.lhsp.entity;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.util.Date;

@Table(name = "GIS_LHSP_XMXX")
public class GisLhspXmxx implements java.io.Serializable{

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "XMBH")
    private String xmbh;

    @Column(name = "XMDM")
    private String xmdm;

    @Column(name = "XMMC")
    private String xmmc;

    @Column(name = "XZQH")
    private String xzqh;

    @Column(name = "XMSZQ")
    private String xmszq;

    @Column(name = "SCCHLX")
    private String scchlx;

    @Column(name = "NKGSJ")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date nkgsj;

    @Column(name = "NJCSJ")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date njcsj;

    @Column(name = "JSDD")
    private String jsdd;

    @Column(name = "JSGMJNR")
    private String jsgmjnr;

    @Column(name = "JSXZ")
    private String jsxz;

    @Column(name = "XMGLBH")
    private String xmglbh;

    @Column(name = "XMZJSX")
    private String xmzjsx;

    @Column(name = "LXLX")
    private String lxlx;

    @Column(name = "XMLX")
    private String xmlx;

    @Column(name = "GBHY")
    private String gbhy;

    @Column(name = "FQBM")
    private String fqbm;

    @Column(name = "FQRXM")
    private String fqrxm;

    @Column(name = "FQRLXDH")
    private String fqrlxdh;

    @Column(name = "JSDW")
    private String jsdw;

    @Column(name = "DWZZLX")
    private String dwzzlx;

    @Column(name = "DWZZHM")
    private String dwzzhm;

    @Column(name = "LXR")
    private String lxr;

    @Column(name = "LXRZJHM")
    private String lxrzjhm;

    @Column(name = "LXRDH")
    private String lxrdh;

    @Column(name = "LXRDZYJ")
    private String lxrdzyj;

    @Column(name = "ZTZE")
    private Double ztze;

    @Column(name = "DQNDZTZ")
    private Double dqndztz;

    @Column(name = "QTNDJHTZ")
    private String qtndjhtz;

    @Column(name = "DQNDJDJH")
    private String dqndjdjh;

    @Column(name = "QTNDJDJH")
    private String qtndjdjh;

    @Column(name = "MQJZQK")
    private String mqjzqk;

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



    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }


    public String getXmbh() {
      return xmbh;
    }

    public void setXmbh(String xmbh) {
      this.xmbh = xmbh;
    }


    public String getXmdm() {
      return xmdm;
    }

    public void setXmdm(String xmdm) {
      this.xmdm = xmdm;
    }


    public String getXmmc() {
      return xmmc;
    }

    public void setXmmc(String xmmc) {
      this.xmmc = xmmc;
    }


    public String getXzqh() {
      return xzqh;
    }

    public void setXzqh(String xzqh) {
      this.xzqh = xzqh;
    }


    public String getXmszq() {
      return xmszq;
    }

    public void setXmszq(String xmszq) {
      this.xmszq = xmszq;
    }


    public String getScchlx() {
      return scchlx;
    }

    public void setScchlx(String scchlx) {
      this.scchlx = scchlx;
    }


    public Date getNkgsj() {
      return nkgsj;
    }

    public void setNkgsj(Date nkgsj) {
      this.nkgsj = nkgsj;
    }


    public Date getNjcsj() {
      return njcsj;
    }

    public void setNjcsj(Date njcsj) {
      this.njcsj = njcsj;
    }


    public String getJsdd() {
      return jsdd;
    }

    public void setJsdd(String jsdd) {
      this.jsdd = jsdd;
    }


    public String getJsgmjnr() {
      return jsgmjnr;
    }

    public void setJsgmjnr(String jsgmjnr) {
      this.jsgmjnr = jsgmjnr;
    }


    public String getJsxz() {
      return jsxz;
    }

    public void setJsxz(String jsxz) {
      this.jsxz = jsxz;
    }


    public String getXmglbh() {
      return xmglbh;
    }

    public void setXmglbh(String xmglbh) {
      this.xmglbh = xmglbh;
    }


    public String getXmzjsx() {
      return xmzjsx;
    }

    public void setXmzjsx(String xmzjsx) {
      this.xmzjsx = xmzjsx;
    }


    public String getLxlx() {
      return lxlx;
    }

    public void setLxlx(String lxlx) {
      this.lxlx = lxlx;
    }


    public String getXmlx() {
      return xmlx;
    }

    public void setXmlx(String xmlx) {
      this.xmlx = xmlx;
    }


    public String getGbhy() {
      return gbhy;
    }

    public void setGbhy(String gbhy) {
      this.gbhy = gbhy;
    }


    public String getFqbm() {
      return fqbm;
    }

    public void setFqbm(String fqbm) {
      this.fqbm = fqbm;
    }


    public String getFqrxm() {
      return fqrxm;
    }

    public void setFqrxm(String fqrxm) {
      this.fqrxm = fqrxm;
    }


    public String getFqrlxdh() {
      return fqrlxdh;
    }

    public void setFqrlxdh(String fqrlxdh) {
      this.fqrlxdh = fqrlxdh;
    }


    public String getJsdw() {
      return jsdw;
    }

    public void setJsdw(String jsdw) {
      this.jsdw = jsdw;
    }


    public String getDwzzlx() {
      return dwzzlx;
    }

    public void setDwzzlx(String dwzzlx) {
      this.dwzzlx = dwzzlx;
    }


    public String getDwzzhm() {
      return dwzzhm;
    }

    public void setDwzzhm(String dwzzhm) {
      this.dwzzhm = dwzzhm;
    }


    public String getLxr() {
      return lxr;
    }

    public void setLxr(String lxr) {
      this.lxr = lxr;
    }


    public String getLxrzjhm() {
      return lxrzjhm;
    }

    public void setLxrzjhm(String lxrzjhm) {
      this.lxrzjhm = lxrzjhm;
    }


    public String getLxrdh() {
      return lxrdh;
    }

    public void setLxrdh(String lxrdh) {
      this.lxrdh = lxrdh;
    }


    public String getLxrdzyj() {
      return lxrdzyj;
    }

    public void setLxrdzyj(String lxrdzyj) {
      this.lxrdzyj = lxrdzyj;
    }


    public Double getZtze() {
      return ztze;
    }

    public void setZtze(Double ztze) {
      this.ztze = ztze;
    }


    public Double getDqndztz() {
      return dqndztz;
    }

    public void setDqndztz(Double dqndztz) {
      this.dqndztz = dqndztz;
    }


    public String getQtndjhtz() {
      return qtndjhtz;
    }

    public void setQtndjhtz(String qtndjhtz) {
      this.qtndjhtz = qtndjhtz;
    }


    public String getDqndjdjh() {
      return dqndjdjh;
    }

    public void setDqndjdjh(String dqndjdjh) {
      this.dqndjdjh = dqndjdjh;
    }


    public String getQtndjdjh() {
      return qtndjdjh;
    }

    public void setQtndjdjh(String qtndjdjh) {
      this.qtndjdjh = qtndjdjh;
    }


    public String getMqjzqk() {
      return mqjzqk;
    }

    public void setMqjzqk(String mqjzqk) {
      this.mqjzqk = mqjzqk;
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

}
