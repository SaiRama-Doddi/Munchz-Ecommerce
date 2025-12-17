package com.yourorg.service.dto;

public class ProductStockDetailResponse {

    private Long productId;
    private String productName;
    private String customProductId;

    private Long categoryId;
    private String categoryName;

    private Long subcategoryId;
    private String subcategoryName;

    private String stockKg;

    public ProductStockDetailResponse() {}

    public ProductStockDetailResponse(Long productId, String productName, String customProductId,
                                      Long categoryId, String categoryName,
                                      Long subcategoryId, String subcategoryName,
                                      String stockKg) {

        this.productId = productId;
        this.productName = productName;
        this.customProductId = customProductId;

        this.categoryId = categoryId;
        this.categoryName = categoryName;

        this.subcategoryId = subcategoryId;
        this.subcategoryName = subcategoryName;

        this.stockKg = stockKg;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getCustomProductId() {
        return customProductId;
    }
    public void setCustomProductId(String customProductId) {
        this.customProductId = customProductId;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    public Long getSubcategoryId() {
        return subcategoryId;
    }
    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
    }
    public String getSubcategoryName() {
        return subcategoryName;
    }
    public void setSubcategoryName(String subcategoryName) {
        this.subcategoryName = subcategoryName;
    }
    public String getStockKg() {
        return stockKg;
    }
    public void setStockKg(String stockKg) {
        this.stockKg = stockKg;
    }
    
  
}
