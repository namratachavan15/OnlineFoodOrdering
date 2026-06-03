package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Request.OrderRequest;
import com.food.Online_Food_Ordering.Service.OrderService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Order;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;


    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable long id,@RequestParam(required = false) String order_status, @RequestHeader("Authorization") String jwt) throws Exception {


        User user=userService.findUserByJwtToken(jwt);
        List<Order> orders=orderService.getRestaurantOrder(id,order_status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable long id,@PathVariable String orderStatus,@RequestParam(required = false) String order_status, @RequestHeader("Authorization") String jwt) throws Exception {


        User user=userService.findUserByJwtToken(jwt);
        Order orders=orderService.updateOrder(id,orderStatus);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

}
