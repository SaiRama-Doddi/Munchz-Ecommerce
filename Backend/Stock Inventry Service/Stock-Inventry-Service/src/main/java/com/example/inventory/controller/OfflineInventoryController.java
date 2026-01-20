package com.example.inventory.controller;

import com.example.inventory.entity.OfflineStockInventory;
import com.example.inventory.service.OfflineInventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock/api/admin/offline-inventory")
public class OfflineInventoryController {

    private final OfflineInventoryService service;

    public OfflineInventoryController(OfflineInventoryService service) {
        this.service = service;
    }

    @PostMapping
    public OfflineStockInventory add(@RequestBody OfflineStockInventory stock) {
        return service.addStock(stock);
    }

    @PutMapping("/{id}")
    public OfflineStockInventory update(
            @PathVariable Long id,
            @RequestBody OfflineStockInventory stock
    ) {
        return service.updateStock(id, stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteStock(id);
    }

    @GetMapping
    public List<OfflineStockInventory> getAll() {
        return service.getAll();
    }
}
