// RestaurantDetails.js - Professional Redesign

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Image, Badge, Nav, Tab, Spinner } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaStar, 
  FaTag, 
  FaFilter,
  FaUtensils,
  FaLeaf,
  FaDrumstick,
  FaInfoCircle,
  FaShare,
  FaBookmark,
  FaPhoneAlt,
  FaRegClock
} from 'react-icons/fa';
import { MdDeliveryDining, MdLocalOffer } from 'react-icons/md';
import MenuCard from './MenuCard';
import { useParams } from 'react-router-dom';
import { useRestaurantContext } from '../State/Restaurant/RestaurantContext';
import { useMenuItemContext } from '../State/Menu/MenuItemContext';
import './RestaurantDetails.css';

const foodTypes = [
  { label: "All Items", value: "all", icon: "🍽️" },
  { label: "Vegetarian Only", value: "vegetarian", icon: "🌱" },
  { label: "Non-Vegetarian", value: "non_vegetarian", icon: "🍗" },
  { label: "Seasonal Specials", value: "seasonal", icon: "🌸" }
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const { restaurant, restaurantCategory, getRestaurantById, getRestaurantsCategory, loading: restaurantLoading } = useRestaurantContext();
  const { getMenuItemsByRestaurantId, menuItems, loading: menuLoading } = useMenuItemContext();
  const [foodType, setFoodType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("menu");
  const [showFilter, setShowFilter] = useState(false);
  const [quantityMap, setQuantityMap] = useState({});

  const handleFilter = (e) => {
    setFoodType(e.target.value);
  };

  const handleFilterCategory = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
  };

  const clearFilters = () => {
    setFoodType("all");
    setSelectedCategory("");
  };

  useEffect(() => {
    if (id) {
      const jwt = localStorage.getItem('jwt');
      getRestaurantById(id, jwt);
      getRestaurantsCategory(id, jwt);
    }
  }, [id]);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    getMenuItemsByRestaurantId({
      restaurantId: id,
      jwt: jwt,
      filters: {
        vegetarian: foodType === "vegetarian",
        nonveg: foodType === "non_vegetarian",
        seasonal: foodType === "seasonal",
        food_category: selectedCategory
      }
    });
  }, [selectedCategory, foodType, id]);

  const categoriesList = restaurantCategory?.map(item => item.name) || [];

  // Calculate average rating or use default
  const rating = restaurant?.rating || 4.5;
  const totalReviews = restaurant?.totalReviews || 128;

  if (restaurantLoading) {
    return (
      <div className="details-loader">
        <Spinner animation="border" variant="danger" />
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-details-page">
      {/* Hero Section with Parallax Effect */}
      <div className="restaurant-hero">
        <div className="hero-overlay"></div>
        <div className="hero-background">
          <img src={restaurant?.images?.[0] || '/api/placeholder/1200/400'} alt={restaurant?.name} />
        </div>
        <Container className="hero-content">
          <div className="restaurant-info-card">
            <div className="restaurant-badge">
              <span className={`status-badge ${restaurant?.open ? 'open' : 'closed'}`}>
                {restaurant?.open ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <h1 className="restaurant-name">{restaurant?.name}</h1>
            <p className="restaurant-description">{restaurant?.description}</p>
            
            <div className="restaurant-meta-grid">
              <div className="meta-item">
                <FaStar className="meta-icon star" />
                <div>
                  <span className="meta-value">{rating}</span>
                  <span className="meta-label">({totalReviews}+ reviews)</span>
                </div>
              </div>
              <div className="meta-item">
                <MdDeliveryDining className="meta-icon" />
                <div>
                  <span className="meta-value">Free Delivery</span>
                  <span className="meta-label">on orders above ₹199</span>
                </div>
              </div>
              <div className="meta-item">
                <FaClock className="meta-icon" />
                <div>
                  <span className="meta-value">30-40 min</span>
                  <span className="meta-label">Delivery Time</span>
                </div>
              </div>
            </div>

            <div className="restaurant-details-row">
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{restaurant?.address?.city || 'Mumbai'}, {restaurant?.address?.state || 'Maharashtra'}</span>
              </div>
              <div className="detail-item">
                <FaRegClock className="detail-icon" />
                <span>Mon-Sun: 9:00 AM - 11:00 PM</span>
              </div>
              <div className="detail-item">
                <FaPhoneAlt className="detail-icon" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            {/* <div className="action-buttons">
              <button className="action-btn share">
                <FaShare /> Share
              </button>
              <button className="action-btn bookmark">
                <FaBookmark /> Save
              </button>
            </div> */}
          </div>
        </Container>
      </div>

      {/* Gallery Section */}
      <section className="gallery-section">
        <Container>
          <h2 className="section-title">Gallery</h2>
          <Row className="gallery-grid">
            <Col md={6} className="gallery-item gallery-main">
              <img src={restaurant?.images?.[1] || '/api/placeholder/600/400'} alt="Restaurant view" />
            </Col>
            <Col md={6}>
              <Row className="gallery-sub-grid">
                <Col sm={6} className="gallery-item">
                  <img src="https://media.istockphoto.com/id/1131393938/photo/very-stylish-indian-gourmet-restaurant.jpg" alt="Interior" />
                </Col>
                <Col sm={6} className="gallery-item">
                  <img src="https://cdn.pixabay.com/photo/2013/12/31/21/47/restaurant-237060_1280.jpg" alt="Dining area" />
                </Col>
                <Col sm={6} className="gallery-item">
                  <img src={restaurant?.images?.[2] || '/api/placeholder/300/200'} alt="Food" />
                </Col>
                <Col sm={6} className="gallery-item">
                  <img src={restaurant?.images?.[3] || '/api/placeholder/300/200'} alt="Ambience" />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content with Tabs */}
      <Container className="main-content">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <div className="content-header">
            <Nav variant="tabs" className="custom-tabs">
              <Nav.Item>
                <Nav.Link eventKey="menu">
                  <FaUtensils /> Menu
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="offers">
                  <MdLocalOffer /> Offers
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="info">
                  <FaInfoCircle /> Info
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <button className="filter-toggle" onClick={() => setShowFilter(!showFilter)}>
              <FaFilter /> Filter
            </button>
          </div>

          <Tab.Content>
            <Tab.Pane eventKey="menu">
              <Row>
                {/* Filter Sidebar */}
                <Col lg={3} className={`filter-sidebar ${showFilter ? 'show' : ''}`}>
                  <div className="filter-card">
                    <div className="filter-header">
                      <h5>Filter Options</h5>
                      { (foodType !== "all" || selectedCategory) && (
                        <button className="clear-filters" onClick={clearFilters}>
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Food Type Filter */}
                    <div className="filter-group">
                      <h6>
                        <FaLeaf /> Food Type
                      </h6>
                      <div className="filter-options">
                        {foodTypes.map((item) => (
                          <label key={item.value} className={`filter-chip ${foodType === item.value ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="food_type"
                              value={item.value}
                              checked={foodType === item.value}
                              onChange={handleFilter}
                            />
                            <span>{item.icon} {item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    {categoriesList.length > 0 && (
                      <div className="filter-group">
                        <h6>
                          <FaTag /> Food Category
                        </h6>
                        <div className="filter-options">
                          {categoriesList.map((item) => (
                            <label key={item} className={`filter-chip ${selectedCategory === item ? 'active' : ''}`}>
                              <input
                                type="radio"
                                name="food_category"
                                value={item}
                                checked={selectedCategory === item}
                                onChange={handleFilterCategory}
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Range Filter - Optional */}
                    <div className="filter-group">
                      <h6>Price Range</h6>
                      <div className="price-range">
                        <input type="range" min="0" max="1000" className="price-slider" />
                        <div className="price-labels">
                          <span>₹0</span>
                          <span>₹1000+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Menu Items Grid */}
                <Col lg={9}>
                  <div className="menu-header">
                    <h3>
                      Menu Items
                      <Badge className="item-count">{menuItems.length} items</Badge>
                    </h3>
                    <div className="sort-options">
                      <select className="sort-select">
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Popularity</option>
                      </select>
                    </div>
                  </div>

                  {menuLoading ? (
                    <div className="menu-loader">
                      <Spinner animation="border" variant="danger" />
                      <p>Loading menu...</p>
                    </div>
                  ) : menuItems.length > 0 ? (
                    <div className="menu-grid">
                      {menuItems.map((item, index) => (
                        <MenuCard key={item.id || index} item={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-menu">
                      <div className="empty-icon">🍽️</div>
                      <h4>No items found</h4>
                      <p>Try adjusting your filters or check back later for new items</p>
                      <button className="reset-btn" onClick={clearFilters}>Reset Filters</button>
                    </div>
                  )}
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="offers">
              <div className="offers-section">
                <h3>Available Offers</h3>
                <div className="offers-grid">
                  <div className="offer-card">
                    <div className="offer-icon">🎉</div>
                    <div className="offer-details">
                      <h4>20% OFF on first order</h4>
                      <p>Use code: FIRST20</p>
                      <span>Valid for new users</span>
                    </div>
                  </div>
                  <div className="offer-card">
                    <div className="offer-icon">🚚</div>
                    <div className="offer-details">
                      <h4>Free Delivery</h4>
                      <p>On orders above ₹199</p>
                      <span>Applicable on all items</span>
                    </div>
                  </div>
                  <div className="offer-card">
                    <div className="offer-icon">💳</div>
                    <div className="offer-details">
                      <h4>10% Cashback</h4>
                      <p>On card payments</p>
                      <span>Max ₹100</span>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="info">
              <div className="info-section">
                <Row>
                  <Col md={6}>
                    <div className="info-card">
                      <h4>About Restaurant</h4>
                      <p>{restaurant?.description || 'A premium dining experience offering authentic cuisine with a modern twist.'}</p>
                      <h4>Cuisines</h4>
                      <div className="cuisine-tags">
                        <span className="cuisine-tag">North Indian</span>
                        <span className="cuisine-tag">Chinese</span>
                        <span className="cuisine-tag">Continental</span>
                        <span className="cuisine-tag">Biryani</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info-card">
                      <h4>Opening Hours</h4>
                      <div className="hours-list">
                        <div className="hour-item">
                          <span>Monday - Friday</span>
                          <span>11:00 AM - 11:00 PM</span>
                        </div>
                        <div className="hour-item">
                          <span>Saturday - Sunday</span>
                          <span>9:00 AM - 12:00 AM</span>
                        </div>
                      </div>
                      <h4>Contact Information</h4>
                      <p>📞 +91 98765 43210</p>
                      <p>✉️ contact@restaurant.com</p>
                      <p>📍 {restaurant?.address?.city || 'Mumbai'}, {restaurant?.address?.state || 'Maharashtra'}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default RestaurantDetails;