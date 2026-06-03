import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Badge } from 'reactstrap';
import { 
  IoMdSearch, 
  IoMdTime, 
  IoMdCheckmark, 
  IoMdClose, 
  IoMdPerson, 
  IoMdRestaurant,
  IoMdArrowForward
} from 'react-icons/io';
import { 
  FaSpinner, 
  FaEye, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
// import { useOrderContext } from '../../component/State/RestaurantOrder/OrderContext';

import './Order.css';

import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import { useOrderContext } from '../../component/State/RestaurantOrder/OrderContext';


const orderStatuses = [
  { label: 'Pending', value: 'PENDING', icon: <IoMdTime />, color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.15)' },

  { label: 'Placed', value: 'PLACED', icon: <FaCheckCircle />, color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)' },

  { label: 'Preparing', value: 'PREPARING', icon: <FaSpinner />, color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.15)' },

  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY', icon: <FaTruck />, color: '#FF5722', bgColor: 'rgba(255, 87, 34, 0.15)' },

  { label: 'Delivered', value: 'DELIVERED', icon: <IoMdCheckmark />, color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)' },

  { label: 'Cancelled', value: 'CANCELLED', icon: <IoMdClose />, color: '#F44336', bgColor: 'rgba(244, 67, 54, 0.15)' },
];

const OrderTable = ({ filterValue }) => {
  const jwt = localStorage.getItem('jwt');
  const { fetchRestaurantOrder, updateOrderStatus, orders, loading } = useOrderContext();
  
  const { usersRestaurant } = useRestaurantContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    if (usersRestaurant?.id && jwt) {
      fetchRestaurantOrder({
        restaurantId: usersRestaurant.id,
        orderStatus: filterValue,
        jwt,
      });
    }
  }, [usersRestaurant?.id, filterValue, jwt]);

  const handleUpdateOrder = async (orderId, orderStatusValue) => {
    setUpdatingOrder(orderId);
    await updateOrderStatus({ orderId, orderStatus: orderStatusValue, jwt });
    setUpdatingOrder(null);
  };

 const getStatusInfo = (status) => {
  return (
    orderStatuses.find(s => s.value === status) || {
      label: status,
      value: status,
      icon: <FaClock />,
      color: '#999',
      bgColor: 'rgba(0,0,0,0.1)'
    }
  );
};

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.customer?.fullName?.toLowerCase().includes(searchLower) ||
      order.items?.some(item => item.food?.name.toLowerCase().includes(searchLower))
    );
  });

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    
    return (
      <div className="order-details-overlay" onClick={onClose}>
        <div className="order-details-modal-premium" onClick={(e) => e.stopPropagation()}>
          <div className="order-details-header">
            <h3>Order #{order.id}</h3>
            <button className="order-details-close" onClick={onClose}>
              <IoMdClose />
            </button>
          </div>
          
          <div className="order-details-body">
            {/* Customer Section */}
            <div className="details-section">
              <h4><IoMdPerson /> Customer Information</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{order.customer?.fullName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{order.customer?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{order.customer?.mobile}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="details-section">
              <h4><IoMdRestaurant /> Order Items</h4>
              <div className="order-items-list">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item-detail">
                    <img src={item.food?.images?.[0]} alt={item.food?.name} />
                    <div className="item-info-detail">
                      <div className="item-name-detail">{item.food?.name}</div>
                      <div className="item-quantity">Quantity: {item.quantity}</div>
                      <div className="item-ingredients">
                        {item.ingredients?.map((ing, i) => (
                          <span key={i} className="ingredient-badge">{ing.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className="item-price-detail">₹{item.totalPrice}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="details-section">
              <h4>Order Summary</h4>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{order.totalAmount - (order.deliveryFee || 40)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>₹{order.deliveryFee || 40}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-state-orders">
        <FaSpinner className="spinning" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container-premium">
      {/* Search Bar */}
      <div className="orders-header-premium-table">
        <div className="search-wrapper-order-premium">
          <IoMdSearch className="search-icon" />
          <Input
            type="text"
            placeholder="Search by order ID, customer name, or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-order-premium"
          />
        </div>
        <div className="orders-stats">
          <Badge className="stats-badge-orders">
            Total: {filteredOrders.length}
          </Badge>
          <Badge className="stats-badge-orders pending">
            Pending: {orders.filter(o => o.orderStatus === 'PENDING').length}
          </Badge>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid-premium">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.orderStatus);
            return (
              <div key={order.id} className="order-card-premium">
                <div className="order-card-header">
                  <div className="order-id">
                    <span className="label">Order ID</span>
                    <strong>#{order.id}</strong>
                  </div>
                  <div 
                    className="order-status-badge"
                    style={{ 
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}20`
                    }}
                  >
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Customer Info */}
                  <div className="customer-info-card">
                    <div className="customer-avatar">
                      {order.customer?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="customer-details">
                      <div className="customer-name">{order.customer?.fullName}</div>
                      <div className="order-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="order-items-preview">
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={item.food?.images?.[0]} alt={item.food?.name} />
                        <span>{item.food?.name} x{item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <div className="more-items" onClick={() => setSelectedOrder(order)}>
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="order-total-card">
                    <span>Total Amount</span>
                    <strong>₹{order.totalAmount}</strong>
                  </div>
                </div>

               
              </div>
            );
          })
        ) : (
          <div className="empty-orders-state-premium">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>Orders will appear here once customers place them</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderTable;