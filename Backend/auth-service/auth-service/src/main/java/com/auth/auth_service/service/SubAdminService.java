package com.auth.auth_service.service;

import com.auth.auth_service.dto.CreateProfileRequest;
import com.auth.auth_service.entity.Role;
import com.auth.auth_service.entity.SubAdmin;
import com.auth.auth_service.entity.SubAdminActivity;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.RoleRepository;
import com.auth.auth_service.repository.SubAdminActivityRepository;
import com.auth.auth_service.repository.SubAdminRepository;
import com.auth.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubAdminService {

    private final SubAdminRepository subAdminRepository;
    private final SubAdminActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoleService roleService;
    private final UserProfileClient userProfileClient;
    private final EmailService emailService;

    @Transactional
    public SubAdmin createSubAdmin(String email, String token) {
        System.out.println("Initiating Sub-Admin creation for: " + email);
        
        // 1. Ensure User exists in auth_users
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setEmailVerified(true);
                    newUser.setProvider("LOCAL");
                    return userRepository.save(newUser);
                });

        // 2. Assign SUB_ADMIN role
        Role subAdminRole = roleRepository.findByName("SUB_ADMIN")
                .orElseGet(() -> roleService.createRole("SUB_ADMIN"));
        
        try {
            roleService.assignRole(user.getId(), subAdminRole.getId(), null);
        } catch (Exception e) {
            System.err.println("⚠ Role assignment skipped/failed: " + e.getMessage());
        }

        // 3. Create SubAdmin Metadata
        SubAdmin subAdmin = subAdminRepository.findByEmail(email)
                .orElse(new SubAdmin());
        
        subAdmin.setEmail(email);
        subAdmin.setStatus(SubAdmin.SubAdminStatus.ACTIVE);
        if (subAdmin.getPermissions() == null) {
            subAdmin.setPermissions("[]"); 
        }
        subAdmin = subAdminRepository.save(subAdmin);

        // 4. Sync Profile to User Profile Service
        // 4. Sync Profile to User Profile Service (Internal)
        try {
            System.out.println("Syncing profile for newly created sub-admin ID: " + user.getId());
            
            // Generate referral code for sub-admin
            String referralCode = generateReferralCode("Sub", "0000000000");
            user.setReferralCode(referralCode);
            userRepository.save(user);

            CreateProfileRequest profileRequest = new CreateProfileRequest(
                    "Sub", "Admin", "0000000000", referralCode, 0.0
            );
            userProfileClient.createInternalProfile(user.getId(), profileRequest);
        } catch (Exception e) {
            System.err.println("⚠ Profile sync skipped or failed: " + e.getMessage());
        }

        // 5. Log Activity
        logActivity(email, "CREATE", "SUB_ADMIN", "Created new sub-admin authority");

        // 6. Send Welcome Email
        try {
            emailService.sendSubAdminWelcomeMail(email);
        } catch (Exception e) {
            System.err.println("⚠ Welcome email failed: " + e.getMessage());
        }

        return subAdmin;
    }

    public List<SubAdmin> getAllSubAdmins() {
        return subAdminRepository.findAll();
    }

    public SubAdmin updatePermissions(UUID id, String permissions) {
        SubAdmin subAdmin = subAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubAdmin not found"));
        subAdmin.setPermissions(permissions);
        return subAdminRepository.save(subAdmin);
    }

    public List<SubAdminActivity> getAllActivities() {
        return activityRepository.findAll();
    }

    public SubAdmin getByEmail(String email) {
        return subAdminRepository.findByEmail(email).orElse(null);
    }

    @Transactional
    public void deleteSubAdmin(UUID id) {
        SubAdmin subAdmin = subAdminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubAdmin not found"));
        
        String email = subAdmin.getEmail();
        logActivity(email, "DELETE", "SUB_ADMIN", "Removed sub-admin authority for " + email);
        subAdminRepository.deleteById(id);
    }

    @Transactional
    public void promoteToSubAdmin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role subAdminRole = roleRepository.findByName("SUB_ADMIN")
                .orElseGet(() -> roleService.createRole("SUB_ADMIN"));
        roleService.assignRole(user.getId(), subAdminRole.getId(), null);

        if (!subAdminRepository.existsByEmail(user.getEmail())) {
            SubAdmin subAdmin = new SubAdmin();
            subAdmin.setEmail(user.getEmail());
            subAdmin.setStatus(SubAdmin.SubAdminStatus.ACTIVE);
            subAdmin.setPermissions("[]");
            subAdminRepository.save(subAdmin);
        }

        logActivity(user.getEmail(), "PROMOTE", "USER_MANAGEMENT", "User promoted to sub-admin");
    }

    @Transactional
    public void deleteUserAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            userProfileClient.deleteInternalProfile(userId);
        } catch (Exception e) {
            System.err.println("⚠ Profile deletion failed: " + e.getMessage());
        }

        subAdminRepository.findByEmail(user.getEmail()).ifPresent(subAdminRepository::delete);
        userRepository.delete(user);
        
        logActivity(user.getEmail(), "DELETE", "USER_MANAGEMENT", "User account deleted");
    }

    public void logActivity(String email, String action, String module, String details) {
        SubAdminActivity activity = new SubAdminActivity();
        activity.setSubAdminEmail(email);
        activity.setAction(action);
        activity.setModule(module);
        activity.setDetails(details);
        activityRepository.save(activity);
    }

    private String generateReferralCode(String firstName, String phone) {
        String base = "";
        if (firstName != null && !firstName.isEmpty()) {
            base += firstName.substring(0, Math.min(firstName.length(), 4)).toUpperCase();
        } else {
            base += "USER";
        }

        if (phone != null && phone.length() >= 4) {
            base += phone.substring(phone.length() - 4);
        } else {
            base += "0000";
        }

        String referralCode = base;
        int suffix = 1;
        while (userRepository.existsByReferralCode(referralCode)) {
            referralCode = base + suffix;
            suffix++;
        }
        return referralCode;
    }
}
