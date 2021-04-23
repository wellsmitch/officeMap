package com.zy.gis.business.lhsp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.Page;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.SnowFlake;
import com.zy.gis.business.lhsp.entity.CodeLandPlanUsage;
import com.zy.gis.business.lhsp.service.CodeLandPlanUsageService;
import com.zy.gis.business.lhsp.service.GisLhspXmfaService;
import com.zy.gis.business.lhsp.vo.GisLhspXmfaVo;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.omg.CORBA.PRIVATE_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/gis/lhsp/xmfa")
public class GisLhspXmfaController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/lhsp/xmfa/index";
    }

    @GetMapping("/html/form")
    public String htmlForm() {
        return "gis/lhsp/xmfa/form";
    }

    @Autowired
    private GisLhspXmfaService gisLhspXmfaService;

    @Autowired
    private CodeLandPlanUsageService codeLandPlanUsageService;

    @Resource(name = "busiIdGenerator")
    SnowFlake snowFlake;

    @GetMapping("/list")
    @ResponseBody
    public Page list(GisLhspXmfaVo gisLhspXmfaVo, Page<GisLhspXmfaVo> page) {
//        gisLhspXmfaVo.setCreateUser(((SysUser) SecurityUtils.getSubject().getPrincipal()).getUserId());
        page.setParams(gisLhspXmfaVo);
        gisLhspXmfaService.list(page);
        return page;
    }



    @GetMapping("/getTmpKey")
    @ResponseBody
    public SimpleJsonResult getTmpKey() {
        return successJsonResult(snowFlake.nextId());
    }

    @GetMapping("/one")
    @ResponseBody
    public SimpleJsonResult one(GisLhspXmfaVo gisLhspXmfaVo) {
        return successJsonResult(gisLhspXmfaService.findOne(gisLhspXmfaVo));
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("id") Long id) {
        return successJsonResult(gisLhspXmfaService.findById(id));
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public SimpleJsonResult delete(@RequestBody GisLhspXmfaVo gisLhspXmfaVo) {
        gisLhspXmfaService.delete(gisLhspXmfaVo.getId());
        return successJsonResult("操作成功");
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody GisLhspXmfaVo gisLhspXmfaVo) {
//        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
//        gisLhspXmfaVo.setModifyUser(user.getUserId());
        gisLhspXmfaService.saveOrUpdate(gisLhspXmfaVo);
        return successJsonResult(gisLhspXmfaVo);
    }

    @RequestMapping("/getLandType")
    public ModelAndView getLandType(@RequestParam Map<String, String> params) throws JsonProcessingException {
        ModelAndView mv = new ModelAndView("gis/lhsp/commonTree");
        ObjectMapper objectMapper = new ObjectMapper();
        List<CodeLandPlanUsage> treeData = new ArrayList<CodeLandPlanUsage>();
        CodeLandPlanUsage cp = new CodeLandPlanUsage();
        String type = params.get("id") == null ? "" : params.get("id");
        String [] typeArr = type.split(",|，");
        for (String arr : typeArr){
            cp.setType(arr);
            treeData.addAll(codeLandPlanUsageService.list(cp));
        }
        mv.addObject("treeData", objectMapper.writeValueAsString(treeData));
        return mv;
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
    }
}
