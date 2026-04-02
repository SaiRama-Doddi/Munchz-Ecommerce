package com.subadmin.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "auth-service", url = "http://auth-service:8081/auth")
public interface AuthClient {

    @PostMapping("/internal/sync-subadmin")
    String syncSubAdmin(@RequestBody Map<String, String> request);
}
