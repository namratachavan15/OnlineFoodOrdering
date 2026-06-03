package com.food.Online_Food_Ordering.Response;

import lombok.Data;

@Data
public class MessageResponse {
    private String message;

    // Default constructor
    public MessageResponse() {}

    // Getter and setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
