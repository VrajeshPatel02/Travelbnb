package com.travelbnb.controller;

import com.travelbnb.entity.User;
import com.travelbnb.payload.ReviewDto;
import com.travelbnb.service.PropertyImpl;
import com.travelbnb.service.ReviewImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @Autowired
    ReviewImpl review;

    @PostMapping("/addReview")
    public ResponseEntity<?> addReview(
            @AuthenticationPrincipal User appUser,
            @RequestParam long propertyId,
            @RequestBody ReviewDto reviewDto
            )
    {
        if(review.verifyUserReview(appUser, propertyId)!=null) {
            return new ResponseEntity<>("Review already exists", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        else{
            ReviewDto dto = review.addReview(reviewDto, propertyId, appUser);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        }
    }
    @GetMapping("/getReviewByUser")
    public ResponseEntity<?> getReviewByUser(@RequestParam long id,
        @RequestParam (value="pageSize",defaultValue = "5",required = false)int pageSize,
        @RequestParam (value="pageNo", defaultValue= "0", required = false)int pageNo,
        @RequestParam(value="sortBy", defaultValue="id",required =false)String sortBy,
        @RequestParam(value="sortDir", defaultValue="asc",required =false)String sortDir) {
        List<ReviewDto> all = review.getReviewById(id,pageSize,pageNo,sortBy,sortDir);
        return new ResponseEntity<>(all, HttpStatus.OK);
    }
}
