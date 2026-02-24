package com.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-profile-service")
public interface UserClient {

    @GetMapping("/profile/users/{id}")
    UserDto getUserById(@PathVariable("id") String id);
}
