package com.yourorg.service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.yourorg.service.dto.ProductRequest;
import com.yourorg.service.dto.ProductResponse;
import com.yourorg.service.service.ProductService;
import com.yourorg.service.util.NotificationUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final NotificationUtil notificationUtil;

    public ProductController(ProductService productService, NotificationUtil notificationUtil) {
        this.productService = productService;
        this.notificationUtil = notificationUtil;
    }

    /** CREATE PRODUCT */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.create(request);
        notificationUtil.sendNotification("PRODUCT_UPDATE");
        return response;
    }

    /** UPDATE PRODUCT */
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.update(id, request);
        notificationUtil.sendNotification("PRODUCT_UPDATE");
        return response;
    }

    /** DELETE PRODUCT */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
        notificationUtil.sendNotification("PRODUCT_UPDATE");
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


    /** search products **/
    @GetMapping("/search")
    public List<ProductResponse> search(@RequestParam String keyword){
        return productService.search(keyword);
    }
}
