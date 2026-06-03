package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem,Long> {

}
