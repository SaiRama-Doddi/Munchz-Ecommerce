package com.yourorg.service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponse {

    /* =======================
       ORDER INFO
    ======================= */
    private UUID orderId;
    private UUID userId;
    private String orderStatus;

    /* =======================
       AMOUNTS
    ======================= */
    private BigDecimal totalAmount;
    private BigDecimal totalTax;        // nullable
    private BigDecimal totalDiscount;   // nullable
    private String currency;

    /* =======================
       ADDRESSES (JSON STRING)
    ======================= */
    private String shippingAddress;
    private String billingAddress;

    /* =======================
       AUDIT
    ======================= */
    private Instant placedAt;

    /* =======================
       ITEMS
    ======================= */
    private List<OrderItemResponse> items;
}
