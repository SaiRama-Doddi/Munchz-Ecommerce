package com.auth.auth_service.config;

import com.auth.auth_service.entity.Role;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.entity.UserRole;
import com.auth.auth_service.repository.RoleRepository;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure essential roles exist
        ensureRoleExists("USER");
        ensureRoleExists("SUB_ADMIN");
        Role adminRole = ensureRoleExists("ADMIN");

        // 2. Define bootstrap admins
        List<String> adminEmails = List.of("sairamadoddi@gmail.com", "gomunchz@gmail.com");

        for (String email : adminEmails) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            
            if (userOpt.isEmpty()) {
                // Create user if not exists
                System.out.println("🌱 Creating new admin user account for: " + email);
                user = new User();
                user.setEmail(email);
                user.setEmailVerified(true);
                user.setProvider("LOCAL");
                user = userRepository.save(user);
            } else {
                user = userOpt.get();
            }

            // 3. Assign ADMIN role if missing
            boolean hasAdminRole = userRoleRepository.findRolesByUserId(user.getId())
                    .contains("ADMIN");

            if (!hasAdminRole) {
                System.out.println("🚀 Assigning ADMIN role to: " + email);
                
                UserRole.UserRoleId id = new UserRole.UserRoleId();
                id.setUserId(user.getId());
                id.setRoleId(adminRole.getId());

                UserRole userRole = new UserRole();
                userRole.setId(id);
                userRole.setAssignedAt(Instant.now());
                
                userRoleRepository.save(userRole);
            }
        }
    }

    private Role ensureRoleExists(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}
