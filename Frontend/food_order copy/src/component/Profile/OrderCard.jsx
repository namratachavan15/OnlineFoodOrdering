// OrderCard.js - Professional Redesign with Reorder functionality

import React, { useState } from 'react';
import { Badge } from 'reactstrap';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaClock, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaMotorcycle,
  FaShoppingBag,
  FaStar,
  FaRegStar,
  FaReceipt,
  FaDownload
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'preparing': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#E91E63';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return '✅';
      case 'preparing': return '🍳';
      case 'confirmed': return '📋';
      case 'cancelled': return '❌';
      default: return '🕒';
    }
  };

  const getStatusMessage = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'Your order has been delivered successfully!';
      case 'preparing': return 'Your food is being prepared fresh!';
      case 'confirmed': return 'Order confirmed! Getting ready for delivery.';
      case 'cancelled': return 'Order has been cancelled.';
      default: return 'Processing your order...';
    }
  };

  const formatOrderId = (id) => {
    if (!id) return 'ORD000000';
    const idStr = String(id);
    return idStr.length > 8 ? `#${idStr.slice(-8)}` : `#${idStr.padStart(8, '0')}`;
  };

  const handleReorder = () => {
    // Add all items from this order to cart
    order.items.forEach(item => {
      // Logic to add item to cart
      console.log(`Adding ${item.food?.name} to cart`);
    });
    navigate('/cart');
  };

  const handleDownloadInvoice = () => {
    // Logic to download invoice PDF
    console.log('Downloading invoice for order:', order.id);
  };

  const handleWriteReview = () => {
    navigate(`/restaurant/${order.restaurant?.id}/review`);
  };

  const isDelivered = order?.orderStatus?.toLowerCase() === 'delivered';
  const isCancelled = order?.orderStatus?.toLowerCase() === 'cancelled';

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setExpanded(!expanded)}>
        <div className="order-info">
          <span className="order-id">
            <p>{formatOrderId(order?.id)}</p>
          </span>
          <span className="order-date">
            <FaClock /> {new Date(order?.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="order-status">
          <Badge style={{ backgroundColor: getStatusColor(order?.orderStatus) }}>
            {getStatusIcon(order?.orderStatus)} {order?.orderStatus || 'Processing'}
          </Badge>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      <div className="order-body">
        {order?.items?.map((item, idx) => (
          <div key={idx} className="order-item">
            <img 
              src={item.food?.images?.[0] || '/api/placeholder/60/60'} 
              alt={item.food?.name}
              className="order-item-img"
            />
            <div className="order-item-details">
              <div className="order-item-name">{item.food?.name || 'Food Item'}</div>
              <div className="order-item-qty">Quantity: {item.quantity}</div>
            </div>
            <div className="order-item-price">
              <FaRupeeSign /> {item.totalPrice}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="order-footer">
          {/* Status Message */}
          <div className="status-message">
            <span className="status-icon">{getStatusIcon(order?.orderStatus)}</span>
            <p>{getStatusMessage(order?.orderStatus)}</p>
          </div>

          {/* Delivery Address */}
          {order?.deliveryAddress && (
            <div className="delivery-address">
              <FaMapMarkerAlt />
              <div>
                <span>Delivery Address</span>
                <p>{order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}</p>
              </div>
            </div>
          )}
          
          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{Math.round((order?.totalAmount || 0) - 40)}</span>
            </div>
            <div className="summary-line">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
            {order?.discount > 0 && (
              <div className="summary-line discount">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total Amount</span>
              <span>₹{order?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="order-actions">
            {!isCancelled && (
              <button className="action-btn reorder-btn" onClick={handleReorder}>
                <FaShoppingBag /> Reorder
              </button>
            )}
            
            {/* <button className="action-btn invoice-btn" onClick={handleDownloadInvoice}>
              <FaDownload /> Invoice
            </button> */}
            
            {isDelivered && (
              <button className="action-btn review-btn" onClick={handleWriteReview}>
                <FaStar /> Write a Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;