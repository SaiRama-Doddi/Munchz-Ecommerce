package com.yourorg.service.dto;

import java.math.BigDecimal;

public class ReduceStockRequest {

    private Long productId;
    private BigDecimal quantityKg;

    public ReduceStockRequest() {}

    public ReduceStockRequest(Long productId, BigDecimal quantityKg) {
        this.productId = productId;
        this.quantityKg = quantityKg;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }
}
