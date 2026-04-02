package com.subadmin.repository;

import com.subadmin.entity.SubAdminOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface SubAdminOtpRepository extends JpaRepository<SubAdminOtp, UUID> {
    Optional<SubAdminOtp> findTopBySubAdminIdAndConsumedFalseOrderByCreatedAtDesc(UUID subAdminId);
}
