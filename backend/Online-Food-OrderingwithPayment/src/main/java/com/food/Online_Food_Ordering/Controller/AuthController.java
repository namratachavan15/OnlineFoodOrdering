package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Config.JwtProvider;
import com.food.Online_Food_Ordering.Repository.CartRepo;
import com.food.Online_Food_Ordering.Repository.UserRepo;
import com.food.Online_Food_Ordering.Request.LoginRequest;
import com.food.Online_Food_Ordering.Response.AuthResponse;
import com.food.Online_Food_Ordering.Service.CustomerUserDetailsService;
import com.food.Online_Food_Ordering.model.Cart;
import com.food.Online_Food_Ordering.model.USER_ROLE;
import com.food.Online_Food_Ordering.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;
    @Autowired
    private CartRepo cartRepo;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse>createUserHandler(@RequestBody User user) throws Exception {
            User isEmailExist=userRepo.findByEmail(user.getEmail());
            if(isEmailExist!=null)
            {
                throw new Exception("Email is already used with another account");
            }

            User createdUser=new User();
            createdUser.setEmail(user.getEmail());
            createdUser.setFullName(user.getFullName());
            createdUser.setRole(user.getRole());
        createdUser.setPhone(user.getPhone());
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser=userRepo.save(createdUser);

            Cart cart=new Cart();
            cart.setCustomer(savedUser);
            cartRepo.save(cart);

        Authentication authentication=new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt=jwtProvider.generateToken(authentication);

        AuthResponse authResponse=new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Register success");
        authResponse.setRole(savedUser.getRole());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest request)
    {
            String username=request.getEmail();
            String password=request.getPassword();

            Authentication authentication=authenticate(username,password);

        Collection<? extends GrantedAuthority>authorities=authentication.getAuthorities();

        String role=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();
        String jwt=jwtProvider.generateToken(authentication);

        AuthResponse authResponse=new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login success");
        authResponse.setRole(USER_ROLE.valueOf(role));

       // Collection<? extends GrantedAuthority>authorities=authentication.getAuthorities();

         role=authorities.isEmpty()?null:authorities.iterator().next().getAuthority();
        return new ResponseEntity<>(authResponse,HttpStatus.OK);

    }

    private Authentication authenticate(String username, String password) {

        UserDetails userDetails=customerUserDetailsService.loadUserByUsername(username);

        if(userDetails==null)
        {
            throw new BadCredentialsException("Invalid username...");
        }
        if(!passwordEncoder.matches(password,userDetails.getPassword()))
        {
            throw new BadCredentialsException("Invalid password...");
        }
        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());

    }

}
