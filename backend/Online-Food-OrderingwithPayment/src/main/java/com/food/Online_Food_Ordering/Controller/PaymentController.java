package com.food.Online_Food_Ordering.Controller;

import com.food.Online_Food_Ordering.Repository.OrderRepo;
import com.food.Online_Food_Ordering.Response.ApiResponse;
import com.food.Online_Food_Ordering.Response.PaymentLinkResponse;
import com.food.Online_Food_Ordering.Service.OrderService;
import com.food.Online_Food_Ordering.Service.UserService;
import com.food.Online_Food_Ordering.exception.OrderException;
import com.food.Online_Food_Ordering.model.Order;
import com.food.Online_Food_Ordering.model.PaymentDetails;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class PaymentController {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepo orderRepo;

    // ----------------- STEP 1: CREATE PAYMENT LINK -----------------
    @PostMapping("/payments/{orderId}")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Order order = orderService.findOrderById(orderId);
        if (order == null) throw new Exception("Order not found!");

        try {
            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", order.getTotalAmount() * 100); // 💰 Razorpay uses paise
            paymentLinkRequest.put("currency", "INR");

            JSONObject customer = new JSONObject();
            customer.put("name", order.getCustomer().getFullName());
            customer.put("email", order.getCustomer().getEmail());
            paymentLinkRequest.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("sms", true);
            notify.put("email", true);
            paymentLinkRequest.put("notify", notify);

            // ✅ Razorpay will redirect back here after payment
            paymentLinkRequest.put("callback_url", "http://localhost:5454/api/payments/callback?order_id=" + orderId);
            paymentLinkRequest.put("callback_method", "get");


            PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);

            String paymentLinkId = payment.get("id");
            String paymentLinkUrl = payment.get("short_url");

            PaymentLinkResponse response = new PaymentLinkResponse();
            response.setPayment_link_id(paymentLinkId);
            response.setPayment_link_url(paymentLinkUrl);

            // Save Razorpay link ID in DB
            PaymentDetails details = new PaymentDetails();
            details.setRazorpayPaymentLinkId(paymentLinkId);
            details.setStatus("PENDING");
            order.setPaymentDetails(details);
            orderRepo.save(order);

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            throw new RazorpayException("Error creating payment link: " + e.getMessage());
        }
    }

    // ----------------- STEP 2: VERIFY PAYMENT -----------------
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> verifyPayment(
            @RequestParam(name = "payment_id", required = false) String paymentId,
            @RequestParam(name = "order_id") Long orderId
    ) throws Exception {

        ApiResponse res = new ApiResponse();

        if (paymentId == null || paymentId.equals("undefined")) {
            res.setMessage("Payment not completed yet");
            res.setStatus(false);
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

        Order order = orderService.findOrderById(orderId);
        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        Payment payment = razorpay.payments.fetch(paymentId);
        JSONObject paymentJson = payment.toJson();

        if ("captured".equals(paymentJson.optString("status"))) {
            PaymentDetails paymentDetails = order.getPaymentDetails();
            if (paymentDetails == null) paymentDetails = new PaymentDetails();

            paymentDetails.setPaymentId(paymentId);
            paymentDetails.setStatus("COMPLETED");
            paymentDetails.setPaymentMethod(paymentJson.optString("method"));
            paymentDetails.setRazorpayPaymentId(paymentJson.optString("id"));
            paymentDetails.setRazorpayPaymentLinkId(paymentJson.optString("payment_link_id"));

            Object notesObj = paymentJson.opt("notes");
            String referenceId = null;

            if (notesObj instanceof JSONObject jsonObj) {
                referenceId = jsonObj.optString("reference_id", null);
            } else if (notesObj instanceof JSONArray jsonArray && jsonArray.length() > 0) {
                referenceId = jsonArray.optString(0, null);
            }

            paymentDetails.setRazorpayPaymentLinkRefernceId(referenceId);

            // ✅ Save payment details
            order.setPaymentDetails(paymentDetails);
            order.setOrderStatus("PLACED");
            orderRepo.save(order);

            res.setMessage("✅ Payment successful and order placed!");
            res.setStatus(true);
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }

        res.setMessage("Payment failed or not captured");
        res.setStatus(false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
    @GetMapping("/payments/callback")
    public ResponseEntity<Void> handleRazorpayCallback(
            @RequestParam("order_id") Long orderId,
            @RequestParam(value = "razorpay_payment_id", required = false) String razorpayPaymentId,
            @RequestParam(value = "razorpay_payment_link_id", required = false) String razorpayPaymentLinkId,
            @RequestParam(value = "razorpay_payment_link_status", required = false) String paymentStatus,
            @RequestParam(value = "razorpay_signature", required = false) String razorpaySignature
    ) {
        try {
            System.out.println("✅ Razorpay callback received for order ID: " + orderId);

            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            // Get or create payment details
            PaymentDetails details = order.getPaymentDetails();
            if (details == null) {
                details = new PaymentDetails();
            }

            // Update all fields safely
            details.setRazorpayPaymentId(razorpayPaymentId);
            details.setRazorpayPaymentLinkId(razorpayPaymentLinkId);
            details.setPaymentMethod("RAZORPAY");
            details.setPaymentId(razorpayPaymentId); // ✅ store again for reference
            details.setRazorpayPaymentLinkRefernceId(orderId.toString()); // optional
            details.setStatus("paid".equalsIgnoreCase(paymentStatus) ? "COMPLETED" : "FAILED");

            // Update order
            order.setPaymentDetails(details);
            order.setOrderStatus("paid".equalsIgnoreCase(paymentStatus) ? "PLACED" : "FAILED");

            orderRepo.save(order);
            System.out.println("✅ Payment details updated successfully for order ID: " + orderId);

            // ✅ Redirect user to React success page
            URI redirectUri = URI.create("http://localhost:3000/payment/success/" + orderId);
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirectUri);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);

        } catch (Exception e) {
            e.printStackTrace();
            URI redirectUri = URI.create("http://localhost:3000/payment/failure");
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirectUri);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
    }

}
