package com.food.Online_Food_Ordering.model;



public class PaymentDetails {

    private String paymentMethod;
    private String status;
    private String paymentId;
    private String razorpayPaymentLinkId;
    private String razorpayPaymentLinkRefernceId;
    private String razorpayPaymentId;

    public PaymentDetails() {
    }


    public PaymentDetails(String paymentMethod, String status, String paymentId, String razorpayPaymentLinkId, String razorpayPaymentLinkRefernceId, String razorpayPaymentId) {
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.paymentId = paymentId;
        this.razorpayPaymentLinkId = razorpayPaymentLinkId;
        this.razorpayPaymentLinkRefernceId = razorpayPaymentLinkRefernceId;
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getRazorpayPaymentLinkId() {
        return razorpayPaymentLinkId;
    }

    public void setRazorpayPaymentLinkId(String razorpayPaymentLinkId) {
        this.razorpayPaymentLinkId = razorpayPaymentLinkId;
    }



    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpayPaymentLinkRefernceId() {
        return razorpayPaymentLinkRefernceId;
    }

    public void setRazorpayPaymentLinkRefernceId(String razorpayPaymentLinkRefernceId) {
        this.razorpayPaymentLinkRefernceId = razorpayPaymentLinkRefernceId;
    }
}
