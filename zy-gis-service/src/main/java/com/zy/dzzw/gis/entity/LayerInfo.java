package com.zy.dzzw.gis.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.zy.gis.model.geometry.Line;
import com.zy.gis.model.geometry.Point;
import com.zy.gis.model.geometry.Polygon;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Map;

/**
 * 图层信息
 *
 * @Author wangxiaofeng
 * @Date 2020/3/28 9:49
 */
@Document(collection = "gis.layer.info")
public class LayerInfo<T> extends TreeObject implements Cloneable, Serializable {

    @Field
    private String name;

    @Field
    private Integer type;

    @Field
    private String loadType;

    @Field
    private String layer;

    @Field
    private String loadMode;

    @Field
    private String loadUrl;

    @Field
    private String wfsUrl;

    @Field
    private String loadAppUrl;

    @Field
    private String docName;//文档名

    @Field
    private String strLayerSn;//图层简称

    @Field
    private String layerIndex;//图层索引

    @Field
    private Object[] properties;

    @Field
    private String analysisTopicName;

    @Field
    private String analysisTopicTableName;

    @Field
    private String topicName;

    @Field
    private String layerIcon;

    @Field
    private String legendUrl;//图例地址

    @Field
    private String strLayersInfo;//通用查询参数

    @Field
    private String gdbpUrl;

    /**
     * 完整的图层路径，用/分隔
     */
    @Field
    private String fullPathName;

    /**
     * 三维图层唯一编码
     */
    @Field
    private String layerCode;

    /**
     * 三维加载方式
     */
    @Field
    private String threeDimensionLoadType;

    /**
     * 三维加载url
     */
    @Field
    private String threeDimensionLoadUrl;

    /**
     * 三维手机端url
     */
    @Field
    private String threeDimensionAppLoadUrl;

    /**
     * 三维修正高度
     */
    @Field
    private Integer threeDimensionCorrectHeight;

    /**
     * 三维图层索引
     */
    @Field
    private String threeDimensionLayerIndex;

    @Field
    private Object[] selfProperties;

    /**
     * 叠加分析名称
     */
    @Field
    private String analysisName;

    /**
     * 叠加分析sql模板
     */
    @Field
    private String analysisSqlTemplate;

    /**
     * 叠加分析结果表
     */
    @Field
    private String analysisResultTable;

    /**
     * 外挂表sql模板
     */
    @Field
    private String externalWatchSqlTemplate;

    /**
     * 范围专题图层 配置参数
     */
    @Field
    private Object rangeLayerConfigByWfs;

    public Object getWfsLayerConfig() {
        return wfsLayerConfig;
    }

    public void setWfsLayerConfig(Object wfsLayerConfig) {
        this.wfsLayerConfig = wfsLayerConfig;
    }

    /**
     * wfs 等值样式 相关字段信息 配置
     */
    @Field
    private Object wfsLayerConfig;

    public Object getRangeLayerConfigByWfs() {
        return rangeLayerConfigByWfs;
    }

    public void setRangeLayerConfigByWfs(Object rangeLayerConfigByWfs) {
        this.rangeLayerConfigByWfs = rangeLayerConfigByWfs;
    }

    @JsonIgnore
    public T getInstance() {
        return (T) this;
    }

    @Override
    public LayerInfo clone() {
        try {
            return (LayerInfo) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getAnalysisResultTable() {
        return analysisResultTable;
    }

    public LayerInfo<T> setAnalysisResultTable(String analysisResultTable) {
        this.analysisResultTable = analysisResultTable;
        return this;
    }

    public String getAnalysisSqlTemplate() {
        return analysisSqlTemplate;
    }

    public LayerInfo<T> setAnalysisSqlTemplate(String analysisSqlTemplate) {
        this.analysisSqlTemplate = analysisSqlTemplate;
        return this;
    }

    public String getWfsUrl() {
        return wfsUrl;
    }

    public LayerInfo<T> setWfsUrl(String wfsUrl) {
        this.wfsUrl = wfsUrl;
        return this;
    }

    public String getAnalysisName() {
        return analysisName;
    }

    public void setAnalysisName(String analysisName) {
        this.analysisName = analysisName;
    }

    public String getFullPathName() {
        return fullPathName;
    }

    public void setFullPathName(String fullPathName) {
        this.fullPathName = fullPathName;
    }

    public String getLayerCode() {
        return layerCode;
    }

    public void setLayerCode(String layerCode) {
        this.layerCode = layerCode;
    }

    public String getThreeDimensionLayerIndex() {
        return threeDimensionLayerIndex;
    }

    public void setThreeDimensionLayerIndex(String threeDimensionLayerIndex) {
        this.threeDimensionLayerIndex = threeDimensionLayerIndex;
    }

    public Integer getThreeDimensionCorrectHeight() {
        return threeDimensionCorrectHeight;
    }

    public void setThreeDimensionCorrectHeight(Integer threeDimensionCorrectHeight) {
        this.threeDimensionCorrectHeight = threeDimensionCorrectHeight;
    }

    public String getThreeDimensionLoadType() {
        return threeDimensionLoadType;
    }

    public void setThreeDimensionLoadType(String threeDimensionLoadType) {
        this.threeDimensionLoadType = threeDimensionLoadType;
    }

    public String getThreeDimensionLoadUrl() {
        return threeDimensionLoadUrl;
    }

    public void setThreeDimensionLoadUrl(String threeDimensionLoadUrl) {
        this.threeDimensionLoadUrl = threeDimensionLoadUrl;
    }

    public String getThreeDimensionAppLoadUrl() {
        return threeDimensionAppLoadUrl;
    }

    public void setThreeDimensionAppLoadUrl(String threeDimensionAppLoadUrl) {
        this.threeDimensionAppLoadUrl = threeDimensionAppLoadUrl;
    }

    public String getGdbpUrl() {
        return gdbpUrl;
    }

    public void setGdbpUrl(String gdbpUrl) {
        this.gdbpUrl = gdbpUrl;
    }

    public String getStrLayerSn() {
        return strLayerSn;
    }

    public void setStrLayerSn(String strLayerSn) {
        this.strLayerSn = strLayerSn;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLoadType() {
        return loadType;
    }

    public void setLoadType(String loadType) {
        this.loadType = loadType;
    }

    public String getLayer() {
        return layer;
    }

    public void setLayer(String layer) {
        this.layer = layer;
    }

    public String getAnalysisTopicName() {
        return analysisTopicName;
    }

    public void setAnalysisTopicName(String analysisTopicName) {
        this.analysisTopicName = analysisTopicName;
    }

    public String getAnalysisTopicTableName() {
        return analysisTopicTableName;
    }

    public void setAnalysisTopicTableName(String analysisTopicTableName) {
        this.analysisTopicTableName = analysisTopicTableName;
    }

    public String getLayerIcon() {
        return layerIcon;
    }

    public void setLayerIcon(String layerIcon) {
        this.layerIcon = layerIcon;
    }

    public String getLegendUrl() {
        return legendUrl;
    }

    public void setLegendUrl(String legendUrl) {
        this.legendUrl = legendUrl;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getLoadMode() {
        return loadMode;
    }

    public void setLoadMode(String loadMode) {
        this.loadMode = loadMode;
    }

    public String getLoadUrl() {
        return loadUrl;
    }

    public void setLoadUrl(String loadUrl) {
        this.loadUrl = loadUrl;
    }

    public String getDocName() {
        return docName;
    }

    public void setDocName(String docName) {
        this.docName = docName;
    }

    public String getLayerIndex() {
        return layerIndex;
    }

    public void setLayerIndex(String layerIndex) {
        this.layerIndex = layerIndex;
    }

    public Object[] getProperties() {
        return properties;
    }

    public void setProperties(Object[] properties) {
        this.properties = properties;
    }

    public String getLoadAppUrl() {
        return loadAppUrl;
    }

    public void setLoadAppUrl(String loadAppUrl) {
        this.loadAppUrl = loadAppUrl;
    }

    public String getStrLayersInfo() {
        return strLayersInfo;
    }

    public void setStrLayersInfo(String strLayersInfo) {
        this.strLayersInfo = strLayersInfo;
    }

    public Object[] getSelfProperties() {
        return selfProperties;
    }

    public void setSelfProperties(Object[] selfProperties) {
        this.selfProperties = selfProperties;
    }

    public String getExternalWatchSqlTemplate() {
        return externalWatchSqlTemplate;
    }

    public void setExternalWatchSqlTemplate(String externalWatchSqlTemplate) {
        this.externalWatchSqlTemplate = externalWatchSqlTemplate;
    }
}
