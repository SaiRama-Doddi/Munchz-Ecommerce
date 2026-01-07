package com.yourorg.service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductVariantResponse {

    private Long id;

    private String skuId;          // ✅ REQUIRED

    private String weightLabel;

    private Integer weightInGrams;

    private BigDecimal mrp;

    private BigDecimal offerPrice;
}
