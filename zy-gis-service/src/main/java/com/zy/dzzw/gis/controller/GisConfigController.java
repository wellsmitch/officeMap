package com.zy.dzzw.gis.controller;

import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.UserAgentParserUtil;
import com.zy.dzzw.gis.service.LayerConfigService;
import com.zy.dzzw.gis.vo.LayerConfigVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Controller("gisConfigC")
@RequestMapping("/gis/config")
public class GisConfigController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/manager/config/index";
    }

    @Autowired
    LayerConfigService layerConfigService;

    @GetMapping("/info")
    @ResponseBody
    public SimpleJsonResult get(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        boolean b = UserAgentParserUtil.checkMobile(userAgent);
        LayerConfigVo layerConfigVo = layerConfigService.getLayerConfig();
        if(b){
            layerConfigVo.setMapInfo(layerConfigVo.getMapAppInfo());
            layerConfigVo.setMapInterFace(layerConfigVo.getMapAppInterFace());
        };
        return successJsonResult(layerConfigVo);
    }

    @PostMapping("/save")
    @ResponseBody
    public SimpleJsonResult save(@RequestBody LayerConfigVo layerConfigVo) {
        return successJsonResult(layerConfigService.save(layerConfigVo));
    }
}
