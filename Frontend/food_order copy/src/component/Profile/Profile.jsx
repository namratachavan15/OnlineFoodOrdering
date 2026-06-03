// Profile.js - Updated with premium sidebar matching admin style

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import UserProfile from './UserProfile';
import Orders from './Orders';
import Address from './Address';
import Favorites from './Favorites';
import PaymentHistory from './PaymentHistory';
import { useAuth } from '../Auth/AuthContext';
import './Profile.css';

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Profile', icon: <FaUser />, path: '/my-profile', key: 'Profile' },
    { title: 'Orders', icon: <FaShoppingBag />, path: '/my-profile/orders', key: 'Orders' },
    { title: 'Address', icon: <FaMapMarkerAlt />, path: '/my-profile/address', key: 'Address' },
    { title: 'Favourites', icon: <FaHeart />, path: '/my-profile/favourites', key: 'Favourites' },
    { title: 'Payments', icon: <FaCreditCard />, path: '/my-profile/payments', key: 'Payments' },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path === '/my-profile' || path === '/my-profile/') {
      setActiveTab('Profile');
    } else if (path.includes('/orders')) {
      setActiveTab('Orders');
    } else if (path.includes('/address')) {
      setActiveTab('Address');
    } else if (path.includes('/favourites')) {
      setActiveTab('Favourites');
    } else if (path.includes('/payments')) {
      setActiveTab('Payments');
    }
  }, [location]);

  const handleNavigate = (item) => {
    navigate(item.path);
    setActiveTab(item.key);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout(navigate);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="profile-page-wrapper">
      {/* Mobile Header */}
      <div className="profile-mobile-header">
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2>{activeTab || 'My Account'}</h2>
        <div className="mobile-placeholder"></div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="profile-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar - Premium Design */}
      <div className={`profile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="profile-sidebar-header">
          <div className="profile-logo-section">
            <div className="profile-logo-icon">
              <FaUser />
            </div>
            <div className="profile-logo-text">
              <span className="logo-main">MY</span>
              <span className="logo-dot">.</span>
              <span className="logo-sub">ACCOUNT</span>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="profile-user-section">
          <div className="profile-avatar">
            <span>{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div className="profile-user-info">
            <span className="profile-user-name">{user?.fullName || 'Guest User'}</span>
            <span className="profile-user-email">{user?.email || 'guest@example.com'}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="profile-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`profile-nav-link ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => handleNavigate(item)}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-title">{item.title}</span>
              {activeTab === item.key && <div className="nav-indicator" />}
            </button>
          ))}
          
          <div className="profile-divider" />
          
          <button className="profile-nav-link logout-link" onClick={handleLogout}>
            <div className="nav-icon"><FaSignOutAlt /></div>
            <span className="nav-title">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="profile-sidebar-footer">
          <p>© 2024 Flavor Express</p>
          <p className="version">Version 2.0.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content-area">
        <Routes>
          <Route path="/" element={<UserProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<Address />} />
          <Route path="/favourites" element={<Favorites />} />
          <Route path="/payments" element={<PaymentHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;