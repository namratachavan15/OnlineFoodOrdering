// Orders.js - Updated with better functionality

import React, { useEffect } from 'react';
import OrderCard from './OrderCard';
import { useNavigate } from 'react-router-dom';
import { useOrderContext } from '../State/Order/OrderContext';
import { useAuth } from '../Auth/AuthContext';
import { Spinner } from 'reactstrap';
import { FaShoppingBag, FaClipboardList } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const { auth } = useAuth();
  const { orders, getUsersOrders, loading } = useOrderContext();
  const navigate = useNavigate();

  const jwt = auth?.jwt || localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      getUsersOrders(jwt);
    }
  }, [jwt]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="section-header">
        <h2>
          <FaShoppingBag /> My Orders
        </h2>
        <p>View your order history and track deliveries</p>
      </div>

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order, orderIndex) => (
            <OrderCard key={order.id || orderIndex} order={order} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaClipboardList />
          </div>
          <h3>No Orders Yet</h3>
          <p>Looks like you haven't placed any orders yet</p>
          <button className="empty-action-btn" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;