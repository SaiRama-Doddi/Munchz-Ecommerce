package com.yourorg.service.service.impl;

import com.yourorg.service.dto.CategoryRequest;
import com.yourorg.service.dto.CategoryResponse;
import com.yourorg.service.entity.Category;
import com.yourorg.service.exception.ResourceNotFoundException;
import com.yourorg.service.repository.CategoryRepository;
import com.yourorg.service.service.CategoryService;
import com.yourorg.service.util.IdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ============================================================
    // CREATE CATEGORY
    // ============================================================
    @Override
    public CategoryResponse create(CategoryRequest request) {

        // Validate duplicate name
        categoryRepository.findByNameIgnoreCase(request.getName())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "Category with name '" + request.getName() + "' already exists"
                    );
                });

        // Step 1: create category WITHOUT customId first
        Category category = new Category(request.getName(), request.getDescription());
        category.setThumbnailImage(request.getThumbnailImage());

        // save once to get DB-generated ID
        Category saved = categoryRepository.save(category);

        // Step 2: generate customId now that ID exists
        String customId = IdGenerator.generateCategoryId(saved.getName(), saved.getId());
        saved.setCustomId(customId);

        // save again WITH customId
        saved = categoryRepository.save(saved);

        return toResponse(saved);
    }

    // ============================================================
    // UPDATE CATEGORY
    // ============================================================
    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setThumbnailImage(request.getThumbnailImage());

        Category updated = categoryRepository.save(category);
        return toResponse(updated);
    }

    // ============================================================
    // DELETE CATEGORY
    // ============================================================
    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // ============================================================
    // GET CATEGORY BY ID
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        return toResponse(category);
    }

    // ============================================================
    // GET ALL
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // ENTITY → DTO
    // ============================================================
    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCustomId(),
                category.getThumbnailImage()
        );
    }
}
