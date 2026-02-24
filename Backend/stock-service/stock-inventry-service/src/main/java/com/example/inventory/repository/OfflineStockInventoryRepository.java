package com.example.inventory.repository;

import com.example.inventory.entity.OfflineStockInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface OfflineStockInventoryRepository
        extends JpaRepository<OfflineStockInventory, Long> {

    Optional<OfflineStockInventory>
    findByProductIdAndVariantLabel(Long productId, String variantLabel);

    List<OfflineStockInventory> findByProductId(Long productId);
}
