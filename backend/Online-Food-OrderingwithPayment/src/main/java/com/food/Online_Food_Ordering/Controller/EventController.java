package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Service.EventServiceImpl;
import com.food.Online_Food_Ordering.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class EventController {

    @Autowired
    private EventServiceImpl eventService;

    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Event> createEvent(@PathVariable Long restaurantId,
                                             @RequestBody Event event) {
        try {

            // Attempt to create event
            Event createdEvent = eventService.createEvent(restaurantId, event);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (Exception ex) {
            // Log the error to debug
            System.err.println("Error creating event: " + ex.getMessage());

            // Return a bad request response or internal server error based on the exception type
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping

    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            System.out.println("inside events");
            List<Event> events = eventService.getAllEvents();
            events.forEach(event -> System.out.println(event));
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Event>> getRestaurantEvents(
            @PathVariable Long restaurantId) {

        List<Event> events =
                eventService.getEventsByRestaurant(restaurantId);

        return ResponseEntity.ok(events);
    }

}
