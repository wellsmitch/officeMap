package com.zy.dzzw.gis.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.ObjectMapper;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.entity.LayerProperty;
import com.zy.dzzw.gis.entity.SubjectInfo;
import com.zy.dzzw.gis.service.LayerBusinessService;
import com.zy.dzzw.gis.service.LayerConfigService;
import com.zy.dzzw.gis.service.LayerInfoService;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/gis/map")
public class MapInfoController extends BaseController {

    @Autowired
    LayerBusinessService layerBusinessService;

    @Autowired
    LayerInfoService layerInfoService;

    @Autowired
    CommonService commonService;

    @Value("${sysId}")
    String sysId;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    LayerConfigService layerConfigService;

    @GetMapping("/index/{code}")
    public String getMap(@PathVariable("code") String code, Model model, HttpServletResponse response) throws JsonProcessingException {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        List<SysRole> roleList = commonService.getUserRoleInfo(sysId, "admin");
        List<String> roleIds = roleList.stream().map(sysRole -> sysRole.getOrgCode() + "_" + sysRole.getRoleId()).collect(Collectors.toList());
        SubjectInfo subjectInfo = layerBusinessService.getSubject(code, roleIds.toArray(new String[]{}));
        model.addAttribute("subjectInfo", objectMapper.writeValueAsString(subjectInfo));
        response.addHeader("P3P", "CP=\"CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR OTI IVA IND COM\"");
        return "gis/manager/map/map";
    }

    @GetMapping("/index")
    public String getLayerMap(Model model, HttpServletResponse response) throws JsonProcessingException {
        SubjectInfo subjectInfo = new SubjectInfo();
        LayerConfigVo configVo = layerConfigService.getLayerConfig();
        subjectInfo.setMapInfo(configVo.getMapInfo());
        subjectInfo.setMapInterFace(configVo.getMapInterFace());
        model.addAttribute("subjectInfo", objectMapper.writeValueAsString(subjectInfo));
        response.addHeader("P3P", "CP=\"CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR OTI IVA IND COM\"");
        return "gis/manager/map/map";
    }

    @GetMapping("/file/resolve")
    @ResponseBody
    public SimpleJsonResult openFile(@RequestParam("file") List<MultipartFile> fileList) {
        List list = fileList.stream().map(file -> {
            String fileName = file.getOriginalFilename();
            String type = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
            if (!"txt".equals(type)) {
                throw new ServiceRuntimeException("只支持上传txt格式文件!");
            }
            String content;
            try {
                content = new String(file.getBytes(), "gb2312");
                return content;
            } catch (IOException e) {
                logger.error("坐标文件读取失败" + file.getOriginalFilename(), e);
                throw new ServiceRuntimeException("读取坐标文件内容时发生错误!");
            }
        }).collect(Collectors.toList());
        return successJsonResult(list);
    }

    @GetMapping("/testmap")
    public String testmap() {
        return "gis/manager/map/testmap";
    }

}
