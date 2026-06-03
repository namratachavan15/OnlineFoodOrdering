package com.food.Online_Food_Ordering.Service;


import com.food.Online_Food_Ordering.Repository.*;
import com.food.Online_Food_Ordering.Request.OrderRequest;
import com.food.Online_Food_Ordering.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired

    private IngredientItemRepo ingredientRepo;
    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Override
    public Order createOrder(OrderRequest order, User user) throws Exception {
        // Check if the order contains a valid restaurantId
        Long restaurantId = order.getRestaurantId();
        if (restaurantId == null) {
            throw new Exception("Restaurant ID is null in order.");
        }

        // Create Address from OrderRequest
        Address address = new Address();
        address.setStreetAddress(order.getDeliveryAddress().getStreetAddress());
        address.setCity(order.getDeliveryAddress().getCity());
        address.setState(order.getDeliveryAddress().getState());
        address.setPostalCode(order.getDeliveryAddress().getPostalCode());
        address.setCountry(order.getDeliveryAddress().getCountry());

        // Save the address to DB
        Address savedAddress = addressRepo.save(address);

        // Associate address with user if not already present
        if (!user.getAddress().contains(savedAddress)) {
            user.getAddress().add(savedAddress);
            userRepo.save(user);
        }

        // Fetch the restaurant
        Restaurant restaurant = restaurantService.findRestaurantById(order.getRestaurantId());
        logger.info("rest is: {}", restaurant.toString());
        Order createOrder = new Order();
        createOrder.setCustomer(user);
        createOrder.setCreatedAt(new Date());
        createOrder.setOrderStatus("COMPLETED");
        createOrder.setDeliveryAddress(savedAddress);
        createOrder.setRestaurant(restaurant);

        Cart cart = cartService.findCartByUserId(user.getId());
        logger.info("Cart Items: {}", cart.getItems());
        List<OrderItem> orderItems = new ArrayList<>();
        int totalItemCount = 0;  // Track total quantity of items
        long totalAmount = 0L;  // Track total amount

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setFood(cartItem.getFood());

            // Convert the list of ingredients (String) in CartItem to IngredientsItem entities
            List<IngredientsItem> ingredientsItems = new ArrayList<>();
            for (String ingredientName : cartItem.getIngredients()) {
                IngredientsItem ingredientItem = ingredientRepo.findByNameAndRestaurantId(ingredientName, restaurant.getId());
                if (ingredientItem != null && ingredientItem.isInStock()) {
                    ingredientsItems.add(ingredientItem);
                    System.out.println("Ingredient found: " + ingredientName);
                } else {
                    System.out.println("Ingredient not found or out of stock: " + ingredientName);
                }
            }

            // Set the ingredients (IngredientsItem) for the OrderItem
            orderItem.setIngredients(ingredientsItems);

            // Set quantity and totalPrice for the OrderItem
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            // Update totalItemCount and totalAmount
            totalItemCount += cartItem.getQuantity();  // Add the quantity of the item
            totalAmount += cartItem.getTotalPrice();  // Add the price of the item

            // Save the order item to the database
            OrderItem savedOrderItem = orderItemRepo.save(orderItem);

            orderItems.add(savedOrderItem);
            System.out.println("Saved OrderItem: " + savedOrderItem);
        }

        // Set totalItem (total quantity of items)
        createOrder.setTotalItem(totalItemCount);

        // Set totalAmount (total price of items in the order)
        createOrder.setTotalAmount(order.getTotalAmount());

        // Set the order items list
        createOrder.setItems(orderItems);

        // Save the order
        Order savedOrder = orderRepo.save(createOrder);
        restaurant.getOrders().add(savedOrder);

        return savedOrder;
    }



    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {

        Order order = findOrderById(orderId);

        // Fix: Remove semicolon after the if statement and handle the exception properly
        if (orderStatus.equals("OUT_FOR_DELIVERY") || orderStatus.equals("DELIVERED") || orderStatus.equals("COMPLETED") || orderStatus.equals("PENDING")) {
            order.setOrderStatus(orderStatus);
            return orderRepo.save(order);
        }

        // Throwing an exception instead of returning it
        throw new Exception("Please select a valid order status");
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {

         Order order=findOrderById(orderId);
         orderRepo.deleteById(orderId);
    }

    @Override
    public List<Order> getUsersOrder(Long userId) throws Exception {
        return orderRepo.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantOrder(Long restaurantId, String orderStatus) throws Exception {
        List<Order> orders = orderRepo.findByRestaurantId(restaurantId);



        // Filter orders based on the provided order status
        if (orderStatus != null && !orderStatus.equals("ALL")) {
            orders = orders.stream()
                    .filter(order -> order.getOrderStatus().equals(orderStatus))
                    .collect(Collectors.toList());
        }
        return orders;
    }


    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder=orderRepo.findById(orderId);
        if(optionalOrder.isEmpty())
        {
            throw new Exception("order not found");
        }
        return optionalOrder.get();
    }
}
