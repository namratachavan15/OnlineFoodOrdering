// UserProfile.js - Professional Redesign

import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaEdit, 
  FaShoppingBag, 
  FaHeart, 
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { useOrderContext } from '../State/Order/OrderContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

const { orders } = useOrderContext();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleLogout = () => logout(navigate);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    // Here you would call API to update user profile
    console.log('Updated profile:', editForm);
    setEditModalOpen(false);
  };

  // Mock stats - replace with actual data from API
  const userStats = {
  totalOrders: orders?.length || 0,

  totalSpent:
    orders?.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    ) || 0,

  favoritesCount: user?.favorites?.length || 0,

  savedAddresses: user?.address?.length || 0,
};

  return (
    <div className="user-profile-container">
      <div className="profile-card-enhanced">
        {/* Cover Image */}
        <div className="profile-cover-enhanced">
          <div className="cover-overlay"></div>
          <div className="cover-badge">
            <MdDeliveryDining /> Premium Member
          </div>
        </div>

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            {user?.fullName ? (
              <div className="avatar-text">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
            <button className="edit-avatar-btn" onClick={() => setEditModalOpen(true)}>
              <FaEdit />
            </button>
          </div>
          <div className="profile-status">
            <span className="status-dot"></span>
            Active Now
          </div>
        </div>

        {/* User Info */}
        <div className="profile-info-enhanced">
          <h1 className="profile-name-enhanced">
            {user?.fullName || "Anonymous User"}
          </h1>
          <p className="profile-email">
            <FaEnvelope /> {user?.email || "Not Available"}
          </p>
          <p className="profile-phone">
            <FaPhone /> {user?.phone || "+91 98765 43210"}
          </p>
          <p className="profile-joined">
            <FaCalendarAlt /> Joined January 2024
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card-enhanced">
            <div className="stat-icon orders">
              <FaShoppingBag />
            </div>
            <div className="stat-info">
              <span className="stat-value">{userStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card-enhanced">
            <div className="stat-icon spent">
              <span>₹</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{userStats.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
          <div className="stat-card-enhanced">
            <div className="stat-icon favorites">
              <FaHeart />
            </div>
            <div className="stat-info">
              <span className="stat-value">{userStats.favoritesCount}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
          <div className="stat-card-enhanced">
            <div className="stat-icon addresses">
              <FaMapMarkerAlt />
            </div>
            <div className="stat-info">
              <span className="stat-value">{userStats.savedAddresses}</span>
              <span className="stat-label">Addresses</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => setEditModalOpen(true)}
          >
            <FaEdit /> Edit Profile
          </button>
          <button 
            className="action-btn logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🍕</div>
              <div className="activity-details">
                <p className="activity-title">Ordered from Pizza Hut</p>
                <p className="activity-time">2 days ago</p>
              </div>
              <span className="activity-status delivered">Delivered</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🍔</div>
              <div className="activity-details">
                <p className="activity-title">Added Burger King to favorites</p>
                <p className="activity-time">5 days ago</p>
              </div>
              <span className="activity-status favorite">Favorite</span>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏠</div>
              <div className="activity-details">
                <p className="activity-title">Added new delivery address</p>
                <p className="activity-time">1 week ago</p>
              </div>
              <span className="activity-status address">Address</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} toggle={() => setEditModalOpen(false)} className="edit-profile-modal">
        <ModalHeader toggle={() => setEditModalOpen(false)}>
          <div className="modal-title">
            <FaEdit /> Edit Profile
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={editForm.fullName}
              onChange={handleEditChange}
              placeholder="Enter your full name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Enter your email"
              disabled
            />
            <small className="text-muted">Email cannot be changed</small>
          </FormGroup>
          <FormGroup>
            <Label for="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleEditSubmit} style={{ backgroundColor: '#E91E63', border: 'none' }}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserProfile;