package com.user.user_profile_service.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name="profiles")
public class Profile {


    @Id
    @GeneratedValue
    private UUID id;


    private UUID userId;
    private String firstName;
    private String lastName;
    private String mobile;
/*    private LocalDate dob;*/


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
}
