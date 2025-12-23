package com.auth.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name="auth_users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String email;

    private String phone;

    private boolean isEmailVerified;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    @Column(name = "provider", nullable = false)
    private String provider = "LOCAL"; // default


    @Column(name = "provider_id")
    private String providerId; // Google "sub"

}
