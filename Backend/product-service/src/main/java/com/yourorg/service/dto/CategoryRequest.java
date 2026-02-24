package com.yourorg.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 150, message = "Category name cannot exceed 150 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private String thumbnailImage;

    public CategoryRequest() {
    }

    public CategoryRequest(String name, String description, String thumbnailImage) {
        this.name = name;
        this.description = description;
        this.thumbnailImage = thumbnailImage;
    }

    // Getters & Setters
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
    public String getThumbnailImage() {
        return thumbnailImage;
    }
    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }
    
}
