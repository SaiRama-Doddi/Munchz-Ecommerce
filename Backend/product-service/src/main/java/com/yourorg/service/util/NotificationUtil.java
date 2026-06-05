package com.yourorg.service.util;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class NotificationUtil {

    private static final Logger logger = LoggerFactory.getLogger(NotificationUtil.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String NOTIFICATION_SERVICE_URL = "http://notification-service:8090/notify/broadcast";

    public void sendNotification(String type) {
        new Thread(() -> {
            try {
                // Send JSON payload like {"type":"PRODUCT_UPDATE"}
                String jsonPayload = "{\"type\":\"" + type + "\"}";
                restTemplate.postForObject(NOTIFICATION_SERVICE_URL, jsonPayload, String.class);
                logger.info("Sent update notification of type {} to notification-service", type);
            } catch (Exception e) {
                logger.warn("Failed to send update notification of type {} to notification-service: {}", type, e.getMessage());
            }
        }).start();
    }
}
