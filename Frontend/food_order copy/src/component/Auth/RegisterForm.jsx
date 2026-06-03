// RegisterForm.js - Professional Redesign

import React, { useState } from 'react';
import { Button, Input, FormGroup, Label, Alert } from 'reactstrap';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTag, FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
      phone: "",
    confirmPassword: "",
    role: "ROLE_CUSTOMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthText = () => {
    const texts = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength] || '';
  };

  const getStrengthColor = () => {
    const colors = ['', '#ff4444', '#ffa444', '#ffd444', '#00c851'];
    return colors[passwordStrength] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   if (
  !formData.fullName ||
  !formData.email ||
  !formData.phone ||
  !formData.password
) {
  setError("Please fill in all required fields");
  return;
}
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    try {
      await register(formData, navigate);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
      </div>
      
      <div className="auth-card auth-card-register">
        <div className="auth-header">
         
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us and start ordering delicious food</p>
        </div>

        {error && (
          <Alert color="danger" className="auth-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <FormGroup>
            <Label for="fullName" className="auth-label">
              <FaUser className="label-icon" />
              Full Name
            </Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="auth-input"
              autoComplete="name"
            />
          </FormGroup>

          <FormGroup>
            <Label for="email" className="auth-label">
              <FaEnvelope className="label-icon" />
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              autoComplete="email"
            />
          </FormGroup>
<FormGroup>
  <Label for="phone" className="auth-label">
    📱 Mobile Number
  </Label>

  <Input
    type="tel"
    id="phone"
    name="phone"
    placeholder="Enter mobile number"
    value={formData.phone}
    onChange={handleChange}
    className="auth-input"
  />
</FormGroup>
          <FormGroup>
            <Label for="password" className="auth-label">
              <FaLock className="label-icon" />
              Password
            </Label>
            <div className="password-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input password-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength / 4) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: getStrengthColor() }}>
                  {getStrengthText()}
                </span>
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="confirmPassword" className="auth-label">
              <FaLock className="label-icon" />
              Confirm Password
            </Label>
            <div className="password-wrapper">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="auth-input password-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </FormGroup>

   

          <Button 
            type="submit" 
            className="auth-btn auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>Create Account</>
            )}
          </Button>
        </form>

        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn google">
            <FaGoogle /> Google
          </button>
          <button className="social-btn facebook">
            <FaFacebookF /> Facebook
          </button>
          <button className="social-btn apple">
            <FaApple /> Apple
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button 
              className="auth-link" 
              onClick={() => navigate("/account/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;