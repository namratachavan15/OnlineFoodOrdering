package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepo extends JpaRepository<Food,Long> {

    List<Food> findByRestaurantId(Long restaurantId);
    @Query("SELECT f FROM Food f WHERE f.name LIKE %:keyword% OR f.foodcategory.name LIKE %:keyword%")
    List<Food> searchFood(@Param("keyword") String keyword);

}
