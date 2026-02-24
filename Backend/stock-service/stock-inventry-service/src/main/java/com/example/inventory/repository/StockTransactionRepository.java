package com.example.inventory.repository;

import com.example.inventory.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;  // ✅ REQUIRED IMPORT

public interface StockTransactionRepository
        extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByProductId(Long productId);

}
