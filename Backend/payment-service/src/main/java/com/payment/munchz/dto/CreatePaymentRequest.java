package com.payment.munchz.dto;



import java.util.UUID;

public record CreatePaymentRequest(
        UUID orderId,
        Long amount,
        String currency
) {}
