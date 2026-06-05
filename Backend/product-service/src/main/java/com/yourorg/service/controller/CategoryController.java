package com.yourorg.service.controller;

import com.yourorg.service.dto.CategoryRequest;
import com.yourorg.service.dto.CategoryResponse;
import com.yourorg.service.service.CategoryService;
import com.yourorg.service.util.NotificationUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final NotificationUtil notificationUtil;

    public CategoryController(CategoryService categoryService, NotificationUtil notificationUtil) {
        this.categoryService = categoryService;
        this.notificationUtil = notificationUtil;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.create(request);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
        return response;
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.update(id, request);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
    }

    @GetMapping("/{id}")
    public CategoryResponse get(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }
}
