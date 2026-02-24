package com.payment.munchz.dto;

public record VerifyPaymentRequest(
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {}