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
                if (path.startsWith(prefix)) {
                    return chain.filter(exchange);
                }
            }

            // 2. If it has a file extension (e.g. .js, .css, .png), it's a static asset
            if (path.contains(".") && !path.endsWith(".html")) {
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
