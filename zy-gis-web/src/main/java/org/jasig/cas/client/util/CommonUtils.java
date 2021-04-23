//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package org.jasig.cas.client.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jasig.cas.client.proxy.ProxyGrantingTicketStorage;
import org.jasig.cas.client.validation.AbstractUrlBasedTicketValidator;
import org.jasig.cas.client.validation.ProxyList;
import org.jasig.cas.client.validation.ProxyListEditor;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Properties;
import java.util.TimeZone;

public final class CommonUtils {
    private static final Log LOG = LogFactory.getLog(CommonUtils.class);
    private static final String PARAM_PROXY_GRANTING_TICKET_IOU = "pgtIou";
    private static final String PARAM_PROXY_GRANTING_TICKET = "pgtId";

    private static Proxy proxy;

    private CommonUtils() {
    }

    static {
        try {
            InputStream is = CommonUtils.class.getResourceAsStream("/app.properties");
            Properties properties = new Properties();
            properties.load(is);
            String hostname = properties.getProperty("cas.proxy.hostname");
            String port = properties.getProperty("cas.proxy.port");
            if (StringUtils.isNotBlank(hostname) && StringUtils.isNotBlank(port)) {
                proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(hostname, Integer.parseInt(port)));
            }
        } catch (Exception e) {

        }
    }

    public static String formatForUtcTime(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return dateFormat.format(date);
    }

    public static void assertNotNull(Object object, String message) {
        if (object == null) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void assertNotEmpty(Collection<?> c, String message) {
        assertNotNull(c, message);
        if (c.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void assertTrue(boolean cond, String message) {
        if (!cond) {
            throw new IllegalArgumentException(message);
        }
    }

    public static boolean isEmpty(String string) {
        return string == null || string.length() == 0;
    }

    public static boolean isNotEmpty(String string) {
        return !isEmpty(string);
    }

    public static boolean isBlank(String string) {
        return isEmpty(string) || string.trim().length() == 0;
    }

    public static boolean isNotBlank(String string) {
        return !isBlank(string);
    }

    public static String constructRedirectUrl(String casServerLoginUrl, String serviceParameterName, String serviceUrl, boolean renew, boolean gateway) {
        try {
            if (!casServerLoginUrl.startsWith("http")) {
                try {
                    String host;
                    String scheme;
                    URL url = new URL(serviceUrl);
                    if (url.getPort() == 80 || url.getPort() == 443) {
                        host = url.getHost();
                    } else {
                        host = url.getHost() + ":" + url.getPort();
                    }
                    scheme = url.getProtocol();
                    casServerLoginUrl = scheme + "://" + host + casServerLoginUrl;
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                }

            }
            return casServerLoginUrl + (casServerLoginUrl.indexOf("?") != -1 ? "&" : "?") + serviceParameterName + "=" + URLEncoder.encode(serviceUrl, "UTF-8") + (renew ? "&renew=true" : "") + (gateway ? "&gateway=true" : "");
        } catch (UnsupportedEncodingException var6) {
            throw new RuntimeException(var6);
        }
    }

    public static void readAndRespondToProxyReceptorRequest(HttpServletRequest request, HttpServletResponse response, ProxyGrantingTicketStorage proxyGrantingTicketStorage) throws IOException {
        String proxyGrantingTicketIou = request.getParameter("pgtIou");
        String proxyGrantingTicket = request.getParameter("pgtId");
        if (!isBlank(proxyGrantingTicket) && !isBlank(proxyGrantingTicketIou)) {
            if (LOG.isDebugEnabled()) {
                LOG.debug("Received proxyGrantingTicketId [" + proxyGrantingTicket + "] for proxyGrantingTicketIou [" + proxyGrantingTicketIou + "]");
            }

            proxyGrantingTicketStorage.save(proxyGrantingTicketIou, proxyGrantingTicket);
            if (LOG.isDebugEnabled()) {
                LOG.debug("Successfully saved proxyGrantingTicketId [" + proxyGrantingTicket + "] for proxyGrantingTicketIou [" + proxyGrantingTicketIou + "]");
            }

            response.getWriter().write("<?xml version=\"1.0\"?>");
            response.getWriter().write("<casClient:proxySuccess xmlns:casClient=\"http://www.yale.edu/tp/casClient\" />");
        } else {
            response.getWriter().write("");
        }
    }

    public static String constructServiceUrl(HttpServletRequest request, HttpServletResponse response, String service, String serverName, String artifactParameterName, boolean encode) {
        if (isNotBlank(service)) {
            try {
                String host;
                URL url = new URL(request.getRequestURL().toString());
                if (url.getPort() == 80 || url.getPort() == 443) {
                    host = request.getRemoteHost();
                } else {
                    host = url.getHost() + ":" + url.getPort();
                }
                if (!service.startsWith("http")) {
                    service = request.getScheme() + "://" + host + service;
                }
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
            return encode ? response.encodeURL(service) : service;
        } else {
            StringBuilder buffer = new StringBuilder();
            if (!serverName.startsWith("https://") && !serverName.startsWith("http://")) {
                buffer.append(request.isSecure() ? "https://" : "http://");
            }

            buffer.append(serverName);
            buffer.append(request.getRequestURI());
            if (isNotBlank(request.getQueryString())) {
                int location = request.getQueryString().indexOf(artifactParameterName + "=");
                if (location == 0) {
                    String returnValue = encode ? response.encodeURL(buffer.toString()) : buffer.toString();
                    if (LOG.isDebugEnabled()) {
                        LOG.debug("serviceUrl generated: " + returnValue);
                    }

                    return returnValue;
                }

                buffer.append("?");
                if (location == -1) {
                    buffer.append(request.getQueryString());
                } else if (location > 0) {
                    int actualLocation = request.getQueryString().indexOf("&" + artifactParameterName + "=");
                    if (actualLocation == -1) {
                        buffer.append(request.getQueryString());
                    } else if (actualLocation > 0) {
                        buffer.append(request.getQueryString().substring(0, actualLocation));
                    }
                }
            }

            String returnValue = encode ? response.encodeURL(buffer.toString()) : buffer.toString();
            if (LOG.isDebugEnabled()) {
                LOG.debug("serviceUrl generated: " + returnValue);
            }
            AbstractUrlBasedTicketValidator s;
            return returnValue;
        }
    }

    public static String safeGetParameter(HttpServletRequest request, String parameter) {
        if ("POST".equals(request.getMethod()) && "logoutRequest".equals(parameter)) {
            LOG.debug("safeGetParameter called on a POST HttpServletRequest for LogoutRequest.  Cannot complete check safely.  Reverting to standard behavior for this Parameter");
            return request.getParameter(parameter);
        } else {
            return request.getQueryString() != null && request.getQueryString().indexOf(parameter) != -1 ? request.getParameter(parameter) : null;
        }
    }

    public static String getResponseFromServer(URL constructedUrl, String encoding) {
        return getResponseFromServer(constructedUrl, HttpsURLConnection.getDefaultHostnameVerifier(), encoding);
    }

    public static String getResponseFromServer(URL constructedUrl, HostnameVerifier hostnameVerifier, String encoding) {
        URLConnection conn = null;

        try {

            if (proxy != null) {
                conn = constructedUrl.openConnection(proxy);
            } else {
                conn = constructedUrl.openConnection();
            }

            if (conn instanceof HttpsURLConnection) {
                ((HttpsURLConnection) conn).setHostnameVerifier(hostnameVerifier);
            }

            BufferedReader in;
            if (isEmpty(encoding)) {
                in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(conn.getInputStream(), encoding));
            }

            StringBuilder stringBuffer = new StringBuilder(255);

            String line;
            while ((line = in.readLine()) != null) {
                stringBuffer.append(line);
                stringBuffer.append("\n");
            }

            String var7 = stringBuffer.toString();
            return var7;
        } catch (Exception var11) {
            LOG.error(var11.getMessage(), var11);
            throw new RuntimeException(var11);
        } finally {
            if (conn != null && conn instanceof HttpURLConnection) {
                ((HttpURLConnection) conn).disconnect();
            }

        }
    }

    public static String getResponseFromServer(String url, String encoding) {
        try {
            return getResponseFromServer(new URL(url), encoding);
        } catch (MalformedURLException var3) {
            throw new IllegalArgumentException(var3);
        }
    }

    public static ProxyList createProxyList(String proxies) {
        if (isBlank(proxies)) {
            return new ProxyList();
        } else {
            ProxyListEditor editor = new ProxyListEditor();
            editor.setAsText(proxies);
            return (ProxyList) editor.getValue();
        }
    }

    public static void sendRedirect(HttpServletResponse response, String url) {
        try {
            response.sendRedirect(url);
        } catch (Exception var3) {
            LOG.warn(var3.getMessage(), var3);
        }

    }
}
