package com.payment.munchz.config;
 
import com.razorpay.RazorpayClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
@Configuration
@Slf4j
public class RazorpayConfig {
 
    @Value("${razorpay.key}")
    private String razorpayKey;
 
    @Value("${razorpay.secret}")
    private String razorpaySecret;
 
    @Bean
    public RazorpayClient razorpayClient() {
        log.info(">>> Initializing RazorpayClient...");
 
        boolean keyValid = isKeyValid(razorpayKey);
        boolean secretValid = isKeyValid(razorpaySecret);
 
        if (keyValid && secretValid) {
            try {
                log.info(">>> Razorpay Keys resolved. Initializing SDK Client.");
                return new RazorpayClient(razorpayKey, razorpaySecret);
            } catch (Exception e) {
                log.error(">>> FAILED to initialize RazorpayClient: {}", e.getMessage());
            }
        } else {
            log.error(">>> CRITICAL: Razorpay Keys are missing or unresolved! (Key: {}, Secret: {})", 
                mask(razorpayKey), mask(razorpaySecret));
        }
 
        // Fallback to dummy client to prevent Application Context failure, 
        // but it will fail during actual API calls with Auth Error.
        try {
            return new RazorpayClient("dummy_key", "dummy_secret");
        } catch (Exception e) {
            return null;
        }
    }
 
    private boolean isKeyValid(String val) {
        return val != null && !val.isBlank() && !val.startsWith("${") && !val.equals("MISSING");
    }
 
    private String mask(String val) {
        if (val == null || val.length() < 4) return "HIDDEN";
        return val.substring(0, 4) + "****";
    }
}
