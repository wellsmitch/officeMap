package com.zy.gis.business.lhsp.entity;
import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.util.Date;

@Table(name = "CODE_LAND_PLAN_USAGE")
public class CodeLandPlanUsage implements java.io.Serializable{

    @Column(name = "CODE_ID")
    private String codeId;

    @Column(name = "PARENT")
    private String parent;

    @Column(name = "CODE_NAME")
    private String codeName;

    @Column(name = "REMARKS")
    private String remarks;

    @Column(name = "LVL")
    private Long lvl;

    @Column(name = "LFT")
    private Long lft;

    @Column(name = "RGT")
    private Long rgt;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "CATEGORY")
    private Long category;



    public String getCodeId() {
      return codeId;
    }

    public void setCodeId(String codeId) {
      this.codeId = codeId;
    }


    public String getParent() {
      return parent;
    }

    public void setParent(String parent) {
      this.parent = parent;
    }


    public String getCodeName() {
      return codeName;
    }

    public void setCodeName(String codeName) {
      this.codeName = codeName;
    }


    public String getRemarks() {
      return remarks;
    }

    public void setRemarks(String remarks) {
      this.remarks = remarks;
    }


    public Long getLvl() {
      return lvl;
    }

    public void setLvl(Long lvl) {
      this.lvl = lvl;
    }


    public Long getLft() {
      return lft;
    }

    public void setLft(Long lft) {
      this.lft = lft;
    }


    public Long getRgt() {
      return rgt;
    }

    public void setRgt(Long rgt) {
      this.rgt = rgt;
    }


    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }


    public Long getCategory() {
      return category;
    }

    public void setCategory(Long category) {
      this.category = category;
    }

}
