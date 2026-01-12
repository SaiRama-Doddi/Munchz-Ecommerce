package com.auth.auth_service.dto;

public record CreateAddressRequest(
        String label,           // Home / Office
        String addressLine1,
        String addressLine2,     // optional
        String city,
        String state,
        String country,
        String pincode,
        String phone,           // optional delivery mobile
        boolean isDefault
) {}
