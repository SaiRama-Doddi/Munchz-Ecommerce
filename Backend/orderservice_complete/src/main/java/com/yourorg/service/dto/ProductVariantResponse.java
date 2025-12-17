package com.yourorg.service.dto;

import java.math.BigDecimal;

public class ProductVariantResponse {

    private Long id;
    private String weightLabel;
    private Integer weightInGrams;
    private BigDecimal mrp;
    private BigDecimal offerPrice;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWeightLabel() { return weightLabel; }
    public void setWeightLabel(String weightLabel) { this.weightLabel = weightLabel; }

    public Integer getWeightInGrams() { return weightInGrams; }
    public void setWeightInGrams(Integer weightInGrams) { this.weightInGrams = weightInGrams; }

    public BigDecimal getMrp() { return mrp; }
    public void setMrp(BigDecimal mrp) { this.mrp = mrp; }

    public BigDecimal getOfferPrice() { return offerPrice; }
    public void setOfferPrice(BigDecimal offerPrice) { this.offerPrice = offerPrice; }
}
