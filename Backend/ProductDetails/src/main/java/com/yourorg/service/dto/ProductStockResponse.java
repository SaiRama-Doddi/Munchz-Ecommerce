package com.yourorg.service.dto;

public class ProductStockResponse {

    private Long productId;
    private String productName;
    private String customProductId;

    private Long categoryId;
    private String categoryName;

    private Long subcategoryId;
    private String subcategoryName;

    private String stockKg;
    private String lastUpdated;
    private String mainImageUrl;

    private boolean isLowStock;

    // ---- Constructor matching what StockServiceImpl is using ----
    public ProductStockResponse(
            Long productId,
            String productName,
            String customProductId,
            Long categoryId,
            String categoryName,
            Long subcategoryId,
            String subcategoryName,
            String stockKg,
            String lastUpdated,
            String mainImageUrl,
            boolean isLowStock
    ) {
        this.productId = productId;
        this.productName = productName;
        this.customProductId = customProductId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.subcategoryId = subcategoryId;
        this.subcategoryName = subcategoryName;
        this.stockKg = stockKg;
        this.lastUpdated = lastUpdated;
        this.mainImageUrl = mainImageUrl;
        this.isLowStock = isLowStock;
    }

    // ---- Getters ----
    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getCustomProductId() {
        return customProductId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Long getSubcategoryId() {
        return subcategoryId;
    }

    public String getSubcategoryName() {
        return subcategoryName;
    }

    public String getStockKg() {
        return stockKg;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public String getMainImageUrl() {
        return mainImageUrl;
    }

    public boolean isLowStock() {
        return isLowStock;
    }

    // optional: toString() for debugging
    @Override
    public String toString() {
        return "ProductStockResponse{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", customProductId='" + customProductId + '\'' +
                ", categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", subcategoryId=" + subcategoryId +
                ", subcategoryName='" + subcategoryName + '\'' +
                ", stockKg='" + stockKg + '\'' +
                ", lastUpdated='" + lastUpdated + '\'' +
                ", mainImageUrl='" + mainImageUrl + '\'' +
                ", isLowStock=" + isLowStock +
                '}';
    }
}
