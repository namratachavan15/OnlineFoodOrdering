package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem,Long> {



}
