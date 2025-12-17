package com.yourorg.service.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. "250g", "1kg"
    @Column(name = "weight_label", nullable = false, length = 50)
    private String weightLabel;

    @Column(name = "weight_in_grams")
    private Integer weightInGrams;

    @Column(name = "mrp", precision = 10, scale = 2, nullable = false)
    private BigDecimal mrp;

    @Column(name = "offer_price", precision = 10, scale = 2)
    private BigDecimal offerPrice;

    


    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    public ProductVariant() {
    }

public ProductVariant(String weightLabel,
                      Integer weightInGrams,
                      BigDecimal mrp,
                      BigDecimal offerPrice,
                      Product product) {

    this.weightLabel = weightLabel;
    this.weightInGrams = weightInGrams;
    this.mrp = mrp;
    this.offerPrice = offerPrice;
    this.product = product;
     
}


    // Getters and setters

    public Long getId() {
        return id;
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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
  
}
