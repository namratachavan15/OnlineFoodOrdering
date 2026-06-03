// LoginForm.js - Professional Redesign

import React, { useState } from 'react';
import { Button, Input, FormGroup, Label, Alert } from 'reactstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaApple, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Auth.css'

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(formData, navigate);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
      
      <div className="auth-card">
        <div className="auth-header">
        
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue to your account</p>
        </div>

        {error && (
          <Alert color="danger" className="auth-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <Label for="password" className="auth-label">
              <FaLock className="label-icon" />
              Password
            </Label>
            <div className="password-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input password-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </FormGroup>

          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <button type="button" className="forgot-password">
              Forgot Password?
            </button>
          </div>

          <Button 
            type="submit" 
            className="auth-btn auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </Button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
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
            Don't have an account?{" "}
            <button 
              className="auth-link" 
              onClick={() => navigate("/account/register")}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;