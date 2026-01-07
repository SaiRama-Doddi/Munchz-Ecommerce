package com.payment.munchz.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "order-service")
public interface OrderClient {

    @PutMapping("/api/orders/{orderId}/payment-success")
    void markPaymentSuccess(
            @PathVariable UUID orderId,
            @RequestParam(required = false) UUID paymentId
    );
}
