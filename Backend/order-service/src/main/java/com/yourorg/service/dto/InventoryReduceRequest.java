package com.yourorg.service.dto;

import lombok.Data;

@Data
public class InventoryReduceRequest {
    private Long productId;
    private String variant;
    private int quantity;
}

