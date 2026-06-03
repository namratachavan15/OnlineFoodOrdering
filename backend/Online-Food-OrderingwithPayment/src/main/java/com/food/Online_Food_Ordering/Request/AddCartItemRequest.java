package com.food.Online_Food_Ordering.Request;

import lombok.Data;

import java.util.List;

@Data
public class AddCartItemRequest {

    private Long foodId;
    private int quantity;
    private List<String> ingredients;
    private Long addonPrice;

    public Long getAddonPrice() {
        return addonPrice;
    }

    public void setAddonPrice(Long addonPrice) {
        this.addonPrice = addonPrice;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    @Override
    public String toString() {
        return "AddCartItemRequest{" +
                "foodId=" + foodId +
                ", quantity=" + quantity +
                ", ingredients=" + ingredients +
                '}';
    }
}
