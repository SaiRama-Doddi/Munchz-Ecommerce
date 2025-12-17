package com.auth.auth_service.dto;

public record CreateProfileRequest(
        String firstName,
        String lastName,
        String mobile
) {}
