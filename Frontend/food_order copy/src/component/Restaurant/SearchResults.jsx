import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaUtensils, FaSpinner, FaSort, FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import RestaurantCardSearch from "./RestaurantCardSearch";
import { API_URI } from "../Config/api";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${API_URI}/api/restaurants/search?keyword=${query}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, jwt]);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price_low") return (a.priceLevel || 2) - (b.priceLevel || 2);
    if (sortBy === "price_high") return (b.priceLevel || 2) - (a.priceLevel || 2);
    return 0;
  });

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Top Rated" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" }
  ];

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : "Relevance";
  };

  return (
    <div className="search-results-premium">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="search-hero-content">
          <div className="search-icon-large">
            <FaSearch />
          </div>
          <h1>Search Results</h1>
          <p>Showing results for <span className="search-query">“{query}”</span></p>
        </div>
      </div>

      <div className="search-container-simple">
        {/* Results Section */}
        <div className="search-results-content-simple">
          {/* Results Header */}
          <div className="results-header-simple">
            <div className="results-count">
              <FaUtensils />
              <span>{sortedResults.length} {sortedResults.length === 1 ? 'restaurant found' : 'restaurants found'}</span>
            </div>
            
            <div className="sort-section-simple">
              <label className="sort-label">Sort by:</label>
              <div className="custom-select-wrapper">
                <button 
                  className="custom-select-trigger"
                  onClick={() => setShowSortMenu(!showSortMenu)}
                >
                  <FaSort /> {getSortLabel()}
                </button>
                {showSortMenu && (
                  <div className="custom-select-menu">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        className={`custom-select-item ${sortBy === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="search-loading">
              <FaSpinner className="spinning" />
              <p>Searching for restaurants...</p>
            </div>
          )}

          {/* Results Grid */}
          {!loading && sortedResults.length > 0 && (
            <div className="results-grid-simple">
              {sortedResults.map((restaurant) => (
                <RestaurantCardSearch key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedResults.length === 0 && (
            <div className="empty-search-state">
              <div className="empty-icon">🔍</div>
              <h3>No restaurants found</h3>
              <p>We couldn't find any restaurants matching "{query}"</p>
              <button className="try-again-btn" onClick={() => window.history.back()}>
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;