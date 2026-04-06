package com.auth.auth_service.controller.admin;

import com.auth.auth_service.dto.CreateProfileRequest;
import com.auth.auth_service.dto.ProfileResponse;
import com.auth.auth_service.entity.User;
import com.auth.auth_service.feign.UserProfileClient;
import com.auth.auth_service.repository.UserRepository;
import com.auth.auth_service.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/admin")
public class ReferralBackfillController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileClient userProfileClient;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/backfill-referral-codes")
    public Map<String, Object> backfill() {
        List<User> usersWithoutCode = userRepository.findByReferralCodeIsNull();
        int successCount = 0;
        int failureCount = 0;
        Map<String, String> results = new HashMap<>();

        for (User user : usersWithoutCode) {
            try {
                // 1. Generate token to fetch profile
                String token = jwtProvider.generateToken(user.getId(), user.getEmail(), List.of("ADMIN"));
                
                // 2. Fetch profile
                ProfileResponse profile = userProfileClient.getProfile("Bearer " + token);
                
                // 3. Generate Referral Code
                String firstName = profile != null ? profile.getFirstName() : "USER";
                String phone = user.getPhone() != null ? user.getPhone() : (profile != null ? profile.getPhone() : null);
                
                String referralCode = generateReferralCode(firstName, phone);
                
                // 4. Update User
                user.setReferralCode(referralCode);
                userRepository.save(user);
                
                // 5. Update Profile
                CreateProfileRequest patchReq = new CreateProfileRequest(
                        firstName,
                        profile != null ? profile.getLastName() : null,
                        phone,
                        referralCode,
                        0.0
                );
                userProfileClient.patchProfile("Bearer " + token, patchReq);
                
                successCount++;
                results.put(user.getEmail(), "Success: " + referralCode);
            } catch (Exception e) {
                failureCount++;
                results.put(user.getEmail(), "Failed: " + e.getMessage());
            }
        }

        return Map.of(
                "totalProcessed", usersWithoutCode.size(),
                "successCount", successCount,
                "failureCount", failureCount,
                "details", results
        );
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
