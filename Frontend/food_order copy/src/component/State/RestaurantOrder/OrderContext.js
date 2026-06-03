import React, { createContext, useContext, useState } from "react";
import { api } from "../../Config/api";

// Define the initial state
const initialState = {
  loading: false,
  error: null,
  orders: [],  // Make sure it's an empty array initially.
};
// Create the context
const OrderContext = createContext();

// Create the provider component
export const RestaurantOrderProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setLoading = (loading) => setState((prevState) => ({ ...prevState, loading }));
  const setError = (error) => setState((prevState) => ({ ...prevState, error }));
  const setOrders = (orders) => setState((prevState) => ({ ...prevState, orders }));

  const fetchRestaurantOrder = ({ restaurantId, orderStatus, jwt }) => {
   
    setLoading(true);

    api
      .get(`/api/admin/order/restaurant/${restaurantId}`, {
        params: { order_status: orderStatus },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        setOrders(response.data);  // This is where you're updating the orders state
       
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  const updateOrderStatus = ({ orderId, orderStatus, jwt }) => {
   
    setLoading(true);
    api
      .put(
        `http://localhost:5454/api/admin/order/${orderId}/${orderStatus}`, // Ensure orderStatus is used
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((response) => {
        const updatedOrders = state.orders.map((order) =>
          order.id === response.data.id ? response.data : order
        );
        setOrders(updatedOrders);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  
  return (
    <OrderContext.Provider value={{ ...state, fetchRestaurantOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a custom hook to use the context
export const useOrderContext = () => {
  return useContext(OrderContext);
};
