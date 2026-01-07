package com.yourorg.service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {

    private Long productId;

    private String skuId;

    private String productName;

    private BigDecimal unitPrice;

    private BigDecimal quantity;

    private BigDecimal lineTotal;
}
