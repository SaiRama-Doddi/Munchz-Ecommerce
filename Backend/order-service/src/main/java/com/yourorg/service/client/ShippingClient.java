package com.yourorg.service.client;

import com.yourorg.service.dto.ShipmentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "shipping-service", url = "http://shipping-service:8087")
public interface ShippingClient {

    @PostMapping("/shipping/create")
    Map<String, Object> createShipment(@RequestBody ShipmentRequest request);
}
