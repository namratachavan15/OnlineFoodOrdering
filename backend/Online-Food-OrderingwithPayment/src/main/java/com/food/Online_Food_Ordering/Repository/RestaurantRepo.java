package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepo extends JpaRepository<Restaurant,Long> {

    @Query("SELECT r FROM Restaurant r WHERE lower(r.name) LIKE lower(concat('%',:query,'%')) OR lower(r.cuisineType) LIKE lower(concat('%',:query,'%')) ")
    List<Restaurant> findBySearchQuery(String query);
//    Restaurant findByOwner(Long userId);
    Optional<Restaurant> findByOwner_Id(Long userId);
}
