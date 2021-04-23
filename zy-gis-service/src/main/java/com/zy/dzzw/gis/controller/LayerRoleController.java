package com.zy.dzzw.gis.controller;

import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.service.LayerRoleService;
import com.zy.dzzw.gis.vo.LayerRoleVo;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/gis/layer/role")
public class LayerRoleController extends BaseController {

    @Autowired
    LayerRoleService layerRoleService;

    @GetMapping("/{roleId}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("roleId") String roleId) {
        return successJsonResult(layerRoleService.findByRoleId(roleId));
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody LayerRoleVo layerRoleVo) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        layerRoleVo.getLayerList().forEach(layerRole -> {
            layerRole.setRoleId(layerRoleVo.getRoleId());
            layerRole.setModifyUser(user.getUserId());
            layerRole.setLayerId(layerRole.getLayerInfo().getId());
        });
        return successJsonResult(layerRoleService.save(layerRoleVo));
    }
}
