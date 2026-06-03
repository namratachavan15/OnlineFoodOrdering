package com.food.Online_Food_Ordering.Controller;


import com.food.Online_Food_Ordering.Request.CreateFoodRequest;
import com.food.Online_Food_Ordering.Response.MessageResponse;
import com.food.Online_Food_Ordering.Service.CategoryService;
import com.food.Online_Food_Ordering.Service.FoodService;
import com.food.Online_Food_Ordering.Service.RestaurantService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Category;
import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.Restaurant;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/food")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminFoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryService categoryService;

    @PostMapping("")
    public ResponseEntity<Food> createFood(@RequestBody CreateFoodRequest req, @RequestHeader("Authorization") String jwt) throws Exception {


        // Fetch User from JWT
        User user = userService.findUserByJwtToken(jwt);

        // Fetch the Restaurant by ID
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());
        System.out.println("Food req: " + req.getCategory());

        // Fetch the Category by ID (which is Long in backend)
        Category category = categoryService.findCategoryById(req.getCategory()); // category is Long here

        // If category is not found, throw an exception
        if (category == null) {
            throw new Exception("Category not found.");
        }

        // Create Food object
        Food food = foodService.createFood(req, category, restaurant);

        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFood(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws Exception {

        // Validate the JWT token and retrieve the user
        User user = userService.findUserByJwtToken(jwt);

        // Call the service method to delete the food item
        foodService.deleteFood(id);

        // Prepare response message
        MessageResponse res = new MessageResponse();
        res.setMessage("Food deleted successfully");

        // Return success response
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)  // Ensure correct content type
                .body(res);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFoodAvaibilityStatus(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);

        Food food=foodService.updateAvailabilityStatus(id);


        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Food> updateFood(
            @PathVariable Long id,
            @RequestBody CreateFoodRequest req,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());
        Category category = categoryService.findCategoryById(req.getCategory());

        Food updated = foodService.updateFood(id, req, category, restaurant);

        return ResponseEntity.ok(updated);
    }
}
