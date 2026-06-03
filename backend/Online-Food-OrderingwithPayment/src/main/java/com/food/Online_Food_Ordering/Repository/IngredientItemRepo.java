package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.IngredientsItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientItemRepo extends JpaRepository<IngredientsItem,Long> {

    List<IngredientsItem> findByRestaurantId(Long id);
    @Query("SELECT i FROM IngredientsItem i WHERE i.name = :name AND i.restaurant.id = :restaurantId")
    IngredientsItem findByNameAndRestaurantId(@Param("name") String name, @Param("restaurantId") Long restaurantId);
}
