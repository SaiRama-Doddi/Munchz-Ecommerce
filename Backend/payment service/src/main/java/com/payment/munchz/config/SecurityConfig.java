package com.payment.munchz.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ Disable CSRF (REST API)
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS (uses CorsConfig bean)
                .cors(cors -> {})

                // ❌ Disable default auth mechanisms
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .authorizeHttpRequests(auth -> auth

                        // 🔥 VERY IMPORTANT: allow preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔥 Allow payment APIs from frontend
                        .requestMatchers("/api/payments/**").permitAll()

                        // 🔒 Everything else (if any)
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
