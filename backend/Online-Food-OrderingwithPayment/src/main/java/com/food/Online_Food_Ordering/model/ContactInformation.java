package com.food.Online_Food_Ordering.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
@JsonInclude(JsonInclude.Include.NON_NULL)  // Ensures null fields are not serialized
public class ContactInformation {

    @JsonProperty("email")      // Optional: For specifying the field name in JSON
    private String email;

    @JsonProperty("mobile")
    private String mobile;

    @JsonProperty("twitter")
    private String twitter;

    @JsonProperty("instagram")
    private String instagram;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }
}
