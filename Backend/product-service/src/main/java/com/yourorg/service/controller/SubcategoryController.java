package com.yourorg.service.controller;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;
import com.yourorg.service.service.SubcategoryService;
import com.yourorg.service.util.NotificationUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;
    private final NotificationUtil notificationUtil;

    public SubcategoryController(SubcategoryService subcategoryService, NotificationUtil notificationUtil) {
        this.subcategoryService = subcategoryService;
        this.notificationUtil = notificationUtil;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubcategoryResponse create(@Valid @RequestBody SubcategoryRequest request) {
        SubcategoryResponse response = subcategoryService.create(request);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
        return response;
    }

    @PutMapping("/{id}")
    public SubcategoryResponse update(@PathVariable Long id,
                                      @Valid @RequestBody SubcategoryRequest request) {
        SubcategoryResponse response = subcategoryService.update(id, request);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subcategoryService.delete(id);
        notificationUtil.sendNotification("CATEGORY_UPDATE");
    }

    @GetMapping("/{id}")
    public SubcategoryResponse get(@PathVariable Long id) {
        return subcategoryService.getById(id);
    }

    @GetMapping("/by-category/{categoryId}")
    public List<SubcategoryResponse> getByCategory(@PathVariable Long categoryId) {
        return subcategoryService.getByCategory(categoryId);
    }

    @GetMapping
    public List<SubcategoryResponse> getAll() {
        return subcategoryService.getAll();
    }


}