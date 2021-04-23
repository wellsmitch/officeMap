package com.zy.gis.business.lhsp.controller;

import com.mongodb.client.gridfs.GridFSDownloadStream;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/gis/lhsp")
public class GisLhspController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/lhsp/index";
    }

    @GetMapping("/html/target")
    public String htmlTarget() {
        return "gis/lhsp/target";
    }

    @RequestMapping("/image/url")
    @ResponseBody
    public SimpleJsonResult getImageUrl(String landCode, HttpServletRequest request) throws URISyntaxException {
//        File file = new File(this.getClass().getResource("lhsp").toURI());
        URL url = this.getClass().getResource("/lhsp");
        File file = new File(url.toURI());
        List<String> list = new ArrayList<>();
        for (File child : file.listFiles()) {
            if (child.getName().equals(landCode)) {
                for (File listFile : child.listFiles()) {
                    String imageUrl = request.getContextPath() + "/gis/lhsp/image/preview/" + landCode + "/" + listFile.getName();
                    list.add(imageUrl);
                }
            }
        }
        return successJsonResult(list);
    }

    @RequestMapping("/image/preview/{landCode}/{fileName}")
    @ResponseBody
    public void getImagePreview(@PathVariable("landCode") String landCode, @PathVariable("fileName") String fileName, HttpServletRequest request, HttpServletResponse response) throws URISyntaxException, FileNotFoundException {
        String uri = request.getRequestURI();
        String[] arr = uri.split("\\.");
        String suffix = arr[arr.length - 1];
        URL url = this.getClass().getResource("/lhsp/" + landCode + "/" + fileName + "." + suffix);
        File file = new File(url.toURI());
        FileInputStream fileInputStream = new FileInputStream(file);
        printFile(response, fileInputStream);
    }

    private void printFile(HttpServletResponse response, InputStream stream) {
        OutputStream out = null;
        int l = 0;
        try {
//            response.setHeader("Content-type", "text/html;charset=UTF-8");
//            response.setCharacterEncoding("GBK");
            byte[] bytes = new byte[2048];
            if (stream instanceof GridFSDownloadStream) {
                GridFSDownloadStream gridFSDownloadStream = (GridFSDownloadStream) stream;
                response.setContentLength(Long.valueOf(gridFSDownloadStream.getGridFSFile().getLength()).intValue());
            }

            if (stream != null) {
                out = response.getOutputStream();

                while ((l = stream.read(bytes)) != -1) {
                    out.write(bytes, 0, l);
                }
            }
        } catch (Exception e) {
            logger.error("图片读取失败", e);
        } finally {
            try {
                if (stream != null) {
                    stream.close();
                }
            } catch (IOException e) {
                logger.error("文件流关闭失败", e);
            }
        }
    }
}
