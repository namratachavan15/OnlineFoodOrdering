// CartItem.js - Professional Redesign

import React, { useState } from 'react';
import { Card, Button, Badge } from 'reactstrap';
import { FaPlus, FaMinus, FaTrashAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../State/Cart/CartContext';
import { useAuth } from '../Auth/AuthContext';
import './Cart.css';

const CartItem = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { updateCartItem, removeCartItem } = useCart();
  const jwt = localStorage.getItem("jwt");

  const handleUpdateCartItem = async (value) => {
    setUpdating(true);
    
    if (value === -1 && item.quantity === 1) {
      await handleRemoveCartItem();
    } else {
      const data = { cartItemId: item.id, quantity: item.quantity + value };
      await updateCartItem({ data, jwt });
    }
    
    setUpdating(false);
  };

  const handleRemoveCartItem = async () => {
    if (window.confirm("Remove this item from cart?")) {
      await removeCartItem({ cartItemId: item.id, jwt: jwt });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, call API to save to favorites
  };

  return (
    <Card className="cart-item-card">
      <div className="cart-item-image">
        <img
          src={item.food?.images?.[0] || '/api/placeholder/120/120'}
          alt={item.food?.name}
        />
        {updating && <div className="update-overlay"><div className="spinner-small"></div></div>}
      </div>
      
      <div className="cart-item-details">
        <div className="item-header">
          <h4>{item.food?.name}</h4>
          <button className="favorite-item-btn" onClick={handleToggleFavorite}>
            {isFavorite ? <FaHeart className="active" /> : <FaRegHeart />}
          </button>
        </div>
        
        <p className="item-description">{item.food?.description?.substring(0, 80)}...</p>
        
        <div className="item-ingredients">
          {item.ingredients?.slice(0, 3).map((ingredient, index) => (
            <span key={index} className="ingredient-tag">
              {ingredient}
            </span>
          ))}
          {item.ingredients?.length > 3 && (
            <span className="ingredient-tag more">+{item.ingredients.length - 3}</span>
          )}
        </div>
        
        <div className="item-actions">
          <div className="quantity-control">
            <button 
              className="qty-control-btn"
              onClick={() => handleUpdateCartItem(-1)}
              disabled={updating}
            >
              <FaMinus />
            </button>
            <span className="quantity-value">{item.quantity}</span>
            <button 
              className="qty-control-btn"
              onClick={() => handleUpdateCartItem(1)}
              disabled={updating}
            >
              <FaPlus />
            </button>
          </div>
          
          <div className="item-price">
            <span className="price-currency">₹</span>
            <span className="price-value">{item.totalPrice}</span>
          </div>
          
          <button 
            className="remove-item-btn"
            onClick={handleRemoveCartItem}
            disabled={updating}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;