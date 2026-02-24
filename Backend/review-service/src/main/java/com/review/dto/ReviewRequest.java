package com.review.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    private String orderId;   // ✅ String here
    private Long productId;
    private String productName;

    private String userId;
    private String userName;

    private int rating;
    private String comment;
    private String imageUrl;
}
