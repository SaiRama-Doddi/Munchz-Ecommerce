package com.yourorg.service.service;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;

import java.util.List;

public interface SubcategoryService {

    SubcategoryResponse create(SubcategoryRequest request);

    SubcategoryResponse update(Long id, SubcategoryRequest request);

    void delete(Long id);

    SubcategoryResponse getById(Long id);

    List<SubcategoryResponse> getByCategory(Long categoryId);
}
