package com.example.inventory.service;

import com.example.inventory.dto.StockEntryRequest;
import com.example.inventory.entity.StockEntry;
import com.example.inventory.repository.StockEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockEntryService {

    private final StockEntryRepository repository;

    public StockEntryService(StockEntryRepository repository) {
        this.repository = repository;
    }

    // ✅ CREATE
    public StockEntry addStockEntry(StockEntryRequest req) {
        StockEntry entry = new StockEntry();
        mapRequestToEntity(req, entry);
        return repository.save(entry);
    }

    // ✅ READ ALL
    public List<StockEntry> getAll() {
        return repository.findAll();
    }

    // ✅ READ BY PRODUCT ID
    public List<StockEntry> getByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    // ✅ READ BY ID
    public StockEntry getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock entry not found"));
    }

    // ✅ UPDATE
    public StockEntry updateStockEntry(Long id, StockEntryRequest req) {
        StockEntry existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock entry not found"));

        mapRequestToEntity(req, existing);
        return repository.save(existing);
    }

    // ✅ DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // ================= MAPPER =================
    private void mapRequestToEntity(StockEntryRequest req, StockEntry entry) {

        // CATEGORY
        entry.setCategoryId(req.getCategoryId());
        entry.setCategoryName(req.getCategoryName());

        // SUB CATEGORY
        entry.setSubCategoryId(req.getSubCategoryId());
        entry.setSubCategoryName(req.getSubCategoryName());

        // PRODUCT
        entry.setProductId(req.getProductId());
        entry.setProductName(req.getProductName());

        // SUPPLIER
        entry.setSupplierName(req.getSupplierName());
        entry.setSupplierGst(req.getSupplierGst());

        // STOCK DETAILS
        entry.setQuantity(req.getQuantity());
        entry.setPurchasePrice(req.getPurchasePrice());
        entry.setSellingPrice(req.getSellingPrice());

        entry.setStockInDate(req.getStockInDate());
        entry.setExpiryDate(req.getExpiryDate());

        entry.setRemarks(req.getRemarks());
    }
}
