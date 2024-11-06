package com.travelbnb.service;

import com.travelbnb.entity.Property;
import com.travelbnb.entity.Review;
import com.travelbnb.entity.User;
import com.travelbnb.payload.ReviewDto;
import com.travelbnb.repository.PropertyRepository;
import com.travelbnb.repository.ReviewsRepository;
import com.travelbnb.repository.UserEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewImpl implements ReviewService{

    private ReviewsRepository reviewsRepository;
    private PropertyRepository propertyRepository;
    private UserEntityRepository userRepository;

    public ReviewImpl(ReviewsRepository reviewsRepository, PropertyRepository propertyRepository, UserEntityRepository userRepository) {
        this.reviewsRepository = reviewsRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReviewDto addReview(ReviewDto review, long propertyId, User userId) {
        Optional<Property> p = propertyRepository.findById(propertyId);
        Optional<User> u = userRepository.findById(userId.getId());
        Property property = null;
        if(p.isPresent()){
            property = p.get();
        }
        User user = null;
        if(u.isPresent()){
            user = u.get();
        }
        Review entity = DtoToEntity(review);
        entity.setProperty(property);
        entity.setUser(user);
        reviewsRepository.save(entity);
        ReviewDto reviewDto = EntityToDto(entity);
        return reviewDto;
    }

    public Review DtoToEntity(ReviewDto review) {
        Review entity= new Review();
        entity.setId(review.getId());
        entity.setRating(review.getRating());
        entity.setDescription(review.getDescription());
        return entity;
    }
    public ReviewDto EntityToDto(Review entity) {
        ReviewDto dto = new ReviewDto();
        dto.setId(entity.getId());
        dto.setRating(entity.getRating());
        dto.setDescription(entity.getDescription());
        dto.setProperty(entity.getProperty().getId());
        dto.setUser(entity.getUser().getId());
        return dto;
    }

    @Override
    public List<ReviewDto> getReviewById(long id, int pageSize,int pageNo,String sortBy,String sortDir) {
        PageRequest pageable = null;
        if(sortDir.equalsIgnoreCase("asc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).ascending());
        }else if(sortDir.equalsIgnoreCase("desc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).descending());
        }
        Optional<User> opUser = userRepository.findById(id);
        if(opUser.isPresent()){
            User user = opUser.get();
            Page<Review> byUser = reviewsRepository.findByUser(user,pageable);
            List<Review> all = byUser.getContent();
            List<ReviewDto> dto = all.stream().map(p->EntityToDto(p)).collect(Collectors.toList());
            return dto;
        }
        return null;
    }

    @Override
    public boolean deleteReview(long id) {
        return false;
    }

    @Override
    public ReviewDto updateReview(ReviewDto review) {
        return null;
    }
    public Review verifyUserReview(User user, long propertyId) {
        Optional<Property> opProperty = propertyRepository.findById(propertyId);
        if(opProperty.isPresent()){
            Long p = opProperty.get().getId();
            Long u = user.getId();
            return reviewsRepository.findByReviewUser(u, p);
        }
        return null;
    }
}
