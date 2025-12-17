package com.yourorg.service.dto;

import java.util.List;

public class ProductResponse {

    private Long id;
    private Long categoryId;
    private Long subcategoryId;
    private String name;
    private String description;
    private String imageUrl;
    private List<String> imageUrls;
    private List<ProductVariantResponse> variants;
    private String customId;  // MUST BE HERE

    public ProductResponse() {}

    public ProductResponse(Long id,
                           Long categoryId,
                           Long subcategoryId,
                           String name,
                           String description,
                           String imageUrl,
                           List<String> imageUrls,
                           List<ProductVariantResponse> variants,
                           String customId) {
        this.id = id;
        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.imageUrls = imageUrls;
        this.variants = variants;
        this.customId = customId;  // IMPORTANT
    }

    public Long getId() { return id; }
    public Long getCategoryId() { return categoryId; }
    public Long getSubcategoryId() { return subcategoryId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public List<String> getImageUrls() { return imageUrls; }
    public List<ProductVariantResponse> getVariants() { return variants; }
    public String getCustomId() { return customId; }

    public void setCustomId(String customId) { this.customId = customId; }
}
