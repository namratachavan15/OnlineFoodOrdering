package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.IngredientCatgory;
import com.food.Online_Food_Ordering.model.IngredientsItem;

import java.util.List;

public interface IngredientsService {

    public IngredientCatgory createIngredientCatgory(String name,Long restaurantId)throws Exception;

    public IngredientCatgory findIngredientCategoryById(Long id)throws Exception;

    public List<IngredientCatgory> findIngredientCategoryByRestaurantId(Long id)throws Exception;

    public List<IngredientsItem> findRestaurantsIngredients(Long restauratId);

    public IngredientsItem createIngredientItem(Long restaurantId,String ingredientName,Long categoryId)throws Exception;

    public IngredientsItem updateStock(Long id) throws Exception;
    public void deleteIngredientCategory(Long id) throws Exception;
    public IngredientCatgory updateIngredientCategory(Long id, String name) throws Exception;
    public IngredientsItem updateIngredient(Long id, String name, Long categoryId) throws Exception;
    public void deleteIngredient(Long id) throws Exception;

}
