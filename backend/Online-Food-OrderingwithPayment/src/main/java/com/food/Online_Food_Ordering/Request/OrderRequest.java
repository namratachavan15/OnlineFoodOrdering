package com.food.Online_Food_Ordering.Request;

import com.food.Online_Food_Ordering.model.Address;
import lombok.Data;

@Data
public class OrderRequest {

    private Long restaurantId;
    private Address deliveryAddress;

    private Long deliveryFee;
    private Long packingCharge;
    private Long gstCharge;
    private Long discount;
    private Long totalAmount;

    public Long getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(Long deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public Long getPackingCharge() {
        return packingCharge;
    }

    public void setPackingCharge(Long packingCharge) {
        this.packingCharge = packingCharge;
    }

    public Long getGstCharge() {
        return gstCharge;
    }

    public void setGstCharge(Long gstCharge) {
        this.gstCharge = gstCharge;
    }

    public Long getDiscount() {
        return discount;
    }

    public void setDiscount(Long discount) {
        this.discount = discount;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Address getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(Address deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    @Override
    public String toString() {
        return "OrderRequest{" +
                "restaurantId=" + restaurantId +
                ", deliveryAddress=" + deliveryAddress.toString() +
                '}';
    }
}
