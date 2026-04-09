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
    private String springKey;
 
    @Value("${razorpay.secret}")
    private String springSecret;
 
    @Bean
    public RazorpayClient razorpayClient() {
        log.info(">>> Initializing RazorpayClient...");
 
        // Resolve keys with multi-layer fallback
        String key = resolve(springKey, "RZP_K");
        String secret = resolve(springSecret, "RZP_S");
 
        if (isValid(key) && isValid(secret)) {
            try {
                log.info(">>> SUCCESS! Initializing Razorpay SDK Client with resolved keys.");
                return new RazorpayClient(key, secret);
            } catch (Exception e) {
                log.error(">>> ERROR: Failed to initialize Razorpay SDK: {}", e.getMessage());
            }
        } else {
            log.error(">>> CRITICAL: KEY RESOLUTION FAILED!");
            log.error(">>> Spring Resolves -> Key: {}, Secret: {}", mask(springKey), mask(springSecret));
            log.error(">>> Env Resolves    -> Key: {}, Secret: {}", mask(System.getenv("RZP_K")), mask(System.getenv("RZP_S")));
        }
 
        // Dummy fallback to prevent startup crash
        try {
            return new RazorpayClient("dummy_key", "dummy_secret");
        } catch (Exception e) {
            return null;
        }
    }
 
    private String resolve(String springVal, String envName) {
        if (isValid(springVal)) return springVal.trim();
        String envVal = System.getenv(envName);
        if (isValid(envVal)) return envVal.trim();
        return "MISSING";
    }
 
    private boolean isValid(String val) {
        return val != null && !val.isBlank() && !val.startsWith("${") && !val.equals("MISSING");
    }
 
    private String mask(String val) {
        if (val == null || val.length() < 3) return val == null ? "NULL" : "SHORT";
        return val.substring(0, 3) + "****";
    }
}
