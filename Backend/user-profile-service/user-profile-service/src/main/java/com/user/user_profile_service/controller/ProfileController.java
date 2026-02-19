package com.user.user_profile_service.controller;

import com.user.user_profile_service.dto.CreateProfileRequest;
import com.user.user_profile_service.entity.Profile;
import com.user.user_profile_service.service.ProfileService;
import com.user.user_profile_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    /* ===================== CREATE ===================== */
    @PostMapping
    public Profile createProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        UUID userId = jwtUtil.extractUserId(token);
        return profileService.createProfile(userId, req);
    }

    /* ===================== GET ===================== */
    @GetMapping
    public Profile getProfile(
            @RequestHeader("Authorization") String token
    ) {
        UUID userId = jwtUtil.extractUserId(token);
        return profileService.getProfile(userId);
    }

    /* ===================== PUT ===================== */
    @PutMapping
    public Profile putProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        UUID userId = jwtUtil.extractUserId(token);
        return profileService.putProfile(userId, req);
    }

    /* ===================== PATCH ===================== */
    @PatchMapping
    public Profile patchProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateProfileRequest req
    ) {
        UUID userId = jwtUtil.extractUserId(token);
        return profileService.patchProfile(userId, req);
    }

    @GetMapping("/users/{userId}")
    public Profile getProfileByUserId(@PathVariable UUID userId) {
        return profileService.getProfile(userId);
    }
}
