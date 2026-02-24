package com.yourorg.service.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductResponseDto {
    private Long id;
    private String imageUrl;
    private List<String> imageUrls;
}
