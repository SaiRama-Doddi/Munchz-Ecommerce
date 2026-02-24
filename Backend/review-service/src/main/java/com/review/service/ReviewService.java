package com.review.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.review.client.UserClient;
import com.review.client.UserDto;
import com.review.dto.ReviewRequest;
import com.review.entity.Review;
import com.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repo;
    private final Cloudinary cloudinary;
    private final UserClient userClient;   // ✅ Correct type

    public Review saveReview(ReviewRequest request, MultipartFile file) throws IOException {

        validateDuplicateReview(request);

        Review review = buildReviewFromRequest(request);

        // ✅ Always fetch correct username from USER-SERVICE
        UserDto user = userClient.getUserById(request.getUserId());
        review.setUserName(user.getFirstName() + " " + user.getLastName());

        if (file != null && !file.isEmpty()) {
            Map<?, ?> upload = cloudinary.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap());
            review.setImageUrl(upload.get("secure_url").toString());
        }

        return repo.save(review);
    }

    public Review saveReviewFromJson(ReviewRequest request) {

        validateDuplicateReview(request);

        Review review = buildReviewFromRequest(request);

        // ✅ Always fetch correct username from USER-SERVICE
        UserDto user = userClient.getUserById(request.getUserId());
        review.setUserName(user.getFirstName() + " " + user.getLastName());

        review.setImageUrl(request.getImageUrl());

        return repo.save(review);
    }

    private Review buildReviewFromRequest(ReviewRequest request) {

        Review review = new Review();
        review.setOrderId(request.getOrderId());
        review.setProductId(request.getProductId());
        review.setProductName(request.getProductName());
        review.setUserId(request.getUserId());
        review.setComment(request.getComment());
        review.setRating(request.getRating());

        return review;
    }

    private void validateDuplicateReview(ReviewRequest request) {

        Optional<Review> existing =
                repo.findByOrderIdAndProductIdAndUserId(
                        request.getOrderId(),
                        request.getProductId(),
                        request.getUserId()
                );

        if (existing.isPresent()) {
            throw new RuntimeException("You have already reviewed this order item.");
        }
    }

    public List<Review> getByProduct(Long productId) {
        return repo.findByProductId(productId);
    }

    public List<Review> getAllReviews() {
        return repo.findAllByOrderByCreatedAtDesc();
    }

    // ✅ One-time fix for old data
    public void backfillUserNames() {
        List<Review> reviews = repo.findAll();

        for (Review r : reviews) {
            if (r.getUserName() == null) {
                try {
                    UserDto user = userClient.getUserById(r.getUserId());
                    r.setUserName(user.getFirstName() + " " + user.getLastName());
                } catch (Exception e) {
                    System.out.println("Failed for userId: " + r.getUserId());
                }
            }
        }

        repo.saveAll(reviews);
    }
}
