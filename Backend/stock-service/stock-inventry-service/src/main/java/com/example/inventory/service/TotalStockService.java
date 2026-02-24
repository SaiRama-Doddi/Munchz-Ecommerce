package com.example.inventory.service;

import com.example.inventory.entity.TotalStockView;
import com.example.inventory.repository.TotalStockViewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TotalStockService {

    private final TotalStockViewRepository repo;

    public TotalStockService(TotalStockViewRepository repo) {
        this.repo = repo;
    }

    public List<TotalStockView> getAll() {
        return repo.findAll();
    }
}
