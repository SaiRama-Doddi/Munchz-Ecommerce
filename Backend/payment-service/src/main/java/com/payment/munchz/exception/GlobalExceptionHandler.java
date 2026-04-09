package com.payment.munchz.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(com.razorpay.RazorpayException.class)
    public ResponseEntity<Map<String, String>> handleRazorpayException(com.razorpay.RazorpayException e) {
        log.error("RAZORPAY_GATEWAY_ERROR: {}", e.getMessage(), e);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Razorpay Error");
        error.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        log.error("PAYMENT_SERVICE_RUNTIME_ERROR: {} - Cause: {}", e.getMessage(), 
                 (e.getCause() != null ? e.getCause().getMessage() : "No cause"), e);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal Service Fault");
        error.put("message", e.getMessage() != null ? e.getMessage() : "Unknown Runtime Error");
        error.put("details", e.getCause() != null ? e.getCause().toString() : "No further details");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception e) {
        log.error("PAYMENT_SERVICE_UNEXPECTED_ERROR: {} - Type: {}", e.getMessage(), e.getClass().getName(), e);
        Map<String, String> error = new HashMap<>();
        error.put("error", "Unexpected error occurred");
        error.put("message", e.getMessage() != null ? e.getMessage() : "Unexpected System Fault");
        error.put("type", e.getClass().getName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
