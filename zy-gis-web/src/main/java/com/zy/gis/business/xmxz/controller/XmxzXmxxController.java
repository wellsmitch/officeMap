package com.zy.gis.business.xmxz.controller;

import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.Page;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.gis.business.xmxz.service.XmxzXmxxService;
import com.zy.gis.business.xmxz.vo.XmxzXmxxVo;
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
@RequestMapping("/xmxz/xmxx")
public class XmxzXmxxController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "xmxz/xmxx/index";
    }

    @GetMapping("/html/form")
    public String htmlForm() {
        return "xmxz/xmxx/form";
    }

    @Autowired
    private XmxzXmxxService xmxzXmxxService;

    @GetMapping("/list")
    @ResponseBody
    public Page list(XmxzXmxxVo xmxzXmxxVo, Page<XmxzXmxxVo> page) {
//        xmxzXmxxVo.setCreateUser(((SysUser) SecurityUtils.getSubject().getPrincipal()).getUserId());
        page.setParams(xmxzXmxxVo);
        xmxzXmxxService.list(page);
        return page;
    }

    @GetMapping("/one")
    @ResponseBody
    public SimpleJsonResult one(XmxzXmxxVo xmxzXmxxVo) {
        return successJsonResult(xmxzXmxxService.findOne(xmxzXmxxVo));
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public SimpleJsonResult get(@PathVariable("id") Long id) {
        return successJsonResult(xmxzXmxxService.findById(id));
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public SimpleJsonResult delete(@RequestBody XmxzXmxxVo xmxzXmxxVo) {
        xmxzXmxxService.delete(xmxzXmxxVo.getId());
        return successJsonResult("操作成功");
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody XmxzXmxxVo xmxzXmxxVo) {
//        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
//        xmxzXmxxVo.setModifyUser(user.getUserId());
        xmxzXmxxService.saveOrUpdate(xmxzXmxxVo);
        return successJsonResult(xmxzXmxxVo);
    }

    @InitBinder
    protected void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
        binder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd"), true));
    }
}
