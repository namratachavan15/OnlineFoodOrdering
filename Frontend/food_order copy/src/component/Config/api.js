import axios from "axios";

export const API_URI = "http://localhost:5454"; // Replace with your backend URL

export const api = axios.create({
  baseURL: API_URI,
  headers: { "Content-Type": "application/json" },
});

// Function to handle login API call
export const loginUser = async (userData) => {
  return api.post("/auth/signin", userData);
};

// Function to handle registration API call
export const registerUser = async (userData) => {
  return api.post("/auth/signup", userData);
};

// Function to fetch user profile
export const getUserProfile = async (token) => {
  return api.get("/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// Function to add restaurant to favorites
export const addToFavorite = async (jwt, restaurantId) => {
  return api.put(`/api/restaurants/${restaurantId}/add-favorites`, {}, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
};


//export default api;
