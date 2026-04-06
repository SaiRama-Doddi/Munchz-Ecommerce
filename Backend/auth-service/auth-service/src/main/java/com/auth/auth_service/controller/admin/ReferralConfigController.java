package com.auth.auth_service.controller.admin;

import com.auth.auth_service.entity.ReferralConfig;
import com.auth.auth_service.repository.ReferralConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class ReferralConfigController {

    @Autowired
    private ReferralConfigRepository referralConfigRepository;

    @GetMapping("/referral-config/active")
    public ResponseEntity<List<ReferralConfig>> getActiveConfigs() {
        return ResponseEntity.ok(referralConfigRepository.findByIsActiveTrue());
    }

    @GetMapping("/admin/referral-config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReferralConfig>> getAllConfigs() {
        return ResponseEntity.ok(referralConfigRepository.findAll());
    }

    @PostMapping("/admin/referral-config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReferralConfig> createConfig(@RequestBody ReferralConfig newConfig) {
        return ResponseEntity.ok(referralConfigRepository.save(newConfig));
    }

    @PutMapping("/admin/referral-config/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReferralConfig> updateConfig(@PathVariable Long id, @RequestBody ReferralConfig newConfig) {
        ReferralConfig existing = referralConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Config not found"));
        
        existing.setFriendDiscountPercentage(newConfig.getFriendDiscountPercentage());
        existing.setReferrerCashbackAmount(newConfig.getReferrerCashbackAmount());
        existing.setMinimumOrderAmount(newConfig.getMinimumOrderAmount());
        existing.setIsActive(newConfig.getIsActive());
        
        return ResponseEntity.ok(referralConfigRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteConfig(@PathVariable Long id) {
        referralConfigRepository.deleteById(id);
        return ResponseEntity.ok("Referral rule deleted successfully");
    }
}
