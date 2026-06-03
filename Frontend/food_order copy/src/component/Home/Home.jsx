// Home.jsx - Modern Professional Design

import React, { useEffect, useState } from 'react';
import './Home.css';
import MultiitemCarousel from './MultiitemCarousel';
import RestaurantCard from '../Restaurant/RestaurantCard';
import { useCart } from './../State/Cart/CartContext';
import { useRestaurantContext } from './../State/Restaurant/RestaurantContext';
import { 
  FaSearch, 
  FaFire, 
  FaStar, 
  FaTruck, 
  FaUserFriends, 
  FaArrowRight,
  FaUtensils,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Home = () => {
  const { cartItems, findCart } = useCart();
  const { restaurants, getAllRestaurants, loading, error } = useRestaurantContext();
  const jwt = localStorage.getItem("jwt");
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero banner slides
  const heroSlides = [
    {
      title: "Craving Something Special?",
      subtitle: "Discover the finest dishes from top restaurants",
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Fast Delivery to Your Doorstep",
      subtitle: "Hot & fresh food delivered in 30 minutes",
      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Exclusive Discounts Available",
      subtitle: "Get up to 50% off on your first order",
      bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  useEffect(() => {
    if (jwt) {
      if (cartItems.length === 0) {
        findCart(jwt);
      }
      if (restaurants.length === 0) {
        getAllRestaurants(jwt);
      }
    }
  }, [jwt]);

  // Filter restaurants based on search and category
const filteredRestaurants = restaurants.filter((restaurant) => {
  const matchesSearch =
    restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    activeCategory === 'all' ||
    restaurant.cuisineType?.toLowerCase() === activeCategory.toLowerCase();

  return matchesSearch && matchesCategory;
});

  const featuredRestaurants = restaurants.filter(r => r.isFeatured || r.rating >= 4.5).slice(0, 4);
 const popularCuisines = [
  ...new Set(
    restaurants
      .map(r => r.cuisineType)
      .filter(Boolean)
  )
];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-premium">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p>Discovering amazing restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-card">
          <span className="error-emoji">⚠️</span>
          <h3>Something went wrong</h3>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()} className="retry-btn-premium">
            Try Again <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-premium">
      {/* Hero Section with Carousel */}
      <section className="hero-premium">
        <div className="hero-slideshow">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.bg }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content-premium">
                <div className="hero-badge">✨ Premium Food Delivery</div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                  <button className="hero-btn-primary" onClick={() => {
                    document.getElementById('restaurant-section').scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Order Now <FaArrowRight />
                  </button>
                  <button className="hero-btn-secondary">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="slide-nav prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="slide-nav next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
          <div className="slide-dots">
            {heroSlides.map((_, index) => (
              <button 
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-premium">
        <div className="container-premium">
          <div className="stats-grid">
            <div className="stat-card-premium">
              <div className="stat-icon">🍽️</div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Restaurants</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-icon">⏱️</div>
              <div className="stat-number">30 min</div>
              <div className="stat-label">Avg Delivery</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-icon">❤️</div>
              <div className="stat-number">10k+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card-premium">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">4.8</div>
              <div className="stat-label">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="search-section-premium">
        <div className="container-premium">
          <div className="search-wrapper-premium">
            {/* <div className="search-box-premium">
              <FaSearch className="search-icon-premium" />
              <input 
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-premium"
              />
              {searchTerm && (
                <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div> */}
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            <button 
              className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {popularCuisines.slice(0, 8).map(cuisine => (
              <button 
                key={cuisine}
                className={`filter-chip ${activeCategory === cuisine ? 'active' : ''}`}
                onClick={() => setActiveCategory(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="featured-section-premium">
          <div className="container-premium">
            <div className="section-header-premium">
              <div className="header-left">
                <FaFire className="header-icon featured" />
                <h2>Featured Restaurants</h2>
              </div>
              <button className="view-all-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                View All <FaArrowRight />
              </button>
            </div>
            <div className="featured-grid">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} item={restaurant} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Meals Carousel */}
      <section className="carousel-section-premium">
        <div className="container-premium">
          <div className="section-header-premium">
            <div className="header-left">
              <FaUtensils className="header-icon" />
              <h2>Popular Dishes</h2>
            </div>
            <button className="view-all-btn">
              Explore Menu <FaArrowRight />
            </button>
          </div>
          <MultiitemCarousel />
        </div>
      </section>

      {/* All Restaurants Grid */}
      <section id="restaurant-section" className="restaurant-section-premium">
        <div className="container-premium">
          <div className="section-header-premium">
            <div className="header-left">
              <FaStar className="header-icon" />
              <h2>All Restaurants</h2>
            </div>
            <div className="results-count">
              {filteredRestaurants.length} restaurants found
            </div>
          </div>

          {filteredRestaurants.length > 0 ? (
            <>
              <div className="restaurant-grid-premium">
                {filteredRestaurants.map((item, index) => (
                  <RestaurantCard key={item.id || index} item={item} />
                ))}
              </div>
              
              {/* Load More Button */}
              {filteredRestaurants.length > 12 && (
                <div className="load-more-container">
                  <button className="load-more-btn">
                    Load More Restaurants <FaArrowRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state-premium">
              <div className="empty-illustration">🔍</div>
              <h3>No restaurants found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="reset-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-premium">
        <div className="container-premium">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Get Exclusive Offers</h3>
              <p>Subscribe to receive special discounts and updates</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;