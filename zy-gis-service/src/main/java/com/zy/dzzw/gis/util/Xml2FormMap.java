package com.zy.dzzw.gis.util;

import org.apache.tools.ant.filters.StringInputStream;
import org.dom4j.*;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.*;
import java.util.*;

public class Xml2FormMap {

    public static String xml2String(String name){

        String xmlPath = Xml2FormMap.class.getClassLoader().getResource(name).getPath();
        Document document;
        String xmlString="";
        SAXReader saxReader = new SAXReader();
        try {
            document = saxReader.read(new File(xmlPath));
            xmlString=document.asXML();//将xml内容转化为字符串
        } catch (Exception e) {
            e.printStackTrace();
            xmlString="";
        }
        return xmlString;

    }
    /**
     *
     * @param xml 要转换的xml字符串
     * @param charset 字符编码
     * @return  转换成map后返回结果
     * @throws UnsupportedEncodingException
     * @throws DocumentException
     */
    public static Map<String, Object> xmlToMap(String xml, String charset) throws UnsupportedEncodingException, DocumentException {
        Map<String, Object> respMap = new HashMap<String, Object>();

        SAXReader reader = new SAXReader();
        Document doc = reader.read(new ByteArrayInputStream(xml.getBytes(charset)));
        Element root = doc.getRootElement();
        xmlToMap(root, respMap);
        return respMap;
    }



    /**
     *
     * @param xml 要转换的xml字符串
     * @param charset 字符编码
     * @return  转换成map后返回结果
     * @throws UnsupportedEncodingException
     * @throws DocumentException
     */
    public static Map<String, Object> xmlPropsToMap(String xml, String charset) throws UnsupportedEncodingException, DocumentException {
        Map<String, Object> respMap = new HashMap<String, Object>();

        SAXReader reader = new SAXReader();
        InputStream inputStream = new StringInputStream(xml,charset);
        Document doc = reader.read(inputStream);
        Element root = doc.getRootElement();
        xmlPropsToMap(root, respMap);
        Map xmlMap = new HashMap();
        xmlMap.put(root.getName(),respMap);
        return xmlMap;
    }





    public static Map<String, Object> xmlToMap(Element tmpElement, Map<String, Object> respMap) {
        if (tmpElement.isTextOnly()) {
            if("".equals(tmpElement.getText().trim()) || "\n  ".equals(tmpElement.getText())){
                tmpElement.setText("&nbsp");
            }
            respMap.put(tmpElement.getName(), tmpElement.getText());
            return respMap;
        }
        Iterator<Element> eItor = tmpElement.elementIterator();
        while (eItor.hasNext()) {
            Element element = eItor.next();
            //当有子节点
            if(element.elements().size()>0){

                List list = new ArrayList();
                for(int i=0;i<element.elements().size();i++){
                    Element e = (Element) element.elements().get(i);
                    Map data = xmlToMap(e,new HashMap());
                    list.add(data);
                }
                respMap.put(element.getName(),list);

            }else{
                xmlToMap(element, respMap);
            }
        }
        return respMap;
    }


    public static Map<String, Object> xmlPropsToMap(Element tmpElement, Map<String, Object> respMap) {
        //叶子节点
        if (tmpElement.isTextOnly() && tmpElement.attributes().size() == 0) {
            respMap.put(tmpElement.getName(), tmpElement.getText());
            return respMap;
        }else if(tmpElement.isTextOnly() && tmpElement.attributes().size() > 0){
            Map emap = new HashMap();
            for(int i=0;i<tmpElement.attributes().size();i++){
                Attribute attr = (Attribute) tmpElement.attributes().get(i);
                emap.put(attr.getName(),attr.getText());
            }
            emap.put("text",tmpElement.getText());
            respMap.put(tmpElement.getName(),emap);
            return respMap;
        }

        //获取所有子节点
        Iterator<Element> eItor = tmpElement.elementIterator();
        while (eItor.hasNext()) {
            Element element = eItor.next();
            //获取当前节点的集合
            List<Element> current = tmpElement.elements(element.getName());
            if(current.size()>1){
                List list = new ArrayList();
                for(Element e:current){
                    Map map = xmlPropsToMap(e,new HashMap());
                    list.add(map);
                }
                respMap.put(element.getName(),list);
            }else{
                //当有子节点
                if(element.elements().size()>0){

                    List list = new ArrayList();
                    for(int i=0;i<element.elements().size();i++){
                        Element e = (Element) element.elements().get(i);
                        Map data = xmlPropsToMap(e,new HashMap());
                        list.add(data);
                    }
                    respMap.put(element.getName(),list);

                }else{
                    xmlPropsToMap(element, respMap);
                }
            }


        }
        return respMap;
    }

    /**
     *
     * @return  转换成map后返回结果
     * @throws UnsupportedEncodingException
     * @throws DocumentException
     */
    public static String MapToXml(Map map){
        String parentName = "xml";
        Document doc = DocumentHelper.createDocument();
        doc.addElement(parentName);
        String xml = recursionMapToXml(doc.getRootElement(), parentName, map, false);
        return formatXML(xml);
    }
    /**
     * 格式化xml,显示为容易看的XML格式
     *
     * @param xml 需要格式化的xml字符串
     * @return
     */
    public static String formatXML(String xml) {
        xml=xml.replace("<xml>","");
        xml=xml.replace("</xml>","");
        String requestXML = null;
        try {
            // 拿取解析器
            SAXReader reader = new SAXReader();
            Document document = reader.read(new StringReader(xml));
            if (null != document) {
                StringWriter stringWriter = new StringWriter();
                // 格式化,每一级前的空格
                OutputFormat format = new OutputFormat("    ", true);
                // xml声明与内容是否添加空行
                format.setNewLineAfterDeclaration(false);
                // 是否设置xml声明头部
                format.setSuppressDeclaration(false);
                // 是否分行
                format.setNewlines(true);
                XMLWriter writer = new XMLWriter(stringWriter, format);
                writer.write(document);
                writer.flush();
                writer.close();
                requestXML = stringWriter.getBuffer().toString();
            }


            return requestXML;
        } catch (Exception e) {
            return null;
        }
    }
    //map , string, list
    @SuppressWarnings("unchecked")
    private static String recursionMapToXml(Element element, String parentName, Map<String, Object> map, boolean isCDATA) {
        Element xmlElement = element.element(parentName) == null ? element.addElement(parentName) : element.element(parentName) ;
        map.keySet().forEach(key -> {
            Object obj = map.get(key);
            if (obj instanceof Map) {
                if(!"xml".equals(xmlElement.getName())){
                    Element e = xmlElement.addElement(key);
                    ((Map) obj).keySet().forEach(key1 ->{
                        Object obj1 = ((Map) obj).get(key1);
                        if("text".equals(key1)){
                            e.addText(obj1.toString());
                        }else{
                            e.addAttribute(key1.toString(),obj1.toString());
                        }

                    });
                }

                recursionMapToXml(xmlElement, key, (Map<String, Object>)obj, isCDATA);
            }
            else if(obj instanceof List){
                for(Object item : (List)obj){

                    recursionMapToXml(xmlElement,key, (Map<String, Object>)item,isCDATA);
                }


            }
            else {
                String value = obj == null ? "" : obj.toString();
                if (isCDATA) {
                    xmlElement.addCDATA(value);
                } else if("text".equals(key)){
                    xmlElement.addText(value);
                }else{
                    xmlElement.attributeValue(key,value);
                }

            }
        });
        return xmlElement.asXML();
    }

}

