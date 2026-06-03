import React, { useState } from 'react';
import { IoMdCalendar, IoMdTime, IoMdPin, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { FaTag } from 'react-icons/fa';
import './Events.css';

const EventCard = ({ event }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isEventActive = () => {
    const now = new Date();
    const start = new Date(event.startedAt);
    const end = new Date(event.endsAt);
    return now >= start && now <= end;
  };

  const isUpcoming = () => {
    const now = new Date();
    const start = new Date(event.startedAt);
    return now < start;
  };

  const getEventStatus = () => {
    if (isEventActive()) return { label: 'Active', className: 'status-active' };
    if (isUpcoming()) return { label: 'Upcoming', className: 'status-upcoming' };
    return { label: 'Ended', className: 'status-ended' };
  };

  const status = getEventStatus();
console.log("Event Image:", event.image);
  return (
    <div className="event-card-premium">
      <div className="event-card-image-wrapper">
        {!imageLoaded && <div className="event-image-skeleton"></div>}
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'} 
          alt={event.name}
          className={`event-card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className={`event-status-badge ${status.className}`}>
          {status.label}
        </div>
        <button 
          className="event-like-btn"
          onClick={() => setIsLiked(!isLiked)}
        >
          {isLiked ? <IoMdHeart className="liked" /> : <IoMdHeartEmpty />}
        </button>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.name}</h3>
        
        {event.description && (
          <p className="event-card-description">
            {event.description.length > 100 
              ? `${event.description.substring(0, 100)}...` 
              : event.description}
          </p>
        )}
        
        <div className="event-details-list">
          <div className="event-detail-item">
            <div className="detail-icon location">
              <IoMdPin />
            </div>
            <div className="detail-info">
              <span className="detail-label">Location</span>
              <span className="detail-value">{event.location || 'Online Event'}</span>
            </div>
          </div>
          
          <div className="event-detail-item">
            <div className="detail-icon date">
              <IoMdCalendar />
            </div>
            <div className="detail-info">
              <span className="detail-label">Date</span>
              <span className="detail-value">
                {formatDate(event.startedAt)}
              </span>
            </div>
          </div>
          
          <div className="event-detail-item">
            <div className="detail-icon time">
              <IoMdTime />
            </div>
            <div className="detail-info">
              <span className="detail-label">Time</span>
              <span className="detail-value">
                {formatTime(event.startedAt)} - {formatTime(event.endsAt)}
              </span>
            </div>
          </div>
        </div>
        
        {status.label === 'Active' && (
          <div className="event-offer-badge">
            <FaTag />
            <span>Special Offer Available</span>
          </div>
        )}
        
       
      </div>
    </div>
  );
};

export default EventCard;