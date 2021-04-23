package com.zy.dzzw.gis.controller;

import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.service.SubjectRoleService;
import com.zy.dzzw.gis.vo.SubjectRoleVo;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/gis/subject/role")
public class SubjectRoleController extends BaseController {

    @Autowired
    SubjectRoleService subjectRoleService;

    @GetMapping("/{roleId}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("roleId") String roleId) {
        return successJsonResult(subjectRoleService.findByRoleId(roleId));
    }

    @GetMapping("/{roleId}/{subjectCode}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("roleId") String roleId,@PathVariable("subjectCode") String subjectCode) {
        return successJsonResult(subjectRoleService.findByRoleId(roleId,subjectCode));
    }


    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody SubjectRoleVo subjectRoleVo) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        subjectRoleVo.getSubjectRoleList().forEach(subjectRole -> {
            subjectRole.setModifyUser(user.getUserId());
            subjectRole.setRoleId(subjectRoleVo.getRoleId());
        });
        return successJsonResult(subjectRoleService.save(subjectRoleVo));
    }





}
