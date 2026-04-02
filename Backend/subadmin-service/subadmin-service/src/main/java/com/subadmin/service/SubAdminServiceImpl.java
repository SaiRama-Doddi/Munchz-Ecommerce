package com.subadmin.service;

import com.subadmin.entity.SubAdmin;
import com.subadmin.entity.SubAdminActivity;
import com.subadmin.feign.AuthClient;
import com.subadmin.repository.SubAdminActivityRepository;
import com.subadmin.repository.SubAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubAdminServiceImpl implements SubAdminService {

    private final SubAdminRepository repository;
    private final SubAdminActivityRepository activityRepository;
    private final AuthClient authClient;

    @Override
    @Transactional
    public SubAdmin createSubAdmin(String email) {
        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Sub-Admin already exists with this email.");
        }
        
        // 1. Create entry in subadmin-service
        SubAdmin subAdmin = new SubAdmin();
        subAdmin.setEmail(email);
        subAdmin.setStatus(SubAdmin.SubAdminStatus.ACTIVE); // Centralized auth handles verification
        subAdmin.setPermissions("{\"CATEGORIES\":[],\"PRODUCTS\":[],\"ORDERS\":[],\"STOCKS\":[],\"COUPONS\":[],\"REVIEWS\":[]}");
        
        SubAdmin saved = repository.save(subAdmin);
        
        // 2. Sync with auth-service to ensure identity and role
        try {
            authClient.syncSubAdmin(Map.of("email", email));
        } catch (Exception e) {
            // Log warning but continue; manual sync might be needed if auth-service is down
            System.err.println("⚠ Failed to sync Sub-Admin identity to auth-service: " + e.getMessage());
        }
        
        return saved;
    }

    @Override
    public List<SubAdmin> getAllSubAdmins() {
        return repository.findAll();
    }

    @Override
    public SubAdmin updatePermissions(UUID id, String permissions) {
        SubAdmin subAdmin = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sub-Admin not found."));
        subAdmin.setPermissions(permissions);
        return repository.save(subAdmin);
    }

    @Override
    public List<SubAdminActivity> getAllActivities() {
        return activityRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public void logActivity(UUID subAdminId, String email, String action, String module, String targetId, String details) {
        SubAdminActivity activity = new SubAdminActivity();
        activity.setSubAdminId(subAdminId);
        activity.setSubAdminEmail(email);
        activity.setAction(action);
        activity.setModule(module);
        activity.setTargetId(targetId);
        activity.setDetails(details);
        activityRepository.save(activity);
    }

    // Redundant methods removed as per unification plan
    @Override
    public SubAdmin verifyOtpAndActivate(String email, String otp) { return null; }
    @Override
    public void requestLoginOtp(String email) { }
    @Override
    public String verifyLoginOtpAndGetToken(String email, String otp) { return null; }
}
