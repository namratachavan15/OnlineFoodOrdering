package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.IngredientCatgory;
import com.food.Online_Food_Ordering.model.IngredientsItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientCategoryRepo extends JpaRepository<IngredientCatgory,Long> {

   List<IngredientCatgory> findByRestaurantId(Long id);

}
