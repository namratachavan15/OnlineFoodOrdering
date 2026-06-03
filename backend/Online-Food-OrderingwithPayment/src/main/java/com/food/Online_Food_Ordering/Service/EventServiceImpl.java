package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Repository.EventRepository;
import com.food.Online_Food_Ordering.Repository.RestaurantRepo;
import com.food.Online_Food_Ordering.model.Event;
import com.food.Online_Food_Ordering.model.Restaurant;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {


    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestaurantRepo restaurantRepository;

    @Override
    @Transactional
    public Event createEvent(Long restaurantId, Event event) {
        // Fetch the restaurant to verify if it exists
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Set the restaurant to the event
        event.setRestaurant(restaurant);

        // Save and return the event
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getEventsByRestaurant(Long restaurantId) {
        return eventRepository.findByRestaurantId(restaurantId);
    }
}
