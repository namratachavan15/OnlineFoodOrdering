package com.food.Online_Food_Ordering.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.IngredientsItem;
import lombok.Data;

import java.util.List;

@Data
public class CreateFoodRequest {

    private String name;
    private String description;
    private Long price;
    private Long category;
    private List<String>  images;

    private Long restaurantId;
    private boolean vegetarian;
    private boolean seasonal;

    @JsonProperty("ingredients")
    private List<IngredientsItem> ingredientsItems;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Long getPrice() {
        return price;
    }



    public List<String> getImages() {
        return images;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }



    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public boolean isVegetarian() {
        return vegetarian;
    }

    public void setVegetarian(boolean vegetarian) {
        this.vegetarian = vegetarian;
    }

    public boolean isSeasonal() {
        return seasonal;
    }

    public void setSeasonal(boolean seasonal) {
        this.seasonal = seasonal;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }



    public void setIngredientsItems(List<IngredientsItem> ingredientsItems) {
        this.ingredientsItems = ingredientsItems;
    }

    public List<IngredientsItem> getIngredientsItems() {
        return ingredientsItems;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }
}
