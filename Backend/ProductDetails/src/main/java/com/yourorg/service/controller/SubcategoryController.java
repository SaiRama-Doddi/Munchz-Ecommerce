package com.yourorg.service.controller;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;
import com.yourorg.service.service.SubcategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
