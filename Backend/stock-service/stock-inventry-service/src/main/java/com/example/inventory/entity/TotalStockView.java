package com.example.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "vw_total_stock")
public class TotalStockView {

    @Id
    @Column(name = "id")          // ✅ synthetic ID
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "variant_label")
    private String variantLabel;

    @Column(name = "total_quantity")
    private Integer totalQuantity;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "sub_category_id")
    private Long subCategoryId;

    @Column(name = "sub_category_name")
    private String subCategoryName;

    // getters
    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getVariantLabel() { return variantLabel; }
    public Integer getTotalQuantity() { return totalQuantity; }
    public Long getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public Long getSubCategoryId() { return subCategoryId; }
    public String getSubCategoryName() { return subCategoryName; }
}
