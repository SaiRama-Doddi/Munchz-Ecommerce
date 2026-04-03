package com.subadmin.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "sub_admin_activities")
public class SubAdminActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "sub_admin_id")
    private UUID subAdminId;

    @Column(name = "sub_admin_email", nullable = false)
    private String subAdminEmail;

    private String action; // e.g., "CREATE", "UPDATE", "DELETE"
    
    private String module; // e.g., "CATEGORY", "PRODUCT"

    @Column(name = "target_id")
    private String targetId; // ID of the entity acted upon

    private String details; // Extra info about the action

    private Instant timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = Instant.now();
    }
}
