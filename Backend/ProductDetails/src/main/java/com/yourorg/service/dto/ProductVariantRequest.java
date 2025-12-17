package com.yourorg.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ProductVariantRequest {

    @NotBlank
    private String weightLabel;

    private Integer weightInGrams;
    private Integer stockUnits;


    @NotNull
    private BigDecimal mrp;

    private BigDecimal offerPrice;

    public ProductVariantRequest() {
    }

    public ProductVariantRequest(String weightLabel, Integer weightInGrams, BigDecimal mrp, BigDecimal offerPrice) {
        this.weightLabel = weightLabel;
        this.weightInGrams = weightInGrams;
        this.mrp = mrp;
        this.offerPrice = offerPrice;
        this.stockUnits = 0; // Default stock units
    }

    public String getWeightLabel() {
        return weightLabel;
    }

    public void setWeightLabel(String weightLabel) {
        this.weightLabel = weightLabel;
    }

    public Integer getWeightInGrams() {
        return weightInGrams;
    }

    public void setWeightInGrams(Integer weightInGrams) {
        this.weightInGrams = weightInGrams;
    }

    public BigDecimal getMrp() {
        return mrp;
    }

    public void setMrp(BigDecimal mrp) {
        this.mrp = mrp;
    }

    public BigDecimal getOfferPrice() {
        return offerPrice;
    }

    public void setOfferPrice(BigDecimal offerPrice) {
        this.offerPrice = offerPrice;
    }
    public Integer getStockUnits() {
        return stockUnits;
    }
    public void setStockUnits(Integer stockUnits) {
        this.stockUnits = stockUnits;
    }
}
