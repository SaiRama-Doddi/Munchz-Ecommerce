package com.auth.auth_service.dto;


public record ResendOtpRequest(
        String email,
        String purpose   // "email_verify" or "login"
) {}

