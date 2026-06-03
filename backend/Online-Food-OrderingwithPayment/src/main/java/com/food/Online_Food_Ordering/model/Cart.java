package com.food.Online_Food_Ordering.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  Long id;

    @OneToOne
    private User customer;

    private Long total;

    @OneToMany(mappedBy = "cart",cascade=CascadeType.ALL,orphanRemoval = true)
    private List<CartItem> items=new ArrayList<>();

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Long getTotal() {
        return total;
    }

    public Long getId() {
        return id;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "id=" + id +
                ", customer=" + customer +
                ", total=" + total +
                ", items=" + items +
                '}';
    }
}
