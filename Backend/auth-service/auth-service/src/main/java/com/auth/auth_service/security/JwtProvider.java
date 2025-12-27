    package com.auth.auth_service.security;
    
    import com.auth0.jwt.JWT;
    import com.auth0.jwt.algorithms.Algorithm;
    import com.auth0.jwt.interfaces.DecodedJWT;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Component;
    
    import java.util.Date;
    import java.util.List;
    import java.util.UUID;
    
    @Component
    
    public class JwtProvider {
    
        @Value("${jwt.secret}")
        private String secret;
    
        @Value("${jwt.expiration}")
        private Long expiration;
    
        public String generateToken(UUID userId, String email, List<String> roles) {
            return JWT.create()
                    .withSubject(userId.toString())
                    .withClaim("email", email)
                    .withClaim("roles", roles)     // 👈 ADD ROLES HERE
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                    .sign(Algorithm.HMAC256(secret));
        }
    
        public DecodedJWT validate(String token) {
            return JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token);
        }
    }
