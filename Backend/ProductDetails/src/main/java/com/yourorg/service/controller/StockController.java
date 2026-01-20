package com.yourorg.service.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.yourorg.service.dto.AddStockRequest;
import com.yourorg.service.dto.ReduceStockRequest;
import com.yourorg.service.service.StockService;

@RestController
@RequestMapping("product/api/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    // ADD STOCK
    @PostMapping("/add")
    public ResponseEntity<?> addStock(@RequestBody AddStockRequest req) {

        stockService.addStock(
                req.getCategoryId(),
                req.getSubcategoryId(),
                req.getProductId(),
                req.getQuantityKg()
        );

        return ResponseEntity.ok("Stock Added Successfully");
    }

    // REDUCE STOCK
    @PostMapping("/reduce")
    public ResponseEntity<?> reduceStock(@RequestBody ReduceStockRequest req) {

        boolean ok = stockService.reduceStock(req.getProductId(), req.getQuantityKg());

        if (!ok) {
            return ResponseEntity.badRequest().body("Insufficient Stock");
        }

        return ResponseEntity.ok("Stock Reduced Successfully");
    }

    // GET STOCK DETAILS FOR ONE PRODUCT
    @GetMapping("/{productId}")
    public ResponseEntity<?> getStockDetails(@PathVariable Long productId) {
        return ResponseEntity.ok(stockService.getStockDetails(productId));
    }

    // GET ALL STOCK
    @GetMapping("/all")
    public ResponseEntity<?> getAllStock() {
        return ResponseEntity.ok(stockService.getAllStock());
    }

    // UPDATE STOCK
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long productId,
            @RequestBody BigDecimal qtyKg
    ) {
        stockService.updateStock(productId, qtyKg);
        return ResponseEntity.ok("Stock Updated Successfully");
    }
    @DeleteMapping("/delete/{productId}")
public ResponseEntity<?> deleteStock(@PathVariable Long productId) {
    stockService.deleteStock(productId);
    return ResponseEntity.ok("Stock Deleted Successfully");
}

}
