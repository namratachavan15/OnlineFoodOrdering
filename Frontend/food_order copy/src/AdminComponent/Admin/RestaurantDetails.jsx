import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { 
  FaInstagram, 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaStore, 
  FaUser, 
  FaUtensils, 
  FaClock, 
  FaMapMarkerAlt, 
  FaCity, 
  FaFlag, 
  FaMailBulk, 
  FaPhone, 
  FaShareAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';
import { IoMdLocate, IoMdPin, IoMdRestaurant } from 'react-icons/io';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import { useNavigate } from "react-router-dom";
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { usersRestaurant, updateRestaurantStatus, loading } = useRestaurantContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    if (usersRestaurant) {
      console.log("Restaurant", usersRestaurant);
    }
  }, [usersRestaurant]);

  const handleRestaurantStatus = async () => {
    setIsUpdating(true);
    try {
      await updateRestaurantStatus({
        restaurantId: usersRestaurant.id,
        jwt: localStorage.getItem("jwt")
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="restaurant-details-premium">
      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast-restaurant">
          <FaCheckCircle />
          <span>Restaurant status updated successfully!</span>
        </div>
      )}

      {/* Header Section */}
      <div className="restaurant-header-premium">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="restaurant-icon-large">
            <IoMdRestaurant />
          </div>
          <div className="restaurant-title-section">
            <h1>{usersRestaurant?.name || 'Restaurant Name'}</h1>
            <p className="restaurant-cuisine">{usersRestaurant?.cuisineType || 'Multi-cuisine'}</p>
          </div>
          <div className="header-actions">
            {/* <button className="share-btn" onClick={copyToClipboard}>
              <FaShareAlt /> Share
            </button> */}
            <button 
              className={`status-toggle-btn ${usersRestaurant?.open ? 'open' : 'closed'}`}
              onClick={handleRestaurantStatus}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <FaSpinner className="spinning" />
              ) : (
                <>
                  {usersRestaurant?.open ? <FaTimesCircle /> : <FaCheckCircle />}
                  {usersRestaurant?.open ? 'Close Restaurant' : 'Open Restaurant'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="restaurant-stats-premium">
        <div className="stat-card-premium">
          <div className="stat-icon status">
            {usersRestaurant?.open ? <FaCheckCircle /> : <FaTimesCircle />}
          </div>
          <div className="stat-info">
            <span className="stat-label">Current Status</span>
            <span className={`stat-value status-${usersRestaurant?.open ? 'open' : 'closed'}`}>
              {usersRestaurant?.open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon orders">
            <FaUtensils />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{usersRestaurant?.totalOrders || 0}</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon rating">
            ⭐
          </div>
          <div className="stat-info">
            <span className="stat-label">Rating</span>
            <span className="stat-value">{usersRestaurant?.rating || 4.5}</span>
          </div>
        </div>
        <div className="stat-card-premium">
          <div className="stat-icon since">
            <FaClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Since</span>
            <span className="stat-value">
              {usersRestaurant?.registrationDate 
                ? new Date(usersRestaurant.registrationDate).getFullYear() 
                : '2024'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="restaurant-content-grid">
        {/* Restaurant Info Card */}
        <div className="info-card premium">
          <div className="card-header-premium">
            <div className="header-icon">
              <FaStore />
            </div>
            <h3>Restaurant Information</h3>
          </div>
          <div className="card-body-premium">
            <div className="info-row">
              <div className="info-label">
                <FaUser className="label-icon" />
                Owner Name
              </div>
              <div className="info-value">{usersRestaurant?.owner?.fullName || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FaStore className="label-icon" />
                Restaurant Name
              </div>
              <div className="info-value">{usersRestaurant?.name || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FaUtensils className="label-icon" />
                Cuisine Type
              </div>
              <div className="info-value">{usersRestaurant?.cuisineType || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FaClock className="label-icon" />
                Opening Hours
              </div>
              <div className="info-value">{usersRestaurant?.openingHours || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="info-card premium">
          <div className="card-header-premium">
            <div className="header-icon address">
              <FaMapMarkerAlt />
            </div>
            <h3>Location Details</h3>
          </div>
          <div className="card-body-premium">
            <div className="info-row">
              <div className="info-label">
                <FaFlag className="label-icon" />
                Country
              </div>
              <div className="info-value">{usersRestaurant?.address?.country || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FaCity className="label-icon" />
                City
              </div>
              <div className="info-value">{usersRestaurant?.address?.city || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <IoMdLocate className="label-icon" />
                Postal Code
              </div>
              <div className="info-value">{usersRestaurant?.address?.postalCode || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <IoMdPin className="label-icon" />
                Street Address
              </div>
              <div className="info-value">{usersRestaurant?.address?.streetAddress || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="info-card premium">
          <div className="card-header-premium">
            <div className="header-icon contact">
              <FaPhone />
            </div>
            <h3>Contact Information</h3>
          </div>
          <div className="card-body-premium">
            <div className="info-row">
              <div className="info-label">
                <FaMailBulk className="label-icon" />
                Email
              </div>
              <div className="info-value email">{usersRestaurant?.contactInformation?.email || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FaPhone className="label-icon" />
                Mobile
              </div>
              <div className="info-value">{usersRestaurant?.contactInformation?.mobile || 'N/A'}</div>
            </div>
            <div className="info-row social-row">
              <div className="info-label">Social Media</div>
              <div className="social-links">
                {usersRestaurant?.contactInformation?.instagram && (
                  <a href={usersRestaurant.contactInformation.instagram} target="_blank" rel="noreferrer" className="social-link instagram">
                    <FaInstagram />
                  </a>
                )}
                {usersRestaurant?.contactInformation?.twitter && (
                  <a href={usersRestaurant.contactInformation.twitter} target="_blank" rel="noreferrer" className="social-link twitter">
                    <FaTwitter />
                  </a>
                )}
                {usersRestaurant?.contactInformation?.facebook && (
                  <a href={usersRestaurant.contactInformation.facebook} target="_blank" rel="noreferrer" className="social-link facebook">
                    <FaFacebook />
                  </a>
                )}
                {usersRestaurant?.contactInformation?.linklined && (
                  <a href={usersRestaurant.contactInformation.linklined} target="_blank" rel="noreferrer" className="social-link linkedin">
                    <FaLinkedin />
                  </a>
                )}
                {!usersRestaurant?.contactInformation?.instagram && 
                 !usersRestaurant?.contactInformation?.twitter && 
                 !usersRestaurant?.contactInformation?.facebook && 
                 !usersRestaurant?.contactInformation?.linklined && (
                  <span className="no-social">No social links added</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="info-card premium quick-actions">
          <div className="card-header-premium">
            <div className="header-icon actions">
              <FaShareAlt />
            </div>
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body-premium">
           <button
  className="quick-action-btn"
  onClick={() => navigate('/admin/restaurant/menu')}
>
  <FaUtensils /> Manage Menu
</button>
           <button
  className="quick-action-btn"
  onClick={() => navigate('/admin/restaurant/orders')}
>
  <FaClock /> View Orders
</button>

<button
  className="quick-action-btn"
  onClick={() => navigate('/admin/restaurant/event')}
>
  <FaShareAlt /> Manage Events
</button>
          </div>
        </div>
      </div>

      {/* Opening Hours Bar */}
      <div className="opening-hours-bar">
        <div className="hours-icon">
          <FaClock />
        </div>
        <div className="hours-text">
          <span className="hours-label">Operating Hours:</span>
          <span className="hours-value">{usersRestaurant?.openingHours || 'Mon-Sun: 9:00 AM - 11:00 PM'}</span>
        </div>
        <div className={`status-indicator ${usersRestaurant?.open ? 'open' : 'closed'}`}>
          {usersRestaurant?.open ? 'Accepting Orders' : 'Currently Closed'}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;