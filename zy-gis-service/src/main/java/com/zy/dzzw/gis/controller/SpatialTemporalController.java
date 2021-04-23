package com.zy.dzzw.gis.controller;

import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.entity.SpatialTemporalInfo;
import com.zy.dzzw.gis.service.SpatialTemporalConfigService;

@Controller
@RequestMapping("/gis/spatialTemporal/config")
public class SpatialTemporalController extends BaseController {

    @Autowired
    SpatialTemporalConfigService spatialTemporalConfigService;
    
    @GetMapping("/list")
    @ResponseBody
    public SimpleJsonResult list(@RequestParam("name") String name) {
        return successJsonResult(spatialTemporalConfigService.find(name));
    }

    @GetMapping("/{id}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("id") long id) {
        return successJsonResult(spatialTemporalConfigService.findById(id));
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody SpatialTemporalInfo spatialTemporal) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        spatialTemporal.setModifyUser(user.getUserId());
        return successJsonResult(spatialTemporalConfigService.save(spatialTemporal));
    }
    
    @PostMapping("/remove")
    @ResponseBody
    public SimpleJsonResult remove(@RequestBody SpatialTemporalInfo spatialTemporal) {
        return successJsonResult(spatialTemporalConfigService.remove(spatialTemporal));
    }
}
