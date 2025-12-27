package com.yourorg.service.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor authForwardInterceptor() {
        return template -> {

            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) return;

            Object credentials = auth.getCredentials();
            if (credentials instanceof String token && !token.isBlank()) {
                template.header("Authorization", "Bearer " + token);
            }
        };
    }
}
