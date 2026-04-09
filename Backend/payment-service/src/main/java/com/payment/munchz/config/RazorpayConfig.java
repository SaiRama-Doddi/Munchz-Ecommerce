package com.payment.munchz.config;



import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Autowired
    private org.springframework.core.env.Environment env;

    @Bean
    public RazorpayClient razorpayClient() {
        // Fail-safe resolution from environment
        String key = env.getProperty("RAZORPAY_KEY");
        String secret = env.getProperty("RAZORPAY_SECRET");
        
        System.out.println(">>> RAZORPAY_CONFIG: Attempting to resolve keys...");

        boolean keyValid = key != null && !key.isBlank() && !key.startsWith("${") && !key.equals("MISSING");
        boolean secretValid = secret != null && !secret.isBlank() && !secret.startsWith("${") && !secret.equals("MISSING");

        if (keyValid && secretValid) {
            try {
                System.out.println(">>> RAZORPAY_CONFIG: SUCCESS! Initializing RazorpayClient.");
                return new RazorpayClient(key, secret);
            } catch (Exception e) {
                System.err.println(">>> RAZORPAY_CONFIG: FAILED to initialize RazorpayClient: " + e.getMessage());
            }
        } else {
            System.err.println(">>> RAZORPAY_CONFIG: WARNING - Keys are missing or placeholders. Using dummy client.");
        }

        // Return a dummy client if keys are missing to prevent context crash
        try {
            return new RazorpayClient("dummy_key", "dummy_secret");
        } catch (Exception e) {
            return null;
        }
    }
}

