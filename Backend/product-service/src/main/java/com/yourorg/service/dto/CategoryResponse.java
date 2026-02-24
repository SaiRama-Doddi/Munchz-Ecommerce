package com.yourorg.service.dto;

public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private String customId;
    private String thumbnailImage;

    public CategoryResponse() {
    }

    public CategoryResponse(Long id, String name, String description, String customId,String thumbnailImage) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.customId = customId;
        this.thumbnailImage = thumbnailImage;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCustomId() {
        return customId;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCustomId(String customId) {
        this.customId = customId;
    }
    public String getThumbnailImage() {
        return thumbnailImage;
    }
    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

}
