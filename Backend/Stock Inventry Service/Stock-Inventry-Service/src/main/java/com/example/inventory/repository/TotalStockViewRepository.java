package com.example.inventory.repository;

import com.example.inventory.entity.TotalStockView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TotalStockViewRepository
        extends JpaRepository<TotalStockView, Long> {
}
