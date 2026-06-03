package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Request.OrderRequest;
import com.food.Online_Food_Ordering.model.Order;
import com.food.Online_Food_Ordering.model.User;

import java.util.List;

public interface OrderService {

    public Order createOrder(OrderRequest order, User user) throws Exception;

    public Order updateOrder(Long orderId,String orderStatus)throws Exception;

    public void cancelOrder(Long orderId)throws Exception;

    public List<Order> getUsersOrder(Long userId) throws Exception;

    public List<Order> getRestaurantOrder(Long restaurantId,String orderStatus) throws Exception;

    public Order findOrderById(Long orderId) throws Exception;
}
