package com.yourorg.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class AddStockRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long categoryId;
    private Long subcategoryId; // nullable
    private Long productId;
    /**
     * Quantity in KG. Always send as kilograms (e.g. 0.25 for 250g, 1.0 for 1kg).
     * Using BigDecimal for precision.
     */
    private BigDecimal quantityKg;

    public AddStockRequest() {}

    public AddStockRequest(Long categoryId, Long subcategoryId, Long productId, BigDecimal quantityKg) {
        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.productId = productId;
        this.quantityKg = quantityKg;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
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

    @Override
    public String toString() {
        return "AddStockRequest{" +
                "categoryId=" + categoryId +
                ", subcategoryId=" + subcategoryId +
                ", productId=" + productId +
                ", quantityKg=" + quantityKg +
                '}';
    }
}
