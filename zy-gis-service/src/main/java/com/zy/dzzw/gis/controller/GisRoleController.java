package com.zy.dzzw.gis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/gis/role")
public class GisRoleController {

    @GetMapping("/html/list")
    public String htmlIndex() {
        return "gis/manager/role/list";
    }
}
