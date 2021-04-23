package com.zy.dzzw.gis.configure;

import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoTemplateConfig extends AbstractMongoClientConfiguration {

    public final static String mongoTransactionManager = "MongoTransactionManager";

    @Value("${mongo.username}")
    private String username;
    @Value("${mongo.password}")
    private String password;
    @Value("${mongo.host}")
    private String host;
    @Value("${mongo.port}")
    private String port;
    @Value("${mongo.db}")
    private String db;

    @Bean(MongoTemplateConfig.mongoTransactionManager)
    public MongoTransactionManager transacionManager(MongoDbFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }

    @Override
    public com.mongodb.client.MongoClient mongoClient() {
        String uri = String.format("mongodb://%s:%s@%s:%s/%s", username, password, host, port, db);
        return MongoClients.create(uri);
    }

    @Override
    protected String getDatabaseName() {
        return db;
    }
}
