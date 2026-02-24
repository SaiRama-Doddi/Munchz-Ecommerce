package com.payment.munchz.dto;

public record CreatePaymentResponse(
        String razorpayOrderId,
        Long amount,
        String currency,
        String key
) {}