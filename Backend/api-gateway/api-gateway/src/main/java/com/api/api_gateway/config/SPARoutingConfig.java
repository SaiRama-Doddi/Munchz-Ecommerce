package com.api.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SPARoutingConfig {

    private static final List<String> API_PREFIXES = Arrays.asList(
        "/auth", "/product/api", "/order/api", "/stock", "/coupon", "/payment", "/userprofile", "/reviews", "/shipping", "/actuator"
    );

    @Bean
    public WebFilter spaWebFilter() {
        return (ServerWebExchange exchange, WebFilterChain chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            // 1. If it's an API request, let it pass
            for (String prefix : API_PREFIXES) {
                if (path.equals(prefix) || path.startsWith(prefix + "/")) {
                    return chain.filter(exchange);
                }
            }

            // 2. Explicitly handle static asset directories and common file extensions
            // This ensures that requests for /assets/index.js never get forwarded to /index.html
            if (path.startsWith("/assets/") || 
                path.startsWith("/public/") || 
                path.startsWith("/static/") ||
                (path.contains(".") && !path.endsWith(".html"))) {
                
                // If it's a relative asset request (e.g. /product/assets/...), 
                // we should internally forward to the absolute path.
                if (path.contains("/assets/") && !path.startsWith("/assets/")) {
                    String correctedPath = path.substring(path.indexOf("/assets/"));
                    return chain.filter(
                        exchange.mutate()
                            .request(exchange.getRequest().mutate().path(correctedPath).build())
                            .build()
                    );
                }
                
                return chain.filter(exchange);
            }

            // 3. For all other routes (like /product/1, /cart, /checkout), forward to index.html
            // This allows the React SPA to take over and handle the route
            return chain.filter(
                exchange.mutate()
                    .request(exchange.getRequest().mutate().path("/index.html").build())
                    .build()
            );
        };
    }
}
