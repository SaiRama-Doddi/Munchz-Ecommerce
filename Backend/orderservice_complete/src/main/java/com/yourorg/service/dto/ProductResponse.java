package com.yourorg.service.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {

    // NEW fields matching actual Product Service JSON
    private Long id;
    private Long categoryId;
    private Long subcategoryId;
    private String name;
    private String description;
    private String imageUrl;
    private List<String> imageUrls;

    private List<ProductVariantResponse> variants; // IMPORTANT


    // OLD FIELDS (backward compatibility)
    private Long productId;               // maps from id
    private String productName;           // maps from name
    private BigDecimal unitPrice;         // derived from chosen variant
    private Integer variantWeightInGrams; // derived from chosen variant
    private String categoryName;


    // GETTERS & SETTERS (NEW + OLD)

    public Long getId() { return id; }
    public void setId(Long id) {
        this.id = id;
        this.productId = id; // auto-sync
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Long subcategoryId) { this.subcategoryId = subcategoryId; }

    public String getName() { return name; }
    public void setName(String name) {
        this.name = name;
        this.productName = name; // auto-sync
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public List<ProductVariantResponse> getVariants() { return variants; }
    public void setVariants(List<ProductVariantResponse> variants) { this.variants = variants; }


    // OLD getters/setters (kept for compatibility)

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getVariantWeightInGrams() { return variantWeightInGrams; }
    public void setVariantWeightInGrams(Integer variantWeightInGrams) { this.variantWeightInGrams = variantWeightInGrams; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
