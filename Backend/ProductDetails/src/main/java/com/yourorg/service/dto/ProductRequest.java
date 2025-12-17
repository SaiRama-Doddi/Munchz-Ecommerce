package com.yourorg.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ProductRequest {

    @NotNull
    private Long categoryId;

    private Long subcategoryId; // nullable

    @NotBlank
    @Size(max = 200)
    private String name;

    @Size(max = 2000)
    private String description;

    // Main thumbnail image (optional)
    @Size(max = 500)
    private String imageUrl;

    // MULTIPLE GALLERY IMAGES (5 images or more)
    private List<String> imageUrls;

    @NotNull
    private List<ProductVariantRequest> variants;

    public ProductRequest() {
    }

    public ProductRequest(Long categoryId,
                          Long subcategoryId,
                          String name,
                          String description,
                          String imageUrl,
                          List<String> imageUrls,
                          List<ProductVariantRequest> variants) {

        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.imageUrls = imageUrls;
        this.variants = variants;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<ProductVariantRequest> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantRequest> variants) {
        this.variants = variants;
    }
}
