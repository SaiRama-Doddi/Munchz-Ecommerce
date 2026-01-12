package com.yourorg.service.repository;

import com.yourorg.service.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

    @Query("""
        select distinct o
        from OrderEntity o
        left join fetch o.items
        where o.userId = :userId
        """)
    Page<OrderEntity> findOrdersWithItems(
            @Param("userId") UUID userId,
            Pageable pageable
    );
}
