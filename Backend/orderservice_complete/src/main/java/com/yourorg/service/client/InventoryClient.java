package com.yourorg.service.client;

import com.yourorg.service.dto.InventoryReduceRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "STOCK-SERVICE")
public interface InventoryClient {

    @PostMapping("/api/inventory/order/reduce")
    void reduceStockOnOrder(@RequestBody InventoryReduceRequest request);
}
