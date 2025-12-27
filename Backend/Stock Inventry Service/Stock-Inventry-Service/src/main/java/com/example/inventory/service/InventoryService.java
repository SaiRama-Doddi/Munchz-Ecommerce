package com.example.inventory.service;

import com.example.inventory.dto.StockRequest;
import com.example.inventory.entity.StockInventory;
import com.example.inventory.entity.StockTransaction;
import com.example.inventory.repository.InventoryRepository;
import com.example.inventory.repository.StockTransactionRepository;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepo;
    private final StockTransactionRepository transactionRepo;

    public InventoryService(
            InventoryRepository inventoryRepo,
            StockTransactionRepository transactionRepo
    ) {
        this.inventoryRepo = inventoryRepo;
        this.transactionRepo = transactionRepo;
    }

    // ================= ADD STOCK =================
    @Transactional
    public StockInventory addStock(StockRequest request) {

        String variant = request.getVariant().trim().toLowerCase();

        StockInventory stock = inventoryRepo
                .findByProductIdAndVariantLabel(request.getProductId(), variant)
                .orElse(null);

        if (stock == null) {
            stock = new StockInventory();
            stock.setCategoryId(request.getCategoryId());
            stock.setCategoryName(request.getCategoryName());
            stock.setSubCategoryId(request.getSubCategoryId());
            stock.setSubCategoryName(request.getSubCategoryName());
            stock.setProductId(request.getProductId());
            stock.setProductName(request.getProductName());
            stock.setVariantLabel(variant);
            stock.setQuantity(0);
        }

        stock.setQuantity(stock.getQuantity() + request.getQuantity());
        inventoryRepo.save(stock);

        StockTransaction tx = new StockTransaction();
        tx.setProductId(request.getProductId());
        tx.setProductName(request.getProductName());
        tx.setVariantLabel(variant);
        tx.setQuantity(request.getQuantity());
        tx.setTransactionType("ADD");

        transactionRepo.save(tx);

        return stock;
    }

    // ================= GET ALL =================
    public List<StockInventory> getAllStock() {
        return inventoryRepo.findAll();
    }

    // ================= GET BY PRODUCT =================
    public List<StockInventory> getStockByProduct(Long productId) {
        return inventoryRepo.findByProductId(productId);
    }

    // ================= REDUCE =================
    @Transactional
    public StockInventory reduceStock(Long productId, String variant, int qty) {

        String normalizedVariant = variant.trim().toLowerCase();

        StockInventory stock = inventoryRepo
                .findByProductIdAndVariantLabel(productId, normalizedVariant)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        if (stock.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        stock.setQuantity(stock.getQuantity() - qty);
        inventoryRepo.save(stock);

        StockTransaction tx = new StockTransaction();
        tx.setProductId(productId);
        tx.setVariantLabel(normalizedVariant);
        tx.setQuantity(qty);
        tx.setTransactionType("REMOVE");

        transactionRepo.save(tx);

        return stock;
    }

    // ================= DELETE =================
    public void deleteStock(Long id) {
        if (!inventoryRepo.existsById(id)) {
            throw new RuntimeException("Stock not found");
        }
        inventoryRepo.deleteById(id);
    }

    // ================= SEARCH =================
    public Page<StockInventory> searchStock(String keyword, Pageable pageable) {
        return inventoryRepo.findByProductNameContainingIgnoreCase(keyword, pageable);
    }

    // ================= LOW STOCK =================
    public List<StockInventory> getLowStock(int threshold) {
        return inventoryRepo.findByQuantityLessThan(threshold);
    }

    // ================= HISTORY =================
    public List<StockTransaction> getStockHistory(Long productId) {
        return transactionRepo.findByProductId(productId);
    }
}
