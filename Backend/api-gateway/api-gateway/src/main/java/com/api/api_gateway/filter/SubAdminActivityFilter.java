package com.api.api_gateway.filter;
 
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
 
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
 
@Component
public class SubAdminActivityFilter implements GlobalFilter, Ordered {
 
    @Value("${jwt.secret}")
    private String jwtSecret;
 
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
 
    public SubAdminActivityFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://auth-service:8081").build();
    }
 
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();
 
        // Only track mutating requests (POST, PUT, DELETE) and skip subadmin-service itself
        if (isMutation(method) && !path.startsWith("/subadmin/")) {
            String token = extractToken(request);
            if (token != null) {
                try {
                    DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
                    List<String> roles = decodedJWT.getClaim("roles").asList(String.class);
 
                    if (roles != null && roles.contains("SUB_ADMIN")) {
                        String email = decodedJWT.getSubject();
                        String module = extractModule(path);
                        String action = getReadableAction(method);
 
                        if (method == HttpMethod.PUT || method == HttpMethod.DELETE) {
                            // Capture OLD state before change
                            return fetchSnapshot(path, token)
                                    .flatMap(oldName -> {
                                        if (method == HttpMethod.PUT) {
                                            // Capture NEW state from body
                                            return DataBufferUtils.join(exchange.getRequest().getBody())
                                                    .flatMap(dataBuffer -> {
                                                        byte[] bytes = new byte[dataBuffer.readableByteCount()];
                                                        dataBuffer.read(bytes);
                                                        DataBufferUtils.release(dataBuffer);
                                                        String body = new String(bytes, StandardCharsets.UTF_8);
                                                        String newName = extractDisplayName(body);
 
                                                        String details = generateTransitionDetails(action, module, path, oldName, newName);
                                                        logActivity(email, module, action, details).subscribe();
 
                                                        ServerHttpRequest mutatedRequest = new ServerHttpRequestDecorator(exchange.getRequest()) {
                                                            @Override
                                                            public Flux<DataBuffer> getBody() {
                                                                return Flux.just(exchange.getResponse().bufferFactory().wrap(bytes));
                                                            }
                                                        };
                                                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                                    });
                                        } else {
                                            // DELETE case
                                            String details = generateTransitionDetails(action, module, path, oldName, null);
                                            logActivity(email, module, action, details).subscribe();
                                            return chain.filter(exchange);
                                        }
                                    }).onErrorResume(e -> chain.filter(exchange)); // Fallback on snapshot error
                        } else if (method == HttpMethod.POST) {
                            // CREATE case (New only)
                            return DataBufferUtils.join(exchange.getRequest().getBody())
                                    .flatMap(dataBuffer -> {
                                        byte[] bytes = new byte[dataBuffer.readableByteCount()];
                                        dataBuffer.read(bytes);
                                        DataBufferUtils.release(dataBuffer);
                                        String body = new String(bytes, StandardCharsets.UTF_8);
                                        String newName = extractDisplayName(body);
 
                                        String details = generateTransitionDetails(action, module, path, null, newName);
                                        logActivity(email, module, action, details).subscribe();
 
                                        ServerHttpRequest mutatedRequest = new ServerHttpRequestDecorator(exchange.getRequest()) {
                                            @Override
                                            public Flux<DataBuffer> getBody() {
                                                return Flux.just(exchange.getResponse().bufferFactory().wrap(bytes));
                                            }
                                        };
                                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                    });
                        }
                    }
                } catch (Exception e) {
                    // Ignore JWT errors
                }
            }
        }
 
        return chain.filter(exchange);
    }
 
    private Mono<String> fetchSnapshot(String path, String token) {
        // Construct the full URL relative to the gateway's internal routing if needed, 
        // but since we are in a GlobalFilter, we hit the downstream URL directly or via the gateway itself.
        // For simplicity, we assume the gateway can hit the internal services by their balanced names if we use a new WebClient,
        // but here we'll just try to hit the same path through the current port for consistency.
        return webClient.get()
                .uri("http://gateway:8080" + path) // Direct hit through gateway to ensure routing works
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractDisplayName)
                .defaultIfEmpty("Unknown")
                .onErrorReturn("Unknown");
    }
 
    private String extractDisplayName(String body) {
        if (body == null || body.isEmpty()) return null;
        try {
            JsonNode node = objectMapper.readTree(body);
            return Optional.ofNullable(node.get("name")).map(JsonNode::asText)
                    .orElseGet(() -> Optional.ofNullable(node.get("title")).map(JsonNode::asText)
                    .orElseGet(() -> Optional.ofNullable(node.get("label")).map(JsonNode::asText)
                    .orElseGet(() -> Optional.ofNullable(node.get("email")).map(JsonNode::asText)
                    .orElseGet(() -> Optional.ofNullable(node.get("itemName")).map(JsonNode::asText)
                    .orElse(null)))));
        } catch (Exception e) {
            return null;
        }
    }
 
    private String getReadableAction(HttpMethod method) {
        if (method == HttpMethod.POST) return "CREATED";
        if (method == HttpMethod.PUT) return "UPDATED";
        if (method == HttpMethod.DELETE) return "DELETED";
        return method.name();
    }
 
    private String generateTransitionDetails(String action, String module, String path, String oldVal, String newVal) {
        String base = String.format("%s %s", action, module.toLowerCase());
        String idInfo = extractId(path);
        
        String context = "";
        if (oldVal != null && newVal != null) {
            context = String.format(": [%s -> %s]", oldVal, newVal);
        } else if (newVal != null) {
            context = String.format(": [%s]", newVal);
        } else if (oldVal != null) {
            context = String.format(": [%s]", oldVal);
        }
 
        return String.format("%s%s at %s%s", base, context, path, idInfo);
    }
 
    private String extractId(String path) {
        try {
            String[] parts = path.split("/");
            if (parts.length > 0) {
                String lastPart = parts[parts.length - 1];
                if (lastPart.matches("\\d+") || lastPart.length() > 20) {
                    return " [ID: " + lastPart + "]";
                }
            }
        } catch (Exception e) {}
        return "";
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
        String p = path.toLowerCase();
        if (p.contains("/product")) return "PRODUCT";
        if (p.contains("/categor")) return "CATEGORY";
        if (p.contains("/order")) return "ORDER";
        if (p.contains("/stock") || p.contains("/inventory") || p.contains("/offline")) return "STOCK";
        if (p.contains("/coupon")) return "COUPON";
        if (p.contains("/review")) return "REVIEW";
        if (p.contains("/payment")) return "PAYMENT";
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
