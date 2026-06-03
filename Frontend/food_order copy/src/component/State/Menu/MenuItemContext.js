// src/component/State/MenuItem/MenuItemContext.js

import React, { createContext, useState, useContext } from "react";
import { api } from "../../Config/api"; // Import your API instance

// Create Context
const MenuItemContext = createContext();

// Provider Component
export const MenuItemProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // Create Menu Item
  const createMenuItem = async ({ menu, jwt }) => {
  
    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/food", menu, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
     
      setMenuItems([...menuItems, data]);
      setMessage("Food Created Successfully");
    } catch (error) {
      console.log("Error creating menu item", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Menu Items by Restaurant ID
  const getMenuItemsByRestaurantId = async ({ restaurantId, jwt, filters }) => {
 
    setLoading(true);
    try {
      // Log the final URL with query params to check the structure
      const url = `api/food/restaurant/${restaurantId}`;
     
  
      const { data } = await api.get(url, {
        params: filters,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setMenuItems(data);
    
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  

  // Search Menu Items
  const searchMenuItem = async ({ keyword, jwt }) => {
    setLoading(true);
    try {
      const { data } = await api.get(`api/food/search?name=${keyword}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setSearchResults(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Menu Item Availability
  const updateMenuItemAvailability = async ({ foodId, jwt }) => {
    setLoading(true);
    try {
      const { data } = await api.put(
        `/api/admin/food/${foodId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setMenuItems(
        menuItems.map((menuItem) =>
          menuItem.id === data.id ? data : menuItem
        )
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Menu Item
  const deleteMenuItem = async ({ foodId, jwt }) => {
    setLoading(true);
    try {
      await api.delete(`/api/admin/food/${foodId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setMenuItems(menuItems.filter((menuItem) => menuItem.id !== foodId));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
const updateMenuItem = async ({ foodId, menu, jwt }) => {
  setLoading(true);
  try {
    const { data } = await api.put(`/api/admin/food/${foodId}`, menu, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    setMenuItems((prev) =>
      prev.map((item) => (item.id === foodId ? data : item))
    );

    setMessage("Food Updated Successfully");
  } catch (error) {
    console.log("Error updating menu item", error);
    setError(error);
  } finally {
    setLoading(false);
  }
};
  return (
    <MenuItemContext.Provider
      value={{
        menuItems,
        loading,
        error,
        message,
        searchResults,
        createMenuItem,
        getMenuItemsByRestaurantId,
        searchMenuItem,
        updateMenuItemAvailability,
        deleteMenuItem,
        updateMenuItem
      }}
    >
      {children}
    </MenuItemContext.Provider>
  );
};

// Custom Hook to use MenuItem Context
export const useMenuItemContext = () => {
  return useContext(MenuItemContext);
};
