package com.zy.dzzw.gis.service;

import com.alibaba.fastjson.JSONObject;
import com.zy.dzzw.gis.entity.LayerInfo;
import com.zy.dzzw.gis.repository.LayerInfoRepository;
import com.zy.dzzw.gis.util.Xml2FormMap;
import com.zy.dzzw.gis.vo.OverlayPolygonParam;
import org.apache.commons.lang3.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * wps叠加分析服务
 */
@Service
public class OverlayPolygonService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private LayerInfoRepository layerInfoRepository;

    /**
     * wps叠加分析方法
     *
     * @param param 请求参数
     * @return 叠加结果
     */
    public Object overlayPolygon(OverlayPolygonParam param) throws UnsupportedEncodingException, DocumentException {

        LayerInfo layerInfo = layerInfoRepository.findByLayer(param.getLayerName());
        if (org.springframework.util.StringUtils.isEmpty(layerInfo)) {
            throw new RuntimeException("图层：" + param.getLayerName() + "未找到！");
        }
        Object[] properties = layerInfo.getProperties();

        String requestUrl = param.getRequestUrl();

        String requestParam = setQueryParam(param);

        String resultUrl = getResultUrl(requestUrl, requestParam);

        String xmlResponse = restTemplate.getForObject(resultUrl, String.class);

        Document document = DocumentHelper.parseText(xmlResponse);
        Element resource = document.getRootElement();
        List<Element> elements = resource.elements("featureMembers");
        List landList = elements.stream().map(element -> {
            Map<String, String> m = new HashMap<>();
            for (Iterator iterator = element.elementIterator(); iterator.hasNext(); ) {
                Element e = (Element) iterator.next();
                String value = e.getText();
                String filed = e.getName();
                if ("Reg".equals(filed)) {
                    String coordinates = e.element("MultiSurface").element("surfaceMember").element("Polygon").element("exterior").element("LinearRing").element("coordinates").getText();
                    m.put("coordinates", coordinates);
                } else {
                    m.put(filed, value);
                }
            }
            return m;
        }).collect(Collectors.toList());

        JSONObject jsonObj = new JSONObject();
        jsonObj.put("layer", param.getLayerName());
        jsonObj.put("name", layerInfo.getName());

        if (landList.size() == 0) {
            jsonObj.put("landList", landList);
            return landList;
        }

        ArrayList<Map<String, String>> landInfoList = new ArrayList<>();
        for (int i = 0; i < landList.size(); i++) {
            Map<String, String> feature = (Map) landList.get(i);
            HashMap<String, String> landInfo = new HashMap<>();

            String coordinates = feature.get("coordinates").trim();
            landInfo.put("coordinate", coordinates);

            for (int j = 0; j < properties.length; j++) {
                JSONObject proper = (JSONObject) JSONObject.toJSON(properties[j]);
                String[] names = proper.getString("name").split(",");
                String field = proper.getString("field");
                Arrays.stream(names).forEach(name -> {
                    String value = feature.get(name);
                    if (StringUtils.isNotBlank(value)) {
                        landInfo.put(field, value);
                    }
                });
            }
            landInfoList.add(landInfo);
        }
        ;
        jsonObj.put("landList", landInfoList);

        return landInfoList;
    }

    /**
     * 分析中
     *
     * @param requestUrl
     * @param requestParam
     * @return 返回结果url
     */
    public String getResultUrl(String requestUrl, String requestParam) throws UnsupportedEncodingException, DocumentException {

        HttpHeaders headers = new HttpHeaders();

        MediaType type = MediaType.parseMediaType("application/x-www-form-urlencoded; charset=UTF-8");

        headers.setContentType(type);

        HttpEntity<String> formEntity = new HttpEntity<>(requestParam, headers);

        ResponseEntity<String> xmlResponse1 = restTemplate.postForEntity(requestUrl, formEntity, String.class);

        Map<String, Object> map = Xml2FormMap.xmlPropsToMap(xmlResponse1.getBody(), "utf-8");

        JSONObject jsonObj = new JSONObject(map);

        String xmlGetUrl = getMatcherResult("http:.+?.xml", jsonObj.toString());

        return xmlGetUrl;
    }

    public String setQueryParam(OverlayPolygonParam param) {

        String queryXmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
                "<wps:Execute service=\"WPS\" version=\"1.0.0\" xmlns:testServer=\"http://www.opengis.net/testServer\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" xmlns:ows=\"http://www.opengis.net/ows/1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 ../wpsExecute_request.xsd\">\n" +
                "    <ows:Identifier>OverlayByPolygon</ows:Identifier>\n" +
                "    <wps:DataInputs>\n" +
                "        <wps:Input>\n" +
                "            <ows:Identifier>OverlayPolygon</ows:Identifier>\n" +
                "            <wps:Data>\n" +
                "                <wps:ComplexData>\n" +
                "                    <wfs:FeatureCollection>\n" +
                "                        <gml:featureMembers>\n" +
                "                            <water gml:id=\"water.20\">\n" +
                "                                <the_geom>\n" +
                "                                    <gml:MultiSurface srsDimension=\"0\" srsName=\"urn:ogc:def:crs:EPSG::4526\">\n" +
                "                                        <gml:surfaceMember>\n" +
                "                                            <gml:Polygon>\n" +
                "                                                <gml:exterior>\n" +
                "                                                    <gml:LinearRing>\n" +
                "                                                        <gml:posList>" + param.getCoordinatesStr() + "</gml:posList>\n" +
                "                                                    </gml:LinearRing>\n" +
                "                                                </gml:exterior>\n" +
                "                                            </gml:Polygon>\n" +
                "                                        </gml:surfaceMember>\n" +
                "                                    </gml:MultiSurface>\n" +
                "                                </the_geom>\n" +
                "                            </water>\n" +
                "                        </gml:featureMembers>\n" +
                "                    </wfs:FeatureCollection>\n" +
                "                </wps:ComplexData>\n" +
                "            </wps:Data>\n" +
                "        </wps:Input>\n" +
                "        <wps:Input>\n" +
                "\t<ows:Identifier>GDBServer</ows:Identifier>\n" +
                "\t<wps:Data>\n" +
                "\t\t<wps:LiteralData>" + param.getGdbServer() + "</wps:LiteralData>\n" +
                "\t</wps:Data>\n" +
                "\t</wps:Input>\n" +
                "\t\t<wps:Input>\n" +
                "\t\t\t<ows:Identifier>GDBName</ows:Identifier>\n" +
                "\t\t\t<wps:Data>\n" +
                "\t\t\t\t<wps:LiteralData>" + param.getGdbName() + "</wps:LiteralData>\n" +
                "\t\t\t</wps:Data>\n" +
                "\t\t</wps:Input>\n" +
                "\t\t<wps:Input>\n" +
                "\t\t\t<ows:Identifier>LayerName</ows:Identifier>\n" +
                "\t\t\t<wps:Data>\n" +
                "\t\t\t\t<wps:LiteralData>" + param.getLayerName() + "</wps:LiteralData>\n" +
                "\t\t\t</wps:Data>\n" +
                "\t\t</wps:Input>\n" +
                "        <wps:Input>\n" +
                "            <ows:Identifier>Radius</ows:Identifier>\n" +
                "            <wps:Data>\n" +
                "                <wps:LiteralData uom=\"meters\">0</wps:LiteralData>\n" +
                "            </wps:Data>\n" +
                "        </wps:Input>\n" +
                "        <wps:Input>\n" +
                "            <ows:Identifier>OverLayType</ows:Identifier>\n" +
                "            <wps:Data>\n" +
                "                <wps:LiteralData>1</wps:LiteralData>\n" +
                "            </wps:Data>\n" +
                "        </wps:Input>\n" +
                "        <wps:Input>\n" +
                "            <ows:Identifier>IsRecalculate</ows:Identifier>\n" +
                "            <wps:Data>\n" +
                "                <wps:LiteralData>false</wps:LiteralData>\n" +
                "            </wps:Data>\n" +
                "        </wps:Input>\n" +
                "        <wps:Input>\n" +
                "            <ows:Identifier>IsNetData</ows:Identifier>\n" +
                "            <wps:Data>\n" +
                "                <wps:LiteralData>false</wps:LiteralData>\n" +
                "            </wps:Data>\n" +
                "        </wps:Input>\n" +
                "    </wps:DataInputs>\n" +
                "    <wps:ResponseForm>\n" +
                "        <wps:ResponseDocument storeExecuteResponse=\"true\" lineage=\"true\" status=\"true\">\n" +
                "            <wps:Output asReference=\"true\">\n" +
                "                <ows:Identifier>OverlayByPolygon</ows:Identifier>\n" +
                "                <ows:Title>Area serviced by playground.</ows:Title>\n" +
                "                <ows:Abstract>Area within which most users of this playground will live.</ows:Abstract>\n" +
                "            </wps:Output>\n" +
                "        </wps:ResponseDocument>\n" +
                "    </wps:ResponseForm>\n" +
                "</wps:Execute>\n";

        return queryXmlString;
    }

    public String getMatcherResult(String matchertext, String content) {
        Pattern pattern = Pattern.compile(matchertext);
        Matcher matcher = pattern.matcher(content);
        StringBuffer bf = new StringBuffer(64);
        if (matcher.find()) {
            bf.append(matcher.group());
        } else {
            throw new RuntimeException("获取叠加分析结果url地址失败！");
        }
        return bf.toString();
    }


}
