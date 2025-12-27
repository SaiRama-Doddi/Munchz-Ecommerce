package com.yourorg.service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtil {

    private SecurityUtil() {}

    public static String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated request");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername(); // email
        }

        return principal.toString();
    }
}
