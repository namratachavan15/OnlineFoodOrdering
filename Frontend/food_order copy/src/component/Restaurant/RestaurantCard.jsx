// RestaurantCard.js - Premium Glassmorphism Design

import React, { useState, useEffect } from 'react';
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ item }) => {
  const { user, addToFavorites } = useAuth();
  const isOpen = item.open === true;
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (user?.favorites) {
      const favoriteStatus = user.favorites.some(fav => fav.id === item.id);
      setIsFavorite(favoriteStatus);
    }
  }, [user?.favorites, item.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    await addToFavorites(item.id);
    setIsFavorite(!isFavorite);
  };

  const handleNavigateToRestaurant = () => {
    if (item.open) {
      navigate(`/restaurant/${item.address?.city}/${item.name}/${item.id}`);
    }
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text || '';
  };

  const rating = item.rating || 4.5;
  const deliveryTime = item.deliveryTime || '25-35 min';
  const discount = item.discount || '20% OFF';

  return (
    <div 
      className="restaurant-card-glass"
      onClick={handleNavigateToRestaurant}
    >
      {/* Gradient Border Effect */}
      <div className="card-border-glow"></div>
      
      <div className="card-image-section">
        <div className="image-wrapper">
          {!imageLoaded && <div className="image-skeleton"></div>}
          <img 
            src={item.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={item.name}
            className={`restaurant-image-glass ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Premium Discount Badge */}
        <div className="discount-badge">
          <span>{discount}</span>
        </div>
        
        {/* Open/Closed Chip */}
        <div className={`status-chip ${isOpen ? 'open' : 'closed'}`}>
          <span className="status-dot"></span>
          {isOpen ? 'Open Now' : 'Closed'}
        </div>
        
        {/* Floating Favorite Button */}
        <button 
          className="favorite-glass-btn"
          onClick={handleToggleFavorite}
          aria-label="Add to favorites"
        >
          {isFavorite ? (
            <IoMdHeart className="favorite-icon-glass active" />
          ) : (
            <IoIosHeartEmpty className="favorite-icon-glass" />
          )}
        </button>
      </div>
      
      <div className="card-content-glass">
        <div className="restaurant-header">
          <h3 className="restaurant-name-glass">{item.name}</h3>
          <div className="rating-glass">
            <FaStar className="star-icon" />
            <span>{rating}</span>
            <span className="rating-count">(1.2k+)</span>
          </div>
        </div>
        
        <p className="restaurant-description-glass">
          {truncateText(item.description, 70)}
        </p>
        
        <div className="restaurant-details">
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{deliveryTime}</span>
          </div>
          <div className="detail-divider"></div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{item.address?.city || 'Nearby'}</span>
          </div>
        </div>
        
        {/* Cuisine Tags */}
        {item.cuisines && item.cuisines.length > 0 && (
          <div className="cuisine-tags">
            {item.cuisines.slice(0, 3).map((cuisine, idx) => (
              <span key={idx} className="cuisine-tag">{cuisine}</span>
            ))}
          </div>
        )}
        
        {/* Price Indicator */}
        <div className="price-indicator">
          <div className="price-bar">
            <div className="price-fill" style={{ width: `${(item.priceLevel || 2) * 33}%` }}></div>
          </div>
          <span className="price-text">
            {'$'.repeat(item.priceLevel || 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;