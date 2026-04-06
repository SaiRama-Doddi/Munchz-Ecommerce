package com.auth.auth_service.repository;

import com.auth.auth_service.entity.ReferralConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReferralConfigRepository extends JpaRepository<ReferralConfig, Long> {
    // We only ever have one config record (ID 1)
    Optional<ReferralConfig> findFirstByOrderByIdAsc();
}
