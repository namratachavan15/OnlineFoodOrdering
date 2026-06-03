import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getUserProfile, addToFavorite } from "../Config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    favorites: [], // Initialize favourites as an empty array
  });

  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || null);
  const [loading, setLoading] = useState(false);

  
  // When jwt changes or is available, fetch the user profile (with favorites)
  useEffect(() => {
    if (jwt) {
      fetchUser(jwt);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Set user from localStorage if exists
      }
    }
  }, [jwt]);

  const fetchUser = async (token) => {
    try {
      const { data } = await getUserProfile(token);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); // Store the user data in localStorage to persist the state
    
    } catch (error) {
      console.error("Fetch User Error:", error);
    }
  };


  const login = async (userData, navigate) => {
    setLoading(true);
    console.log("userdata",userData)
    try {
      const { data } = await loginUser(userData);
      console.log("data",data)
      setJwt(data.jwt);
      localStorage.setItem("jwt", data.jwt);
      await fetchUser(data.jwt);
  
      // Now redirect them based on role
      if (data.role === "ROLE_RESTAURANT_OWNER") {
        navigate("/admin/restaurant"); // This will show CreateRestaurantForm if they don’t have one
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
    setLoading(false);
  };
  
  

  const register = async (userData, navigate) => {
    setLoading(true);
    try {
      const { data } = await registerUser(userData);
      
      // Instead of immediately logging them in and calling protected endpoints...
      // Just store success message and redirect to login
      localStorage.setItem("registered", "true");
      navigate("/account/login"); // Or wherever your login route is
  
    } catch (error) {
      console.error("Register Error:", error);
    }
    setLoading(false);
  };
  
  const addToFavorites = async (restaurantId) => {
    if (!jwt) {
      console.log("User is not authenticated.");
      return;
    }
    setLoading(true);
    try {
      // Check if the restaurant is already in favorites
      const isFavorite = user.favorites.some(fav => fav.id === restaurantId);

      // Add or remove from favorites
      await addToFavorite(jwt, restaurantId); // API call to add or remove the restaurant from favorites

      // Update the user favorites list in the state and localStorage
      const updatedFavorites = isFavorite
        ? user.favorites.filter(fav => fav.id !== restaurantId) // Remove from favorites
        : [...user.favorites, { id: restaurantId }]; // Add to favorites

      setUser(prevState => ({
        ...prevState,
        favorites: updatedFavorites,
      }));

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify({
        ...user,
        favorites: updatedFavorites,
      }));

      console.log(isFavorite ? "Restaurant removed from favorites" : "Restaurant added to favorites");
    } catch (error) {
      console.error("Add to Favorite Error:", error);
    }
    setLoading(false);
  };

  const logout = (navigate) => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user"); // Remove user data from localStorage
    setJwt(null);
    setUser({ favorites: [] }); // Reset to default state
  
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{
      user,
      jwt,
      loading,
      login,
      register,
      logout,
      fetchUser,
      addToFavorites,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
