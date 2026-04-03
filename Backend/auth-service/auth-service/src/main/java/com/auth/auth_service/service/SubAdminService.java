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
            CreateProfileRequest profileRequest = new CreateProfileRequest(
                    "Sub", "Admin", "0000000000"
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
        System.out.println("Deleting sub-admin: " + email);
        
        // Log before delete
        logActivity(email, "DELETE", "SUB_ADMIN", "Removed sub-admin authority for " + email);
        
        // Delete metadata
        subAdminRepository.deleteById(id);
    }

    public void logActivity(String email, String action, String module, String details) {
        SubAdminActivity activity = new SubAdminActivity();
        activity.setSubAdminEmail(email);
        activity.setAction(action);
        activity.setModule(module);
        activity.setDetails(details);
        activityRepository.save(activity);
    }
}
