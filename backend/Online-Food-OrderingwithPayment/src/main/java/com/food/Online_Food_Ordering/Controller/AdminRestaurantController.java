package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Request.CreateRestaurantRequest;
import com.food.Online_Food_Ordering.Response.MessageResponse;
import com.food.Online_Food_Ordering.Service.RestaurantService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Restaurant;
import com.food.Online_Food_Ordering.model.User;
import com.mysql.cj.protocol.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/restaurants")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AdminRestaurantController {

    @Autowired
    private RestaurantService restaurantService;


    @Autowired
    private UserService userService;


    @PostMapping("")
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody CreateRestaurantRequest req, @RequestHeader("Authorization") String jwt) throws Exception
    {

        User user=userService.findUserByJwtToken(jwt);
        Restaurant restaurant=restaurantService.createRestaurant(req,user);

        return  new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }



    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@RequestBody CreateRestaurantRequest req, @RequestHeader("Authorization") String jwt,@PathVariable Long id) throws Exception
    {
        User user=userService.findUserByJwtToken(jwt);
        Restaurant restaurant=restaurantService.updateRestaurant(id,req);

        return  new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(@RequestHeader("Authorization") String jwt,@PathVariable Long id) throws Exception
    {
        User user=userService.findUserByJwtToken(jwt);
        restaurantService.deleteRestaurant(id);

        MessageResponse res=new MessageResponse();
        res.setMessage("restaurant deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(@RequestHeader("Authorization") String jwt,@PathVariable Long id) throws Exception
    {
        System.out.println("jwt"+jwt);
        System.out.println("rest id"+id);
        User user=userService.findUserByJwtToken(jwt);
        Restaurant restaurant=restaurantService.updateRestaurantStatus(id);

        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }


@GetMapping("/user")
public ResponseEntity<?> findRestaurantByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
    System.out.println("Inside REST controller. JWT: " + jwt);

    User user = userService.findUserByJwtToken(jwt);

    Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());


    if (restaurant == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No restaurant found for this user.");
    }

    return ResponseEntity.ok(restaurant);
}


}
