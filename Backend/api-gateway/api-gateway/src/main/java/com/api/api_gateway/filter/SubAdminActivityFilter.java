package com.api.api_gateway.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
public class SubAdminActivityFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final WebClient webClient;

    public SubAdminActivityFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://auth-service:8081").build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // Only track mutating requests (POST, PUT, DELETE) and skip subadmin-service itself login/verify
        if (isMutation(method) && !path.startsWith("/subadmin/")) {
            String token = extractToken(request);
            if (token != null) {
                try {
                    DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
                    List<String> roles = decodedJWT.getClaim("roles").asList(String.class);

                    if (roles != null && roles.contains("SUB_ADMIN")) {
                        String email = decodedJWT.getSubject();
                        String module = extractModule(path);
                        String action = method.name();
                        String details = "Sub-Admin " + email + " performed " + action + " on " + path;

                        // Call subadmin-service asynchronously to log the activity
                        logActivity(email, module, action, details).subscribe();
                    }
                } catch (Exception e) {
                    // Ignore JWT decoding errors in filter to avoid blocking valid requests
                    // Actual security is handled in individual services
                }
            }
        }

        return chain.filter(exchange);
    }

    private boolean isMutation(HttpMethod method) {
        return method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.DELETE;
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private String extractModule(String path) {
        if (path.contains("/product/")) return "PRODUCT";
        if (path.contains("/categories")) return "CATEGORY";
        if (path.contains("/order/")) return "ORDER";
        if (path.contains("/stock/")) return "STOCK";
        if (path.contains("/coupon/")) return "COUPON";
        if (path.contains("/review/")) return "REVIEW";
        return "GENERAL";
    }

    private Mono<Void> logActivity(String email, String module, String action, String details) {
        return webClient.post()
                .uri("/auth/subadmin/api/log")
                .bodyValue(Map.of(
                        "email", email,
                        "module", module,
                        "action", action,
                        "details", details
                ))
                .retrieve()
                .toBodilessEntity()
                .then();
    }

    @Override
    public int getOrder() {
        return -1; // Run early
    }
}
