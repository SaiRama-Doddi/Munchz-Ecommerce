package com.yourorg.service.dto;

import java.math.BigDecimal;

public class OrderItemRequest {

    private Long productId;
    private String productCustomId;
    private String productName;
    private Integer categoryId;
    private String categoryName;

    private Integer variantWeightInGrams;

    private Long variantId;        // NEW FIELD (REQUIRED FOR VARIANT PRICE)
    private Double quantityKg;

    private BigDecimal unitPrice;

    // GETTERS & SETTERS

    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductCustomId() {
        return productCustomId;
    }
    public void setProductCustomId(String productCustomId) {
        this.productCustomId = productCustomId;
    }

    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Integer getVariantWeightInGrams() {
        return variantWeightInGrams;
    }
    public void setVariantWeightInGrams(Integer variantWeightInGrams) {
        this.variantWeightInGrams = variantWeightInGrams;
    }

    public Long getVariantId() {
        return variantId;
    }
    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public Double getQuantityKg() {
        return quantityKg;
    }
    public void setQuantityKg(Double quantityKg) {
        this.quantityKg = quantityKg;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
}
