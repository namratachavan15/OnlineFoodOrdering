package com.food.Online_Food_Ordering.model;



import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;
    private Long price;

    @ManyToOne
    private Category foodcategory;

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private boolean available;

    @ManyToOne
    @JsonBackReference
    private Restaurant restaurant;

    private boolean isVegetarian;
    private boolean isSeasonal;

    @ManyToMany

    @JoinTable(
            name = "food_ingredient",
            joinColumns = @JoinColumn(name = "food_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private List<IngredientsItem> ingredients=new ArrayList<>();

    private Date creationDate;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Long getPrice() {
        return price;
    }

    public Category getFoodcategory() {
        return foodcategory;
    }

    public List<String> getImages() {
        return images;
    }

    public boolean isAvailable() {
        return available;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public boolean isVegetarian() {
        return isVegetarian;
    }

    public boolean isSeasonal() {
        return isSeasonal;
    }

    public List<IngredientsItem> getIngredients() {
        return ingredients;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public void setFoodcategory(Category foodcategory) {
        this.foodcategory = foodcategory;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public void setVegetarian(boolean vegetarian) {
        isVegetarian = vegetarian;
    }

    public void setSeasonal(boolean seasonal) {
        isSeasonal = seasonal;
    }

    public void setIngredients(List<IngredientsItem> ingredients) {
        this.ingredients = ingredients;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    @Override
    public String toString() {
        return "Food{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                ", foodcategory=" + foodcategory +
                ", images=" + images +
                ", available=" + available +
                ", restaurant=" + restaurant +
                ", isVegetarian=" + isVegetarian +
                ", isSeasonal=" + isSeasonal +
                ", ingredients=" + ingredients +
                ", creationDate=" + creationDate +
                '}';
    }
}
