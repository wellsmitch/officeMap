package com.zy.dzzw.gis.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * 时空分析
 * @author czf
 *
 */
@Document(collection = "gis.spatialTemporal.info")
public class SpatialTemporalInfo extends BaseObject {
  @Field
  private String name;// 名称
  @Field
  private int source;// 数据来源 0现有时间划分图层 1动态时间服务图层
  @Field
  private String layer; // 图层id 0现有时间划分图层 为父级目录id 1动态时间服务图层 为具体图层id
  @Field
  private int compareType;// 比较类型 0环比 1同比
  @Field
  private int periodType;// 时间段类型 0最近 1选取
  @Field
  private int segment;// 分段 0年 1季度 3月份
  @Field
  private int segmentCount;// 时间段类型为0最近时有效
  @Field
  private String start;// 开始时间 根据图层名称或参数设定 如2020/2020-01/2020一季度
  @Field
  private String end;// 结束时间 类似开始时间
  @Field
  private String remarks;// 备注
  @Field
  private List<String> colors;// 色彩

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getSource() {
    return source;
  }

  public void setSource(int source) {
    this.source = source;
  }

  public String getLayer() {
    return layer;
  }

  public void setLayer(String layer) {
    this.layer = layer;
  }

  public int getCompareType() {
    return compareType;
  }

  public void setCompareType(int compareType) {
    this.compareType = compareType;
  }

  public int getPeriodType() {
    return periodType;
  }

  public void setPeriodType(int periodType) {
    this.periodType = periodType;
  }

  public int getSegment() {
    return segment;
  }

  public void setSegment(int segment) {
    this.segment = segment;
  }

  public int getSegmentCount() {
    return segmentCount;
  }

  public void setSegmentCount(int segmentCount) {
    this.segmentCount = segmentCount;
  }

  public String getStart() {
    return start;
  }

  public void setStart(String start) {
    this.start = start;
  }

  public String getEnd() {
    return end;
  }

  public void setEnd(String end) {
    this.end = end;
  }

  public String getRemarks() {
    return remarks;
  }

  public void setRemarks(String remarks) {
    this.remarks = remarks;
  }

  public List<String> getColors() {
    return colors;
  }

  public void setColors(List<String> colors) {
    this.colors = colors;
  }
}
