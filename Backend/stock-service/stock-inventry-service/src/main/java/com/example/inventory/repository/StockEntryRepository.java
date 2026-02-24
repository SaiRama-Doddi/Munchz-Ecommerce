package com.example.inventory.repository;

import com.example.inventory.entity.StockEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockEntryRepository extends JpaRepository<StockEntry, Long> {

    List<StockEntry> findByProductId(Long productId);
}
