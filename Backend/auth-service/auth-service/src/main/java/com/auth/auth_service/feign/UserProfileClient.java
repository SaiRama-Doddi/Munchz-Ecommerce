package com.auth.auth_service.feign;

import com.auth.auth_service.dto.CreateProfileRequest;
import com.auth.auth_service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
        name = "user-profile-service",
        url = "${services.user-profile.url}"
)
public interface UserProfileClient {



    @PostMapping("/profile/update")
    ProfileResponse createOrUpdateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest request
    );

    @GetMapping("/profile")
    ProfileResponse getProfile(@RequestHeader("Authorization") String token);
}

