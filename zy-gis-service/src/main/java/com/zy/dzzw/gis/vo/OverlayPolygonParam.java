package com.zy.dzzw.gis.vo;

import org.apache.commons.lang3.StringUtils;

/**
 * wps叠加分析请求参数
 */
public class OverlayPolygonParam {
    /**
     * 请求服务地址
     */
    private String requestUrl;

    /**
     * 请求被叠加图层地址
     * 示例：gdbp://username:password@ORCL/SJZX/ds/郑州市/sfcls/LCKDJ410100CKQSQDJ
     */
    private String gdbpUrl;

    /**
     * 请求叠加坐标串(坐标值以空格分隔)
     */
    private String coordinatesStr;

    /**
     * GDBServer:
     * 示例：username:password@ORCL
     */
    private String gdbServer;

    /**
     * GDBName
     * 示例：SJZX/ds/郑州市
     */
    private String gdbName;

    /**
     * LayerName
     * 示例：LCKDJ410100CKQSQDJ
     */
    private String layerName;

    public OverlayPolygonParam() {
    }

    public OverlayPolygonParam(String requestUrl, String gdbpUrl, String coordinatesStr) {
        this.requestUrl = requestUrl;
        this.gdbpUrl = gdbpUrl;
        this.coordinatesStr = coordinatesStr;
    }

    public OverlayPolygonParam(String requestUrl,String coordinatesStr, String gdbServer, String gdbName, String layerName) {
        this.requestUrl = requestUrl;
        this.coordinatesStr = coordinatesStr;
        this.gdbServer = gdbServer;
        this.gdbName = gdbName;
        this.layerName = layerName;
    }


    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getGdbpUrl() {
        return gdbpUrl;
    }

    public void setGdbpUrl(String gdbpUrl) {
        this.gdbpUrl = gdbpUrl;
        if(StringUtils.isNotBlank(gdbpUrl)){
            String subUrl = gdbpUrl.split("//")[1];
            String[] params = subUrl.split("/sfcls/");
            this.layerName = params[1];
            this.gdbServer = params[0].split("/")[0];
            this.gdbName= params[0].replace(this.gdbServer+"/", "");
        }
    }

    public String getCoordinatesStr() {
        return coordinatesStr;
    }

    public void setCoordinatesStr(String coordinatesStr) {
        this.coordinatesStr = coordinatesStr;
    }

    public String getGdbServer() {
        return gdbServer;
    }

    public void setGdbServer(String gdbServer) {
        this.gdbServer = gdbServer;
    }

    public String getGdbName() {
        return gdbName;
    }

    public void setGdbName(String gdbName) {
        this.gdbName = gdbName;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }
}
