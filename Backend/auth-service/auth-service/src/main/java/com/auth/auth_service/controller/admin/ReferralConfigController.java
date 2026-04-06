package com.auth.auth_service.controller.admin;

import com.auth.auth_service.entity.ReferralConfig;
import com.auth.auth_service.repository.ReferralConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/admin/referral-config")
@PreAuthorize("hasRole('ADMIN')")
public class ReferralConfigController {

    @Autowired
    private ReferralConfigRepository referralConfigRepository;

    @GetMapping
    public ResponseEntity<ReferralConfig> getConfig() {
        ReferralConfig config = referralConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    ReferralConfig newConfig = new ReferralConfig();
                    newConfig.setRewardPercentage(5.0);
                    newConfig.setFixedAmount(50.0);
                    newConfig.setMinimumOrderAmount(500.0);
                    newConfig.setIsActive(true);
                    return referralConfigRepository.save(newConfig);
                });
        return ResponseEntity.ok(config);
    }

    @PutMapping
    public ResponseEntity<ReferralConfig> updateConfig(@RequestBody ReferralConfig newConfig) {
        ReferralConfig existing = referralConfigRepository.findFirstByOrderByIdAsc()
                .orElse(new ReferralConfig());
        
        existing.setRewardPercentage(newConfig.getRewardPercentage());
        existing.setFixedAmount(newConfig.getFixedAmount());
        existing.setMinimumOrderAmount(newConfig.getMinimumOrderAmount());
        existing.setIsActive(newConfig.getIsActive());
        
        ReferralConfig saved = referralConfigRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
