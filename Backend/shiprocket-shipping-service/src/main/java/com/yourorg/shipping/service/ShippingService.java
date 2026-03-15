package com.yourorg.shipping.service;

import java.time.LocalDate;
import java.util.*;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.yourorg.shipping.client.ShiprocketClient;
import com.yourorg.shipping.dto.ShipmentRequest;
import com.yourorg.shipping.repository.ShipmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingService {

    private final ShiprocketClient shiprocketClient;
    private final RestTemplate restTemplate;
    private final ShipmentRepository shipmentRepository;

    public Object createShipment(ShipmentRequest request) {
        log.info("Creating Shiprocket shipment for order: {}", request.getOrderId());
        
        try {
            String token = shiprocketClient.getToken();
            log.debug("Successfully obtained Shiprocket token");

            String url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("order_id", request.getOrderId());
            body.put("order_date", LocalDate.now().toString());

            String fullName = request.getCustomerName() != null ? request.getCustomerName().trim() : "Customer";
            String firstName = fullName;
            String lastName = ".";
            if (fullName.contains(" ")) {
                int lastSpace = fullName.lastIndexOf(" ");
                firstName = fullName.substring(0, lastSpace);
                lastName = fullName.substring(lastSpace + 1);
            }

            body.put("billing_customer_name", firstName);
            body.put("billing_last_name", lastName);
            body.put("billing_phone", request.getPhone() != null && !request.getPhone().isEmpty() ? request.getPhone() : "9123456789");
            body.put("billing_address", request.getAddress());
            body.put("billing_city", request.getCity());
            body.put("billing_pincode", request.getPincode());
            body.put("billing_state", request.getState());
            body.put("billing_country", "India");
            body.put("billing_email", request.getEmail() != null ? request.getEmail() : "customer@munchz.com");
            body.put("shipping_is_billing", true);
            body.put("payment_method", "Prepaid");
            body.put("length", 10);
            body.put("breadth", 10);
            body.put("height", 10);
            body.put("weight", 1);

            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("name", "Munchz Food Items");
            item.put("sku", "MNCZ-" + request.getOrderId().substring(0, 5));
            item.put("units", 1);
            item.put("selling_price", request.getPrice());
            items.add(item);

            body.put("order_items", items);
            body.put("sub_total", request.getPrice());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            log.info("Sending request to Shiprocket: {}", url);
            log.info("Shiprocket Request Body: {}", body);
            
            try {
                ResponseEntity<Object> response = restTemplate.postForEntity(url, entity, Object.class);
                log.info("Shiprocket success response: {}", response.getBody());
                return response.getBody();
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                log.error("Shiprocket API call failed. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
                throw e;
            }
        } catch (Exception e) {
            log.error("Failed to create Shiprocket shipment: {}", e.getMessage(), e);
            throw e;
        }
    }

    public Object getTrackingInfo(String shipmentId) {
        log.info("Fetching tracking info for shipment: {}", shipmentId);
        Map<String, Object> res = shiprocketClient.getTrackingInfo(shipmentId);
        if (res != null && res.containsKey(shipmentId)) {
            return res.get(shipmentId);
        }
        return res;
    }
}
