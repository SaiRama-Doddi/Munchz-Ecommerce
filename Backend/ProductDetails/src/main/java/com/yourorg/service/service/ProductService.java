package com.yourorg.service.service;

import com.yourorg.service.dto.ProductRequest;
import com.yourorg.service.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);

    ProductResponse getById(Long id);

    List<ProductResponse> getAll();

    List<ProductResponse> getByCategory(Long categoryId);

    List<ProductResponse> getByCategoryAndSubcategory(Long categoryId, Long subcategoryId);

    List<ProductResponse> search(String keyword);
}
