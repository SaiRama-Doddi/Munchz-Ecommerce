package com.review.repository;

import com.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByProductId(Long productId);

    List<Review> findAllByOrderByCreatedAtDesc();

    Optional<Review> findByOrderIdAndProductIdAndUserId(
            String orderId,
            Long productId,
            String userId
    );

    List<Review> findByUserId(String userId);
}