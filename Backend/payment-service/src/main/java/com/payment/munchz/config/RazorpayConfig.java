package com.payment.munchz.config;



import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {
        boolean isKeyFromValue = key != null && !key.isBlank() && !key.startsWith("${");
        String finalKey = isKeyFromValue ? key : System.getenv("RAZORPAY_KEY");
                
        boolean isSecretFromValue = secret != null && !secret.isBlank() && !secret.startsWith("${");
        String finalSecret = isSecretFromValue ? secret : System.getenv("RAZORPAY_SECRET");

        // Advanced Logging for Troubleshooting
        String keySource = isKeyFromValue ? "Spring Property (@Value)" : "System Environment (System.getenv)";
        if (finalKey != null && !finalKey.isBlank() && !finalKey.startsWith("${")) {
            String masked = finalKey.substring(0, 8) + "..." + finalKey.substring(finalKey.length() - 4);
            System.out.println(">>> RAZORPAY_CONFIG: Resolved Key via " + keySource + ": " + masked);
        } else {
            System.err.println(">>> RAZORPAY_CONFIG: FAILED to resolve Key via both Spring Property and System Env!");
            throw new RuntimeException("CRITICAL CONFIG ERROR: RAZORPAY_KEY is missing! Check .env or Docker/VPS shell environment.");
        }
        
        if (finalSecret == null || finalSecret.isBlank() || finalSecret.startsWith("${")) {
             System.err.println(">>> RAZORPAY_CONFIG: FAILED to resolve Secret via both Spring Property and System Env!");
            throw new RuntimeException("CRITICAL CONFIG ERROR: RAZORPAY_SECRET is missing! Check .env or Docker/VPS shell environment.");
        }

        return new RazorpayClient(finalKey, finalSecret);
    }
}

