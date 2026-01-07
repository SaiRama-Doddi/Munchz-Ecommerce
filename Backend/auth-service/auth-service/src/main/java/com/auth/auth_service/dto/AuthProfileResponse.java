package com.auth.auth_service.dto;

public record AuthProfileResponse(
        String firstName,
        String lastName,
        String mobile,
        String email,
        java.util.UUID id) {}

