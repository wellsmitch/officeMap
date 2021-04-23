package com.zy.dzzw.gis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TestMainController {
    @RequestMapping("test")
    public ModelAndView testPage() {
        ModelAndView mv = new ModelAndView("test");
        int[][] arr = {{111,222},{4,5},{7,8}};
        mv.addObject("arr", arr);
        return mv;
    }
}
