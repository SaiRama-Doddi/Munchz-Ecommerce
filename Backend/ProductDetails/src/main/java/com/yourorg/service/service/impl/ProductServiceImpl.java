package com.yourorg.service.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yourorg.service.dto.ProductRequest;
import com.yourorg.service.dto.ProductResponse;
import com.yourorg.service.dto.ProductVariantRequest;
import com.yourorg.service.dto.ProductVariantResponse;
import com.yourorg.service.entity.Category;
import com.yourorg.service.entity.Product;
import com.yourorg.service.entity.ProductImage;
import com.yourorg.service.entity.ProductVariant;
import com.yourorg.service.entity.Subcategory;
import com.yourorg.service.exception.ResourceNotFoundException;
import com.yourorg.service.repository.CategoryRepository;
import com.yourorg.service.repository.ProductRepository;
import com.yourorg.service.repository.SubcategoryRepository;
import com.yourorg.service.service.ProductService;
import com.yourorg.service.util.IdGenerator;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SubcategoryRepository subcategoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    // ============================================================
    // CREATE PRODUCT
    // ============================================================
    @Override
    public ProductResponse create(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found: " + request.getSubcategoryId()));
        }

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getImageUrl(),
                category,
                subcategory
        );

        // Add images
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                product.addImage(new ProductImage(url, product));
            }
        }

        // Add variants
        if (request.getVariants() != null) {
            for (ProductVariantRequest v : request.getVariants()) {
                product.addVariant(
                        new ProductVariant(
                                v.getWeightLabel(),
                                v.getWeightInGrams(),
                                v.getMrp(),
                                v.getOfferPrice(),
                                product
                        )
                );
            }
        }

        // Save product (generate DB id)
        Product savedProduct = productRepository.save(product);

        // ------------------------------------------------------------
        // ENABLE CUSTOM PRODUCT ID → makcascri001
        // ------------------------------------------------------------
        String customId = IdGenerator.generateProductId(
                savedProduct.getCategory().getName(),
                savedProduct.getSubcategory() != null ? savedProduct.getSubcategory().getName() : null,
                savedProduct.getName(),
                savedProduct.getId()
        );

        savedProduct.setCustomId(customId);
        savedProduct = productRepository.save(savedProduct);

        return toResponse(savedProduct);
    }

    // ============================================================
    // UPDATE PRODUCT
    // ============================================================
    @Override
    public ProductResponse update(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryId()));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found: " + request.getSubcategoryId()));
        }

        // Update base fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        product.setSubcategory(subcategory);

        // --------------------------------------------
        // UPDATE IMAGES (SAFE ORPHAN HANDLING)
        // --------------------------------------------
        for (ProductImage old : new ArrayList<>(product.getImages())) {
            product.removeImage(old);
        }

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                product.addImage(new ProductImage(url, product));
            }
        }

        // --------------------------------------------
        // UPDATE VARIANTS (SAFE ORPHAN HANDLING)
        // --------------------------------------------
        for (ProductVariant old : new ArrayList<>(product.getVariants())) {
            product.removeVariant(old);
        }

        if (request.getVariants() != null) {
            for (ProductVariantRequest v : request.getVariants()) {
                product.addVariant(
                        new ProductVariant(
                                v.getWeightLabel(),
                                v.getWeightInGrams(),
                                v.getMrp(),
                                v.getOfferPrice(),
                                product
                        )
                );
            }
        }

        productRepository.save(product);
        return toResponse(product);
    }

    // ============================================================
    // DELETE PRODUCT
    // ============================================================
    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    // ============================================================
    // GET PRODUCT BY ID
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return toResponse(product);
    }

    // ============================================================
    // GET ALL PRODUCTS
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // FILTER BY CATEGORY
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // FILTER BY CATEGORY + SUBCATEGORY
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getByCategoryAndSubcategory(Long categoryId, Long subcategoryId) {
        return productRepository.findByCategoryIdAndSubcategoryId(categoryId, subcategoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponse> search(String keyword) {
        return productRepository.search(keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ============================================================
    // ENTITY → DTO MAPPER
    // ============================================================
  private ProductResponse toResponse(Product product) {

    List<String> imageUrls = product.getImages()
            .stream()
            .map(ProductImage::getImageUrl)
            .collect(Collectors.toList());

    List<ProductVariantResponse> variantResponses = product.getVariants()
            .stream()
            .map(v -> new ProductVariantResponse(
                    v.getId(),
                    v.getWeightLabel(),
                    v.getWeightInGrams(),
                    v.getMrp(),
                    v.getOfferPrice(), null
            ))
            .collect(Collectors.toList());
            

    Long subcategoryId = product.getSubcategory() != null
            ? product.getSubcategory().getId()
            : null;

    return new ProductResponse(
            product.getId(),
            product.getCategory().getId(),
            subcategoryId,
            product.getName(),
            product.getDescription(),
            product.getImageUrl(),
            imageUrls,
            variantResponses,
            product.getCustomId(), // VERY IMPORTANT,
            product.getCreatedAt()
    );
}

}