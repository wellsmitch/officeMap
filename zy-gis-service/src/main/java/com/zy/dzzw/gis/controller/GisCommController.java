package com.zy.dzzw.gis.controller;

import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.ObjectMapper;
import com.zy.core.util.UserAgentParserUtil;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.MapInterFace;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.service.*;
import com.zy.dzzw.gis.vo.IntersectionAnalysisVo;
import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.relation.Condition;
import com.zy.gis.model.layer.Layer;
import com.zy.gis.model.layer.MapGisLayer;
import com.zy.gis.model.layer.WfsLayer;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/gis/comms")
public class GisCommController extends BaseController {

    @Autowired
    private BufferService bufferService;

    @Autowired
    LayerInfoService layerInfoService;

    @Autowired
    SubjectInfoService subjectInfoService;

    @Autowired
    AnalysisService analysisService;

    @Autowired
    CommonService commonService;

    @Autowired
    LayerBusinessService layerBusinessService;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private DictService dictService;

    @Autowired
    MapGisService mapGisService;

    @Value("${sysId}")
    String sysId;

    @RequestMapping("/buffer/{distance}")
    @ResponseBody
    public SimpleJsonResult buffer(@PathVariable("distance") int distance, @RequestBody Geometry geometry) {
        if ( distance == 0){
            return failureJsonResult("缓冲参数错误");
        }
        return successJsonResult(bufferService.buffer(distance,geometry));
    }

    @RequestMapping("/buffers/{distance}")
    @ResponseBody
    public SimpleJsonResult buffer(@PathVariable("distance") int distance, @RequestBody List<Geometry> geometrys) {
        if ( distance == 0){
            return failureJsonResult("缓冲参数错误");
        }
        return successJsonResult(bufferService.buffer(distance,geometrys));
    }


    @PostMapping("/intersection/{layerInfoId}")
    @ResponseBody
    public SimpleJsonResult intersection(@PathVariable("layerInfoId") Long layerInfoId, @RequestBody Geometry geometry) throws Exception {
        LayerInfo layerInfo = layerInfoService.findById(layerInfoId);
        Map<String, Object> intersectionResult = analysisService.intersectionAnalysis(layerInfo, geometry);
        return successJsonResult(intersectionResult);
    }

    @PostMapping("/intersections/{layerInfoId}")
    @ResponseBody
    public SimpleJsonResult intersection(@PathVariable("layerInfoId") Long layerInfoId, @RequestBody List<Geometry> searchGeometries) throws Exception {
        LayerInfo layerInfo = layerInfoService.findById(layerInfoId);
        Map<String, Object> intersectionResult = analysisService.intersectionAnalysis(layerInfo, searchGeometries);
        return successJsonResult(intersectionResult);
    }

    @PostMapping("/intersections")
    @ResponseBody
    public SimpleJsonResult intersection(@RequestBody IntersectionAnalysisVo intersectionAnalysisVo) throws Exception {
        List<Map<String, Object>> intersectionResult = analysisService.intersectionAnalysis(intersectionAnalysisVo);
        return successJsonResult(intersectionResult);
    }

    @RequestMapping("/findSubNodeByCode/{code}")
    @ResponseBody
    public SimpleJsonResult findSubNodeByCode(@PathVariable("code") String code, HttpServletRequest request) {
        return successJsonResult(subjectInfoService.findNodesExcludeByCode(code));
    }

    @RequestMapping("/findSubLayerInfoById/{id}")
    @ResponseBody
    public SimpleJsonResult findSubLayerInfoById(@PathVariable("id") Long id, HttpServletRequest request) {
        SubjectInfo subjectInfo = subjectInfoService.findById(id);
        String userAgent = request.getHeader("User-Agent");
        boolean b = UserAgentParserUtil.checkMobile(userAgent);
        ObjectMapper objectMapper = new ObjectMapper();
        if (b) {
            if (subjectInfo.getLayerInfoList() != null && subjectInfo.getLayerInfoList().size() > 0) {
                subjectInfo.getLayerInfoList().forEach(item -> {
                    item.getLayerInfo().setLoadUrl(item.getLayerInfo().getLoadAppUrl());
                });
            }
        }
        if (subjectInfo.getLayerInfoList() == null || subjectInfo.getLayerInfoList().size() == 0) {
            return successJsonResult(subjectInfo);
        }

        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<SysRole> roleList = commonService.getUserRoleInfo(sysId, user.getUserId());
        List<String> roleIds = roleList.stream().map(sysRole -> sysRole.getOrgCode() + "_" + sysRole.getRoleId()).collect(Collectors.toList());
        subjectInfo = layerBusinessService.getSubject(subjectInfo, roleIds.toArray(new String[]{}));
        Collections.reverse(subjectInfo.getLayerInfoList());
        Map map = objectMapper.convertValue(subjectInfo, Map.class);
        Long createTime = map.get("createTime") == null ? System.currentTimeMillis() : (Long) map.get("createTime");
        Long modifyTime = map.get("modifyTime") == null ? System.currentTimeMillis() : (Long) map.get("modifyTime");
        map.put("createTime", DateFormatUtils.format(createTime,"yyyy-MM-dd HH:mm:ss"));
        map.put("modifyTime",DateFormatUtils.format(modifyTime,"yyyy-MM-dd HH:mm:ss"));
        List<Map> layerInfoList = map.get("layerInfoList") == null ? new ArrayList() : (List) map.get("layerInfoList");
        if (CollectionUtils.isEmpty(layerInfoList)) {
            return successJsonResult(map);
        }
        for (Map layerMap : layerInfoList) {
            if (layerMap == null) {
                continue;
            }
            if (layerMap.get("layerInfo") == null) {
                continue;
            }
            Map map1 = (Map) layerMap.get("layerInfo");
            Long createTime1 = map1.get("createTime") == null ? System.currentTimeMillis() : (Long) map1.get("createTime");
            Long modifyTime1 = map1.get("modifyTime") == null ? System.currentTimeMillis() : (Long) map1.get("modifyTime");
            map1.put("createTime",DateFormatUtils.format(createTime1,"yyyy-MM-dd HH:mm:ss"));
            map1.put("modifyTime",DateFormatUtils.format(modifyTime1,"yyyy-MM-dd HH:mm:ss"));

            Map map2 = (Map) layerMap.get("property");
            map1.putAll(map2);
        }
        return successJsonResult(map);
    }

    @RequestMapping("/dict/{ztjc}")
    @ResponseBody
    public SimpleJsonResult getNameList(@PathVariable("ztjc") String ztjc, @RequestBody List<Map<String, Object>> featureList) {
        return successJsonResult(dictService.getNameList(ztjc,featureList));
    }

    @RequestMapping("/queryFeature/{layerId}")
    @ResponseBody
    public SimpleJsonResult queryFeature(@PathVariable("layerId") long layerId, @RequestBody Condition condition) {
        LayerInfo layerInfo = layerInfoService.findById(layerId);
        return successJsonResult(mapGisService.queryFeature(layerInfo,condition));
    }
}
