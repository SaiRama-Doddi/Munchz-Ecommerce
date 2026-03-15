package com.yourorg.shipping.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShiprocketClient {

    private final RestTemplate restTemplate;

    @Value("${shiprocket.email}")
    private String email;

    @Value("${shiprocket.password}")
    private String password;

    public String getToken() {
        log.info("Requesting Shiprocket auth token for email: {}", email);
        String url = "https://apiv2.shiprocket.in/v1/external/auth/login";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/json");

        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("password", password);

        try {
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> resBody = (Map<String, Object>) response.getBody();
            if (resBody != null && resBody.containsKey("token")) {
                return (String) resBody.get("token");
            } else {
                log.error("Shiprocket login response does not contain token: {}", resBody);
                throw new RuntimeException("Shiprocket token not found");
            }
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Shiprocket Auth Failed. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            log.error("Failed to authenticate with Shiprocket: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw e;
        }
    }

    public Map<String, Object> getTrackingInfo(String shipmentId) {
        String token = getToken();
        String url = "https://apiv2.shiprocket.in/v1/external/courier/track/shipment/" + shipmentId;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + token);
        headers.set("User-Agent", "Mozilla/5.0");

        try {
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, entity, Map.class);
            return (Map<String, Object>) response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch tracking info from Shiprocket for shipment {}: {}", shipmentId, e.getMessage());
            throw new RuntimeException("Tracking API failed", e);
        }
    }
}
