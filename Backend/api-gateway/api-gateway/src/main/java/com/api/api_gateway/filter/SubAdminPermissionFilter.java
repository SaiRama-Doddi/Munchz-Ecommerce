package com.api.api_gateway.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class SubAdminPermissionFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Skip checks for non-admin API paths
        if (!isAdminApiPath(path)) {
            return chain.filter(exchange);
        }

        String token = extractToken(request);
        if (token == null) {
            return chain.filter(exchange); // Security handled by other filters/services
        }

        try {
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
            List<String> roles = decodedJWT.getClaim("roles").asList(String.class);

            // 2. Main Admin has all access
            if (roles != null && roles.contains("ADMIN")) {
                return chain.filter(exchange);
            }

            // 3. Sub-Admin permission check
            if (roles != null && roles.contains("SUB_ADMIN")) {
                String permissionsJson = decodedJWT.getClaim("permissions").asString();
                if (permissionsJson == null || permissionsJson.isEmpty()) {
                    return onError(exchange, "Sub-admin has no permissions assigned", HttpStatus.FORBIDDEN);
                }

                Map<String, List<String>> permsMap = objectMapper.readValue(permissionsJson, new TypeReference<Map<String, List<String>>>() {});
                String module = mapPathToModule(path);
                String action = mapMethodToAction(method);

                if (module != null && action != null) {
                    List<String> allowedActions = permsMap.getOrDefault(module, Collections.emptyList());
                    
                    // Special case: If they have ANY permission for a module, they can READ it
                    boolean isAuthorized = action.equals("READ") 
                        ? !allowedActions.isEmpty() 
                        : allowedActions.contains(action);

                    if (!isAuthorized) {
                        return onError(exchange, "Sub-admin not authorized for " + action + " on " + module, HttpStatus.FORBIDDEN);
                    }
                }
            }
        } catch (Exception e) {
            // Decoding errors - let the individual services handle invalid tokens
        }

        return chain.filter(exchange);
    }

    private boolean isAdminApiPath(String path) {
        // Paths that require sub-admin permission checks
        return path.contains("/product/api/") || 
               path.contains("/order/api/") || 
               path.contains("/stock/") || 
               path.contains("/coupon/") || 
               path.contains("/reviews/") ||
               path.contains("/categories");
    }

    private String mapPathToModule(String path) {
        if (path.contains("/categories") || path.contains("/sub-categories")) return "CATEGORIES";
        if (path.contains("/product/")) return "PRODUCTS";
        if (path.contains("/order/")) return "ORDERS";
        if (path.contains("/stock/")) return "STOCKS";
        if (path.contains("/coupon/")) return "COUPONS";
        if (path.contains("/review/")) return "REVIEWS";
        return null;
    }

    private String mapMethodToAction(HttpMethod method) {
        if (method == HttpMethod.GET) return "READ";
        if (method == HttpMethod.POST) return "CREATE";
        if (method == HttpMethod.PUT || method == HttpMethod.PATCH) return "UPDATE";
        if (method == HttpMethod.DELETE) return "DELETE";
        return null;
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return 0; // Run after logging filter
    }
}
