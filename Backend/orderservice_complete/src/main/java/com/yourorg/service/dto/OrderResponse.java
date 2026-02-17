package com.yourorg.service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponse {

    private UUID orderId;

    private UUID userId;
    private String userName;
    private String userEmail;

    private String orderStatus;

    private BigDecimal totalAmount;
    private BigDecimal totalTax;
    private BigDecimal totalDiscount;

    private UUID paymentId;
    private String couponCode;
    private Integer couponId;

    private String currency;

    private Object shippingAddress;
    private Object billingAddress;
    private String placedAt;
    private String updatedAt;


    private List<OrderItemResponse> items;
}