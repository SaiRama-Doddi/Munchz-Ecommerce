package com.yourorg.service.repository;

import com.yourorg.service.entity.OrderEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderEventRepository extends JpaRepository<OrderEventEntity, UUID> {
}

