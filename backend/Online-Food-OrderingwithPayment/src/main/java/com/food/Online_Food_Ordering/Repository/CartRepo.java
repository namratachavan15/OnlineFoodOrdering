package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<Cart,Long> {

    public Cart findByCustomerId(Long userId);

}
