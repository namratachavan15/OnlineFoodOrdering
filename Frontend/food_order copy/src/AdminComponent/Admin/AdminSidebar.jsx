import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import {
  FaShoppingBag, FaChartBar, FaBox, FaHamburger, FaUtensils,
  FaCalendarAlt, FaCogs, FaSignOutAlt, FaStore, FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../../component/Auth/AuthContext';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import "./AdminSidebar.css";

const menu = [
  { title: 'Dashboard', icon: <FaChartBar />, path: '/' },
  { title: 'Orders', icon: <FaShoppingBag />, path: '/orders' },
  { title: 'Menu', icon: <FaBox />, path: '/menu' },
  { title: 'Food Category', icon: <FaHamburger />, path: '/category' },
  { title: 'Ingredients', icon: <FaUtensils />, path: '/ingredients' },
  { title: 'Events', icon: <FaCalendarAlt />, path: '/event' },
  { title: 'Restaurant Details', icon: <FaCogs />, path: '/details' },
];

const AdminSideBar = ({ onItemClick, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout } = useAuth();
  const { logoutRestaurant } = useRestaurantContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigate = (item) => {
    if (item.title === 'Logout') {
      logout(navigate);
      logoutRestaurant();
    } else {
      navigate(`/admin/restaurant${item.path}`);
      if (onItemClick) onItemClick();
      if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout(navigate);
    logoutRestaurant();
  };

  const isActive = (path) => {
    return location.pathname === `/admin/restaurant${path}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <FaStore />
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="logo-main">FLAVOR</span>
                <span className="logo-dot">.</span>
                <span className="logo-sub">express</span>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Profile Section */}
        {!isCollapsed && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span>A</span>
            </div>
            <div className="profile-info">
              <span className="profile-name">Admin User</span>
              <span className="profile-role">Restaurant Owner</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <Nav vertical className="sidebar-nav">
          {menu.map((item, index) => (
            <NavItem key={index}>
              <NavLink
                onClick={() => handleNavigate(item)}
                className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <div className="nav-icon">{item.icon}</div>
                {!isCollapsed && <span className="nav-title">{item.title}</span>}
                {isActive(item.path) && !isCollapsed && (
                  <div className="nav-indicator" />
                )}
              </NavLink>
            </NavItem>
          ))}
          
          {/* Divider */}
          {!isCollapsed && <div className="sidebar-divider" />}
          
          {/* Logout Item */}
          <NavItem>
            <NavLink
              onClick={handleLogout}
              className="sidebar-nav-link logout-link"
            >
              <div className="nav-icon"><FaSignOutAlt /></div>
              {!isCollapsed && <span className="nav-title">Logout</span>}
            </NavLink>
          </NavItem>
        </Nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <p>© 2024 Flavor Express</p>
            <p className="version">Version 2.0.0</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSideBar;