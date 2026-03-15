/*package com.auth.auth_service.security;


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
}*/

package com.auth.auth_service.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
        System.out.println("DEBUG: Request is " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("DEBUG: Authorization Header: " + (header != null ? "PRESENT" : "MISSING"));

        // ✅ If no token → just continue
        if (header == null || !header.startsWith("Bearer ")) {
            System.out.println("DEBUG: No Bearer token found in header.");
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        System.out.println("DEBUG: Token found, validating...");

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
                            userId.toString(),
                            null,
                            authorities
                    );

            System.out.println("DEBUG: Token valid for user: " + userId + " with roles: " + roles);
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception ex) {
            System.out.println("DEBUG: Token validation failed: " + ex.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
