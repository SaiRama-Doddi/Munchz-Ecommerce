package com.auth.auth_service.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class SecurityHeadersConfig {

    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> coopHeadersFilter() {

        FilterRegistrationBean<OncePerRequestFilter> bean =
                new FilterRegistrationBean<>();

        bean.setFilter(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    FilterChain filterChain
            ) throws ServletException, IOException {

                // ✅ REQUIRED for Google OAuth popup
                response.setHeader(
                        "Cross-Origin-Opener-Policy",
                        "same-origin-allow-popups"
                );

                response.setHeader(
                        "Cross-Origin-Embedder-Policy",
                        "unsafe-none"
                );

                filterChain.doFilter(request, response);
            }
        });

        // Apply to all endpoints
        bean.addUrlPatterns("/*");

        // Ensure it runs early
        bean.setOrder(0);

        return bean;
    }
}
