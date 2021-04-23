package com.zy.dzzw.gis.service;

import com.zy.gis.model.geometry.Geometry;
import com.zy.gis.model.geometry.position.Position;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author Administrator
 */
@Service
public class BufferService {

    public  Position buffer(int distance, Geometry geometry){
        List <Position> positions = this.buffer(distance, Arrays.asList(new Geometry[]{geometry}));
        return positions.stream().findFirst().orElse(null);
    }

    public  List <Position> buffer(int distance, List<Geometry> geometrys){
        List <Position> positions = new ArrayList<>();
        for (Geometry geometry : geometrys){
            positions.add(geometry.buffer(distance));
        }
        return positions;
    }
}
