package com.zy.dzzw.gis.controller;

import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.ObjectMapper;
import com.zy.core.util.SnowFlake;
import com.zy.core.util.UserAgentParserUtil;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.repository.LayerInfoRepository;
import com.zy.dzzw.gis.service.LayerBusinessService;
import com.zy.dzzw.gis.service.LayerConfigService;
import com.zy.dzzw.gis.service.SubjectInfoService;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Array;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/gis/subject")
public class SubjectInfoController extends BaseController {

    @Autowired
    SubjectInfoService subjectInfoService;

    @Autowired
    CommonService commonService;

    @Autowired
    LayerBusinessService layerBusinessService;

    @Autowired
    SnowFlake busiIdGenerator;

    @Autowired
    LayerInfoRepository layerInfoRepository;

    @Autowired
    LayerConfigService layerConfigService;

    @Value("${sysId}")
    String sysId;

    @GetMapping("/list")
    @ResponseBody
//    @Cacheable(value = "gis-subject-list")
    public SimpleJsonResult list() {
        return successJsonResult(subjectInfoService.find());
    }

    @PostMapping("/save")
    @ResponseBody
//    @CacheEvict(value = "gis-subject-list", allEntries = true)
    public SimpleJsonResult save(@RequestBody SubjectInfo subjectInfo) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        subjectInfo.setModifyUser(user.getUserId());
        return successJsonResult(subjectInfoService.save(subjectInfo));
    }

    @PostMapping("/saveImportSubject")
    @ResponseBody
    public SimpleJsonResult saveImportSubject(@RequestBody List<SubjectInfo> subjectInfo) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (subjectInfo != null && subjectInfo.size() > 0){
            LayerConfigVo layerConfigVo = layerConfigService.getLayerConfig();
            Map layerIdMap = new HashMap<Long, Long>(subjectInfo.size());
            subjectInfo.stream().filter(layer -> layerIdMap.get(layer.getId()) == null).forEach(layer -> layerIdMap.put(layer.getId(), busiIdGenerator.nextId()));
            subjectInfo.stream().filter(layer -> layerIdMap.get(layer.getId()) != null).forEach(layer -> layer.setId((Long)layerIdMap.get(layer.getId())));
            subjectInfo.stream().filter(layer -> layerIdMap.get(layer.getPid()) != null).forEach(layer -> layer.setPid((Long) layerIdMap.get(layer.getPid())));
            subjectInfo.stream().forEach(layer ->{
                layer.setModifyUser(user.getUserId());
                layer.setMapInfo(layerConfigVo.getMapInfo());
                layer.setMapInterFace(layerConfigVo.getMapInterFace());
                if (layer.getLayerInfoList() != null && layer.getLayerInfoList().size() > 0){
                    Collections.sort(layer.getLayerInfoList(), Comparator.comparing(a -> a.getLayerInfo().getLft()));
                    layer.getLayerInfoList().stream().forEach(layerInfo ->{
                        if (layerInfo.getLayerInfo() != null && StringUtils.isNotEmpty(layerInfo.getLayerInfo().getLayer())){
                            LayerInfo layerInfo1 = layerInfoRepository.findByLayer(layerInfo.getLayerInfo().getLayer());
                            if (layerInfo1 != null) {
                                layerInfo.setLayerInfo(layerInfo1);
                            }
                        }
                    });
                }
                subjectInfoService.insert(layer);
            });
        }
        return successJsonResult(subjectInfo);
    }


    @DeleteMapping("/{id}")
    @ResponseBody
//    @CacheEvict(value = "gis-subject-list", allEntries = true)
    public SimpleJsonResult remove(@PathVariable("id") Long id) {
        subjectInfoService.remove(id);
        return successJsonResult("操作成功");
    }

    @PostMapping("/move")
    @ResponseBody
//    @CacheEvict(value = "gis-subject-list", allEntries = true)
    public SimpleJsonResult move(Long sourceId, Long targetId, String type) {
        subjectInfoService.move(sourceId, targetId, type);
        return successJsonResult("操作成功");
    }

    @GetMapping("/findSubNodes/{code}")
    @ResponseBody
    public SimpleJsonResult getSubNodeByCode(@PathVariable("code") String code, HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        boolean b = UserAgentParserUtil.checkMobile(userAgent);
        List<SubjectInfo> subjectInfos = subjectInfoService.findSubNodesByCode(code);
        ObjectMapper objectMapper = new ObjectMapper();
        if (b) {
            for (SubjectInfo subjectInfo : subjectInfos) {
                if (subjectInfo.getLayerInfoList() != null && subjectInfo.getLayerInfoList().size() > 0) {
                    subjectInfo.getLayerInfoList().forEach(item -> {
                        item.getLayerInfo().setLoadUrl(item.getLayerInfo().getLoadAppUrl());
                    });
                }
            }
        }

        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<SysRole> roleList = commonService.getUserRoleInfo(sysId, user.getUserId());
        List<String> roleIds = roleList.stream().map(sysRole -> sysRole.getOrgCode() + "_" + sysRole.getRoleId()).collect(Collectors.toList());
        subjectInfos = subjectInfos.stream().map(subjectInfo -> layerBusinessService.getSubject(subjectInfo, roleIds.toArray(new String[]{}))).collect(Collectors.toList());
        // 倒序
        subjectInfos.forEach(subjectInfo -> Collections.reverse(subjectInfo.getLayerInfoList()));

        List<Map> reslutMap = new ArrayList<>();
        for (SubjectInfo sub : subjectInfos) {
            Map map = objectMapper.convertValue(sub, Map.class);
            reslutMap.add(map);
            Long createTime = map.get("createTime") == null ? System.currentTimeMillis() : (Long) map.get("createTime");
            Long modifyTime = map.get("modifyTime") == null ? System.currentTimeMillis() : (Long) map.get("modifyTime");
            map.put("createTime",DateFormatUtils.format(createTime,"yyyy-MM-dd HH:mm:ss"));
            map.put("modifyTime",DateFormatUtils.format(modifyTime,"yyyy-MM-dd HH:mm:ss"));

            List<Map> layerInfoList = map.get("layerInfoList") == null ? new ArrayList() : (List) map.get("layerInfoList");
            if (CollectionUtils.isEmpty(layerInfoList)) {
                continue;
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
        }
        return successJsonResult(reslutMap);
    }

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/manager/subject/index";
    }
}
