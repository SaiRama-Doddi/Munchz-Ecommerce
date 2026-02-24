package com.example.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_entries")
public class StockEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== CATEGORY DETAILS =====
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", length = 150)
    private String categoryName;

    @Column(name = "sub_category_id")
    private Long subCategoryId;

    @Column(name = "sub_category_name", length = 150)
    private String subCategoryName;

    // ===== PRODUCT DETAILS =====
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", length = 150)
    private String productName;

    // ===== SUPPLIER DETAILS =====
    @Column(name = "supplier_name", length = 150)
    private String supplierName;

    @Column(name = "supplier_gst", length = 50)
    private String supplierGst;

    // ===== STOCK DETAILS =====
    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "purchase_price")
    private Double purchasePrice;

    @Column(name = "selling_price")
    private Double sellingPrice;

    @Column(name = "stock_in_date")
    private LocalDate stockInDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ===== AUTO TIMESTAMP =====
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
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

    public Long getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(Long subCategoryId) {
        this.subCategoryId = subCategoryId;
    }

    public String getSubCategoryName() {
        return subCategoryName;
    }

    public void setSubCategoryName(String subCategoryName) {
        this.subCategoryName = subCategoryName;
    }

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

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getSupplierGst() {
        return supplierGst;
    }

    public void setSupplierGst(String supplierGst) {
        this.supplierGst = supplierGst;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Double getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(Double sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public LocalDate getStockInDate() {
        return stockInDate;
    }

    public void setStockInDate(LocalDate stockInDate) {
        this.stockInDate = stockInDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
