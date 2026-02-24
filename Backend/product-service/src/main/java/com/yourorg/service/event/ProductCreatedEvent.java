package com.yourorg.service.event;

import java.time.OffsetDateTime;

public class ProductCreatedEvent {

    private Long productId;
    private OffsetDateTime createdAt;

    public ProductCreatedEvent() {
    }

    public ProductCreatedEvent(Long productId, OffsetDateTime createdAt) {
        this.productId = productId;
        this.createdAt = createdAt;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
