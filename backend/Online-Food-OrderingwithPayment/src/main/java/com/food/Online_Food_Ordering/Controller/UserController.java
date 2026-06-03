package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class UserController {


    @Autowired
    private UserService userService;


    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        System.out.println(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
