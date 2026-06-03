package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Request.CreateFoodRequest;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.Restaurant;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FoodService {

    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant);

    void deleteFood(Long foodId)throws  Exception;

    public List<Food> getRestaurantsFood(Long restaurantId, boolean isVegitarian, boolean nonVeg,boolean isSeasonal,String foodCategory);

   public List<Food> searchFood(String keyword);
   public Food findFoodById(Long foodId) throws Exception;

   public Food updateAvailabilityStatus(Long foodId) throws Exception;
    public Food updateFood(Long id, CreateFoodRequest req, Category category, Restaurant restaurant) throws Exception;
}
