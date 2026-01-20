package com.yourorg.service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;
import com.yourorg.service.service.SubcategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    public SubcategoryController(SubcategoryService subcategoryService) {
        this.subcategoryService = subcategoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubcategoryResponse create(@Valid @RequestBody SubcategoryRequest request) {
        return subcategoryService.create(request);
    }

    @PutMapping("/{id}")
    public SubcategoryResponse update(@PathVariable Long id,
                                      @Valid @RequestBody SubcategoryRequest request) {
        return subcategoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subcategoryService.delete(id);
    }

    @GetMapping("/{id}")
    public SubcategoryResponse get(@PathVariable Long id) {
        return subcategoryService.getById(id);
    }

    @GetMapping("/by-category/{categoryId}")
    public List<SubcategoryResponse> getByCategory(@PathVariable Long categoryId) {
        return subcategoryService.getByCategory(categoryId);
    }
}
