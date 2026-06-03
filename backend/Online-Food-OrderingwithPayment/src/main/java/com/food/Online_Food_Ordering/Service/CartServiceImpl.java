package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Repository.CartItemRepo;
import com.food.Online_Food_Ordering.Repository.CartRepo;
import com.food.Online_Food_Ordering.Repository.FoodRepo;
import com.food.Online_Food_Ordering.Request.AddCartItemRequest;
import com.food.Online_Food_Ordering.model.Cart;
import com.food.Online_Food_Ordering.model.CartItem;
import com.food.Online_Food_Ordering.model.Food;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class CartServiceImpl implements CartService{

    private static final Logger logger = LoggerFactory.getLogger(CartServiceImpl.class);
    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private FoodService foodService;



    @Override
    public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);

        Food food=foodService.findFoodById(req.getFoodId());

        Cart cart=cartRepo.findByCustomerId(user.getId());
         System.out.println("cart"+cart.toString());
         for (CartItem cartItem:cart.getItems())
         {
             if(cartItem.getFood().equals(food)){
                 int newQuantity=cartItem.getQuantity()+req.getQuantity();
                 return updateCartItemQuantity(cartItem.getId(),newQuantity);
             }
         }

         CartItem newCartItem=new CartItem();
         newCartItem.setFood(food);
         newCartItem.setCart(cart);
         newCartItem.setQuantity(req.getQuantity());
         newCartItem.setIngredients(req.getIngredients());
        Long totalPrice =
                (food.getPrice() + req.getAddonPrice())
                        * req.getQuantity();

        newCartItem.setTotalPrice(totalPrice);

         CartItem savedCartItem=cartItemRepo.save(newCartItem);
         cart.getItems().add(savedCartItem);
         return savedCartItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {
        Optional<CartItem> cartItem=cartItemRepo.findById(cartItemId);
        if(cartItem.isEmpty())
        {
            throw new Exception("Cart item not found");
        }
        CartItem items=cartItem.get();
        items.setQuantity(quantity);

        items.setTotalPrice((items.getFood().getPrice()*quantity));
        return cartItemRepo.save(items);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {

        User user=userService.findUserByJwtToken(jwt);


        Cart cart=cartRepo.findByCustomerId(user.getId());

        Optional<CartItem> cartItem=cartItemRepo.findById(cartItemId);
        if(cartItem.isEmpty())
        {
            throw new Exception("Cart item not found");
        }

        CartItem item=cartItem.get();
        cart.getItems().remove(item);


        return cartRepo.save(cart);
    }

    @Override
    public Long calculateCartTotals(Cart cart) throws Exception {

        Long total=0L;

        for(CartItem cartItem:cart.getItems())
        {
            total+=cartItem.getFood().getPrice()+cartItem.getQuantity();
        }
        return total;
    }

    @Override
    public Cart findCartById(Long id) throws Exception {
        Optional<Cart> optionalCart=cartRepo.findById(id);
        if(optionalCart.isEmpty())
        {
            throw new Exception("cart not found");
        }
        return optionalCart.get();
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
       // User user=userService.findUserByJwtToken(jwt);
        Cart cart= cartRepo.findByCustomerId(userId);
        logger.info("Cart id: {}", cart.toString());
        cart.setTotal(calculateCartTotals(cart));
        return cart;
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {

       // User user=userService.findUserByJwtToken(userId);
        Cart cart=findCartByUserId(userId);
        cart.getItems().clear();
        return cartRepo.save(cart);
    }
}
