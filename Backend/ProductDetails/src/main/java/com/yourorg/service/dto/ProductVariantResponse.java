package com.yourorg.service.dto;

import java.math.BigDecimal;

public class ProductVariantResponse {

    private Long id;
    private String weightLabel;
    private Integer weightInGrams;
    private BigDecimal mrp;
    private BigDecimal offerPrice;
    private Integer stockUnits;   // ADD THIS

    public ProductVariantResponse() {}

    public ProductVariantResponse(Long id,
                                  String weightLabel,
                                  Integer weightInGrams,
                                  BigDecimal mrp,
                                  BigDecimal offerPrice,
                                  Integer stockUnits) {
        this.id = id;
        this.weightLabel = weightLabel;
        this.weightInGrams = weightInGrams;
        this.mrp = mrp;
        this.offerPrice = offerPrice;
        this.stockUnits = stockUnits;  // ADD THIS
    }

    public Long getId() { return id; }
    public String getWeightLabel() { return weightLabel; }
    public Integer getWeightInGrams() { return weightInGrams; }
    public BigDecimal getMrp() { return mrp; }
    public BigDecimal getOfferPrice() { return offerPrice; }
    public Integer getStockUnits() { return stockUnits; }

    public void setId(Long id) { this.id = id; }
    public void setWeightLabel(String weightLabel) { this.weightLabel = weightLabel; }
    public void setWeightInGrams(Integer weightInGrams) { this.weightInGrams = weightInGrams; }
    public void setMrp(BigDecimal mrp) { this.mrp = mrp; }
    public void setOfferPrice(BigDecimal offerPrice) { this.offerPrice = offerPrice; }
    public void setStockUnits(Integer stockUnits) { this.stockUnits = stockUnits; }
}
