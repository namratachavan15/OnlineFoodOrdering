import React, { createContext, useContext, useState ,useEffect} from "react";
import { api } from "../../Config/api"; // Make sure to import api

// Create a context for restaurants
const RestaurantContext = createContext();

// Custom hook to use the RestaurantContext
export const useRestaurantContext = () => {
  return useContext(RestaurantContext);
};

// Create the RestaurantProvider
export const RestaurantProvider = ({ children }) => {
  // State
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  const [usersRestaurant, setUsersRestaurant] = useState(null);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurantCategory, setRestaurantCategory] = useState([]); // New state for restaurant categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actions
  useEffect(() => {
    console.log("Updated Restaurants:", restaurants); // This will log whenever `restaurants` changes
  }, [restaurants]);


  const createEvent = async ({ eventData, jwt, restaurantId }) => {
   
    setLoading(true);
    setError(null);
  
    try {
      const { data } = await api.post(
        `/api/admin/events/restaurant/${restaurantId}`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setEvents((prevEvents) => [...prevEvents, data]);
      setLoading(false);   
    } catch (err) {
      setError(err);
      setLoading(false);
      console.log("Error creating event:", err);
    }
  };
  
const getRestaurantEvents = async ({ restaurantId, jwt }) => {
  const { data } = await api.get(
    `/api/admin/events/restaurant/${restaurantId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  setEvents(data);
};
  // Get All Events
  const getAllEvents = async (jwt) => {
   
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/api/admin/events", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setEvents(data);
      setLoading(false);
    
    } catch (err) {
      setError(err);
      setLoading(false);
      console.log("Error fetching events:", err);
    }
  };

  // Get All Restaurants
  const getAllRestaurants = async (token) => {
   
    setLoading(true);
    setError(null);
    try {
      console.log("inside get all");
      const { data } = await api.get("/api/restaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      setRestaurants(data);
    
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Get Restaurant by ID
  const getRestaurantById = async (restaurantId, jwt) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Create Restaurant
  const createRestaurant = async (restaurantData, token) => {
   
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/admin/restaurants", restaurantData, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      setUsersRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Delete Restaurant
  const deleteRestaurant = async (restaurantId, token) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/admin/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants((prevState) =>
        prevState.filter((restaurant) => restaurant.id !== restaurantId)
      );
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Update Restaurant
  const updateRestaurant = async (restaurantId, updatedData, token) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(
        `/api/admin/restaurants/${restaurantId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

 

  // Create Category
  const createCategory = async (categoryData, token) => {
   
    setLoading(true);
    setError(null);
  
    try {
      const { data } = await api.post("/api/admin/category", categoryData.reqData, {
        headers: {
          Authorization: `Bearer ${categoryData.jwt}`,
        },
      });
  
      // Optimistically update the restaurantCategory list
      setRestaurantCategory((prevCategories) => [...prevCategories, data]);
  
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  const updateCategory = async ({ reqData, jwt }) => {
  try {
    const { data } = await api.put(
      `/api/admin/category/${reqData.id}`,
      { name: reqData.name },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    setRestaurantCategory((prev) =>
      prev.map((cat) => (cat.id === data.id ? data : cat))
    );
  } catch (err) {
    console.error("Error updating category", err);
  }
};
const deleteCategory = async ({ categoryId, jwt }) => {
  try {
    await api.delete(`/api/admin/category/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    setRestaurantCategory((prev) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  } catch (err) {
    console.error("Error deleting category", err);
  }
};
  

  // Get Restaurants by Category
const getRestaurantsCategory = async ({ restaurantId, jwt }) => {
  try {
    console.log("restid", restaurantId);
    console.log("jwt", jwt);

    const { data } = await api.get(
      `/api/category/restaurant/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    setRestaurantCategory(data);
  } catch (err) {
    console.error("Error fetching restaurants by category", err);
  }
};
  

const getRestaurantByUserId = async (jwt) => {
 
  setLoading(true);
  setError(null);
  try {
    const { data } = await api.get(`/api/admin/restaurants/user`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    setUsersRestaurant(data);  // Set the fetched restaurant data in the state
    setLoading(false);
   
  } catch (err) {
    setError(err);
    setLoading(false);
    console.error("Error fetching restaurant by user ID:", err);
  }
};
const updateRestaurantStatus = async ({ restaurantId, jwt }) => {
  setLoading(true);
  setError(null);
  try {
    // Call the API to update the restaurant status
    const { data } = await api.put(
      `/api/admin/restaurants/${restaurantId}/status`,
      {}, // Empty body if it's a simple toggle
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // After updating the status, update the state with the new restaurant data
    setUsersRestaurant(data);  // Update the restaurant state with the response

    setLoading(false);
   
  } catch (err) {
    setError(err);
    setLoading(false);
    console.error("Error updating restaurant status", err);
  }
};

const logoutRestaurant=()=>{
  setRestaurant(null);
  setUsersRestaurant(null);
}

  return (
    <RestaurantContext.Provider
      value={{
        createEvent,
        logoutRestaurant,
        restaurants,
        restaurant,
        usersRestaurant,
        events,
        categories,
        restaurantCategory, // Provide the restaurantCategory state
        loading,
        error,
        getAllRestaurants,
        getRestaurantById,
        createRestaurant,
        deleteRestaurant,
        updateRestaurant,
        getAllEvents,
        createCategory,
        getRestaurantByUserId,
        getRestaurantsCategory, // Provide the getRestaurantsCategory function
        updateRestaurantStatus,getRestaurantEvents,
        deleteCategory,
        updateCategory
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
