package com.yourorg.service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourorg.service.dto.SubcategoryRequest;
import com.yourorg.service.dto.SubcategoryResponse;
import com.yourorg.service.entity.Category;
import com.yourorg.service.entity.Subcategory;
import com.yourorg.service.exception.ResourceNotFoundException;
import com.yourorg.service.repository.CategoryRepository;
import com.yourorg.service.repository.SubcategoryRepository;
import com.yourorg.service.service.SubcategoryService;
import com.yourorg.service.util.IdGenerator;

@Service
@Transactional
public class SubcategoryServiceImpl implements SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    public SubcategoryServiceImpl(SubcategoryRepository subcategoryRepository,
                                  CategoryRepository categoryRepository) {
        this.subcategoryRepository = subcategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public SubcategoryResponse create(SubcategoryRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found: " + request.getCategoryId()));

        Subcategory subcategory = new Subcategory(
                request.getName(),
                request.getDescription(),
                category
        );

        Subcategory saved = subcategoryRepository.save(subcategory);

        String customId = IdGenerator.generateSubcategoryId(
                saved.getCategory().getName(),
                saved.getName(),
                saved.getId()
        );

        saved.setCustomId(customId);
        saved = subcategoryRepository.save(saved);

        return toResponse(saved);
    }

    @Override
    public SubcategoryResponse update(Long id, SubcategoryRequest request) {

        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subcategory not found: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found: " + request.getCategoryId()));

        subcategory.setName(request.getName());
        subcategory.setDescription(request.getDescription());
        subcategory.setCategory(category);

        Subcategory updated = subcategoryRepository.save(subcategory);

        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!subcategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subcategory not found: " + id);
        }
        subcategoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public SubcategoryResponse getById(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subcategory not found: " + id));
        return toResponse(subcategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubcategoryResponse> getByCategory(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ THIS IS THE IMPORTANT METHOD FOR YOUR REACT PAGE
    @Override
    @Transactional(readOnly = true)
    public List<SubcategoryResponse> getAll() {
        return subcategoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private SubcategoryResponse toResponse(Subcategory subcategory) {
        return new SubcategoryResponse(
                subcategory.getId(),
                subcategory.getName(),
                subcategory.getDescription(),
                subcategory.getCategory().getId(),
                subcategory.getCustomId()
        );
    }
}