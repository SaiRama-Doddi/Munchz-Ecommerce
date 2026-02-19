package com.yourorg.service.repository;

import com.yourorg.service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByCategoryIdAndSubcategoryId(Long categoryId, Long subcategoryId);

    @Query("""
    SELECT p FROM Product p
    LEFT JOIN p.category c
    LEFT JOIN p.subcategory s
    WHERE
        LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Product> search(@Param("keyword") String keyword);


}
