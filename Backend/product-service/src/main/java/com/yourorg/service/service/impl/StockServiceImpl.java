package com.yourorg.service.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yourorg.service.dto.ProductStockDetailResponse;
import com.yourorg.service.dto.ProductStockResponse;
import com.yourorg.service.entity.Category;
import com.yourorg.service.entity.Product;
import com.yourorg.service.entity.ProductStock;
import com.yourorg.service.entity.Subcategory;
import com.yourorg.service.repository.CategoryRepository;
import com.yourorg.service.repository.ProductRepository;
import com.yourorg.service.repository.ProductStockRepository;
import com.yourorg.service.repository.SubcategoryRepository;
import com.yourorg.service.service.StockService;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private ProductStockRepository stockRepo;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    // ---------------------------------------------------------
    // ADD STOCK
    // ---------------------------------------------------------
    @Override
    public void addStock(Long categoryId, Long subcategoryId, Long productId, BigDecimal qtyKg) {

        ProductStock stock = stockRepo.findByProductId(productId).orElse(null);

        if (stock == null) {
            stock = new ProductStock();
            stock.setCategoryId(categoryId);
            stock.setSubcategoryId(subcategoryId);
            stock.setProductId(productId);
            stock.setStockInKg(qtyKg);
        } else {
            stock.setStockInKg(stock.getStockInKg().add(qtyKg));
        }

        stock.setUpdatedAt(LocalDateTime.now());
        stockRepo.save(stock);
    }

    // ---------------------------------------------------------
    // REDUCE STOCK
    // ---------------------------------------------------------
    @Override
    public boolean reduceStock(Long productId, BigDecimal qtyKg) {

        ProductStock stock = stockRepo.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (stock.getStockInKg().compareTo(qtyKg) < 0) {
            return false;
        }

        stock.setStockInKg(stock.getStockInKg().subtract(qtyKg));
        stock.setUpdatedAt(LocalDateTime.now());
        stockRepo.save(stock);
        return true;
    }

    // ---------------------------------------------------------
    // GET STOCK FOR ONE PRODUCT
    // ---------------------------------------------------------
    @Override
    public BigDecimal getStock(Long productId) {
        return stockRepo.findByProductId(productId)
                .map(ProductStock::getStockInKg)
                .orElse(BigDecimal.ZERO);
    }

    // ---------------------------------------------------------
    // LIST ALL STOCK WITH DETAILS
    // ---------------------------------------------------------
    @Override
    public List<ProductStockResponse> getAllStock() {

        List<ProductStock> stocks = stockRepo.findAll();

        return stocks.stream().map(s -> {

            Product product = productRepository.findById(s.getProductId()).orElse(null);
            Category category = categoryRepository.findById(s.getCategoryId()).orElse(null);
            Subcategory subcat = (s.getSubcategoryId() != null)
                    ? subcategoryRepository.findById(s.getSubcategoryId()).orElse(null)
                    : null;

            String lastUpdated = s.getUpdatedAt() != null ? s.getUpdatedAt().toString() : null;

            boolean lowStock = s.getStockInKg().compareTo(new BigDecimal("10")) < 0;

            return new ProductStockResponse(
                    product != null ? product.getId() : null,
                    product != null ? product.getName() : "Unknown Product",
                    product != null ? product.getCustomId() : null,

                    category != null ? category.getId() : null,
                    category != null ? category.getName() : "Unknown Category",

                    subcat != null ? subcat.getId() : null,
                    subcat != null ? subcat.getName() : "No Subcategory",

                    s.getStockInKg().toPlainString(),
                    lastUpdated,
                    product != null ? product.getImageUrl() : null,
                    lowStock
            );

        }).toList();
    }

    // ---------------------------------------------------------
    // GET STOCK DETAIL (ONE PRODUCT)
    // ---------------------------------------------------------
    @Override
    public ProductStockDetailResponse getStockDetails(Long productId) {

        ProductStock stock = stockRepo.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found for productId: " + productId));

        Product product = productRepository.findById(stock.getProductId()).orElse(null);
        Category category = categoryRepository.findById(stock.getCategoryId()).orElse(null);
        Subcategory subcat = (stock.getSubcategoryId() != null)
                ? subcategoryRepository.findById(stock.getSubcategoryId()).orElse(null)
                : null;

        return new ProductStockDetailResponse(
                product != null ? product.getId() : null,
                product != null ? product.getName() : "Unknown Product",
                product != null ? product.getCustomId() : null,
                category != null ? category.getId() : null,
                category != null ? category.getName() : "Unknown Category",
                subcat != null ? subcat.getId() : null,
                subcat != null ? subcat.getName() : "No Subcategory",
                stock.getStockInKg().toPlainString()
        );
    }

    // ---------------------------------------------------------
    // UPDATE STOCK
    // ---------------------------------------------------------
    @Override
    public void updateStock(Long productId, BigDecimal qtyKg) {

        ProductStock stock = stockRepo.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        stock.setStockInKg(qtyKg);
        stock.setUpdatedAt(LocalDateTime.now());
        stockRepo.save(stock);
    }

    @Override
public void deleteStock(Long productId) {
    ProductStock stock = stockRepo.findByProductId(productId)
            .orElseThrow(() -> new RuntimeException("Stock not found"));
    stockRepo.delete(stock);
}

}
