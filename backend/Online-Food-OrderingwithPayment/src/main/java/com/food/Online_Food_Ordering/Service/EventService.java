package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.model.Event;

import java.util.List;

public interface EventService {
    public Event createEvent(Long restaurantId, Event event) ;
    public List<Event> getAllEvents();
    public List<Event> getEventsByRestaurant(Long restaurantId);
}
