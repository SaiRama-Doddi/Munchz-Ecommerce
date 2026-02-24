package com.yourorg.service.service;

import java.math.BigDecimal;
import java.util.List;

import com.yourorg.service.dto.ProductStockDetailResponse;
import com.yourorg.service.dto.ProductStockResponse;

public interface StockService {

    void addStock(Long categoryId, Long subcategoryId, Long productId, BigDecimal quantityKg);

    boolean reduceStock(Long productId, BigDecimal quantityKg);

    BigDecimal getStock(Long productId);

    List<ProductStockResponse> getAllStock();

    ProductStockDetailResponse getStockDetails(Long productId);

    // Only declare method, do NOT implement here
    void updateStock(Long productId, BigDecimal qtyKg);
    void deleteStock(Long productId);

}
