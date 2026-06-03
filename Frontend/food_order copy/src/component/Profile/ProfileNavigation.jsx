// ProfileNavigation.js - Keep your logic, just update styling class names

import React from 'react';
import {
  FaShoppingBag,
  FaHeart,
  FaPlusCircle,
  FaWallet,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useRestaurantContext } from '../State/Restaurant/RestaurantContext';
import { Nav, NavItem, NavLink } from 'reactstrap';
import './ProfileNavigation.css';

const menu = [
  { title: 'Profile', icon: <FaUser />, path: '/' },
  { title: 'Orders', icon: <FaShoppingBag />, path: '/orders' },
  { title: 'Favourites', icon: <FaHeart />, path: '/favourites' },
  { title: 'Address', icon: <FaPlusCircle />, path: '/address' },
  { title: 'Payments', icon: <FaWallet />, path: '/payments' },
  { title: 'Logout', icon: <FaSignOutAlt />, path: '/' },
];

const ProfileNavigation = ({ onItemClick }) => {
  const { logout } = useAuth();
  const { logoutRestaurant } = useRestaurantContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/my-profile' || location.pathname === '/my-profile/';
    }
    return location.pathname === `/my-profile${path}`;
  };

  const handleNavigate = (item) => {
    if (item.title === 'Logout') {
      logout(navigate);
      logoutRestaurant();
    } else {
      navigate(`/my-profile${item.path}`);
      if (onItemClick) onItemClick();
    }
  };

  return (
    <div className="sidebar">
      <Nav vertical>
        {menu.map((item, index) => (
          <div key={index}>
            <NavItem className="nav-item">
              <NavLink
                onClick={() => handleNavigate(item)}
                className={`d-flex align-items-center ${isActive(item.path) ? 'active' : ''}`}
              >
                <div className="me-2">{item.icon}</div>
                <span>{item.title}</span>
              </NavLink>
            </NavItem>
            {index !== menu.length - 1 && <hr className="my-2" />}
          </div>
        ))}
      </Nav>
    </div>
  );
};

export default ProfileNavigation;