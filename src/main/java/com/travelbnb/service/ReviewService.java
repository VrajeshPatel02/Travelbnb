package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.ReviewDto;

import java.util.List;

public interface ReviewService {
    ReviewDto addReview(ReviewDto review, long propertyId, User user);
    List<ReviewDto> getReviewById(long id, int pageSize,int pageNo,String sortBy,String sortDir);
    boolean deleteReview(long id);
    ReviewDto updateReview(ReviewDto review);
}
