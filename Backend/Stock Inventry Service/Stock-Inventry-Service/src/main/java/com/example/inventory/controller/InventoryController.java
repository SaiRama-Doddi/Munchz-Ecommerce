package com.example.inventory.controller;

import com.example.inventory.dto.StockRequest;
import com.example.inventory.entity.StockInventory;
import com.example.inventory.entity.StockTransaction;
import com.example.inventory.service.InventoryService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // ✅ GET ALL STOCK
    @GetMapping
    public List<StockInventory> getAllStock() {
        return inventoryService.getAllStock();
    }

    // ✅ GET STOCK BY PRODUCT
    @GetMapping("/product/{productId}")
    public List<StockInventory> getStockByProduct(@PathVariable Long productId) {
        return inventoryService.getStockByProduct(productId);
    }

    // ✅ ADD STOCK
    @PostMapping("/add")
    public StockInventory addStock(@RequestBody StockRequest request) {
        return inventoryService.addStock(request);
    }

    // ✅ REDUCE STOCK
    @PostMapping("/reduce")
    public StockInventory reduceStock(@RequestBody StockRequest request) {
        return inventoryService.reduceStock(
                request.getProductId(),
                request.getVariant(),
                request.getQuantity()
        );
    }

    // ✅ DELETE STOCK
    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable Long id) {
        inventoryService.deleteStock(id);
    }

    // ✅ SEARCH WITH PAGINATION
    @GetMapping("/search")
    public Page<StockInventory> searchStock(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return inventoryService.searchStock(keyword, PageRequest.of(page, size));
    }

    // ✅ LOW STOCK
    @GetMapping("/low-stock")
    public List<StockInventory> lowStock(
            @RequestParam(defaultValue = "10") int threshold
    ) {
        return inventoryService.getLowStock(threshold);
    }

    // ✅ STOCK HISTORY
    @GetMapping("/history/{productId}")
    public List<StockTransaction> history(@PathVariable Long productId) {
        return inventoryService.getStockHistory(productId);
    }


    // ✅ UPDATE STOCK
    @PutMapping("/{id}")
    public StockInventory updateStock(
            @PathVariable Long id,
            @RequestBody StockRequest request
    ) {
        return inventoryService.updateStock(id, request);
    }

}
