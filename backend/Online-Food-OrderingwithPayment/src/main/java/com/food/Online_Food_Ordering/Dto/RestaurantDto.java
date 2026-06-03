package com.food.Online_Food_Ordering.Dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;


import java.util.List;

@Data
@Embeddable
public class RestaurantDto {

    private String title;

    @Column(length = 1000)
    private List<String> images;  // No need for @ElementCollection here

    private String description;

    private Long id;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
