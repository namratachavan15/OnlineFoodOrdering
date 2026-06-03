// NavbarComponent.js - Premium Modern Design with Dynamic Location

import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaBell, FaChevronDown } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoMdRestaurant } from 'react-icons/io';
import { 
  Navbar, 
  NavbarBrand, 
  Input, 
  Button, 
  Badge 
} from 'reactstrap';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../State/Cart/CartContext';
import './Navbar.css';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log("user is", user);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  // Get user's location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    } else {
      // Try to get browser location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const defaultLocation = { city: "Mumbai", area: "Andheri West" };
            setUserLocation(defaultLocation);
            localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
          },
          (error) => {
            console.log("Location permission denied");
          }
        );
      }
    }
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim() !== "") {
      navigate(`/search-results?query=${encodeURIComponent(searchKeyword)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    logout(navigate);
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const handleLocationChange = () => {
    if (locationInput.trim()) {
      const newLocation = { city: locationInput.trim(), area: "" };
      setUserLocation(newLocation);
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      setShowLocationModal(false);
      setLocationInput("");
      window.location.reload();
    }
  };

  const cartItemCount = cartItems?.length || 0;

  return (
    <>
      <Navbar className={`navbar-premium ${scrolled ? 'scrolled' : ''}`} fixed="top">
        <div className="navbar-inner">
          {/* Logo Section */}
          <NavbarBrand onClick={() => navigate("/")} className="brand">
            <div className="brand-icon">
              <IoMdRestaurant />
            </div>
            <div className="brand-text">
              <span className="brand-main">FLAVOR</span>
              <span className="brand-dot">.</span>
              <span className="brand-sub">express</span>
            </div>
          </NavbarBrand>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {/* Location Picker - Dynamic */}
            <div className="location-picker" onClick={() => setShowLocationModal(true)}>
              <FaMapMarkerAlt className="location-icon" />
              <div className="location-info">
                <span className="location-label">Delivering to</span>
                <span className="location-value">
                  {userLocation ? userLocation.city : "Select Location"}
                </span>
              </div>
              <FaChevronDown className="location-chevron" />
            </div>

            {/* Search Bar - Desktop */}
            <div className={`search-container ${searchExpanded ? 'expanded' : ''}`}>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <Input
                  type="text"
                  placeholder="Search dishes, restaurants, cuisines..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onFocus={() => setSearchExpanded(true)}
                  onBlur={() => setSearchExpanded(false)}
                  className="search-input-premium"
                />
                {searchKeyword && (
                  <button className="search-clear-btn" onClick={() => setSearchKeyword('')}>
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {/* Favorites */}
              <button className="action-icon-btn" onClick={() => navigate("/favourites")}>
                <FaHeart />
                <span className="action-label">Favorites</span>
              </button>

              {/* Cart */}
              <button className="cart-btn-premium" onClick={() => navigate("/cart")}>
                <FaShoppingBag />
                <span className="cart-label">Cart</span>
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </button>

              {/* User Menu */}
              <div className="user-menu-container">
                {user && user.fullName ? (
                  <button 
                    className="user-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar-premium">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name-premium">{user.fullName.split(' ')[0]}</span>
                    <FaChevronDown className="user-chevron" />
                  </button>
                ) : (
                  <button className="signin-btn" onClick={() => navigate("/account/login")}>
                    <AiOutlineUser />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Dropdown Menu */}
                {showUserMenu && user && (
                  <div className="user-dropdown-premium">
                    <div className="dropdown-card">
                      <div className="dropdown-user">
                        <div className="dropdown-avatar-premium">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="dropdown-user-details">
                          <div className="dropdown-fullname">{user.fullName}</div>
                          <div className="dropdown-email">{user.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-menu-items">
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate(user.role === "ROLE_CUSTOMER" ? "/my-profile" : "/admin/restaurant/dashboard");
                            setShowUserMenu(false);
                          }}
                        >
                          <span>👤</span> Profile Settings
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate("/orders");
                            setShowUserMenu(false);
                          }}
                        >
                          <span>📋</span> Order History
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item logout-item"
                          onClick={handleLogout}
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="mobile-controls">
            <button className="mobile-search-toggle" onClick={() => navigate("/search")}>
              <FaSearch />
            </button>
            <button className="mobile-cart-toggle" onClick={() => navigate("/cart")}>
              <FaShoppingBag />
              {cartItemCount > 0 && <span className="mobile-cart-badge">{cartItemCount}</span>}
            </button>
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
              <AiOutlineMenu />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mobile-search-bar">
          <div className="mobile-search-box">
            <FaSearch className="mobile-search-icon" />
            <Input
              type="text"
              placeholder="Search food..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
              className="mobile-search-input"
            />
            <Button className="mobile-search-submit" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-header">
              <h3>Change Delivery Location</h3>
              <button className="location-modal-close" onClick={() => setShowLocationModal(false)}>
                <AiOutlineClose />
              </button>
            </div>
            <div className="location-modal-body">
              <p>Enter your delivery address to see restaurants near you</p>
              <div className="location-input-wrapper">
                <FaMapMarkerAlt className="location-input-icon" />
                <Input
                  type="text"
                  placeholder="Enter city, area, or pincode"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationChange()}
                  className="location-input"
                  autoFocus
                />
              </div>
              <button className="location-save-btn" onClick={handleLocationChange}>
                Save Location
              </button>
              {userLocation && (
                <button 
                  className="location-current-btn"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const currentLocation = { city: "Current Location", area: "" };
                          setUserLocation(currentLocation);
                          localStorage.setItem('userLocation', JSON.stringify(currentLocation));
                          setShowLocationModal(false);
                          window.location.reload();
                        }
                      );
                    }
                  }}
                >
                  Use Current Location
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <IoMdRestaurant />
            <span>FLAVOR.express</span>
          </div>
          <button className="drawer-close" onClick={() => setMobileMenuOpen(false)}>
            <AiOutlineClose />
          </button>
        </div>

        <div className="drawer-content">
          {/* Mobile Location */}
          <div className="drawer-location" onClick={() => {
            setMobileMenuOpen(false);
            setShowLocationModal(true);
          }}>
            <FaMapMarkerAlt />
            <div className="drawer-location-text">
              <span>Delivering to</span>
              <strong>{userLocation ? userLocation.city : "Select Location"}</strong>
            </div>
            <FaChevronDown className="drawer-location-chevron" />
          </div>

          {user && user.fullName ? (
            <div className="drawer-user-card">
              <div className="drawer-avatar">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="drawer-user-info">
                <div className="drawer-user-name">{user.fullName}</div>
                <div className="drawer-user-email">{user.email}</div>
              </div>
            </div>
          ) : (
            <button className="drawer-signin" onClick={() => {
              navigate("/account/login");
              setMobileMenuOpen(false);
            }}>
              <AiOutlineUser /> Sign In / Register
            </button>
          )}

          <div className="drawer-menu">
            <button className="drawer-menu-item" onClick={() => {
              navigate("/");
              setMobileMenuOpen(false);
            }}>
              <span>🏠</span> Home
            </button>
            <button className="drawer-menu-item" onClick={() => {
              navigate("/favorites");
              setMobileMenuOpen(false);
            }}>
              <span>❤️</span> Favorites
            </button>
            <button className="drawer-menu-item" onClick={() => {
              navigate("/orders");
              setMobileMenuOpen(false);
            }}>
              <span>📦</span> My Orders
            </button>
            <button className="drawer-menu-item" onClick={() => {
              navigate("/offers");
              setMobileMenuOpen(false);
            }}>
              <span>🏷️</span> Offers
            </button>
            <button className="drawer-menu-item" onClick={() => {
              navigate("/help");
              setMobileMenuOpen(false);
            }}>
              <span>❓</span> Help Center
            </button>
          </div>

          {user && user.fullName && (
            <button className="drawer-logout" onClick={handleLogout}>
              <span>🚪</span> Sign Out
            </button>
          )}
        </div>
      </div>

      <div className={`drawer-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className="navbar-spacer-premium"></div>
    </>
  );
};

export default NavbarComponent;