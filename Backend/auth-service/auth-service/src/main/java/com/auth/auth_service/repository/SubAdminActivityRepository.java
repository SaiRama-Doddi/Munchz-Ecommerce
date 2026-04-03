package com.auth.auth_service.repository;

import com.auth.auth_service.entity.SubAdminActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SubAdminActivityRepository extends JpaRepository<SubAdminActivity, UUID> {
}
