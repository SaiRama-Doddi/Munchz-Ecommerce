package com.auth.auth_service.controller.admin;

import com.auth.auth_service.dto.AdminUserResponse;
import com.auth.auth_service.dto.ProfileResponse;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.service.RoleService;
import com.auth.auth_service.service.SubAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private SubAdminService subAdminService;

    @Autowired
    private UserProfileClient userProfileClient;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<ProfileResponse> profiles = new ArrayList<>();
        List<com.auth.auth_service.dto.AddressResponse> allAddresses = new ArrayList<>();
        
        try {
            profiles = userProfileClient.getAllProfiles();
            allAddresses = userProfileClient.getAllAddresses();
        } catch (Exception e) {
            System.err.println("⚠ Could not fetch data from User Profile Service: " + e.getMessage());
        }

        Map<UUID, ProfileResponse> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileResponse::getUserId, p -> p, (p1, p2) -> p1));

        Map<UUID, List<com.auth.auth_service.dto.AddressResponse>> addressMap = allAddresses.stream()
                .collect(Collectors.groupingBy(com.auth.auth_service.dto.AddressResponse::userId));

        List<AdminUserResponse> response = users.stream().map(user -> {
            ProfileResponse profile = profileMap.get(user.getId());
            List<String> roles = roleService.getUserRoleNames(user.getId());
            List<com.auth.auth_service.dto.AddressResponse> userAddresses = addressMap.getOrDefault(user.getId(), new ArrayList<>());
            
            return new AdminUserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getPhone() != null ? user.getPhone() : (profile != null ? profile.getPhone() : null),
                    profile != null ? profile.getFirstName() : "User",
                    profile != null ? profile.getLastName() : "",
                    user.getReferralCode(),
                    roles,
                    user.getProvider(),
                    userAddresses
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/promote")
    public ResponseEntity<String> promoteToSubAdmin(@PathVariable UUID userId) {
        subAdminService.promoteToSubAdmin(userId);
        return ResponseEntity.ok("User promoted to Sub-Admin successfully");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
        subAdminService.deleteUserAccount(userId);
        return ResponseEntity.ok("User account deleted successfully");
    }
}
