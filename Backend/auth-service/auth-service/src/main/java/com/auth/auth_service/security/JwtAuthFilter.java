package com.auth.auth_service.security;


import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 🔓 NO TOKEN → SKIP JWT CHECK
        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {
                DecodedJWT jwt = jwtProvider.validate(token);

                UUID userId = UUID.fromString(jwt.getSubject());
                List<String> roles = jwt.getClaim("roles").asList(String.class);

                List<SimpleGrantedAuthority> authorities =
                        roles.stream()
                             .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                             .toList();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId.toString(),   // 🔥 use String principal
                                null,
                                authorities
                        );

                authentication.setDetails(
                        new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);


            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }

        // 🔴 THIS LINE IS MANDATORY
        filterChain.doFilter(request, response);
    }
}
