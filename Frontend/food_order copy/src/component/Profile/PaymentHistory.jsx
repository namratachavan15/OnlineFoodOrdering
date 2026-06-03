// PaymentHistory.js - Professional Redesign

import React, { useEffect, useState } from 'react';
import { useOrderContext } from '../State/Order/OrderContext';
import { useAuth } from '../Auth/AuthContext';
import { FaCreditCard, FaRupeeSign, FaCalendarAlt, FaWallet, FaDownload, FaReceipt, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const { orders, getUsersOrders, loading } = useOrderContext();
  const { jwt } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (jwt) {
      getUsersOrders(jwt);
    }
  }, [jwt]);

  const formatOrderId = (id) => {
    if (!id) return 'ORD000000';
    const idStr = String(id);
    return idStr.length > 8 ? `#${idStr.slice(-8)}` : `#${idStr.padStart(8, '0')}`;
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'completed': return 'success';
      case 'processing': return 'processing';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      case 'cancelled': return 'failed';
      default: return 'pending';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'card': return <FaCreditCard />;
      case 'wallet': return <FaWallet />;
      default: return <FaCreditCard />;
    }
  };

  const calculateTotalSpent = () => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  };

  const getTotalOrders = () => {
    return orders.length;
  };

  const getAverageOrderValue = () => {
    if (orders.length === 0) return 0;
    return Math.round(calculateTotalSpent() / orders.length);
  };

  const handleDownloadReceipt = (order) => {
    console.log('Downloading receipt for order:', order.id);
    // Add receipt download logic
  };

  const handleViewDetails = (order) => {
    navigate(`/order/${order.id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading payment history...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="payment-container">
        <div className="payment-header">
          <h2>
            <FaCreditCard /> Payment History
          </h2>
          <p>Track your payment transactions</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <FaReceipt />
          </div>
          <h3>No Payment History</h3>
          <p>Your payment transactions will appear here</p>
          <button className="empty-action-btn" onClick={() => navigate("/")}>
            <FaShoppingBag /> Start Ordering
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>
          <FaCreditCard /> Payment History
        </h2>
        <p>Track and manage your transactions</p>
      </div>

      {/* Stats Summary */}
      <div className="payment-stats">
        <div className="stat-summary-card">
          <span className="stat-summary-value">{getTotalOrders()}</span>
          <span className="stat-summary-label">Total Orders</span>
        </div>
        <div className="stat-summary-card">
          <span className="stat-summary-value">₹{calculateTotalSpent().toLocaleString()}</span>
          <span className="stat-summary-label">Total Spent</span>
        </div>
        <div className="stat-summary-card">
          <span className="stat-summary-value">₹{getAverageOrderValue().toLocaleString()}</span>
          <span className="stat-summary-label">Avg. Order Value</span>
        </div>
      </div>

      {/* Payment Grid */}
      <div className="payment-grid">
        {orders.map((order, idx) => (
          <div key={order.id || idx} className="payment-card">
            <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
              {order.orderStatus || 'Processing'}
            </span>

            <div className="payment-card-header">
              <div className="payment-icon-wrapper">
                {getPaymentMethodIcon(order.paymentMethod)}
              </div>
              <div className="payment-info">
                <div className="payment-order-id">
                  {formatOrderId(order.id)}
                </div>
                <div className="payment-date">
                  <FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="payment-card-body">
              <div className="payment-amount">
                <span className="amount-label">Total Amount</span>
                <span className="amount-value">
                  <FaRupeeSign /> {order.totalAmount?.toLocaleString()}
                </span>
              </div>

              <div className="payment-method">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span>Paid via <strong>{order.paymentMethod || 'Credit Card'}</strong></span>
              </div>

              {/* Items List */}
              <ul className="items-list">
                {order.items?.slice(0, 2).map((item, index) => (
                  <li key={index}>
                    <span className="item-name">{item.food?.name}</span>
                    <span className="item-price">₹{item.totalPrice}</span>
                  </li>
                ))}
                {order.items?.length > 2 && (
                  <li className="more-items">
                    +{order.items.length - 2} more items
                  </li>
                )}
              </ul>
            </div>

            {/* <div className="payment-card-footer">
              <button className="payment-action-btn" onClick={() => handleViewDetails(order)}>
                <FaReceipt /> Details
              </button>
              <button className="payment-action-btn" onClick={() => handleDownloadReceipt(order)}>
                <FaDownload /> Receipt
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;