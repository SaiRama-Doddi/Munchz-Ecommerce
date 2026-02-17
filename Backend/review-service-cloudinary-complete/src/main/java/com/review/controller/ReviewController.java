package com.review.controller;

import com.review.dto.ReviewRequest;
import com.review.entity.Review;
import com.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@CrossOrigin
public class ReviewController {

    private final ReviewService service;

    // ✅ JSON review
    @PostMapping
    public Review addReview(@RequestBody ReviewRequest request) {
        return service.saveReviewFromJson(request);
    }

    // ✅ Image review (multipart)
    @PostMapping("/form")
    public Review addReviewWithImage(
            @RequestPart("request") String requestJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        ReviewRequest request = mapper.readValue(requestJson, ReviewRequest.class);

        return service.saveReview(request, file);
    }

    // ✅ Get reviews
    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        return service.getByProduct(productId);
    }

    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return service.getAllReviews();
    }

}