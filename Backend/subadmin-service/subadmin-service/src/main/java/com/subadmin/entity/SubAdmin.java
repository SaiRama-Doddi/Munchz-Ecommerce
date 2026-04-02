package com.subadmin.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "sub_admins")
public class SubAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private SubAdminStatus status = SubAdminStatus.PRE_VERIFIED;

    @Column(columnDefinition = "TEXT")
    private String permissions; // JSON String or comma-separated

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public enum SubAdminStatus {
        PRE_VERIFIED, ACTIVE, DISABLED
    }
}
