package com.subadmin.repository;

import com.subadmin.entity.SubAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SubAdminRepository extends JpaRepository<SubAdmin, UUID> {
    Optional<SubAdmin> findByEmail(String email);
}
