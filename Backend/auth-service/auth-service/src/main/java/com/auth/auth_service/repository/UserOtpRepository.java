package com.auth.auth_service.repository;

import com.auth.auth_service.entity.UserOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserOtpRepository extends JpaRepository<UserOtp, UUID> {
    Optional<UserOtp> findAllByUserIdAndPurposeAndConsumedFalseOrderByExpiresAtDesc(UUID userId,String purpose);
    void deleteByUserIdAndPurpose(UUID userId, String purpose);

    @Query("""
        SELECT u FROM UserOtp u
        WHERE u.userId = :userId
        AND u.purpose = :purpose
        AND u.consumed = false
        AND u.expiresAt > :now
    """)
    Optional<UserOtp> findValidOtp(
            UUID userId,
            String purpose,
            Instant now
    );

    @Modifying
    @Query("""
        UPDATE UserOtp u
        SET u.consumed = true
        WHERE u.userId = :userId
        AND u.purpose = :purpose
        AND u.consumed = false
    """)
    void invalidateActiveOtps(UUID userId, String purpose);


}
