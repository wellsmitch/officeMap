package com.zy.gis.business.lhsp.controller;

import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.Page;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.gis.business.lhsp.service.GisLhspXmxxService;
import com.zy.gis.business.lhsp.vo.GisLhspXmxxVo;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping("/gis/lhsp/xmxx")
public class GisLhspXmxxController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/lhsp/xmxx/index";
    }

    @GetMapping("/html/form")
    public String htmlForm() {
        return "gis/lhsp/xmxx/form";
    }

    @Autowired
    private GisLhspXmxxService gisLhspXmxxService;

    @GetMapping("/list")
    @ResponseBody
    public Page list(GisLhspXmxxVo gisLhspXmxxVo, Page<GisLhspXmxxVo> page) {
//        gisLhspXmxxVo.setCreateUser(((SysUser) SecurityUtils.getSubject().getPrincipal()).getUserId());
        page.setParams(gisLhspXmxxVo);
        gisLhspXmxxService.list(page);
        return page;
    }

    @GetMapping("/one")
    @ResponseBody
    public SimpleJsonResult one(GisLhspXmxxVo gisLhspXmxxVo) {
        return successJsonResult(gisLhspXmxxService.findOne(gisLhspXmxxVo));
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("id") Long id) {
        return successJsonResult(gisLhspXmxxService.findById(id));
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public SimpleJsonResult delete(@RequestBody GisLhspXmxxVo gisLhspXmxxVo) {
        gisLhspXmxxService.delete(gisLhspXmxxVo.getId());
        return successJsonResult("操作成功");
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody GisLhspXmxxVo gisLhspXmxxVo) {
//        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
//        gisLhspXmxxVo.setModifyUser(user.getUserId());
        gisLhspXmxxService.saveOrUpdate(gisLhspXmxxVo);
        return successJsonResult(gisLhspXmxxVo);
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
    }
}
