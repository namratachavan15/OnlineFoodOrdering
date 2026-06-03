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
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    //@Autowired
   // private PaymentService paymentService;

    @PostMapping("/order")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {

        System.out.println("orderRequest"+req.toString());
        User user=userService.findUserByJwtToken(jwt);
        Order order=orderService.createOrder(req,user);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

//    @PostMapping("/order")
//    public ResponseEntity<PaymentResponse> createOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
//
//        System.out.println("orderRequest"+req.toString());
//        User user=userService.findUserByJwtToken(jwt);
//        Order order=orderService.createOrder(req,user);
//        PaymentResponse res=paymentService.createPaymentLink(order);
//        return new ResponseEntity<>(res, HttpStatus.OK);
//    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory( @RequestHeader("Authorization") String jwt) throws Exception {


        User user=userService.findUserByJwtToken(jwt);
       List<Order> orders=orderService.getUsersOrder(user.getId());
       for(Order o:orders)
       {
           System.out.println("orders is"+o.toString());
       }
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

}
