package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.model.User;

public interface UserService {

     public User findUserByJwtToken(String jwt) throws  Exception;

     public User findUserByEmail(String email) throws Exception;

}
