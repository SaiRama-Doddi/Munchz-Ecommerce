package com.example.inventory.repository;

import com.example.inventory.entity.StockInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<StockInventory, Long> {

    Optional<StockInventory> findByProductIdAndVariantLabel(
            Long productId,
            String variantLabel
    );

    List<StockInventory> findByProductId(Long productId);

    Page<StockInventory> findByProductNameContainingIgnoreCase(
            String productName,
            Pageable pageable
    );

    List<StockInventory> findByQuantityLessThan(int quantity);
}
