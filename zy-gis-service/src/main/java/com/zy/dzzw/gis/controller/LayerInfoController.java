package com.zy.dzzw.gis.controller;

import com.alibaba.fastjson.JSONObject;
import com.zy.common.sys.entity.SysUser;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.SnowFlake;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerInfoCluster;
import com.zy.dzzw.gis.entity.LayerInfoGraduatedSymbol;
import com.zy.dzzw.gis.entity.TreeObject;
import com.zy.dzzw.gis.enums.LayerInfoEnums;
import com.zy.dzzw.gis.service.LayerInfoService;
//import com.zy.dzzw.gis.service.OverlayPolygonService;
import com.zy.dzzw.gis.service.OverlayPolygonService;
import com.zy.dzzw.gis.vo.OverlayPolygonParam;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.codehaus.groovy.runtime.DefaultGroovyMethods.collect;


@Controller
@RequestMapping("/gis/layer")
public class LayerInfoController extends BaseController {

    @Autowired
    LayerInfoService layerInfoService;
    @Autowired
    private OverlayPolygonService overlayPolygonService;
    @Autowired
    SnowFlake busiIdGenerator;

    @PostMapping("/overlayPolygon")
    @ResponseBody
    public SimpleJsonResult overlayPolygon(@RequestBody OverlayPolygonParam param) {
        Object jsonObject = null;
        try {
            jsonObject = overlayPolygonService.overlayPolygon(param);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("叠加分析失败" + param.getLayerName(), e);
            return failureJsonResult(param.getLayerName() + "叠加分析失败:(" + e + ")");
        }
        return successJsonResult(jsonObject);

    }

    @GetMapping("/list")
    @ResponseBody
    public SimpleJsonResult list() {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (user != null) {
            return successJsonResult(layerInfoService.find(user));
        }
        return successJsonResult(layerInfoService.find());
    }


    @PostMapping("/saveImportLayer")
    @ResponseBody
    public SimpleJsonResult saveImportLayer(@RequestBody List<LayerInfo> layerInfo) {
        Long baseLayerId = null;
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (layerInfo != null && layerInfo.size() > 0) {
            baseLayerId = layerInfo.get(0).getPid();
            Map layerIdMap = new HashMap<Long, Long>(layerInfo.size());
            layerInfo.stream().filter(layer -> layerIdMap.get(layer.getId()) == null).forEach(layer -> layerIdMap.put(layer.getId(), busiIdGenerator.nextId()));
            layerInfo.stream().filter(layer -> layerIdMap.get(layer.getId()) != null).forEach(layer -> layer.setId((Long) layerIdMap.get(layer.getId())));
            layerInfo.stream().filter(layer -> layerIdMap.get(layer.getPid()) != null).forEach(layer -> layer.setPid((Long) layerIdMap.get(layer.getPid())));

            layerInfo.stream().forEach(layer -> {
                if (layer.getProperties() != null && layer.getProperties().length > 0) {
                    for (Object property : layer.getProperties()) {
                        Map map = (Map) property;
                        Long refId = map.get("refId") == null ? Long.valueOf(0) : Long.valueOf(map.get("refId").toString());
                        if (layerIdMap.get(refId) != null) {
                            map.put("refId", layerIdMap.get(refId));
                        }
                    }
                }
                layer.setModifyUser(user.getUserId());
                layerInfoService.insert(layer);
            });
        }
        // 更新目录下图层属性
        List<LayerInfo> childrenLayerInfo = layerInfoService.findChildren(baseLayerId);
        childrenLayerInfo.forEach(item -> {
            if (LayerInfoEnums.Type.layer.getCode().equals(item.getType())) {
                this.updateLayerNode(item);
            }
        });
        return successJsonResult(layerInfo);
    }


    @PostMapping("/class/save")
    @ResponseBody
    public SimpleJsonResult classSave(@RequestBody LayerInfo layerInfo) {
        layerInfo.setType(LayerInfoEnums.Type.classify.getCode());
        LayerInfo saveLayerInfo = save(layerInfo);
        // 更新目录下图层属性
        List<LayerInfo> childrenLayerInfo = layerInfoService.findChildren(saveLayerInfo.getId());
        childrenLayerInfo.forEach(item -> {
            if (LayerInfoEnums.Type.layer.getCode().equals(item.getType())) {
                this.updateLayerNode(item);
            }
        });
        return successJsonResult(layerInfo);
    }

    @PostMapping("/info/save")
    @ResponseBody
    public SimpleJsonResult infoSave(@RequestBody JSONObject jsonObject) {
        String loadType = jsonObject.getString("loadType");
        LayerInfo layerInfo;
        if ("cluster".equals(loadType)) {
            layerInfo = jsonObject.toJavaObject(LayerInfoCluster.class);
        } else if ("graduatedSymbol".equals(loadType)) {
            layerInfo = jsonObject.toJavaObject(LayerInfoGraduatedSymbol.class);
        } else {
            layerInfo = jsonObject.toJavaObject(LayerInfo.class);
        }
        return successJsonResult(save(layerInfo));
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public SimpleJsonResult remove(@PathVariable("id") Long id) {
        layerInfoService.remove(id);
        return successJsonResult("操作成功");
    }

    @PostMapping("/move")
    @ResponseBody
    public SimpleJsonResult move(Long sourceId, Long targetId, String type) {
        layerInfoService.move(sourceId, targetId, type);
        LayerInfo layerInfo = layerInfoService.findById(sourceId);
        if (layerInfo != null) {
            if (LayerInfoEnums.Type.layer.getCode().equals(layerInfo.getType())) {
                this.updateLayerNode(layerInfo);
            } else if (LayerInfoEnums.Type.classify.getCode().equals(layerInfo.getType())) {
                List<LayerInfo> childrenLayerInfo = layerInfoService.findChildren(layerInfo.getId());
                childrenLayerInfo.forEach(item -> {
                    if (LayerInfoEnums.Type.layer.getCode().equals(item.getType())) {
                        this.updateLayerNode(item);
                    }
                });
            }
        }
        return successJsonResult("操作成功");
    }

    @RequestMapping("/findSubject/{id}")
    @ResponseBody
    public SimpleJsonResult findSubject(@PathVariable("id") Long id) {
        LayerInfo layerInfo = layerInfoService.findById(id);
        String analysisSqlTemplate = layerInfo.getAnalysisSqlTemplate();
        List<LayerInfo> layerInfoList = new ArrayList<>();
        if (layerInfo != null) {
            layerInfoList.add(layerInfo);
            if (LayerInfoEnums.Type.classify.getCode().equals(layerInfo.getType())) {
                layerInfoList.addAll(layerInfoService.findChildren(layerInfo));
            }
        }
        return successJsonResult(layerInfoList);
    }

    private LayerInfo save(LayerInfo layerInfo) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        layerInfo.setModifyUser(user.getUserId());
        return layerInfoService.save(layerInfo);
    }

    /**
     * 更新图层属性，有序
     *
     * @param layerInfo
     */
    private void updateLayerNode(LayerInfo layerInfo) {
        List<LayerInfo> parentLayer = layerInfoService.findParent(layerInfo);
        parentLayer.sort(Comparator.comparingInt(TreeObject::getLft).reversed());
        List<Object> list = new ArrayList<>();
        List<String> keys = new ArrayList<>();
        // 获取图层本身属性
        if (layerInfo.getProperties() != null && layerInfo.getProperties().length > 0) {
            for (Object property : layerInfo.getProperties()) {
                Map map = (Map) property;
                if (map == null || keys.contains(map.get("field"))) {
                    continue;
                }
                Long refId = map.get("refId") == null ? Long.valueOf(0) : Long.valueOf(map.get("refId").toString());
                if (refId == 0 || layerInfo.getId().equals(refId)) {
                    map.put("refId", layerInfo.getId());
                    map.put("refName", layerInfo.getName());
                    keys.add(String.valueOf(map.get("field")));
                }
                list.add(property);
            }
        }
        // 父级属性
        List<Object> parentNode = new ArrayList();
        if (!CollectionUtils.isEmpty(parentLayer)) {
            parentLayer.forEach(layer -> {
                if (layer.getProperties() != null && layer.getProperties().length > 0) {
                    for (Object property : layer.getProperties()) {
                        Map map = (Map) property;
                        if (map == null || keys.contains(map.get("field"))) {
                            continue;
                        }
                        map.put("refId", layer.getId());
                        map.put("refName", layer.getName());
                        parentNode.add(property);
                        keys.add(String.valueOf(map.get("field")));
                    }
                }
            });
        }
        Map<String, Object> parentMap = parentNode.stream().collect(Collectors.toMap((x) -> ((Map) x).get("field").toString(), Function.identity()));
        List<Object> newlist = new ArrayList<>();
        Iterator<Object> iterator = list.iterator();
        while (iterator.hasNext()) {
            Map map = (Map) iterator.next();
            Long refId = map.get("refId") == null ? Long.valueOf(0) : Long.valueOf(map.get("refId").toString());
            String field = map.get("field") == null ? "" : map.get("field").toString();
            if (!layerInfo.getId().equals(refId) && parentMap.get(field) == null) {
                continue;
            } else if (!layerInfo.getId().equals(refId) && parentMap.get(field) != null) {
                // map属性合并
                newlist.add(parentMap.get(field));
            } else {
                newlist.add(map);
            }
        }
        List<String> set = newlist.stream().map((x) -> ((Map) x).get("field").toString()).collect(Collectors.toList());
        parentNode.forEach(item -> {
            Map map = (Map) item;
            String field = map.get("field") == null ? "" : map.get("field").toString();
            // list 不包含
            if (!set.contains(field)) {
                set.add(field);
                newlist.add(item);
            }
        });
        layerInfo.setProperties(newlist.toArray(new Object[newlist.size()]));
        save(layerInfo);
    }

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/manager/layer/index";
    }

    @GetMapping("/html/resource")
    public String resource() {
        return "gis/manager/layer/index";
    }

    @GetMapping("/app/index")
    public String appIndex() {
        return "gis/manager/app/index";
    }

    @GetMapping("/html/toolbar")
    public String toolbar() {
        return "gis/manager/toolbar/index";
    }

    @GetMapping("/html/xmxzgis")
    public String htmlXmxzGis() {
        return "gis/manager/xmxz/xmxzgis";
    }

}
