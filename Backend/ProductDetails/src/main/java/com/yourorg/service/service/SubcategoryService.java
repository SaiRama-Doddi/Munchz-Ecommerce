package com.yourorg.service.service;

import java.util.List;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;

public interface SubcategoryService {

    SubcategoryResponse create(SubcategoryRequest request);

    SubcategoryResponse update(Long id, SubcategoryRequest request);

    void delete(Long id);

    SubcategoryResponse getById(Long id);

    List<SubcategoryResponse> getByCategory(Long categoryId);

    // ✅ ADD THIS
    List<SubcategoryResponse> getAll();
}