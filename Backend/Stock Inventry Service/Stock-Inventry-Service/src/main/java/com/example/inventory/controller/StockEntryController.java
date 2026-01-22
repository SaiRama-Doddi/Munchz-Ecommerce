package com.example.inventory.controller;

import com.example.inventory.dto.StockEntryRequest;
import com.example.inventory.entity.StockEntry;
import com.example.inventory.service.StockEntryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/inventory/entries")

public class StockEntryController {

    private final StockEntryService service;

    public StockEntryController(StockEntryService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public StockEntry add(@RequestBody StockEntryRequest request) {
        return service.addStockEntry(request);
    }

    // GET ALL
    @GetMapping
    public List<StockEntry> getAll() {
        return service.getAll();
    }

    // GET BY PRODUCT ID
    @GetMapping("/product/{productId}")
    public List<StockEntry> getByProductId(@PathVariable Long productId) {
        return service.getByProductId(productId);
    }

    // ✅ UPDATE (THIS IS REQUIRED)
    @PutMapping("/{id}")
    public StockEntry update(
            @PathVariable Long id,
            @RequestBody StockEntryRequest request
    ) {
        return service.updateStockEntry(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public StockEntry getById(@PathVariable Long id) {
        return service.getById(id);
    }

}
