
package com.zy.common.dataform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.zy.common.dataform.entity.UploadCategory;
import com.zy.common.dataform.entity.UploadFile;
import com.zy.common.dataform.service.UploadService;
import com.zy.common.sys.entity.SysUser;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.ObjectMapper;
import com.zy.core.util.SnowFlake;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping({"/upload"})
public class UploadController extends BaseController {
    @Resource
    private UploadService uploadService;
    @Resource
    private SnowFlake fileIdGenerator;
    @Resource
    private ObjectMapper objectMapper;
   // @Resource
//    private HistoryService historyService;
//    @Resource
//    private ManagementService managementService;

    public UploadController() {
    }

    @RequestMapping({"/file-getCatagory"})
    public ModelAndView manage(String businessKey, String formId, String mainTable, String mainTableKey, String readonly, String tmpKey) {
        ModelAndView mv = new ModelAndView("workflow/uploadView");
        if (businessKey == null && tmpKey == null) {
            mv.addObject("errorMsg", "缺少必要参数 ");
            mv.setViewName("errorView");
            return mv;
        } else {
            if (formId == null) {
                formId = "-";
            }

            if (readonly == null) {
                readonly = "true";
            } else {
//                boolean b;
//                if (businessKey == null) {
//                    b = true;
//                } else if (mainTable != null && mainTableKey != null) {
//                    b = this.uploadService.validDataUpload(mainTable, mainTableKey, businessKey);
//                } else {
//                    b = this.uploadService.validDataUpload(formId, businessKey);
//                }
//
//                if (!b) {
//                    readonly = "true";
//                }
            }

            List<UploadCategory> category = this.uploadService.getDataUploadCategory(businessKey, formId);
            List file = businessKey == null ? this.uploadService.getDataUploadFileFromTmp(tmpKey, formId) : this.uploadService.getDataUploadFile(businessKey, formId, (String)null);

            try {
                mv.addObject("category", this.objectMapper.writeValueAsString(category));
                mv.addObject("file", file == null ? null : this.objectMapper.writeValueAsString(file));
            } catch (JsonProcessingException var13) {
                mv.addObject("errorMsg", "转换结果错误 " + var13.getMessage());
                mv.setViewName("errorView");
                return mv;
            }

//            if (businessKey != null) {
//                SysUser user = (SysUser)SecurityUtils.getSubject().getPrincipal();
//                List<HistoricTaskInstance> list = ((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)this.historyService.createNativeHistoricTaskInstanceQuery().sql("select task_def_key_,end_time_ from ".concat(this.managementService.getTableName(HistoricTaskInstance.class)).concat(" where proc_inst_id_=nvl((select proc_inst_id from data_status where business_key=#{b} and curr_flag=1),'-') and assignee_=#{a} order by start_time_ desc"))).parameter("b", businessKey)).parameter("a", user.getUserId())).listPage(0, 1);
//                if (!list.isEmpty()) {
//                    HistoricTaskInstance ht = (HistoricTaskInstance)list.get(0);
//                    mv.addObject("taskKey", ht.getTaskDefinitionKey());
//                    mv.addObject("hasDone", ht.getEndTime() == null ? "false" : "true");
//                }
//            }

            mv.addObject("formId", formId);
            mv.addObject("mainTable", mainTable);
            mv.addObject("mainTableKey", mainTableKey);
            mv.addObject("readonly", readonly);
            mv.addObject("businessKey", businessKey);
            mv.addObject("tmpKey", tmpKey);
            return mv;
        }
    }

    @RequestMapping({"/file-getThumbnail"})
    public void getThumbnail(@RequestParam("fileId") String fileId, HttpServletResponse response) {
        if (fileId != null) {
            fileId = fileId + "_t";
            InputStream stream = this.uploadService.getThumbnail(fileId);
            OutputStream out = null;
            boolean var5 = false;

            try {
                byte[] b = new byte[2048];
                if (stream != null) {
                    out = response.getOutputStream();

                    int l;
                    while((l = stream.read(b)) != -1) {
                        out.write(b, 0, l);
                    }
                } else {
                    this.logger.error("图片读取失败");
                }
            } catch (Exception var15) {
                this.logger.error("图片读取失败", var15);
            } finally {
                try {
                    stream.close();
                } catch (IOException var14) {
                    this.logger.error("上传文件流关闭失败", var14);
                }

            }

        }
    }

    @RequestMapping({"/file-getFile"})
    public void getpPicture(@RequestParam("fileId") String fileId, @RequestParam(name = "fileName",required = false) String fileName, HttpServletRequest request, HttpServletResponse response) throws FileNotFoundException {
        if (fileId != null) {
            if (StringUtils.isNotBlank(fileName)) {
                String type = fileName.substring(fileName.lastIndexOf(46) + 1).toLowerCase();
                if ("txt".equals(type)) {
                    response.setContentType("text/plain");
                } else if ("pdf".equals(type)) {
                    response.setContentType("application/pdf");
                } else if (!"jpg".equals(type) && !"jpeg".equals(type) && !"png".equals(type)) {
                    response.setContentType("application/octet-stream");
                } else {
                    response.setContentType("image/" + type);
                }

                try {
                    response.setHeader("Content-Disposition", "attachment;filename=" + this.getFileName(request.getHeader("User-Agent"), fileName));
                } catch (Exception var18) {
                    response.setHeader("Content-Disposition", "attachment;filename=" + fileName);
                }
            }

            InputStream stream = this.uploadService.getPicture(fileId);
            OutputStream out = null;
            boolean var7 = false;

            try {
                byte[] bytes = new byte[2048];
                if (stream != null) {
                    out = response.getOutputStream();

                    int l;
                    while((l = stream.read(bytes)) != -1) {
                        out.write(bytes, 0, l);
                    }
                } else {
                    this.logger.error("图片读取失败");
                }
            } catch (Exception var19) {
                this.logger.error("图片读取失败", var19);
            } finally {
                try {
                    if (stream != null) {
                        stream.close();
                    }
                } catch (IOException var17) {
                    this.logger.error("上传文件流关闭失败", var17);
                }

            }

        }
    }

    @RequestMapping({"/file-uploadFile"})
    @ResponseBody
    public SimpleJsonResult uploadFile(MultipartFile file, String formId, String mainTable, String mainTableKey, UploadFile uploadFile) {
        if (file != null && uploadFile.getCategoryId() != null) {
            boolean b = true;
//            if (uploadFile.getBusinessKey() == null) {
//                b = true;
//            }
            //else {
//                SysUser user = (SysUser)SecurityUtils.getSubject().getPrincipal();
//                List<HistoricTaskInstance> list = ((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)this.historyService.createNativeHistoricTaskInstanceQuery().sql("select task_def_key_ from ".concat(this.managementService.getTableName(HistoricTaskInstance.class)).concat(" where proc_inst_id_=nvl((select proc_inst_id from data_status where business_key=#{b} and curr_flag=1),-1) and assignee_=#{a} order by start_time_ desc"))).parameter("b", uploadFile.getBusinessKey())).parameter("a", user.getUserId())).listPage(0, 1);
//                if (list.isEmpty()) {
//                    if (mainTable != null && mainTableKey != null) {
//                        b = this.uploadService.validDataUpload(mainTable, mainTableKey, uploadFile.getBusinessKey());
//                    } else {
//                        b = this.uploadService.validDataUpload(formId, uploadFile.getBusinessKey());
//                    }
//                } else {
//                    b = this.uploadService.validDataUpload(((HistoricTaskInstance)list.get(0)).getTaskDefinitionKey(), uploadFile);
//                }
          //  }

            if (b) {
                this.uploadService.uploadFile(file, uploadFile);
                return this.successJsonResult(uploadFile);
            } else {
                return this.failureJsonResult("该记录当前状态下无法变更");
            }
        } else {
            return this.failureJsonResult("缺少必要参数");
        }
    }

    @RequestMapping({"/file-removeFile"})
    @ResponseBody
    public SimpleJsonResult removeFile(String formId, String mainTable, String mainTableKey, UploadFile uploadFile) {
        if (uploadFile.getCategoryId() != null && uploadFile.getFileId() != null) {
            boolean b = true;
//            if (uploadFile.getBusinessKey() == null) {
//                b = true;
//            } else {
//                SysUser user = (SysUser)SecurityUtils.getSubject().getPrincipal();
//                List<HistoricTaskInstance> list = ((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)((NativeHistoricTaskInstanceQuery)this.historyService.createNativeHistoricTaskInstanceQuery().sql("select task_def_key_ from ".concat(this.managementService.getTableName(HistoricTaskInstance.class)).concat(" where proc_inst_id_=nvl((select proc_inst_id from data_status where business_key=#{b} and curr_flag=1),-1) and assignee_=#{a} order by start_time_ desc"))).parameter("b", uploadFile.getBusinessKey())).parameter("a", user.getUserId())).listPage(0, 1);
//                if (list.isEmpty()) {
//                    if (mainTable != null && mainTableKey != null) {
//                        b = this.uploadService.validDataUpload(mainTable, mainTableKey, uploadFile.getBusinessKey());
//                    } else {
//                        b = this.uploadService.validDataUpload(formId, uploadFile.getBusinessKey());
//                    }
//                } else {
//                    b = this.uploadService.validDataUpload(((HistoricTaskInstance)list.get(0)).getTaskDefinitionKey(), uploadFile);
//                }
//            }

            if (b) {
                this.uploadService.removeDataFile(uploadFile);
                return this.successJsonResult("删除成功");
            } else {
                return this.failureJsonResult("该记录当前状态下无法变更");
            }
        } else {
            return this.failureJsonResult("缺少必要参数");
        }
    }
}