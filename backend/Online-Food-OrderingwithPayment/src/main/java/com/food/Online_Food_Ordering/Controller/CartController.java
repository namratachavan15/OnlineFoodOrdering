package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Request.AddCartItemRequest;
import com.food.Online_Food_Ordering.Request.UpdateCartItemRequest;
import com.food.Online_Food_Ordering.Service.CartService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.model.Cart;
import com.food.Online_Food_Ordering.model.CartItem;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @PutMapping("/cart/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody AddCartItemRequest req, @RequestHeader("Authorization") String jwt,@RequestHeader Map<String, String> headers) throws Exception {


        CartItem cartItem=cartService.addItemToCart(req,jwt);
        return new ResponseEntity<>(cartItem, HttpStatus.OK);
    }

    @PutMapping("/cart-item/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(@RequestBody UpdateCartItemRequest req, @RequestHeader("Authorization") String jwt) throws Exception {

        // If token is not in the format "Bearer <token>"
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);  // Extract the actual token part
        } else {
            throw new BadCredentialsException("Invalid token format");
        }
        CartItem cartItem=cartService.updateCartItemQuantity(req.getCartItemId(),req.getQuantity());
        return new ResponseEntity<>(cartItem, HttpStatus.OK);
    }

    @DeleteMapping("/cart-item/{id}/remove")
    public ResponseEntity<Cart> removeCartItem(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws Exception {

        Cart cart=cartService.removeItemFromCart(id,jwt);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PutMapping("/cart/clear")
    public ResponseEntity<Cart> clearCart(@RequestBody UpdateCartItemRequest req, @RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        Cart cart=cartService.clearCart(user.getId());
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);
        Cart cart=cartService.findCartByUserId(user.getId());

        return new ResponseEntity<>(cart, HttpStatus.OK);
    }



}
