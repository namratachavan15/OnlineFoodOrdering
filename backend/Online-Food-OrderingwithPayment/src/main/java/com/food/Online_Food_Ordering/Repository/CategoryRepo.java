package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepo  extends JpaRepository<Category,Long> {

    public List<Category> findByRestaurantId(long id);

}
