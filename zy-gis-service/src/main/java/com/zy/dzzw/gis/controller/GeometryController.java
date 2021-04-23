package com.zy.dzzw.gis.controller;

import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
//import com.zy.dzzw.gis.entity.BufferMode;
import com.zy.dzzw.gis.service.BufferService;
import org.locationtech.jts.geom.Geometry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 几何图形操作类
 *
 * @author Administrator
 * @date 2021/03/17 17:13
 **/

@Controller
@RequestMapping("/gis/geometry")
public class GeometryController extends BaseController {
//
//    @Autowired
//    private BufferService bufferService;
//
//
//    /**
//     * 交叉分析
//     *
//     * @param mainCoordinates 对比地块坐标
//     * @param coordinates     分析地块坐标
//     * @return 叠加在一起的图形坐标
//     */
//    @RequestMapping("/intersection")
//    @ResponseBody
//    public SimpleJsonResult intersection(String mainCoordinates, String coordinates) {
//        BufferMode buffer = new BufferMode();
//        buffer.setCoordinateCluster(mainCoordinates);
//        Geometry mainGeometry = bufferService.createPolygon(buffer);
//        buffer.setCoordinateCluster(coordinates);
//        Geometry subGeometry = bufferService.createPolygon(buffer);
//        Geometry intersectionGeometry = mainGeometry.intersection(subGeometry);
//        return successJsonResult(bufferService.transformationStr(intersectionGeometry));
//    }
//
//    /**
//     * 差异分析
//     *
//     * @param mainCoordinates 对比地块坐标
//     * @param coordinates     分析地块坐标
//     * @return 除去对比地块后剩余的分析地块坐标
//     */
//    @RequestMapping("/difference")
//    @ResponseBody
//    public SimpleJsonResult difference(String mainCoordinates, String coordinates) {
//        BufferMode buffer = new BufferMode();
//        buffer.setCoordinateCluster(mainCoordinates);
//        Geometry mainGeometry = bufferService.createPolygon(buffer);
//        buffer.setCoordinateCluster(coordinates);
//        Geometry subGeometry = bufferService.createPolygon(buffer);
//        Geometry intersectionGeometry = subGeometry.difference(mainGeometry);
//        return successJsonResult(bufferService.transformationStr(intersectionGeometry));
//    }
//
//    @RequestMapping("/differenceAnalysis")
//    @ResponseBody
//    public SimpleJsonResult differenceAnalysis(String mainCoordinates, String coordinates) {
//        BufferMode buffer = new BufferMode();
//        List<String> intersectionList = new ArrayList<>();
//        Map<String,Object> result = new HashMap<>(2);
//        String [] arr = mainCoordinates.split("#");
//        for (String str : arr){
//            buffer.setCoordinateCluster(str);
//            Geometry mainGeometry = bufferService.createPolygon(buffer);
//            buffer.setCoordinateCluster(coordinates);
//            Geometry subGeometry = bufferService.createPolygon(buffer);
//            // 叠加分析
//            Geometry intersectionGeometry = mainGeometry.intersection(subGeometry);
//            intersectionList.add(bufferService.transformationStr(intersectionGeometry));
//        }
//        // 差异分析
//        for (String intersectionStr : intersectionList){
//            buffer.setCoordinateCluster(intersectionStr);
//            Geometry mainGeometry = bufferService.createPolygon(buffer);
//            buffer.setCoordinateCluster(coordinates);
//            Geometry subGeometry = bufferService.createPolygon(buffer);
//            // 裁剪
//            Geometry differenceGeometry = subGeometry.difference(mainGeometry);
//            coordinates = bufferService.transformationStr(differenceGeometry);
//        }
//        result.put("intersection",intersectionList);
//        result.put("difference",coordinates);
//        return successJsonResult(result);
//    }
//
}
