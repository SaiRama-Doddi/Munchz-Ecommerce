package com.yourorg.service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemRequest {

    @NotNull
    private Long productId;

    @NotNull
    private Long variantId;

    @NotNull
    @Positive
    private BigDecimal quantity;
}
