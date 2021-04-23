package com.zy.dzzw.gis.configure;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean("GisCacheManager")
    public CacheManager getCacheManager(@Autowired(required = false) RedisTemplate<String, Object> redisTemplate) {
        if (redisTemplate != null) {
            return new RedisCacheManager(redisTemplate);
        }
        CacheManager cacheManager = new JCacheCacheManager();
        return cacheManager;
    }
}
