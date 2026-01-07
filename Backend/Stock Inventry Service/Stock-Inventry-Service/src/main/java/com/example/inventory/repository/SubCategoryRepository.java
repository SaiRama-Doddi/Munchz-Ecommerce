package com.example.inventory.repository;

import com.example.inventory.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    Optional<SubCategory> findByNameIgnoreCase(String name);
}
