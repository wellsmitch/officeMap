package com.zy.dzzw.gis.vo;

import com.zy.dzzw.gis.entity.MapAppInfo;
import com.zy.dzzw.gis.entity.MapAppInterFace;
import com.zy.dzzw.gis.entity.MapInfo;
import com.zy.dzzw.gis.entity.MapInterFace;

public class LayerConfigVo {

    MapInfo mapInfo;

    MapAppInfo mapAppInfo;

    MapInterFace mapInterFace;

    MapAppInterFace mapAppInterFace;

    public MapInfo getMapInfo() {
        return mapInfo;
    }

    public void setMapInfo(MapInfo mapInfo) {
        this.mapInfo = mapInfo;
    }

    public MapAppInfo getMapAppInfo() {
        return mapAppInfo;
    }

    public void setMapAppInfo(MapAppInfo mapAppInfo) {
        this.mapAppInfo = mapAppInfo;
    }

    public MapInterFace getMapInterFace() {
        return mapInterFace;
    }

    public void setMapInterFace(MapInterFace mapInterFace) {
        this.mapInterFace = mapInterFace;
    }

    public MapAppInterFace getMapAppInterFace() {
        return mapAppInterFace;
    }

    public void setMapAppInterFace(MapAppInterFace mapAppInterFace) {
        this.mapAppInterFace = mapAppInterFace;
    }
}
