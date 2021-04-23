package com.zy.gis.model.geometry.position;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Polygon extends Position<Line> {

    private List<Line> lines = new ArrayList<>();;

    public Polygon() {
    }

    public Polygon(List<Line> lines) {
        this.lines = lines;
    }

    public List<Line> getLines() {
        return lines;
    }

    public Polygon add(Line line) {
        this.lines.add(line);
        return this;
    }

    public Polygon remove(Line line) {
        this.lines.remove(line);
        return this;
    }

    public String toString() {
        return this.lines.stream().map(point -> point.toString()).collect(Collectors.joining("*"));
    }
}
