import React, { createContext, useContext, useState } from "react";
import { api } from '../../Config/api';

// Create CartContext
const CartContext = createContext();

// Create CartProvider
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const findCart = async (token) => {
        setLoading(true);
        try {
            const response = await api.get(`/api/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
            setCartItems(response.data.items);
           
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const getAllCartItems = async (reqData) => {
        setLoading(true);
        try {
            const response = await api.get(`api/carts/${reqData.cartId}/items`, {
                headers: { Authorization: `Bearer ${reqData.token}` },
            });
            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const addItemToCart = async (reqData) => {
        try {
            const { data } = await api.put(
                `api/cart/add`,
                reqData,
                {
                    headers: { Authorization: `Bearer ${reqData.token}` },
                }
            );
            setCartItems((prevItems) => [data, ...prevItems]);
            setCart((prevCart) => ({
                ...prevCart,
                items: [data, ...(prevCart?.items || [])],
            }));
          
        } catch (error) {
            setError(error);
        }
    };

  
    const updateCartItem = async ({ data, jwt }) => {
        setLoading(true);
        try {
            const { data: responseData } = await api.put(`/api/cart-item/update`, data, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
    
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === responseData.id ? responseData : item
                )
            );
    
            // Update in cart as well
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart?.items.map((item) =>
                    item.id === responseData.id ? responseData : item
                ),
            }));
    
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };
    

    const removeCartItem = async ({ cartItemId, jwt }) => {
       
        setLoading(true);
        try {
            const { data } = await api.delete(`/api/cart-item/${cartItemId}/remove`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.id !== cartItemId)
            );
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart?.items?.filter((item) => item.id !== cartItemId),
            }));
            
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const clearCart = async (jwt) => {
        setLoading(true);
        try {
            const { data } = await api.put(`/api/cart/clear`, {}, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            setCartItems([]);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                cartItems,
                loading,
                error,
                findCart,
                getAllCartItems,
                addItemToCart,
                updateCartItem,
                removeCartItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use CartContext
export const useCart = () => {
    return useContext(CartContext);
};
