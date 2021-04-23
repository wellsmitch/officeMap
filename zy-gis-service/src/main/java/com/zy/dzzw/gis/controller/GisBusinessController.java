package com.zy.dzzw.gis.controller;

import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerProperty;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.service.LayerBusinessService;
import com.zy.dzzw.gis.service.LayerInfoService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/gis/business")
public class GisBusinessController extends BaseController {

    @Autowired
    LayerBusinessService layerBusinessService;

    @Autowired
    LayerInfoService layerInfoService;

    @Autowired
    CommonService commonService;

    @Value("${sysId}")
    String sysId;

    @GetMapping("/{code}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("code") String code, HttpServletRequest request) {
        //SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        //List<SysRole> roleList = commonService.getUserRoleInfo(sysId, user.getUserId());
		List<SysRole> roleList = commonService.getUserRoleInfo(sysId, "admin");
        List<String> roleIds = roleList.stream().map(sysRole -> sysRole.getOrgCode() + "_" + sysRole.getRoleId()).collect(Collectors.toList());
        SubjectInfo subjectInfo = layerBusinessService.getSubject(code, roleIds.toArray(new String[]{}));

        return successJsonResult(subjectInfo);
    }

    @GetMapping("selectLand")
    public String selectLand() {
        return "gis/lhsp/selectLand";
    }

}
