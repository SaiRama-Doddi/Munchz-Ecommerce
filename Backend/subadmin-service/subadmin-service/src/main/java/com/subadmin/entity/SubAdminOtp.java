package com.subadmin.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "sub_admin_otps")
public class SubAdminOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID subAdminId;

    @Column(nullable = false)
    private String otpHash;

    private Instant expiresAt;

    private boolean consumed = false;

    private String purpose; // e.g., "ACTIVATION", "LOGIN"

    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
