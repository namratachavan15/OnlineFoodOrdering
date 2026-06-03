package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Dto.RestaurantDto;
import com.food.Online_Food_Ordering.Service.RestaurantService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Restaurant;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestHeader("Authorization") String jwt, @RequestParam String keyword) throws Exception
    {
        System.out.println("jwt in search rest"+jwt);
        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurant=restaurantService.searchRestaurant(keyword);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Restaurant>> getAllRestaurant(@RequestHeader("Authorization") String jwt) throws Exception
    {

        User user=userService.findUserByJwtToken(jwt);

        List<Restaurant> restaurant=restaurantService.getAllRestaurant();
        System.out.println("rest"+restaurant);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(@RequestHeader("Authorization") String jwt,@PathVariable Long id) throws Exception
    {

        User user=userService.findUserByJwtToken(jwt);

        Restaurant restaurant=restaurantService.findRestaurantById(id);

        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }
    @PutMapping("/{id}/add-favorites")
    public ResponseEntity<RestaurantDto> addToFavorites(@RequestHeader("Authorization") String jwt, @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        // Perform add/remove from favorites
        RestaurantDto restaurant = restaurantService.addToFavorites(id, user);

        // Return updated user favorites
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }


}
