package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Request.AddCartItemRequest;
import com.food.Online_Food_Ordering.model.Cart;
import com.food.Online_Food_Ordering.model.CartItem;
import com.food.Online_Food_Ordering.model.User;

public interface CartService {

    public CartItem addItemToCart(AddCartItemRequest req, String jwt )throws Exception;

    public CartItem updateCartItemQuantity(Long cartItemId,int quantity)throws  Exception;

    public Cart removeItemFromCart(Long cartItemId,String jwt)throws Exception;

    public Long calculateCartTotals(Cart cart)throws Exception;

    public Cart findCartById(Long id)throws Exception;
    public Cart findCartByUserId(Long userId)throws Exception;

    public Cart clearCart(Long userId)throws Exception;
}
