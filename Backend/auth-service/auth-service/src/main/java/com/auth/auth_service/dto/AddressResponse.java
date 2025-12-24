package com.auth.auth_service.dto;

import java.time.Instant;
import java.util.UUID;

public record AddressResponse(
        UUID id,
        String label,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String country,
        String pincode,
        String mobile,        // delivery phone
        boolean isDefault,
        Instant createdAt,
        Instant updatedAt
) {}
