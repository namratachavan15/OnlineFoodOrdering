package com.food.Online_Food_Ordering.Repository;

import com.food.Online_Food_Ordering.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Long> {

    public User findByEmail(String username);

}
