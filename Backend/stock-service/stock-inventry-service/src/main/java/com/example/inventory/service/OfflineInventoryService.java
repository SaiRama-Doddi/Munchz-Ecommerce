package com.example.inventory.service;

import com.example.inventory.entity.OfflineStockInventory;
import com.example.inventory.entity.StockTransaction;
import com.example.inventory.repository.OfflineStockInventoryRepository;
import com.example.inventory.repository.StockTransactionRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfflineInventoryService {

    private final OfflineStockInventoryRepository offlineRepo;
    private final StockTransactionRepository transactionRepo;

    public OfflineInventoryService(
            OfflineStockInventoryRepository offlineRepo,
            StockTransactionRepository transactionRepo
    ) {
        this.offlineRepo = offlineRepo;
        this.transactionRepo = transactionRepo;
    }

    // ================= ADD =================
    @Transactional
    public OfflineStockInventory addStock(OfflineStockInventory request) {

        String variant = request.getVariantLabel().trim().toLowerCase();

        OfflineStockInventory stock = offlineRepo
                .findByProductIdAndVariantLabel(request.getProductId(), variant)
                .orElse(null);

        if (stock == null) {
            stock = new OfflineStockInventory();
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
        offlineRepo.save(stock);

        logTransaction(stock, request.getQuantity(), "OFFLINE_ADD");

        return stock;
    }

    // ================= UPDATE =================
    public OfflineStockInventory updateStock(Long id, OfflineStockInventory req) {

        OfflineStockInventory stock = offlineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Offline stock not found"));

        stock.setCategoryId(req.getCategoryId());
        stock.setCategoryName(req.getCategoryName());
        stock.setSubCategoryId(req.getSubCategoryId());
        stock.setSubCategoryName(req.getSubCategoryName());
        stock.setProductId(req.getProductId());
        stock.setProductName(req.getProductName());
        stock.setVariantLabel(req.getVariantLabel());
        stock.setQuantity(req.getQuantity());
        stock.setMinThreshold(req.getMinThreshold());

        return offlineRepo.save(stock);
    }

    // ================= DELETE =================
    public void deleteStock(Long id) {
        offlineRepo.deleteById(id);
    }

    // ================= GET ALL =================
    public List<OfflineStockInventory> getAll() {
        return offlineRepo.findAll();
    }

    // ================= GET BY PRODUCT =================
    public List<OfflineStockInventory> getByProduct(Long productId) {
        return offlineRepo.findByProductId(productId);
    }

    // ================= TRANSACTION LOG =================
    private void logTransaction(
            OfflineStockInventory stock,
            int qty,
            String type
    ) {
        StockTransaction tx = new StockTransaction();
        tx.setProductId(stock.getProductId());
        tx.setProductName(stock.getProductName());
        tx.setVariantLabel(stock.getVariantLabel());
        tx.setQuantity(qty);
        tx.setTransactionType(type);
        transactionRepo.save(tx);
    }
}
