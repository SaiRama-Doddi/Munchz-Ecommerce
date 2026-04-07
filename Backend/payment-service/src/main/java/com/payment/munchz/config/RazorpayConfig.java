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
        String finalKey = (key == null || key.isBlank() || key.startsWith("${")) 
                ? System.getenv("RAZORPAY_KEY") 
                : key;
                
        String finalSecret = (secret == null || secret.isBlank() || secret.startsWith("${")) 
                ? System.getenv("RAZORPAY_SECRET") 
                : secret;

        if (finalKey == null || finalKey.isBlank() || finalKey.startsWith("${")) {
            throw new RuntimeException("CRITICAL CONFIG ERROR: RAZORPAY_KEY is missing or unresolved! Check .env or Docker configuration.");
        }
        
        if (finalSecret == null || finalSecret.isBlank() || finalSecret.startsWith("${")) {
            throw new RuntimeException("CRITICAL CONFIG ERROR: RAZORPAY_SECRET is missing or unresolved! Check .env or Docker configuration.");
        }

        return new RazorpayClient(finalKey, finalSecret);
    }
}

