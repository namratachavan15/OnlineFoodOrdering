import React, { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Create order and initiate payment
  const createOrder = async (reqData) => {
    console.log("request data",reqData)
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Create the order in backend
      const { data: order } = await api.post("/api/order", reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });

      console.log("✅ Order Created:", order);

      // 2️⃣ Create Razorpay payment link for this order
      const { data: paymentRes } = await api.post(
        `/api/payments/${order.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${reqData.jwt}`,
          },
        }
      );

      console.log("💳 Payment Link Response:", paymentRes);

      // 3️⃣ Redirect user to Razorpay checkout
      if (paymentRes.payment_link_url) {
        window.location.href = paymentRes.payment_link_url;
      }

      // 4️⃣ Save to local state
      setOrders((prevOrders) => [...prevOrders, order]);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error creating order:", error);
      setError(error);
      setLoading(false);
    }
  };

  // ✅ Fetch all user orders
  const getUsersOrders = async (jwt) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/api/order/user", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError(error);
      setLoading(false);
    }
  };

  // (Optional) Notifications — can be used later
  const getUsersNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.get("api/notifications");
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        loading,
        orders,
        error,
        createOrder,
        getUsersOrders,
        getUsersNotifications,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
