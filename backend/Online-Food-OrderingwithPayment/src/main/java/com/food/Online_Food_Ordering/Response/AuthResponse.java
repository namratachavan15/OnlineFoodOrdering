package com.food.Online_Food_Ordering.Response;

import com.food.Online_Food_Ordering.model.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private USER_ROLE role;

    public String getJwt() {
        return jwt;
    }

    public String getMessage() {
        return message;
    }

    public USER_ROLE getRole() {
        return role;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRole(USER_ROLE role) {
        this.role = role;
    }
}
