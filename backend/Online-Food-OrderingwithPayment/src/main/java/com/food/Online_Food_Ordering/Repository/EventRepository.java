package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByRestaurantId(Long restaurantId);
}
