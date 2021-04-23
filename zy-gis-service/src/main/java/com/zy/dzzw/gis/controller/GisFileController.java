package com.zy.dzzw.gis.controller;

import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.util.AnalysisDxf;
import com.zy.dzzw.gis.util.ShapeUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/gis/file")
public class GisFileController extends BaseController {

    @RequestMapping("/cad/open")
    @ResponseBody
    public SimpleJsonResult cadOpen(@RequestParam("file") List<MultipartFile> fileList) {
        List list = new ArrayList();
        for(MultipartFile file : fileList){
            Map map = new HashMap();
            String fileName = file.getOriginalFilename();
            String type = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
            AnalysisDxf analysisDxf = null;
            if (!"dwg".equals(type) && !"dxf".equals(type)) {
                throw new ServiceRuntimeException("只支持上传dwg或dxf格式文件!");
            }
            else{
                try {
                    analysisDxf = new AnalysisDxf(file.getInputStream(),fileName);
                } catch (IOException e) {
                    e.printStackTrace();
                }finally {
                    try {
                        file.getInputStream().close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            //布局
            map.put("layers",analysisDxf.getLayers());
            //所有坐标点
            map.put("pointContent",analysisDxf.getPoint2DContent());
            //所有图元
            map.put("pels",analysisDxf.getAlllist());
            list.add(map);
        }
        return successJsonResult(list);
    }

    @RequestMapping("/export/file")
    public void export(@RequestParam("type") String type,@RequestParam("fileName") String fileName,@RequestParam("cordinate") String cordinate,
                       HttpServletRequest request, HttpServletResponse response) {
        String export = null;
        InputStream is = null;
        OutputStream out = null;
        File file = null;
        switch (type){
            case "txt":
                export = this.exportTxt(cordinate);
                is = new ByteArrayInputStream(export.getBytes());
                fileName = fileName+".txt";
                break;
            case "standardTxt":
                export = this.exporStandardTxt(cordinate);
                is = new ByteArrayInputStream(export.getBytes());
                fileName = fileName+".txt";
                break;
            case "shp":
                ShapeUtil shap = new ShapeUtil();
                file = shap.writeShape(fileName + ".shp",cordinate);
                if (file != null){
                    try {
                        is = new FileInputStream(file);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
                fileName = fileName+".zip";
                break;
            default:
                export = "未找到导出文件类型";
                is = new ByteArrayInputStream(export.getBytes());
                fileName = fileName+".txt";
        }
        if (is == null){
            export = "导出文件失败!";
            is = new ByteArrayInputStream(export.getBytes());
            fileName = fileName+".txt";
        }
        try {
            fileName = this.getFileName(request.getHeader("User-Agent"), fileName);
        } catch (UnsupportedEncodingException e2) {
            e2.printStackTrace();
        }
        response.setHeader("Content-Type", "application/octet-stream");
        response.setHeader("Content-Disposition", "attatchment;filename=" + fileName);
        response.setCharacterEncoding("UTF-8");

        // 向浏览器写入压缩文件
        try {
            out = response.getOutputStream();
            byte[] bytes = new byte[1024];
            int l;
            while ((l = is.read(bytes)) != -1) {
                out.write(bytes, 0, l);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (is != null) {
                try {
                    is.close();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
            if (file != null && file.exists()){
                file.delete();
            }
        }
    }

    private String exportTxt(String cordinate){
        StringBuffer exportT = new StringBuffer();
        String [] cordinateArr = cordinate.split("\\*");
        for (String str : cordinateArr){
            String [] cordinates = str.split(" ");
            for (String cd : cordinates){
                exportT.append(cd).append("\r\n");
            }
        }
        return exportT.toString();
    }

    private String exporStandardTxt(String cordinate){
        StringBuffer exportT = new StringBuffer();
        String [] cordinateArr = cordinate.split("\\*");
        int index = 0;
        int a = 0;
        exportT.append("[属性描述]").append("\r\n");
        exportT.append("坐标系=2000国家大地坐标系").append("\r\n");
        exportT.append("几度分带=3").append("\r\n");
        exportT.append("投影类型=高斯克吕格").append("\r\n");
        exportT.append("计量单位=").append("\r\n");
        exportT.append("带号=38").append("\r\n");
        exportT.append("精度=0.001").append("\r\n");
        exportT.append("转换参数=,,,,,,").append("\r\n");
        exportT.append("[地块坐标]").append("\r\n");

        int cordinateNumber = 0;
        for (String str : cordinateArr){
            String [] cordinates = str.split(" ");
            cordinateNumber += cordinates.length;
        }
        exportT.append(cordinateNumber).append(",,").append(cordinateArr.length).append(",,,,,,@").append("\r\n");

        for (String str : cordinateArr){
            a++;
            String [] cordinates = str.split(" ");
            String first = "";
            int firstIndex = 0;
            for (int b = 0; b < cordinates.length; b++ ){
                ++cordinateNumber;
                if (b == cordinates.length - 1 && cordinates.length >2){
                    if (!first.equals(cordinates[b])){
                        exportT.append("J"+(++index)).append(",").append(a).append(",").append(cordinates[b]).append("\r\n");
                        exportT.append("J"+firstIndex).append(",").append(a).append(",").append(first).append("\r\n");
                    } else {
                        exportT.append("J"+firstIndex).append(",").append(a).append(",").append(first).append("\r\n");
                    }
                } else {
                    exportT.append("J"+(++index)).append(",").append(a).append(",").append(cordinates[b]).append("\r\n");
                }
                if (b == 0){
                    first = cordinates[b];
                    firstIndex = index;
                }
            }
        }

        return exportT.toString();
    }
}
