package com.yourorg.service.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private static final String SECRET = "AI8pvV4kSKAkHXHjtrAgnFqOzeSwHTsHNGEOQM5Th5Y="; // must match auth service

    private final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    public boolean validateToken(String token) {
        try {
            JWT.require(algorithm)
                    .build()
                    .verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserId(String token) {
        DecodedJWT jwt = JWT.require(algorithm)
                .build()
                .verify(token);

        return jwt.getSubject(); // userId
    }
}
