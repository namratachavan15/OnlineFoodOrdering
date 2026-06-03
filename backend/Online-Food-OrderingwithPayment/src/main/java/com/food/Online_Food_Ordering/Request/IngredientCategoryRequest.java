package com.food.Online_Food_Ordering.Request;

import lombok.Data;

@Data
public class IngredientCategoryRequest {

    private String name;
    private Long restaurantId;

    public String getName() {
        return name;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }
}
