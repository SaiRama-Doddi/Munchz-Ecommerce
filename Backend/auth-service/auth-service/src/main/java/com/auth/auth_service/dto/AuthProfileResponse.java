package com.auth.auth_service.dto;

import java.util.UUID;

public record AuthProfileResponse(
        String firstName,
        String lastName,
        String mobile,
        String email,
        UUID id,
        Double referralCredits,
        String referralCode) {}
