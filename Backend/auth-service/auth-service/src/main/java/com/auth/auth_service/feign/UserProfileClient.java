package com.auth.auth_service.feign;

import com.auth.auth_service.dto.AddressResponse;
import com.auth.auth_service.dto.CreateAddressRequest;
import com.auth.auth_service.dto.CreateProfileRequest;
import com.auth.auth_service.dto.ProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "user-profile-service",
        url = "${services.user-profile.url}"
)
public interface UserProfileClient {

    @PostMapping("/profile")
    ProfileResponse createProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest request
    );

    @GetMapping("/profile")
    ProfileResponse getProfile(
            @RequestHeader("Authorization") String token
    );

    @PutMapping("/profile")
    ProfileResponse putProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest request
    );

    @PatchMapping("/profile")
    ProfileResponse patchProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest request
    );


    /* ADDRESS */
    @PostMapping("/address/add")
    AddressResponse addAddress(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateAddressRequest request
    );

    @GetMapping("/address/list")
    List<AddressResponse> listAddresses(
            @RequestHeader("Authorization") String token
    );
}
