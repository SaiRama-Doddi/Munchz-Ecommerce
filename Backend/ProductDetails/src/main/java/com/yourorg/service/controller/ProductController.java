package com.yourorg.service.controller;

import com.yourorg.service.dto.ProductRequest;
import com.yourorg.service.dto.ProductResponse;
import com.yourorg.service.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /** CREATE PRODUCT */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    /** UPDATE PRODUCT */
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    /** DELETE PRODUCT */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    /** GET PRODUCT BY ID */
    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    /** GET ALL PRODUCTS */
    @GetMapping
    public List<ProductResponse> getAll() {
        return productService.getAll();
    }

    /** FILTER BY CATEGORY */
    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getByCategory(@PathVariable Long categoryId) {
        return productService.getByCategory(categoryId);
    }

    /** FILTER BY CATEGORY + SUBCATEGORY */
    @GetMapping("/category/{categoryId}/subcategory/{subcategoryId}")
    public List<ProductResponse> getByCategoryAndSubcategory(
            @PathVariable Long categoryId,
            @PathVariable Long subcategoryId
    ) {
        return productService.getByCategoryAndSubcategory(categoryId, subcategoryId);
    }
}
