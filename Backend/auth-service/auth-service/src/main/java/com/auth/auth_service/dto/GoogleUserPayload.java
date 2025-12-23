package com.auth.auth_service.dto;

public record GoogleUserPayload(
        String email,
        String googleId,
        String firstName,
        String lastName,
        Boolean emailVerified,
        String picture
) {}
