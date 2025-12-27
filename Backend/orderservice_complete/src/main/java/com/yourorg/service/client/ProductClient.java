package com.yourorg.service.client;

import com.yourorg.service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.yourorg.service.dto.ProductResponse;

@FeignClient(name = "PRODUCT-SERVICE" ,
        url = "${services.PRODUCT-SERVICE.url}",
        configuration = FeignConfig.class)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductResponse getProductById(@PathVariable("id") Long id);

}
