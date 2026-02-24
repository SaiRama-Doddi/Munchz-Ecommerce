package com.yourorg.service.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yourorg.service.entity.ProductStock;

public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {

    Optional<ProductStock> findByProductId(Long productId);
}
