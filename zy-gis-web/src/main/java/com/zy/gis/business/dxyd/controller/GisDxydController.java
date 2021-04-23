package com.zy.gis.business.dxyd.controller;

import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.service.LayerInfoService;
import com.zy.dzzw.gis.service.MapGisService;
import com.zy.dzzw.gis.util.ExcelUtil;
import com.zy.dzzw.gis.util.ZipUtil;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@Controller
@RequestMapping("/gis/dxyd")
public class GisDxydController extends BaseController {

    @GetMapping("/html/index")
    public String htmlIndex() {
        return "gis/dxyd/index";
    }

    @Autowired
    MapGisService mapGisService;

    @Autowired
    LayerInfoService layerInfoService;

    @RequestMapping("/importLand")
    @ResponseBody
    public SimpleJsonResult importLand(@RequestParam("file") MultipartFile file, @RequestParam("xLayerName") String xLayerName, @RequestParam("mLayerName") String mLayerName) throws IOException {

        String fileName = file.getOriginalFilename();
        String type = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        if (!".zip".equals(type)) {
            return failureJsonResult("请上传zip类型压缩文件");
        }
        String path = this.getClass().getResource("/").getPath() + "/dxydTemp";
        FileUtils.deleteQuietly(new File(path));
        new File(path).mkdirs();
        String dirPath = path + "/" + UUID.randomUUID().toString();
        String zipFilePath = dirPath + type;
        File zipFile = new File(zipFilePath);
        file.transferTo(zipFile);
        ZipUtil.unZip(zipFile.getPath());
//        String dirPath = "D:\\test\\低效用地数据";
//        return successJsonResult(true);
        List xDataList = new ArrayList();
        List mDataList = new ArrayList();
        File dir = new File(dirPath);
        File[] excelFile = dir.listFiles(pathname -> pathname.isFile() && (pathname.getName().endsWith("xls") || pathname.getName().endsWith("xlsx")));
        Map<String, List<String>> propMap = new HashMap<>(1024);
        List<String> heads = null;
        if (excelFile.length > 0) {
            InputStream inputStream = new FileInputStream(excelFile[0]);
            try {
                List<List<String>> propList = ExcelUtil.getListByExcel(inputStream, excelFile[0].getName());
                if (propList.size() > 0) {
                    heads = propList.get(0);
                }
                for (List<String> strings : propList) {
                    if (strings.size() > 2) {
                        propMap.put(strings.get(0).trim() + "" + strings.get(1).toString(), strings);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    inputStream.close();
                } catch (Exception x) {
                    x.printStackTrace();
                }
            }
        }

        for (File listFile : dir.listFiles()) {
            if (!listFile.isDirectory()) {
                continue;
            }
            String xzqh = listFile.getName();
            for (File file1 : listFile.listFiles()) {
                int suffixIndex = file1.getName().lastIndexOf(".");
                if (suffixIndex == -1) {
                    continue;
                }
                if (!".txt".equals(file1.getName().substring(suffixIndex))) {
                    continue;
                }
                String xh = file1.getName().substring(0, suffixIndex);
                try {
                    List<String> condList = FileUtils.readLines(file1, "GBK");
                    List<List<String>> ss = new ArrayList<>();
                    List<String> s1 = new ArrayList<>();
                    condList.add("");
                    boolean mark = false;
                    for (String s : condList) {
                        if (s.length() > 0 && 'J' == s.charAt(0)) {
                            mark = true;
                            String[] dots = s.split(",");
                            Double tempX = Double.valueOf(dots[2]);
                            Double tempY = Double.valueOf(dots[3]);
                            String x = tempX.compareTo(tempY) > 0 ? dots[2] : dots[3];
                            String y = tempX.compareTo(tempY) > 0 ? dots[3] : dots[2];
                            String str = x.trim() + "," + y.trim();

                            if (s1.contains(str)) {
                                s1.add(str);
                                s1 = new ArrayList<>();
                            } else {
                                s1.add(str);
                            }
                            if (!ss.contains(s1) && s1.size() > 0) {
                                ss.add(s1);
                            }

                        } else {
                            mark = false;
                            StringBuilder sb = new StringBuilder();
                            if (ss.size() > 0) {
                                boolean m = false;
                                for (int i = 0; i < ss.size(); i++) {
                                    List<String> cord = ss.get(i);
                                    if (cord.get(0).equals(cord.get(cord.size() - 1))) {
                                        m = true;
                                    }
                                    String text = String.join(" ", cord);
                                    sb.append(text);
                                    sb.append("*");
                                }
                                sb.deleteCharAt(sb.length() - 1);
                                Map<String, Object> data = new HashMap<>();
                                data.put("行政区代码", xzqh);
                                data.put("行政区划代码", xzqh);
                                data.put("序号", xh);

                                List<String> props = propMap.get(xh + xzqh);
                                if (props != null && props.size() > 0) {
                                    for (int i = 0; i < heads.size(); i++) {
                                        data.put(heads.get(i), props.get(i));
                                    }
                                }

                                data.put("coordinates", sb.toString());

                                if (m) {
                                    mDataList.add(data);
                                } else {
                                    xDataList.add(data);
                                }
                            }
                            ss = new ArrayList<>();
                            s1 = new ArrayList<>();
                        }
                    }
                } catch (Exception e) {
                    throw new ServiceRuntimeException("行政区划：" + xzqh + ",文件：" + file1.getName() + "坐标存在错误");
                }
            }
        }
        List resultList = new ArrayList();
        if (mDataList.size() > 0) {
            LayerInfo layerInfoM = layerInfoService.findByLayer(mLayerName);
            Object result = mapGisService.insertFeature(layerInfoM, mDataList);
            resultList.add(result);
        }
        if (xDataList.size() > 0) {
            LayerInfo layerInfoX = layerInfoService.findByLayer(xLayerName);
            Object result = mapGisService.insertFeature(layerInfoX, xDataList);
            resultList.add(result);
        }
        return successJsonResult(resultList);
    }
}
