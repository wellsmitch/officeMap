package com.zy.dzzw.gis.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class testMainClass {
    public static void main(String[] args) {
        int[][] arr = {{1,2,3},{4,5,6},{7,8,9}};
        List ints = Collections.singletonList(arr);
        List arrayList = new ArrayList(ints);
        System.out.println(arrayList);
    }
}
