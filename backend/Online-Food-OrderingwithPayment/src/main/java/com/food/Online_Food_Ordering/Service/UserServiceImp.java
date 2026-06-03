package com.food.Online_Food_Ordering.Service;

import com.food.Online_Food_Ordering.Config.JwtProvider;
import com.food.Online_Food_Ordering.Repository.UserRepo;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService{

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {

       String email=jwtProvider.getEmailFromJwtToken(jwt);
       User user=findUserByEmail(email);

        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {

        User user=userRepo.findByEmail(email);

        if(user==null)
        {
            throw new Exception("USer not found");
        }
        return user;
    }
}
