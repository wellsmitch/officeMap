package com.zy.dzzw.gis.configure;

import com.alibaba.druid.pool.DruidDataSource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class JdbcTemplateConfig {

    @Value("${mPDbMaster.jdbc.url:}")
    private String mPDbMasterJdbcUrl;

    @Value("${mPDbMaster.jdbc.username:}")
    private String mPDbMasterJdbcUsername;

    @Value("${mPDbMaster.jdbc.password:}")
    private String mPDbMasterJdbcPassword;

    @Bean("mpDbMasterJdbcTemplate")
    public JdbcTemplate getMpDbMaster() {
        if (StringUtils.isBlank(mPDbMasterJdbcUrl)) {
            return null;
        }
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUrl(mPDbMasterJdbcUrl);
        druidDataSource.setUsername(mPDbMasterJdbcUsername);
        druidDataSource.setPassword(mPDbMasterJdbcPassword);
        jdbcTemplate.setDataSource(druidDataSource);
        return jdbcTemplate;
    }

    public String getMPDbMasterJdbcUrl() {
        return mPDbMasterJdbcUrl;
    }

    public String getMPDbMasterJdbcUsername() {
        return mPDbMasterJdbcUsername;
    }

    public String getMPDbMasterJdbcPassword() {
        return mPDbMasterJdbcPassword;
    }
}
