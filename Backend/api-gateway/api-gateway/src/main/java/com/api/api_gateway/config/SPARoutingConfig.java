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
        "/auth", "/product/api", "/order/api", "/stock", "/coupon", "/payment", "/userprofile", "/reviews", "/shipping", "/actuator", "/subadmin"
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
                path.matches(".*\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|txt|json)$")) {
                
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

            // 3. Prevent forwarding missing files (paths with dots) to index.html
            // If the path contains a dot but wasn't caught by the asset check above,
            // it's likely a missing file. Forwarding it to index.html would cause
            // a MIME type mismatch error in the browser.
            if (path.contains(".") && !path.startsWith("/index.html")) {
                return chain.filter(exchange);
            }

            // 4. For all other routes (like /product/1, /cart, /checkout), forward to index.html
            exchange.getResponse().beforeCommit(() -> {
                exchange.getResponse().getHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
                exchange.getResponse().getHeaders().set("Pragma", "no-cache");
                exchange.getResponse().getHeaders().set("Expires", "0");
                return Mono.empty();
            });
            
            return chain.filter(
                exchange.mutate()
                    .request(exchange.getRequest().mutate().path("/index.html").build())
                    .build()
            );
        };
    }
}
