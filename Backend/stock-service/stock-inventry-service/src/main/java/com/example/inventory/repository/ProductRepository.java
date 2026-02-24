package com.example.inventory.repository;

import com.example.inventory.entity.Product;
import com.example.inventory.entity.Category;
import com.example.inventory.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByNameIgnoreCaseAndCategoryAndSubCategory(
            String name,
            Category category,
            SubCategory subCategory
    );

    Optional<Product> findByNameIgnoreCaseAndCategoryAndSubCategoryIsNull(
            String name,
            Category category
    );
}
