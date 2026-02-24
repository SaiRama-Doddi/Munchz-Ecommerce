package com.yourorg.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients

@SpringBootApplication
public class OrderserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderserviceApplication.class, args);
    }
}
