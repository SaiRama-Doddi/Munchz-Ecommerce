package com.example.inventory.dto;

public class StockRequest {

    private Long categoryId;
    private String categoryName;

    private Long subCategoryId;
    private String subCategoryName;

    private Long productId;
    private String productName;

    private String variant;
    private int quantity;

    public Long getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }

    public Long getSubCategoryId() { return subCategoryId; }
    public String getSubCategoryName() { return subCategoryName; }

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }

    public String getVariant() { return variant; }
    public int getQuantity() { return quantity; }
}
