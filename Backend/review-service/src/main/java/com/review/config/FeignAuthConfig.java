package com.review.config;


 
import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class FeignAuthConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            var auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.getCredentials() != null) {
                requestTemplate.header(
                        "Authorization",
                        "Bearer " + auth.getCredentials().toString()
                );
            }
        };
    }
}