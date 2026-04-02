package com.auth.auth_service.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/auth/subadmin/api")
public class SubAdminProxyController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String TARGET_BASE_URL = "http://subadmin-service:8089/api";

    private HttpHeaders getHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            headers.set("Authorization", authHeader);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    }

    private ResponseEntity<Object> executeProxy(String url, HttpMethod method, HttpEntity<?> entity) {
        try {
            return restTemplate.exchange(url, method, entity, Object.class);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).headers(e.getResponseHeaders()).body(e.getResponseBodyAsByteArray());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Proxy Error to " + url + ": " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Object> create(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders(request));
        return executeProxy(TARGET_BASE_URL + "/create", HttpMethod.POST, entity);
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list(HttpServletRequest request) {
        HttpEntity<Void> entity = new HttpEntity<>(getHeaders(request));
        return executeProxy(TARGET_BASE_URL + "/list", HttpMethod.GET, entity);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<Object> getByEmail(@PathVariable String email, HttpServletRequest request) {
        HttpEntity<Void> entity = new HttpEntity<>(getHeaders(request));
        return executeProxy(TARGET_BASE_URL + "/by-email/" + email, HttpMethod.GET, entity);
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<Object> updatePermissions(@PathVariable String id, @RequestBody Map<String, Object> body, HttpServletRequest request) {
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, getHeaders(request));
        return executeProxy(TARGET_BASE_URL + "/" + id + "/permissions", HttpMethod.PUT, entity);
    }

    @GetMapping("/activities")
    public ResponseEntity<Object> activities(HttpServletRequest request) {
        HttpEntity<Void> entity = new HttpEntity<>(getHeaders(request));
        return executeProxy(TARGET_BASE_URL + "/activities", HttpMethod.GET, entity);
    }
}
