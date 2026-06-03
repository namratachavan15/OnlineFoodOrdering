// Cart.js - Professional Redesign with Fixed Missing States

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, FormGroup, Card, Row, Col, Spinner, Alert, Badge } from 'reactstrap';
import AddressCart from './AddressCart';
import CartItem from './CartItem';
import { FaLocationArrow, FaCreditCard, FaWallet, FaCashRegister, FaTrash, FaArrowLeft, FaTag, FaGift, FaMapMarkerAlt, FaBriefcase, FaHome, FaMailBulk, FaMapPin, FaCity, FaUser, FaPhoneAlt } from 'react-icons/fa';
import { MdDeliveryDining, MdLocalOffer } from 'react-icons/md';
import { AiFillSecurityScan } from 'react-icons/ai';
import './Cart.css';
import { useCart } from '../State/Cart/CartContext';
import { useOrderContext } from './../State/Order/OrderContext';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRestaurantContext } from '../State/Restaurant/RestaurantContext';

const Cart = () => {
  const [open, setOpen] = React.useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [addressType, setAddressType] = useState("home"); // Added missing state
  const [setAsDefault, setSetAsDefault] = useState(false); // Added missing state
  const [formData, setFormData] = React.useState({
    streetAddress: '',
    state: '',
    pincode: '',
    city: '',
    fullName: '',
    phoneNumber: '',
  });

  const handleOpenAddressModel = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { cartItems, clearCart, cart, findCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrderContext();
  const { restaurant } = useRestaurantContext();
  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      findCart(jwt);
    }
  }, [jwt]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAddress = {
      id: Date.now(),
      ...formData,
      fullName: formData.fullName || user?.fullName,
      addressType: addressType,
      isDefault: setAsDefault,
    };
    
    // In real app, save to backend
    console.log("Address saved:", newAddress);
    setSelectedAddress(newAddress);
    setSavingAddress(false);
    handleClose();
    
    // Reset form after save
    setFormData({
      streetAddress: '',
      state: '',
      pincode: '',
      city: '',
      fullName: '',
      phoneNumber: '',
    });
    setAddressType("home");
    setSetAsDefault(false);
  };

  const handleApplyPromo = () => {
    if (promoCode === "SAVE20") {
      setPromoApplied(true);
    } else {
      alert("Invalid promo code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setOrderPlacing(true);
    
   const orderData = {
  restaurantId: restaurant?.id,
  deliveryAddress: {
    fullName: selectedAddress.fullName || user?.fullName,
    streetAddress: selectedAddress.streetAddress,
    city: selectedAddress.city,
    state: selectedAddress.state,
    postalCode: selectedAddress.pincode,
    country: "India",
    phoneNumber: selectedAddress.phoneNumber || user?.phoneNumber,
  },

  cartItems: cart?.items || cartItems,

  paymentMethod,

  promoCode: promoApplied ? promoCode : null,

  deliveryFee,
  packingCharge,
  gstCharge,
  discount,
  totalAmount: totalPay,
};
    try {
      await createOrder({ order: orderData, jwt });
      await clearCart(jwt);
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setOrderPlacing(false);
    }
  };

  // Calculate totals
  const itemsTotal = cart?.totalPrice || cartItems?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;
  const deliveryFee = itemsTotal > 0 ? (itemsTotal > 500 ? 0 : 39) : 0;
  const packingCharge = itemsTotal > 0 ? 20 : 0;
  const gstCharge = itemsTotal > 0 ? Math.round(itemsTotal * 0.05) : 0;
  const discount = promoApplied ? Math.round(itemsTotal * 0.2) : 0;
  const totalPay = itemsTotal > 0 ? itemsTotal + deliveryFee + packingCharge + gstCharge - discount : 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet</p>
          <Button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <h1>Shopping Cart</h1>
          <span className="item-count">{cartItems.length} items</span>
        </div>

        <div className="cart-grid">
          {/* Left Column - Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <CartItem key={item.id || index} item={item} />
              ))}
            </div>

            {/* Promo Code */}
            <div className="promo-section">
              <div className="promo-input-group">
                <FaTag className="promo-icon" />
                <input
                  type="text"
                  placeholder="Apply promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                {!promoApplied ? (
                  <button onClick={handleApplyPromo}>Apply</button>
                ) : (
                  <Badge color="success" className="promo-applied">
                    SAVE20 Applied!
                  </Badge>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="special-instructions-section">
              <textarea
                placeholder="Add special instructions for the restaurant (optional)"
                className="special-instructions-textarea"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                <div className="summary-row">
                  <span>Item Total</span>
                  <span>₹{itemsTotal.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Packing Charge</span>
                  <span>₹{packingCharge}</span>
                </div>
                <div className="summary-row">
                  <span>GST (5%)</span>
                  <span>₹{gstCharge}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Promo Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{totalPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="delivery-info">
                <MdDeliveryDining />
                <span>Free delivery on orders above ₹500</span>
              </div>
            </div>

            {/* Address Selection */}
            <div className="address-card">
              <h3>Delivery Address</h3>
              
              {selectedAddress ? (
                <div className="selected-address">
                  <div className="address-details">
                    <p className="address-name">{selectedAddress.fullName}</p>
                    <p className="address-line">{selectedAddress.streetAddress}</p>
                    <p className="address-line">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="address-phone">📞 {selectedAddress.phoneNumber}</p>
                    {selectedAddress.isDefault && (
                      <Badge color="primary" className="default-badge">Default</Badge>
                    )}
                  </div>
                  <button className="change-address-btn" onClick={handleOpenAddressModel}>
                    Change
                  </button>
                </div>
              ) : (
                <button className="add-address-btn" onClick={handleOpenAddressModel}>
                  <FaLocationArrow /> Add Delivery Address
                </button>
              )}
            </div>

            {/* Payment Methods */}
            <div className="payment-card">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <FaCreditCard />
                  <span>Credit/Debit Card</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'wallet' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <FaWallet />
                  <span>Wallet</span>
                </label>
                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <FaCashRegister />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <Button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || orderPlacing}
            >
              {orderPlacing ? (
                <>
                  <Spinner size="sm" /> Placing Order...
                </>
              ) : (
                <>
                  <FaCreditCard /> Proceed to Payment • ₹{totalPay.toLocaleString()}
                </>
              )}
            </Button>

            <div className="security-note">
              <AiFillSecurityScan />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal - Professional Design */}
      <Modal 
        isOpen={open} 
        toggle={handleClose} 
        className="address-modal"
        backdrop="static"
        size="md"
      >
        <div className="address-modal-container">
          <div className="address-modal-header">
            <div className="modal-header-icon">
              <FaLocationArrow />
            </div>
            <h3>Add Delivery Address</h3>
            <button className="modal-close-btn" onClick={handleClose}>
              <span>×</span>
            </button>
          </div>
          
          <Form onSubmit={handleAddAddress}>
            <div className="address-modal-body">
              {/* Progress Indicator */}
              <div className="address-progress">
                <div className="progress-step active">
                  <span>1</span>
                  <label>Personal Info</label>
                </div>
                <div className="progress-line"></div>
                <div className="progress-step">
                  <span>2</span>
                  <label>Address Details</label>
                </div>
              </div>

              <div className="form-sections">
                {/* Personal Information Section */}
                <div className="form-section">
                  <h4 className="section-title">
                    <FaUser className="section-icon" />
                    Personal Information
                  </h4>
                  <div className="form-row">
                    <FormGroup className="form-group-custom">
                      <label className="form-label">Full Name *</label>
                      <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <Input
                          type="text"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </FormGroup>
                    
                    <FormGroup className="form-group-custom">
                      <label className="form-label">Phone Number *</label>
                      <div className="input-wrapper">
                        <FaPhoneAlt className="input-icon" />
                        <Input
                          type="tel"
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          value={formData.phoneNumber}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </FormGroup>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="form-section">
                  <h4 className="section-title">
                    <FaMapMarkerAlt className="section-icon" />
                    Address Information
                  </h4>
                  
                  <FormGroup className="form-group-custom">
                    <label className="form-label">Street Address *</label>
                    <div className="input-wrapper">
                      <FaHome className="input-icon" />
                      <Input
                        type="text"
                        name="streetAddress"
                        placeholder="House number, street name"
                        value={formData.streetAddress}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </FormGroup>

                  <div className="form-row">
                    <FormGroup className="form-group-custom">
                      <label className="form-label">City *</label>
                      <div className="input-wrapper">
                        <FaCity className="input-icon" />
                        <Input
                          type="text"
                          name="city"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </FormGroup>
                    
                    <FormGroup className="form-group-custom">
                      <label className="form-label">State *</label>
                      <div className="input-wrapper">
                        <FaMapPin className="input-icon" />
                        <Input
                          type="text"
                          name="state"
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                    </FormGroup>
                  </div>

                  <FormGroup className="form-group-custom">
                    <label className="form-label">Pincode *</label>
                    <div className="input-wrapper">
                      <FaMailBulk className="input-icon" />
                      <Input
                        type="text"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={handleFormChange}
                        required
                        maxLength="6"
                      />
                    </div>
                  </FormGroup>

                  {/* Address Type Selection */}
                  <div className="address-type-section">
                    <label className="form-label">Address Type</label>
                    <div className="address-type-buttons">
                      <button 
                        type="button" 
                        className={`address-type-btn ${addressType === 'home' ? 'active' : ''}`}
                        onClick={() => setAddressType('home')}
                      >
                        <FaHome /> Home
                      </button>
                      <button 
                        type="button" 
                        className={`address-type-btn ${addressType === 'work' ? 'active' : ''}`}
                        onClick={() => setAddressType('work')}
                      >
                        <FaBriefcase /> Work
                      </button>
                      <button 
                        type="button" 
                        className={`address-type-btn ${addressType === 'other' ? 'active' : ''}`}
                        onClick={() => setAddressType('other')}
                      >
                        <FaMapMarkerAlt /> Other
                      </button>
                    </div>
                  </div>
                </div>

                {/* Default Address Checkbox */}
                <div className="default-address-checkbox">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={setAsDefault} 
                      onChange={(e) => setSetAsDefault(e.target.checked)} 
                    />
                    <span className="checkbox-custom"></span>
                    Set as default delivery address
                  </label>
                </div>
              </div>
            </div>
            
            <div className="address-modal-footer">
              <Button type="button" className="modal-cancel-btn" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="modal-save-btn" disabled={savingAddress}>
                {savingAddress ? (
                  <>
                    <Spinner size="sm" className="btn-spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <FaLocationArrow /> Save Address
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;