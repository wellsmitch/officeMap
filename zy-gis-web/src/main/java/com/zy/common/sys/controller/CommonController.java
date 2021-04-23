package com.zy.common.sys.controller;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zy.common.sys.entity.SysCode;
import com.zy.common.sys.entity.SysRole;
import com.zy.common.sys.entity.SysUser;
import com.zy.common.sys.service.CommonService;
import com.zy.core.cache.RedisCacheManager;
import com.zy.core.exception.ServiceRuntimeException;
import com.zy.core.mvc.BaseController;
import com.zy.core.mvc.DynamicCode;
import com.zy.core.mvc.SimpleJsonResult;
import com.zy.core.util.CommonUtil;
import com.zy.core.util.RSACoder;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.crypto.hash.Sha1Hash;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.util.SavedRequest;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class CommonController extends BaseController {

    @Value("${sysId:00}")
    private String sysId;
    @Resource
    private CommonService commonService;

    @Value("${cas.serverLogoutUrl:}")
    String serverLogoutUrl;

    @Value("${cas.service:}")
    String service;

    @Autowired(required = false)
    RedisCacheManager redisCacheManager;

    // 获取服务器时间
    @RequestMapping("/sysdate")
    @ResponseBody
    public SimpleJsonResult getSysDate() {
        return successJsonResult(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
    }

    @GetMapping("/common/user/info")
    @ResponseBody
    public Object info() {
        return successJsonResult(SecurityUtils.getSubject().getPrincipal());
    }

    @GetMapping("/common/curr/sysId")
    @ResponseBody
    public Object getCurrSysId() {
        return successJsonResult(sysId);
    }

    // 登陆界面
    @RequestMapping("/login")
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response) {
        // 判断是否是ajax请求，返回201状态码
        String requestedWith = request.getHeader("X-Requested-With");
        if ("XMLHttpRequest".equals(requestedWith)) {
            response.setStatus(401);
            return null;
        } else {
            String url = request.getParameter("url");
            if (StringUtils.isBlank(url)) {
                SavedRequest savedRequest = (SavedRequest) request.getSession().getAttribute("shiroSavedRequest");
                if (savedRequest != null) {
                    String getRequestUrl = savedRequest.getRequestUrl();
                    if (StringUtils.isNotBlank(getRequestUrl)) {
                        url = getRequestUrl;
                    }
                }
            }
            if (StringUtils.isNotBlank(url)) {
                request.getSession(true).setAttribute("requestUrl", url);
            }
            if (StringUtils.isNotBlank(service)) {
                String view = "redirect:/sso/login";
                view += "?url=" + url;
                ModelAndView mv = new ModelAndView(view);
                return mv;
            }
            ModelAndView mv = new ModelAndView("loginView");
            mv.addObject("publicKey", RSACoder.PUBLIC_KEY);
            return mv;
        }
    }

    /**
     * 登陆
     *
     * @return
     */
    @RequestMapping("/doLogin")
    public String doLogin(String userId, String userPwd, RedirectAttributes attr, HttpServletRequest request, HttpServletResponse response) {
        String loginUri = "redirect:/login";
        if (StringUtils.isBlank(userId) || StringUtils.isBlank(userPwd)) {
            attr.addFlashAttribute("msg", "账号或密码不能为空");
            return loginUri;
        }
        try {
            userPwd = new String(RSACoder.decryptByPrivateKey(RSACoder.decryptBASE64(userPwd)));
        } catch (Exception e) {
            logger.error("解析密码错误", e);
            userPwd = null;
        }
        if (userPwd == null) {
            attr.addFlashAttribute("msg", "未能正确解析密码");
            return loginUri;
        }

        if (userId.length() > 20 || userPwd.length() > 24) {
            attr.addFlashAttribute("msg", "账号或密码错误");
            return loginUri;
        }

        Subject currentUser = SecurityUtils.getSubject();
        try {
            currentUser.login(new UsernamePasswordToken(userId, new Sha1Hash(userPwd).toHex().toUpperCase()));
        } catch (UnknownAccountException e) {
            attr.addFlashAttribute("msg", "账号或密码错误");
            return loginUri;
        } catch (IncorrectCredentialsException e) {
            attr.addFlashAttribute("msg", "账号或密码错误");
            return loginUri;
        } catch (ExcessiveAttemptsException e) {
            attr.addFlashAttribute("msg", "失败次数过多");
            return loginUri;
        } catch (LockedAccountException e) {
            attr.addFlashAttribute("msg", "账号已被锁定");
            return loginUri;
        } catch (DisabledAccountException e) {
            attr.addFlashAttribute("msg", "账号已被禁用");
            return loginUri;
        } catch (ExpiredCredentialsException e) {
            attr.addFlashAttribute("msg", "账号已过期");
            return loginUri;
        }
        SysUser user = (SysUser) currentUser.getPrincipal();
        user.setUserPwd(null);
        commonService.login(userId);
        logger.info("用户 {} 登录", userId);

        String sessionId = currentUser.getSession().getId().toString();
        if (redisCacheManager != null) {
            List<SysRole> sysRoles = commonService.getUserRoleInfo(sysId, user.getUserId());
            redisCacheManager.hset("session:" + sessionId, "user", user, 60 * 60 * 12);
            redisCacheManager.hset("session:" + sessionId, "role", sysRoles, 60 * 60 * 12);
        }
        String requestUrl = (String) request.getSession().getAttribute("requestUrl");
        if (StringUtils.isNotBlank(requestUrl)) {
            try {
                request.getSession().removeAttribute("requestUrl");
                if (requestUrl.startsWith("http")) {
                    String cookieParam = "";
                    Cookie[] cookies = request.getCookies();
                    for (Cookie cookie : cookies) {
                        if (cookie.getValue().contains(sessionId)) {
                            cookieParam = cookie.getName() + "=" + cookie.getValue();
                        }
                    }
                    //requestUrl = requestUrl + ";" + cookieParam + ";";
                }
                response.sendRedirect(requestUrl);
                return null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "redirect:/main";
    }

    @RequestMapping("/sso/logout")
    public void ssoLogout(HttpSession session, HttpServletRequest request, HttpServletResponse response) {
        try {
            Subject currentUser = SecurityUtils.getSubject();
            currentUser.logout();
            if (request.isRequestedSessionIdValid()) {
                session.invalidate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String serverLogoutUrl = this.serverLogoutUrl;
        String service = this.service;
        String host = "";
        try {
            URL url = new URL(request.getRequestURL().toString());
            if (url.getPort() == 80 || url.getPort() == 443) {
                host = url.getHost();
            } else {
                host = url.getHost() + ":" + url.getPort();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        if (!serverLogoutUrl.startsWith("http")) {
            serverLogoutUrl = request.getScheme() + "://" + host + serverLogoutUrl;
        }
        if (!service.startsWith("http")) {
            service = request.getScheme() + "://" + host + service;
        }
        try {
            response.sendRedirect(serverLogoutUrl + "?service=" + service);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 单点登录
     *
     * @param request
     * @return
     */
    @RequestMapping("/sso/login")
    public Object ssoLogin(HttpServletRequest request, HttpServletResponse response) {
        Principal principal = request.getUserPrincipal();
        Subject currentUser = SecurityUtils.getSubject();
        if (!(principal instanceof AttributePrincipal)) {
            if (currentUser != null) {
                currentUser.logout();
                String queryUrl = request.getParameter("url");
                if (StringUtils.isNotBlank(queryUrl)) {
                    request.getSession().setAttribute("requestUrl", queryUrl);
                }
                return "redirect:/sso/login";
            }
        }

        if (principal instanceof AttributePrincipal) {
            String userName = request.getUserPrincipal().getName();
            String failMessage = "";
            try {
                SysUser sysUser = (SysUser) commonService.getUser(userName);
                if (sysUser != null) {
                    currentUser.login(new UsernamePasswordToken(sysUser.getUserId(), sysUser.getUserPwd()));
                } else {
                    throw new ServiceRuntimeException("用户信息不存在【" + userName + "】");
                }
                logger.info("单点用户登录：{}，姓名：{}，sessionId：{}", userName, sysUser.getUserName(), request.getSession().getId());
            } catch (Exception e) {
                e.printStackTrace();
                if (e instanceof LockedAccountException) {
                    failMessage = "账号已被锁定";
                } else if (e instanceof DisabledAccountException) {
                    failMessage = "账号已被禁用";
                } else if (e instanceof ServiceRuntimeException) {
                    failMessage = e.getMessage();
                } else {
                    failMessage = "登录失败";
                }
                logger.error("[{}]{}", userName, failMessage);
                try {
                    response.setHeader("Content-type", "text/html;charset=UTF-8");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().print(JSON.toJSONString(failureJsonResult(failMessage)));
                } catch (IOException e1) {
                    e1.printStackTrace();
                } finally {
                    return null;
                }
            }
        }

        SysUser user = (SysUser) currentUser.getPrincipal();
        user.setUserPwd(null);
        String sessionId = currentUser.getSession().getId().toString();
        if (redisCacheManager != null) {
            List<SysRole> sysRoles = commonService.getUserRoleInfo(sysId, user.getUserId());
            redisCacheManager.hset("session:" + sessionId, "user", user, 60 * 60 * 12);
            redisCacheManager.hset("session:" + sessionId, "role", sysRoles, 60 * 60 * 12);
        }

        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            Cookie newCookie = new Cookie(cookie.getName(), cookie.getValue());
            newCookie.setPath("/");
            newCookie.setHttpOnly(false);
            response.addCookie(newCookie);
        }

        String requestUrl = (String) request.getSession().getAttribute("requestUrl");
        if (StringUtils.isNotBlank(requestUrl)) {
            try {
                request.getSession().removeAttribute("requestUrl");
                response.sendRedirect(requestUrl);
                return null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "redirect:/main";
    }

    /**
     * 跳转主页
     *
     * @return
     */
    @RequestMapping("/main")
    public ModelAndView main(HttpServletRequest request) {
        String sysId = (String) request.getSession().getAttribute("sysId");
        if (StringUtils.isBlank(sysId)) {
            sysId = this.sysId;
            request.getSession().setAttribute("sysId", sysId);
        }
        Subject subject = SecurityUtils.getSubject();
        SysUser user = (SysUser) subject.getPrincipal();
        ModelAndView mv = new ModelAndView();
        if (user == null) {
            mv.setViewName("redirect:/login");
            return mv;
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            mv.addObject("user", mapper.writeValueAsString(user));
            mv.addObject("org", mapper.writeValueAsString(commonService.getUserOrg(user.getUserOrg())));
            mapper.setSerializationInclusion(Include.NON_NULL);
            mv.addObject("userMenu", mapper.writeValueAsString(commonService.getUserMenu(sysId, user.getUserId())));
        } catch (JsonProcessingException e) {
            logger.error("转换数据失败", e);
        }
        // 密码加密
        mv.addObject("publicKey", RSACoder.PUBLIC_KEY);
        mv.setViewName("mainView");
        return mv;
    }

    /**
     * 无权限处理
     *
     * @return
     */
    @RequestMapping("/noAuthority")
    public ModelAndView noAuthority(HttpServletRequest request, HttpServletResponse response, Model model) {
        Object uri = request.getAttribute("javax.servlet.forward.request_uri");
        String msg = new StringBuilder("没有资源").append(uri == null ? "" : uri).append("的访问权限").toString();
        ModelAndView view;
        if (isAjax(request)) {
            response.setContentType("application/json;charset=UTF-8");
            view = new ModelAndView("ajaxError");
            try {
                msg = new ObjectMapper().writeValueAsString(failureJsonResult(msg));
            } catch (IOException e) {
                e.printStackTrace();
                msg = null;
            }
        } else {
            view = new ModelAndView("errorView");
        }
        view.addObject("errorMsg", msg);
        return view;
    }

    /**
     * 报错处理
     *
     * @return
     */
    @RequestMapping("/error")
    public ModelAndView error(HttpServletRequest request, HttpServletResponse response, Model model) {
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        Exception exception = (Exception) request.getAttribute("javax.servlet.error.exception");
        if (statusCode == null)
            return null;
        StringBuilder builder = new StringBuilder();
        String msg;
        switch (statusCode) {
            case 404:
                Object uri = request.getAttribute("javax.servlet.forward.request_uri");
                msg = builder.append(uri == null ? "" : uri).append(",资源不存在").toString();
                logger.warn(msg);
                break;
            default:
                msg = builder.append("非预期的异常:").append(exception.getMessage()).toString();
                logger.error(msg, exception);
                break;
        }
        ModelAndView view;
        if (isAjax(request)) {
            response.setContentType("application/json;charset=UTF-8");
            view = new ModelAndView("ajaxError");
            try {
                msg = new ObjectMapper().writeValueAsString(failureJsonResult(msg));
            } catch (IOException e) {
                e.printStackTrace();
                msg = null;
            }
        } else {
            view = new ModelAndView("errorView");
        }
        view.addObject("errorMsg", msg);
        return view;
    }

    // 代码字典通过code查询type
    @RequestMapping("/common/getCode")
    @ResponseBody
    public SimpleJsonResult getCode(int codeType, Integer state) {
        List<SysCode> list = commonService.getSysCodeByCodeType(codeType, state == null ? 0 : state);
        Map<String, String> map = CommonUtil.newHashMapWithExpectedSize(list.size());
        for (Iterator<SysCode> iterator = list.iterator(); iterator.hasNext(); ) {
            SysCode sysCode = (SysCode) iterator.next();
            map.put(sysCode.getCodeId(), sysCode.getCodeName());
        }
        return successJsonResult(map);
    }

    // 得到codelist
    @RequestMapping("/common/getCodeList")
    @ResponseBody
    public SimpleJsonResult getCodeList(int codeType, Integer state) {
        List<SysCode> list = commonService.getSysCodeByCodeType(codeType, state == null ? 0 : state);
        return successJsonResult(list);
    }

    // 得到codeName

    @RequestMapping("/common/getCodeNameList")
    @ResponseBody
    public SimpleJsonResult getCodeNameList(int codeType, Integer state) {
        List<SysCode> list = commonService.getSysCodeByCodeType(codeType, state == null ? 0 : state);
        List<String> nav = new ArrayList<String>();
        for (Iterator<SysCode> iterator = list.iterator(); iterator.hasNext(); ) {
            SysCode sysCode = (SysCode) iterator.next();
            nav.add(sysCode.getCodeName());
        }
        return successJsonResult(nav);
    }

    @RequestMapping("/common/getDymCodeList")
    @ResponseBody
    public SimpleJsonResult getDymCodeList(DynamicCode dynamicCode, String key) {
        return successJsonResult(commonService.getDymCode(dynamicCode, key));
    }

    // 修改用户个人信息
    @RequestMapping("/common/user-modifyInfo")
    @ResponseBody
    public SimpleJsonResult modifyInfo(String email, String mobilePhone, Short sex) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        user.setEmail(email);
        user.setMobilePhone(mobilePhone);
        user.setSex(sex);
        commonService.modifySelfInfo(user);
        return successJsonResult("修改用戶成功");
    }

    // 修改用户个人信息
    @RequestMapping("/common/user-checkPwd")
    @ResponseBody
    public SimpleJsonResult checkPassword(String userPwd) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (user == null) {
            return failureJsonResult("请先登陆");
        }
        // js参数加密传输
        try {
            userPwd = new String(RSACoder.decryptByPrivateKey(RSACoder.decryptBASE64(userPwd)));
        } catch (IOException e1) {
            userPwd = null;
        }
        if (userPwd == null) {
            return failureJsonResult("未能正确解析密码");
        }
        if (commonService.checkPassword(userPwd, user.getUserId())) {
            return successJsonResult("密码正确");
        }
        return failureJsonResult("密码不正确");
    }

    // 修改用户密码 参数为新密码旧密码
    @RequestMapping("/common/user-modifyPwd")
    @ResponseBody
    public SimpleJsonResult modifyPwd(String oPwd, String nPwd) {
        SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
        if (user == null) {
            return failureJsonResult("请先登陆");
        }
        try {
            oPwd = new String(RSACoder.decryptByPrivateKey(RSACoder.decryptBASE64(oPwd)));
        } catch (IOException e1) {
            oPwd = null;
        }
        try {
            nPwd = new String(RSACoder.decryptByPrivateKey(RSACoder.decryptBASE64(nPwd)));
        } catch (IOException e1) {
            nPwd = null;
        }
        if (oPwd == null) {
            return failureJsonResult("未能正确解析密码");
        }
        if (commonService.checkPassword(user.getUserId(), oPwd)) {
            commonService.modifySelfPassword(user.getUserId(), nPwd);

        } else {
            return failureJsonResult("旧密码不正确");
        }
        return successJsonResult("修改密码成功");
    }

    // 获取个人组织机构信息
    @RequestMapping("/common/user-getOrgInfo")
    @ResponseBody
    public SimpleJsonResult userOrgInformation() {
        Subject subject = SecurityUtils.getSubject();
        SysUser user = (SysUser) subject.getPrincipal();
        if (user == null) {
            return failureJsonResult("请先登陆");
        }
        return successJsonResult(commonService.getUserOrg(user.getUserOrg()));
    }

    // 获取系统id
    @RequestMapping("/common/getSysId")
    @ResponseBody
    public SimpleJsonResult getSysId() {
        return successJsonResult(commonService.getSysId());
    }

    private boolean isAjax(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }
}
