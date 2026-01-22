package com.example.inventory.controller;

import com.example.inventory.entity.TotalStockView;
import com.example.inventory.service.TotalStockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/total-stock")
public class TotalStockController {

    private final TotalStockService service;

    public TotalStockController(TotalStockService service) {
        this.service = service;
    }

    @GetMapping
    public List<TotalStockView> getAll() {
        return service.getAll();
    }
}
