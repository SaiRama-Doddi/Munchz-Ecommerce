package com.subadmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SubAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(SubAdminApplication.class, args);
    }
}
