package com.zy.gis.business.xmxz.controller;

import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.Page;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.gis.business.xmxz.service.XmxzXmfaService;
import com.zy.gis.business.xmxz.vo.XmxzXmfaVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping("/xmxz/xmfa")
public class XmxzXmfaController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "xmxz/xmfa/index";
    }

    @GetMapping("/html/form")
    public String htmlForm() {
        return "xmxz/xmfa/form";
    }

    @Autowired
    private XmxzXmfaService xmxzXmfaService;

    @GetMapping("/list")
    @ResponseBody
    public Page list(XmxzXmfaVo xmxzXmfaVo, Page<XmxzXmfaVo> page) {
        page.setParams(xmxzXmfaVo);
        xmxzXmfaService.list(page);
        return page;
    }

    @GetMapping("/one")
    @ResponseBody
    public SimpleJsonResult one(XmxzXmfaVo xmxzXmfaVo) {
        return successJsonResult(xmxzXmfaService.findOne(xmxzXmfaVo));
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("id") Long id) {
        return successJsonResult(xmxzXmfaService.findById(id));
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public SimpleJsonResult delete(@RequestBody XmxzXmfaVo xmxzXmfaVo) {
        xmxzXmfaService.delete(xmxzXmfaVo.getId());
        return successJsonResult("操作成功");
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody XmxzXmfaVo xmxzXmfaVo) {
//        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
//        xmxzXmfaVo.setModifyUser(user.getUserId());
        xmxzXmfaService.saveOrUpdate(xmxzXmfaVo);
        return successJsonResult(xmxzXmfaVo);
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
    }
}
