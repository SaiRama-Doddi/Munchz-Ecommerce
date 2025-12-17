package com.yourorg.service.dto;

public class SubcategoryResponse {

    private Long id;
    private String name;
    private String description;
    private Long categoryId;
    private String customId;

    public SubcategoryResponse() {}

    public SubcategoryResponse(
            Long id,
            String name,
            String description,
            Long categoryId,
            String customId
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.customId = customId;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Long getCategoryId() { return categoryId; }
    public String getCustomId() { return customId; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setCustomId(String customId) { this.customId = customId; }
}
