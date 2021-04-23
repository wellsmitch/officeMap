package com.zy.gis.business.lhsp.entity;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.util.Date;

@Table(name = "GIS_LHSP_XMFA")
public class GisLhspXmfa implements java.io.Serializable{

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
    private String mappingKey;

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

    @Column(name = "LHSP_XMXX_ID")
    private Long lhspXmxxId;

    @Column(name = "LAND_CODE")
    private String landCode;

    @Column(name = "ISSUE_TYPE")
    private String issueType;

    @Column(name = "GPFS")
    private String gpfs;

    @Column(name = "KFQ")
    private String kfq;

    @Column(name = "TDYT")
    private String tdyt;

    @Column(name = "DXKJYT")
    private String dxkjyt;

    @Column(name = "RJL")
    private String rjl;

    @Column(name = "GPQSJ")
    private String gpqsj;

    @Column(name = "GPQSDJ")
    private String gpqsdj;

    @Column(name = "RDJ")
    private String rdj;

    @Column(name = "ZGXJ")
    private String zgxj;

    @Column(name = "BLLX")
    private String bllx;

    @Column(name = "NGYZDBH")
    private String ngyzdbh;

    @Column(name = "NBDW")
    private String nbdw;

    @Column(name = "NBLX")
    private String nblx;

    @Column(name = "DJQS")
    private String djqs;

    @Column(name = "XCQK")
    private String xcqk;

    @Column(name = "AQQQK")
    private String aqqqk;

    @Column(name = "JZGD")
    private String jzgd;

    @Column(name = "JZMD")
    private String jzmd;

    @Column(name = "LDL")
    private String ldl;

    @Column(name = "DXKJ")
    private String dxkj;

    @Column(name = "OTHER")
    private String other;

    @Column(name = "PGZJ")
    private String pgzj;

    @Column(name = "PGDJ")
    private String pgdj;

    @Column(name = "TDJK")
    private String tdjk;

    @Column(name = "GHYT")
    private String ghyt;

    @Column(name = "ZYTRJL")
    private String zytrjl;

    @Column(name = "QSDW")
    private String qsdw;

    @Column(name = "SSPC")
    private String sspc;

    @Column(name = "BCFY")
    private String bcfy;

    @Column(name = "AZQ")
    private String azq;

    @Column(name = "GZFAPH")
    private String gzfaph;

    @Column(name = "TDSYZ")
    private String tdsyz;

    @Column(name = "SYQLX")
    private String syqlx;

    @Column(name = "TDZH")
    private String tdzh;

    @Column(name = "SGBC")
    private String sgbc;

    @Column(name = "XGHYU")
    private String xghyu;

    @Column(name = "YTXH")
    private String ytxh;

    @Column(name = "MAPPING_YT")
    private String mappingYt;

    @Column(name = "TDYT_CODE")
    private String tdytCode;

    @Column(name = "SIDE_TDYT")
    private String sideTdyt;

    @Column(name = "SIDE_TDYT_CODE")
    private String sideTdytCode;

    @Column(name = "COMPATIBLE")
    private String compatible;

    @Column(name = "TMP_KEY")
    private String tmpKey;

    @Column(name = "GHYT_CODE")
    private String ghytCode;

    @Column(name = "XGHYU_CODE")
    private String xghyuCode;



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


    public Long getLhspXmxxId() {
      return lhspXmxxId;
    }

    public void setLhspXmxxId(Long lhspXmxxId) {
      this.lhspXmxxId = lhspXmxxId;
    }


    public String getLandCode() {
      return landCode;
    }

    public void setLandCode(String landCode) {
      this.landCode = landCode;
    }


    public String getIssueType() {
      return issueType;
    }

    public void setIssueType(String issueType) {
      this.issueType = issueType;
    }


    public String getGpfs() {
      return gpfs;
    }

    public void setGpfs(String gpfs) {
      this.gpfs = gpfs;
    }


    public String getKfq() {
      return kfq;
    }

    public void setKfq(String kfq) {
      this.kfq = kfq;
    }


    public String getTdyt() {
      return tdyt;
    }

    public void setTdyt(String tdyt) {
      this.tdyt = tdyt;
    }


    public String getDxkjyt() {
      return dxkjyt;
    }

    public void setDxkjyt(String dxkjyt) {
      this.dxkjyt = dxkjyt;
    }


    public String getRjl() {
      return rjl;
    }

    public void setRjl(String rjl) {
      this.rjl = rjl;
    }


    public String getGpqsj() {
      return gpqsj;
    }

    public void setGpqsj(String gpqsj) {
      this.gpqsj = gpqsj;
    }


    public String getGpqsdj() {
      return gpqsdj;
    }

    public void setGpqsdj(String gpqsdj) {
      this.gpqsdj = gpqsdj;
    }


    public String getRdj() {
      return rdj;
    }

    public void setRdj(String rdj) {
      this.rdj = rdj;
    }


    public String getZgxj() {
      return zgxj;
    }

    public void setZgxj(String zgxj) {
      this.zgxj = zgxj;
    }


    public String getBllx() {
      return bllx;
    }

    public void setBllx(String bllx) {
      this.bllx = bllx;
    }


    public String getNgyzdbh() {
      return ngyzdbh;
    }

    public void setNgyzdbh(String ngyzdbh) {
      this.ngyzdbh = ngyzdbh;
    }


    public String getNbdw() {
      return nbdw;
    }

    public void setNbdw(String nbdw) {
      this.nbdw = nbdw;
    }


    public String getNblx() {
      return nblx;
    }

    public void setNblx(String nblx) {
      this.nblx = nblx;
    }


    public String getDjqs() {
      return djqs;
    }

    public void setDjqs(String djqs) {
      this.djqs = djqs;
    }


    public String getXcqk() {
      return xcqk;
    }

    public void setXcqk(String xcqk) {
      this.xcqk = xcqk;
    }


    public String getAqqqk() {
      return aqqqk;
    }

    public void setAqqqk(String aqqqk) {
      this.aqqqk = aqqqk;
    }


    public String getJzgd() {
      return jzgd;
    }

    public void setJzgd(String jzgd) {
      this.jzgd = jzgd;
    }


    public String getJzmd() {
      return jzmd;
    }

    public void setJzmd(String jzmd) {
      this.jzmd = jzmd;
    }


    public String getLdl() {
      return ldl;
    }

    public void setLdl(String ldl) {
      this.ldl = ldl;
    }


    public String getDxkj() {
      return dxkj;
    }

    public void setDxkj(String dxkj) {
      this.dxkj = dxkj;
    }


    public String getOther() {
      return other;
    }

    public void setOther(String other) {
      this.other = other;
    }


    public String getPgzj() {
      return pgzj;
    }

    public void setPgzj(String pgzj) {
      this.pgzj = pgzj;
    }


    public String getPgdj() {
      return pgdj;
    }

    public void setPgdj(String pgdj) {
      this.pgdj = pgdj;
    }


    public String getTdjk() {
      return tdjk;
    }

    public void setTdjk(String tdjk) {
      this.tdjk = tdjk;
    }


    public String getGhyt() {
      return ghyt;
    }

    public void setGhyt(String ghyt) {
      this.ghyt = ghyt;
    }


    public String getZytrjl() {
      return zytrjl;
    }

    public void setZytrjl(String zytrjl) {
      this.zytrjl = zytrjl;
    }


    public String getQsdw() {
      return qsdw;
    }

    public void setQsdw(String qsdw) {
      this.qsdw = qsdw;
    }


    public String getSspc() {
      return sspc;
    }

    public void setSspc(String sspc) {
      this.sspc = sspc;
    }


    public String getBcfy() {
      return bcfy;
    }

    public void setBcfy(String bcfy) {
      this.bcfy = bcfy;
    }


    public String getAzq() {
      return azq;
    }

    public void setAzq(String azq) {
      this.azq = azq;
    }


    public String getGzfaph() {
      return gzfaph;
    }

    public void setGzfaph(String gzfaph) {
      this.gzfaph = gzfaph;
    }


    public String getTdsyz() {
      return tdsyz;
    }

    public void setTdsyz(String tdsyz) {
      this.tdsyz = tdsyz;
    }


    public String getSyqlx() {
      return syqlx;
    }

    public void setSyqlx(String syqlx) {
      this.syqlx = syqlx;
    }


    public String getTdzh() {
      return tdzh;
    }

    public void setTdzh(String tdzh) {
      this.tdzh = tdzh;
    }


    public String getSgbc() {
      return sgbc;
    }

    public void setSgbc(String sgbc) {
      this.sgbc = sgbc;
    }


    public String getXghyu() {
      return xghyu;
    }

    public void setXghyu(String xghyu) {
      this.xghyu = xghyu;
    }


    public String getYtxh() {
      return ytxh;
    }

    public void setYtxh(String ytxh) {
      this.ytxh = ytxh;
    }


    public String getMappingYt() {
      return mappingYt;
    }

    public void setMappingYt(String mappingYt) {
      this.mappingYt = mappingYt;
    }


    public String getTdytCode() {
      return tdytCode;
    }

    public void setTdytCode(String tdytCode) {
      this.tdytCode = tdytCode;
    }


    public String getSideTdyt() {
      return sideTdyt;
    }

    public void setSideTdyt(String sideTdyt) {
      this.sideTdyt = sideTdyt;
    }


    public String getSideTdytCode() {
      return sideTdytCode;
    }

    public void setSideTdytCode(String sideTdytCode) {
      this.sideTdytCode = sideTdytCode;
    }


    public String getCompatible() {
      return compatible;
    }

    public void setCompatible(String compatible) {
      this.compatible = compatible;
    }


    public String getTmpKey() {
      return tmpKey;
    }

    public void setTmpKey(String tmpKey) {
      this.tmpKey = tmpKey;
    }


    public String getGhytCode() {
      return ghytCode;
    }

    public void setGhytCode(String ghytCode) {
      this.ghytCode = ghytCode;
    }


    public String getXghyuCode() {
      return xghyuCode;
    }

    public void setXghyuCode(String xghyuCode) {
      this.xghyuCode = xghyuCode;
    }

}
