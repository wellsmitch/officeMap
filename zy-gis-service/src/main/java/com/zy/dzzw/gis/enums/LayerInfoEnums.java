package com.zy.dzzw.gis.enums;

public interface LayerInfoEnums {
    enum Type {
        classify(1, "分类"),
        layer(0, "图层");

        private Integer code;
        private String message;

        Type(Integer code, String message) {
            this.code = code;
            this.message = message;
        }

        public Integer getCode() {
            return code;
        }

        public void setCode(Integer code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
