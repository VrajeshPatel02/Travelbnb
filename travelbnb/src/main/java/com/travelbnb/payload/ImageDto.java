package com.travelbnb.payload;

import com.travelbnb.entity.Image;
import lombok.Data;

@Data
public class ImageDto {
    private Long id;
    private String imageUrl;
    private Long property_id;

    public ImageDto() {
    }

    public ImageDto(Image image){
        this.id = image.getId();
        this.imageUrl = image.getImageUrl();
        this.property_id = image.getProperty().getId();
    }
}
