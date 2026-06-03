package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Request.CreateFoodRequest;
import com.food.Online_Food_Ordering.Service.FoodService;
import com.food.Online_Food_Ordering.Service.RestaurantService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.Restaurant;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFood(@RequestParam String name, @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        List<Food> food=foodService.searchFood(name);

        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(@RequestParam(required = false) boolean vegetarian,@RequestParam(required = false) boolean seasonal,@RequestParam(required = false) boolean nonveg,@RequestParam(required = false) String food_category, @PathVariable Long restaurantId,@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);


        List<Food> food=foodService.getRestaurantsFood(restaurantId,vegetarian,nonveg,seasonal,food_category);
        for (Food f : food) {
            System.out.println(f.toString());  // This will print the full details as defined in your Food class's toString method
        }
        return new ResponseEntity<>(food, HttpStatus.OK);
    }

}
