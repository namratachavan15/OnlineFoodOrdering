import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Label, Input } from 'reactstrap';
import { FaChartLine, FaClock, FaCheckCircle, FaListAlt } from 'react-icons/fa';
import OrderTable from './OrderTable';
import './Order.css';
import { useOrderContext } from '../../component/State/RestaurantOrder/OrderContext';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';




const orderStatus = [
  { label: "Pending", value: "PENDING", icon: <FaClock />, color: "#FF9800" },
  { label: "Completed", value: "COMPLETED", icon: <FaCheckCircle />, color: "#4CAF50" },
  { label: "All Orders", value: "ALL", icon: <FaListAlt />, color: "#2196F3" },
];

const Order = () => {
  const [filterValue, setFilterValue] = useState("ALL");
 const { orders, getUsersOrders } = useOrderContext();

  const jwt = localStorage.getItem("jwt");
  const handleFilter = (e) => {
    setFilterValue(e.target.value);
  };

 const {  fetchRestaurantOrder } = useOrderContext();
const { usersRestaurant } = useRestaurantContext();

useEffect(() => {
  if (usersRestaurant?.id && jwt) {
    fetchRestaurantOrder({
      restaurantId: usersRestaurant.id,
      orderStatus: "ALL",
      jwt,
    });
  }
}, [usersRestaurant]);

  const getTotalRevenue = () => {
  return orders.reduce((total, order) => {
    return total + (order.totalAmount || 0);
  }, 0);
};


const totalRevenue = getTotalRevenue();
console.log("orders=",orders)
 const getStatusCount = () => {
  const counts = {
    PENDING: 0,
    COMPLETED: 0,
    ALL: orders.length || 0
  };

  orders.forEach((order) => {
    if (order.orderStatus === "PENDING") {
      counts.PENDING++;
    }
    if (order.orderStatus === "PLACED" || order.orderStatus === "COMPLETED") {
      counts.COMPLETED++;
    }
  });

  return counts;
};


  const counts = getStatusCount();

  return (
    <div className="orders-management-premium">
      <div className="orders-header-premium">
        <div className="header-content">
          <h1>Orders Management</h1>
          <p>Track and manage all customer orders</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
          <span className="stat-number">₹{totalRevenue}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="header-stat">
            <span className="stat-number">{counts.ALL}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="status-filters-premium">
        {orderStatus.map((item) => (
          <label 
            key={item.value} 
            className={`status-filter-card ${filterValue === item.value ? 'active' : ''}`}
            style={{ '--status-color': item.color }}
          >
            <input
              type="radio"
              name="orderStatus"
              value={item.value}
              onChange={handleFilter}
              checked={filterValue === item.value}
              hidden
            />
            <div className="filter-card-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              {item.icon}
            </div>
            <div className="filter-card-info">
              <span className="filter-label">{item.label}</span>
              <span className="filter-count">{counts[item.value] || 0}</span>
            </div>
            <div className="filter-card-arrow">
              {filterValue === item.value && <span>→</span>}
            </div>
          </label>
        ))}
      </div>

      {/* Orders Table */}
      <div className="orders-table-wrapper">
        <OrderTable filterValue={filterValue} />
      </div>
    </div>
  );
};

export default Order;