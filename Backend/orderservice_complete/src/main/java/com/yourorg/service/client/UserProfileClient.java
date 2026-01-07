package com.yourorg.service.client;

import com.yourorg.service.config.FeignConfig;
import com.yourorg.service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
        name = "user-profile-service",
        url = "${services.user-profile.url}",
        configuration = FeignConfig.class
)
public interface UserProfileClient {

    @GetMapping("/profile")
    ProfileResponse getProfile(

    );
}
