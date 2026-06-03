package com.food.Online_Food_Ordering.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.food.Online_Food_Ordering.Dto.RestaurantDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fullName;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String phone;

    private USER_ROLE role=USER_ROLE.ROLE_RESTAURANT_OWNER;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer")
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name = "payment_information",joinColumns = @JoinColumn(name="user_id"))
    private List<PaymentInformation> paymentInformations=new ArrayList<>();


    @ElementCollection
    @CollectionTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"))
    private List<RestaurantDto> favorites = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> address = new ArrayList<>();

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<PaymentInformation> getPaymentInformations() {
        return paymentInformations;
    }

    public void setPaymentInformations(List<PaymentInformation> paymentInformations) {
        this.paymentInformations = paymentInformations;
    }

    public USER_ROLE getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public List<RestaurantDto> getFavorites() {
        return favorites;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(USER_ROLE role) {
        this.role = role;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void setFavorites(List<RestaurantDto> favorites) {
        this.favorites = favorites;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }
}
