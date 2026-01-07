package com.yourorg.service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    /* =======================
       USER INFO
    ======================= */


    /* =======================
       ADDRESSES
       Stored as JSONB in DB
    ======================= */
    @NotNull(message = "Shipping address is required")
    private String shippingAddress;

    @NotNull(message = "Billing address is required")
    private String billingAddress;

    /* =======================
       ORDER ITEMS
    ======================= */
    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
}
