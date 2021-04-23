package com.zy.dzzw.gis.util;

import com.aspose.cad.Image;
import com.aspose.cad.LoadOptions;
import com.aspose.cad.fileformats.cad.CadImage;
import com.zy.core.exception.BusinessRuntimeException;
import com.zy.dzzw.gis.bean.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URLDecoder;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;

import static java.lang.Math.*;

public class AnalysisDxf {
    //cad文件文件流
    private InputStream inputStream;
    //文件名
    private String fileName;
    protected Logger logger = LoggerFactory.getLogger(this.getClass());

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    private BufferedReader bReader;
    private String temp1, temp2, temp3, temp4, temp5, temp6, temp7;
    //    private ArrayList linelist;
//    private ArrayList ellipselist;
//    private ArrayList circlelist;
//    private ArrayList lwpolylinelist;
//    private ArrayList arclist;
    //所有多线段集合
    private ArrayList<LWPolyline> alllist = new ArrayList();

    private ArrayList<Text> textList = new ArrayList();
    //所有图层集合
    private ArrayList<Layer> layers = new ArrayList();
    //所有多线段的点
    private String Point2DContent;

    public String getPoint2DContent() {
        return Point2DContent;
    }

    public void setPoint2DContent(String Point2DContent) {
        this.Point2DContent = Point2DContent;
    }

    public ArrayList<LWPolyline> getAlllist() {
        return alllist;
    }

    public void setAlllist(ArrayList<LWPolyline> alllist) {
        this.alllist = alllist;
    }

    public ArrayList<Layer> getLayers() {
        return layers;
    }

    public void setLayers(ArrayList<Layer> layers) {
        this.layers = layers;
    }

    DecimalFormat df = new DecimalFormat("0.0000");

    /**
     * 读取流中行数据
     *
     * @param datain
     * @return
     */
    private String readString(BufferedReader datain) {
        String temp = null;
        try {
            temp = new String(datain.readLine());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return temp;
    }


    public AnalysisDxf(InputStream inputStream, String fileName) {
        try {
            this.inputStream = new BufferedInputStream(inputStream);
            this.fileName = fileName;
            String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
            InputStreamReader fr = null;
            File f = null;
            String basePath = this.getClass().getClassLoader().getResource("/").getPath() + "dxf";
            try {
                basePath = URLDecoder.decode(basePath, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            File file = new File(basePath);
            if (!file.exists()) {
                file.mkdirs();
            }
            String path = this.getClass().getClassLoader().getResource("/dxf/").getPath();
            try {
                path = URLDecoder.decode(path, "utf-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            String charset = "GBK";
            //如果是dwg格式，直接转成dxf,aspose转换
            if ("dwg".equals(suffix)) {
                String outFile = basePath + fileName.substring(0, fileName.lastIndexOf(".")) + ".dxf";
                LoadOptions options = new LoadOptions();
                options.setSpecifiedMifEncoding(1);
                options.setSpecifiedEncoding(1);
                CadImage cadImage = (CadImage) Image.load(inputStream, options);
                cadImage.save(outFile);
                f = new File(outFile);
                try {
                    inputStream = new BufferedInputStream(new FileInputStream(f));
                    //获取字符集
                    charset = getCharsetByFile(f, charset);
                } catch (FileNotFoundException e) {

                    e.printStackTrace();
                    logger.info("dwg转dxf转换失败！");
                    throw new BusinessRuntimeException("dwg转dxf转换失败！");
                } catch (IOException e) {
                    e.printStackTrace();
                    logger.info("dwg转dxf转换失败！");
                    throw new BusinessRuntimeException("dwg转dxf转换失败！");
                }
                if (!f.exists()) {
                    logger.info("dwg转dxf转换失败！");
                    throw new BusinessRuntimeException("dwg转dxf转换失败！");
                }
                //如果是dxf 直接转换，需要注意，因为要判断文件编码，所以必须用缓冲流接收
            } else if ("dxf".equals(suffix)) {
                try {
                    inputStream = new BufferedInputStream(inputStream);
                    charset = getCharset(inputStream, charset);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new BusinessRuntimeException("编码失败！");
                }
            }
            try {
                //读数据
                fr = new InputStreamReader(inputStream, charset);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                throw new BusinessRuntimeException("编码失败！");
            }
            //解析文件
            analysisDxf(fr, f, path);
            //解析坐标
            getAllPoint2D(this);
            //文本绑定
            bindTextToLwPolyLine(this);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 根据文件判断字符集
     *
     * @param f
     * @param charset
     * @return
     * @throws IOException
     */
    public String getCharsetByFile(File f, String charset) throws IOException {
        InputStream inputStream2 = new BufferedInputStream(new FileInputStream(f));

        return getCharset(inputStream2, charset);
    }

    /**
     * 根据流信息判断字符集
     *
     * @param inputStream2
     * @param charset
     * @return
     * @throws IOException
     */
    private String getCharset(InputStream inputStream2, String charset) throws IOException {
        byte[] first3Bytes = new byte[3];
        boolean checked = false;
        int p = (inputStream2.read() << 8) + inputStream2.read();
        // 读者注： inputStream.mark(0);修改为 inputStream.mark(100);我用过这段代码，需要修改上面标出的地方。
        inputStream2.mark(100);
        // Wagsn注：不过暂时使用正常，遂不改之
        int read = inputStream2.read(first3Bytes, 0, 3);
        if (read == -1) {
            return charset;
        } else if (first3Bytes[0] == (byte) 0xFF && first3Bytes[1] == (byte) 0xFE) {
            // 文件编码为 Unicode
            charset = "UTF-16LE";
            checked = true;
        } else if (first3Bytes[0] == (byte) 0xFE && first3Bytes[1] == (byte) 0xFF) {
            // 文件编码为 Unicode big endian
            charset = "UTF-16BE";
            checked = true;
        } else if (first3Bytes[0] == (byte) 0xEF && first3Bytes[1] == (byte) 0xBB
                && first3Bytes[2] == (byte) 0xBF) {
            // 文件编码为 UTF-8
            charset = "UTF-8";
            checked = true;
        }
        inputStream2.reset();
        if (!checked) {
            while ((read = inputStream2.read()) != -1) {
                if (read >= 0xF0) {
                    break;
                }
                // 单独出现BF以下的，也算是GBK
                if (0x80 <= read && read <= 0xBF) {
                    break;
                }
                if (0xC0 <= read && read <= 0xDF) {
                    read = inputStream2.read();
                    // 双字节 (0xC0 - 0xDF)
                    if (0x80 <= read && read <= 0xBF)
                    // (0x80 - 0xBF),也可能在GB编码内
                    {
                        continue;
                    } else {
                        break;
                    }
                    // 也有可能出错，但是几率较小
                } else if (0xE0 <= read && read <= 0xEF) {
                    read = inputStream2.read();
                    if (0x80 <= read && read <= 0xBF) {
                        read = inputStream2.read();
                        if (0x80 <= read && read <= 0xBF) {
                            charset = "UTF-8";
                            break;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        return charset;
    }

    /**
     * 线段和文本绑定
     *
     * @param analysisDxf
     */
    private void bindTextToLwPolyLine(AnalysisDxf analysisDxf) {
        for (LWPolyline lwPolyline : analysisDxf.alllist) {
            List texts = new ArrayList();
            for (Text text : analysisDxf.textList) {
                if (IsPtInPoly(text, lwPolyline.getPoints())) {
                    texts.add(text.getValue());
                    lwPolyline.setText(texts);
                }
            }
        }
    }

    /**
     * 获取所有坐标点坐标
     *
     * @param analysisDxf
     */
    private void getAllPoint2D(AnalysisDxf analysisDxf) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < analysisDxf.getAlllist().size(); i++) {
            LWPolyline lwPolyline = (LWPolyline) analysisDxf.getAlllist().get(i);
            for (int j = 0; j < lwPolyline.getPoints().size(); j++) {
                //每个点都去算弧点
                Point2D start = (lwPolyline).getPoints().get(j);
                if (j + 1 == lwPolyline.getPoints().size()) {
                    break;
                } else {
                    Point2D end = lwPolyline.getPoints().get(j + 1);
                    PolylineArc arc = analysisDxf.polyLineArc(start, end);
                    if (arc.getArcPoint() != null) {
                        (lwPolyline).getPoints().add(j + 1, arc.getArcPoint());
                    }
                }

            }
            for (int j = 0; j < (lwPolyline).getPoints().size(); j++) {
                Point2D Point2D = (lwPolyline).getPoints().get(j);

                String y = formatDouble(Point2D.getY());
                if (!y.startsWith("38")) {
                    y = "38" + y;
                }
                String x = formatDouble(Point2D.getX());
                if (!x.startsWith("38")) {
                    x = "38" + x;
                }
                if (Point2D.isArc()) {
                    stringBuilder.append("J" + (j + 1) + "," + (i + 1) + "," + y + "," + x + ",H" + "\n");
                } else {
                    stringBuilder.append("J" + (j + 1) + "," + (i + 1) + "," + y + "," + x + "\n");
                }
            }
        }
        analysisDxf.setPoint2DContent(new String(stringBuilder));
    }

    private static String formatDouble(double d) {
        NumberFormat nf = NumberFormat.getInstance();
        //设置保留多少位小数
        nf.setMaximumFractionDigits(20);
        // 取消科学计数法
        nf.setGroupingUsed(false);
        //返回结果
        return nf.format(d);
    }


    /**
     * 分析dxf文件
     *
     * @param fr
     * @param f
     * @param path
     */
    private void analysisDxf(InputStreamReader fr, File f, String path) {
        bReader = new BufferedReader(fr);
        System.out.println("Begin read file" + path);
        // 从DXF文件中读取一个字符串
        temp1 = readString(bReader);
        // 未到文件结束标志
        while (!temp1.equals("EOF")) {
            temp1 = readString(bReader);
            //图层信息
            if (temp1.equals("LAYER")) {
                while (true) {
                    temp2 = readString(bReader);
                    //图层名
                    if (temp2.equals("  2")) {
                        temp3 = readString(bReader);
                        Layer layer = new Layer();
                        layer.setName(temp3);
                        layers.add(layer);
                    }
                    if (temp2.equals("ENDTAB")) {
                        break;
                    }
                }
            }
            // 实体段开始
            if (temp1.equals("ENTITIES")) {
                temp2 = readString(bReader);
                while (true) {
                    temp2 = readString(bReader);
                    // 判断Point2D实体结束
//                    if (temp2.equals("CIRCLE")) {// 判断CIRCLE实体开始
//                        circlelist = new ArrayList();
//                        circlelist.add("1");
//                        while (true) {
//                            temp3 = readString(bReader);
//                            if (temp3.equals(" 10")) {
//                                temp4 = readString(bReader);
//                                circlelist.add(temp4);
//                            }
//                            if (temp3.equals(" 20")) {
//                                temp4 = readString(bReader);
//                                circlelist.add(temp4);
//                            }
//                            if (temp3.equals(" 30")) {
//                                temp4 = readString(bReader);
//                                circlelist.add(temp4);
//                            }
//                            if (temp3.equals(" 40")) {
//                                temp4 = readString(bReader);
//                                circlelist.add(temp4);
//                                break;
//                            }
//                        }
//                        alllist.add(circlelist);
//                    }
//                    // 判断CIRCLE实体结束
//                    if (temp2.equals("ELLIPSE")) {// 判断ellipse实体开始
//                        ellipselist = new ArrayList();
//                        ellipselist.add("5");
//                        while (true) {
//                            temp3 = readString(bReader);
//                            if (temp3.equals(" 10")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 20")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 30")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 11")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 21")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 31")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 40")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 41")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                            }
//                            if (temp3.equals(" 42")) {
//                                temp4 = readString(bReader);
//                                ellipselist.add(temp4);
//                                break;
//                            }
//                        }
//                        alllist.add(ellipselist);
//                    }
//                    // 判断ellipse实体结束
//                    if (temp2.equals("ARC")) {// 判断ARC实体开始
//                        arclist = new ArrayList();
//                        arclist.add("4");
//                        while (true) {
//                            temp3 = readString(bReader);
//                            if (temp3.equals(" 10")) {
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                            }
//
//                            if (temp3.equals(" 20")) {
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                            }
//                            if (temp3.equals(" 30")) {
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                            }
//                            if (temp3.equals(" 40")) {// 半径
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                            }
//                            if (temp3.equals(" 50")) {// 弧的起始角度
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                            }
//                            if (temp3.equals(" 51")) {// 弧的终止角度
//                                temp4 = readString(bReader);
//                                arclist.add(temp4);
//                                break;
//                            }
//                        }
//                        alllist.add(arclist);
//                    }
//                    // 判断ARC实体结束
//                    if (temp2.equals("LINE")) {// 判断ellipse实体开始
//                        linelist = new ArrayList();
//                        linelist.add("3");
//                        while (true) {
//                            temp3 = readString(bReader);
//                            if (temp3.equals(" 10")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                            }
//                            if (temp3.equals(" 20")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                            }
//                            if (temp3.equals(" 30")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                            }
//                            if (temp3.equals(" 11")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                            }
//                            if (temp3.equals(" 21")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                            }
//                            if (temp3.equals(" 31")) {
//                                temp4 = readString(bReader);
//                                linelist.add(temp4);
//                                break;
//                            }
//                        }
//                        alllist.add(linelist);
//                    }
                    // 判断LINE实体结束
                    if (temp2.equals("LWPOLYLINE")) {
                        LWPolyline lwPolyline = new LWPolyline();
                        Point2D Point2D = new Point2D();
                        while (true) {
                            temp3 = readString(bReader);
                            if (temp3.equals("  8")) {
                                temp4 = readString(bReader);
                                lwPolyline.setLayerId(temp4.trim());
                            }
                            if (temp3.equals(" 90")) {
                                temp4 = readString(bReader);
                                //点个数
                                lwPolyline.setPointCount(Integer.valueOf(temp4.trim()));
                            }
                            if (temp3.equals(" 10")) {
                                temp4 = readString(bReader);
                                Point2D.setX(Double.parseDouble(df.format(Double.parseDouble(temp4.trim()))));
                            }
                            if (temp3.equals(" 20")) {
                                temp4 = readString(bReader);
                                Point2D.setY(Double.parseDouble(df.format(Double.parseDouble(temp4.trim()))));
                                temp7 = "0.0";// 有些隐含42没有出现，而默认值是0
                                temp5 = readString(bReader);
                                //下一行是凸度
                                if (temp5.equals(" 42")) {
                                    temp6 = readString(bReader);
                                    Point2D.setConvexityDegree(Double.parseDouble(temp6.trim()));
                                    lwPolyline.getPoints().add(Point2D);
                                    Point2D = new Point2D();
                                    //下一行是正常
                                } else if (temp5.equals(" 10")) {
                                    lwPolyline.getPoints().add(Point2D);
                                    Point2D = new Point2D();
                                    Point2D.setConvexityDegree(Double.parseDouble(temp7.trim()));
                                    temp4 = readString(bReader);
                                    Point2D.setX(Double.parseDouble(df.format(Double.parseDouble(temp4.trim()))));
                                    continue;
                                } else if (temp5.equals("  0") || temp5.equals("1001")) {
                                    Point2D.setConvexityDegree(Double.parseDouble(df.format(Double.parseDouble(temp7.trim()))));
                                    lwPolyline.getPoints().add(Point2D);
                                    break;
                                }

                            }
                            if (temp3.equals("  0")) {
                                break;
                            }
                        }
                        alllist.add(lwPolyline);
                        //获取所有文本
                    }
                    if (temp2.equals("TEXT")) {
                        Text text = new Text();
                        while (true) {
                            temp3 = readString(bReader);
                            if (temp3.equals("  8")) {
                                temp4 = readString(bReader);
                                text.setLayerId(temp4.trim());
                            }
                            if (temp3.equals(" 10")) {
                                temp4 = readString(bReader);
                                text.setX(Double.parseDouble(df.format(Double.parseDouble(temp4.trim()))));
                            }
                            if (temp3.equals(" 20")) {
                                temp4 = readString(bReader);
                                text.setY(Double.parseDouble(df.format(Double.parseDouble(temp4.trim()))));
                            }
                            if (temp3.equals("  1")) {
                                temp4 = readString(bReader);
                                text.setValue(temp4);
                            }
                            if (temp3.equals("  0")) {
                                break;
                            }
                        }
                        textList.add(text);
                    }

                    if (temp2.equals("ENDSEC")) {
                        break;
                    }
                } // 实体段结束的循环结束
            }    // 实体段结束
        } // 文件循环语句结束
        try {
            if (bReader != null) {
                bReader.close();
            }
            if (fr != null) {
                fr.close();
            }
            if (f != null && f.exists()) {
                System.out.println("end delete file！");
                f.delete();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 计算弧点
     *
     * @param start 开始点
     * @param end   结束点
     * @return
     */
    private PolylineArc polyLineArc(Point2D start, Point2D end) {
        PolylineArc polylineArc = new PolylineArc();
        double theta_degree;//角度,包角
        double dStarX = 0, dStarY = 0;//圆弧起始点
        double dEndX = 0, dEndY = 0;     //圆弧终止点
        double dStarC = 0, dEndC = 0; //圆弧起始角度，终止角度
        double dCenterX = 0, dCenterY = 0;//圆心坐标
        double dCenterX1 = 0, dCenterY1 = 0;//圆心坐标1
        double dCenterX2 = 0, dCenterY2 = 0;//圆心坐标2
        double dLength; //弦长
        double dfR;  //半径
        double num1, num2;    //x方向矢量和圆心到弧线起点和终点的矢量的叉乘的z


        double k = 0.0;//弦的斜率
        double k_verticle = 0.0;//弦的中垂线的斜率
        double mid_x = 0.0, mid_y = 0.0;//弦的中点坐标
        double a = 1.0;
        double b = 1.0;
        double c = 1.0;
        double angleChordX = 0;//弦向量X正方向的角度
        int direction = 0;//判断是G02还是G03
        boolean isMinorArc = true;//圆弧半径是否为较小的
        double dStartVale = 0; //起始角的cos（dStarC）值
        double dEndVale = 0; //终止角的cos（dEndC）值

        //当凸度dConvexityDegree不等于0时，表示为圆弧
        double dConvexityDegree = start.getConvexityDegree();
        if (dConvexityDegree != 0.0 && !("NaN".equals(String.valueOf(dStartVale)) || "NaN".equals(String.valueOf(dEndVale)))) {
            //圆心角
            theta_degree = 4 * atan(abs(dConvexityDegree));

            //起始点，终止点
            dStarX = start.getX();
            dStarY = start.getY();
            dEndX = end.getX();
            dEndY = end.getY();

            //弦长
            dLength = sqrt(pow(dStarX - dEndX, 2) + pow(dStarY - dEndY, 2));
            //圆弧半径
            dfR = abs(0.5 * dLength / Math.sin(0.5 * theta_degree));

            k = (dEndY - dStarY) / (dEndX - dStarX);
            if (k == 0) {
                dCenterX1 = (dStarX + dEndX) / 2.0;
                dCenterX2 = (dStarX + dEndX) / 2.0;
                dCenterY1 = dStarY + sqrt(dfR * dfR - (dStarX - dEndX) * (dStarX - dEndX) / 4.0);
                dCenterY2 = dEndY - sqrt(dfR * dfR - (dStarX - dEndX) * (dStarX - dEndX) / 4.0);
            } else {
                k_verticle = -1.0 / k;
                mid_x = (dStarX + dEndX) / 2.0;
                mid_y = (dStarY + dEndY) / 2.0;
                a = 1.0 + k_verticle * k_verticle;
                b = -2 * mid_x - k_verticle * k_verticle * (dStarX + dEndX);
                c = mid_x * mid_x + k_verticle * k_verticle * (dStarX + dEndX) * (dStarX + dEndX) / 4.0 -
                        (dfR * dfR - ((mid_x - dStarX) * (mid_x - dStarX) + (mid_y - dStarY) * (mid_y - dStarY)));

                dCenterX1 = (-1.0 * b + sqrt(b * b - 4 * a * c)) / (2 * a);
                dCenterX2 = (-1.0 * b - sqrt(b * b - 4 * a * c)) / (2 * a);
                dCenterY1 = k_verticle * dCenterX1 - k_verticle * mid_x + mid_y;
                dCenterY2 = k_verticle * dCenterX2 - k_verticle * mid_x + mid_y;
            }
            if ("NaN".equals(String.valueOf(dCenterX1)) || "NaN".equals(String.valueOf(dCenterX2))
                    || "NaN".equals(String.valueOf(dCenterY1)) || "NaN".equals(String.valueOf(dCenterY2))) {
                return polylineArc;
            }


            //凸度绝对值小于1表示圆弧包角小于180°，凸度绝对值大于1表示圆弧包角大于180°
            if (abs(dConvexityDegree) <= 1) {
                isMinorArc = true;
            } else {
                isMinorArc = false;
            }
            //确定圆弧的顺逆
            if (0 > dConvexityDegree) {
                direction = 2;
            } else {
                direction = 3;
            }

            //确定圆心
            angleChordX = acos((1 * (dEndX - dStarX) + 0 * (dEndY - dStarY)) / dLength) * 180 / PI;
            if ((dEndY - dStarY) < 0) {
                angleChordX *= -1;
            }
            if ((angleChordX > 0 && angleChordX < 180) || angleChordX == 180) {
                if (direction == 2)//顺圆
                {
                    if (isMinorArc) {
                        dCenterX = dCenterX1;
                        dCenterY = dCenterY1;
                    } else {
                        dCenterX = dCenterX2;
                        dCenterY = dCenterY2;
                    }
                } else if (direction == 3)//逆圆
                {
                    if (isMinorArc) {
                        dCenterX = dCenterX2;
                        dCenterY = dCenterY2;
                    } else {
                        dCenterX = dCenterX1;
                        dCenterY = dCenterY1;
                    }
                }
            } else {
                if (direction == 2)//顺圆
                {
                    if (isMinorArc) {
                        dCenterX = dCenterX2;
                        dCenterY = dCenterY2;
                    } else {
                        dCenterX = dCenterX1;
                        dCenterY = dCenterY1;
                    }
                } else if (direction == 3)//逆圆
                {
                    if (isMinorArc) {
                        dCenterX = dCenterX1;
                        dCenterY = dCenterY1;
                    } else {
                        dCenterX = dCenterX2;
                        dCenterY = dCenterY2;
                    }
                }
            }

            //起始角度、终止角度
            dStartVale = (dStarX - dCenterX) / dfR;
            //在C++中，浮点型中的结果1可能是1.00000000000000001，避免这种情况出现。
            if (dStartVale > 1) {
                dStartVale = 1;
            }

            if (dStartVale < -1) {
                dStartVale = -1;
            }

            dStarC = acos(dStartVale);
            //x方向矢量和圆心到弧线起点和终点的矢量的叉乘的z
            num1 = dStarY - dCenterY;
            if (num1 < 0) {
                dStarC = 2 * PI - dStarC;
            }

            //终止角度、终止角度
            dEndVale = (dEndX - dCenterX) / dfR;
            //在C++中，浮点型中的结果1可能是1.00000000000000001，避免这种情况出现。
            if (dEndVale > 1) {
                dEndVale = 1;
            }
            if (dEndVale < -1) {
                dEndVale = -1;
            }
            dEndC = acos(dEndVale);
            //x方向矢量和圆心到弧线起点和终点的矢量的叉乘的z
            num2 = dEndY - dCenterY;
            if (num2 < 0) {
                dEndC = 2 * PI - dEndC;
            }
            //将DXF_LWPOLYLINE转换成ARC
            polylineArc.setStartPoint(start);
            polylineArc.setEndPoint(end);
            //如果凸度小于0则为顺时针，clockwise为true
            if (0 > dConvexityDegree) {
                polylineArc.setClockwise(true);
            } else {
                polylineArc.setClockwise(false);
            }
            Point2D centerPoint2D = new Point2D();
            centerPoint2D.setX(dCenterX);
            centerPoint2D.setY(dCenterY);
            polylineArc.setCenterPoint(centerPoint2D);
            polylineArc.setRedius(dfR);
            Point2D arcPoint2D = new Point2D();
            // the local part
            //角度
            double bangel = dStarC;
            //角度
            double endangel = dEndC;

            if (dStarC > dEndC)//如果起始角度小于结束角度就加上360度
            {
                endangel += 2 * PI;
            }
            if (polylineArc.isClockwise()) {
                bangel += PI;
                endangel += PI;
            }
            double x = dfR * Math.cos((bangel + endangel) / 2);
            double y = dfR * Math.sin((bangel + endangel) / 2);
            arcPoint2D.setX(Double.parseDouble(df.format(dCenterX + x)));
            arcPoint2D.setY(Double.parseDouble(df.format(y + dCenterY)));
            arcPoint2D.setArc(true);
            polylineArc.setArcPoint(arcPoint2D);

        }
        return polylineArc;
    }

    /**
     * 判断点是否在多边形内
     *
     * @param point 检测点
     * @param pts   多边形的顶点
     * @return 点在多边形内返回true, 否则返回false
     */
    public static boolean IsPtInPoly(Point point, List<Point2D> pts) {
        int N = pts.size();
        if (N == 0) {
            return false;
        }
        boolean boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        int intersectCount = 0;//cross Point2Ds count of x
        double precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        Point p1, p2;//neighbour bound vertices
        Point p = point; //当前点
        p1 = pts.get(0);//left vertex
        for (int i = 1; i <= N; ++i) {//check all rays
            if (p.equals(p1)) {
                return boundOrVertex;//p is an vertex
            }
            p2 = pts.get(i % N);//right vertex
            if (p.getX() < Math.min(p1.getX(), p2.getX()) || p.getX() > Math.max(p1.getX(), p2.getX())) {//ray is outside of our interests
                p1 = p2;
                continue;//next ray left Point2D
            }
            if (p.getX() > Math.min(p1.getX(), p2.getX()) && p.getX() < Math.max(p1.getX(), p2.getX())) {//ray is crossing over by the algorithm (common part of)
                if (p.getY() <= Math.max(p1.getY(), p2.getY())) {//x is before of ray
                    if (p1.getX() == p2.getX() && p.getY() >= Math.min(p1.getY(), p2.getY())) {//overlies on a horizontal ray
                        return boundOrVertex;
                    }
                    if (p1.getY() == p2.getY()) {//ray is vertical
                        if (p1.getY() == p.getY()) {//overlies on a vertical ray
                            return boundOrVertex;
                        } else {//before ray
                            ++intersectCount;
                        }
                    } else {//cross Point2D on the left side
                        double xinters = (p.getX() - p1.getX()) * (p2.getY() - p1.getY()) / (p2.getX() - p1.getX()) + p1.getY();//cross Point2D of y
                        if (Math.abs(p.getY() - xinters) < precision) {//overlies on a ray
                            return boundOrVertex;
                        }
                        if (p.getY() < xinters) {//before ray
                            ++intersectCount;
                        }
                    }
                }
            } else {//special case when ray is crossing through the vertex
                if (p.getX() == p2.getX() && p.getY() <= p2.getY()) {//p crossing over p2
                    Point p3 = pts.get((i + 1) % N); //next vertex
                    if (p.getX() >= Math.min(p1.getX(), p3.getX()) && p.getX() <= Math.max(p1.getX(), p3.getX())) {//p.x lies between p1.x & p3.x
                        ++intersectCount;
                    } else {
                        intersectCount += 2;
                    }
                }
            }
            p1 = p2;//next ray left Point2D
        }
        return intersectCount % 2 != 0;
    }
}
