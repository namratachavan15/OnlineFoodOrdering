// Favorites.js - Updated with improved styling

import React, { useEffect, useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import RestaurantCard from './../Restaurant/RestaurantCard';
import { Spinner } from 'reactstrap';
import { FaHeart, FaRegHeart, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const { user, loading, fetchUser, jwt } = useAuth();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (jwt && (!user || !user.favorites)) {
      fetchUser(jwt);
    }
  }, [jwt, user?.favorites]);

  const favourites = user?.favorites || [];

  const handleRemoveFavorite = (restaurantId) => {
    setRemovingId(restaurantId);
    // Logic to remove from favorites
    setTimeout(() => {
      setRemovingId(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="section-header">
        <h2>
          <FaHeart /> My Favorites
        </h2>
        <p>
          {favourites.length > 0 
            ? `You have ${favourites.length} favorite ${favourites.length === 1 ? 'restaurant' : 'restaurants'}`
            : 'Discover and save your favorite restaurants'}
        </p>
      </div>

      {favourites.length > 0 ? (
        <div className="favorites-grid">
          {favourites.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`fav-item ${removingId === item.id ? 'fav-removing' : ''}`}
            >
              <RestaurantCard 
                item={item} 
                onRemove={() => handleRemoveFavorite(item.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaRegHeart />
          </div>
          <h3>No Favorites Yet</h3>
          <p>Start adding restaurants to your favorites and they will appear here</p>
          <button className="empty-action-btn" onClick={() => navigate("/")}>
            <FaUtensils /> Browse Restaurants
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;