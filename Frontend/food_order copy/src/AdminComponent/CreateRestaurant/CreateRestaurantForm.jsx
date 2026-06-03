import React, { useState } from 'react';
import {
  Button, Form, FormGroup, Label, Input, Row, Col, Spinner
} from 'reactstrap';
import { 
  AiOutlinePlusCircle, 
  AiOutlineCloseCircle, 
  AiOutlineCloudUpload,
  AiOutlineCheckCircle 
} from 'react-icons/ai';
import { 
  FaUtensils, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaInstagram, 
  FaTwitter,
  FaClock,
  FaStore,
  FaImage
} from 'react-icons/fa';
import { uploadImageToCloud } from '../../util/UploadToCloudary';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import './CreateRestaurantForm.css';

const CreateRestaurantForm = () => {
  const [uploadImage, setUploadImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [formValues, setFormValues] = useState({
    name: "", 
    description: "", 
    cuisineType: "",
    streetAddress: "", 
    city: "", 
    stateProvider: "",
    postalCode: "", 
    country: "", 
    email: "",
    mobile: "", 
    twitter: "", 
    instagram: "",
    openingHours: "Mon-Sun : 9:00 AM - 12:00 PM",
    images: []
  });

  const jwt = localStorage.getItem("jwt");
  const { createRestaurant } = useRestaurantContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadImage(true);
    const image = await uploadImageToCloud(file);
    setFormValues(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formValues.images];
    updatedImages.splice(index, 1);
    setFormValues(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      name: formValues.name,
      description: formValues.description,
      cuisineType: formValues.cuisineType,
      address: {
        streetAddress: formValues.streetAddress,
        city: formValues.city,
        stateProvider: formValues.stateProvider,
        postalCode: formValues.postalCode,
        country: formValues.country
      },
      contactInformation: {
        email: formValues.email,
        mobile: formValues.mobile,
        twitter: formValues.twitter,
        instagram: formValues.instagram,
      },
      open: 1,
      openingHours: formValues.openingHours,
      images: formValues.images,
    };
    
    try {
      await createRestaurant(data, { token: jwt });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        // Reset form or redirect
      }, 3000);
    } catch (error) {
      console.error("Error creating restaurant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <FaStore /> },
    { id: 'location', label: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 'contact', label: 'Contact', icon: <FaPhone /> }
  ];

  return (
    <div className="create-restaurant-container">
      <div className="form-header-premium">
        <div className="header-icon-wrapper">
          <FaUtensils />
        </div>
        <h1>Add New Restaurant</h1>
        <p>Fill in the details below to register your restaurant</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="success-message-premium">
          <AiOutlineCheckCircle />
          <span>Restaurant created successfully!</span>
        </div>
      )}

      <div className="form-wrapper-premium">
        {/* Section Navigation */}
        <div className="section-nav-premium">
          {sections.map(section => (
            <button
              key={section.id}
              className={`section-nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <Form onSubmit={handleSubmit} className="restaurant-form-premium">
          {/* Basic Information Section */}
          <div className={`form-section ${activeSection === 'basic' ? 'active' : 'hidden'}`}>
            <div className="section-title-premium">
              <FaStore />
              <h3>Basic Information</h3>
            </div>

            {/* Image Upload Section - Premium */}
            <div className="image-upload-section-premium">
              <Label className="image-upload-label">
                <FaImage className="label-icon" />
                Restaurant Images
              </Label>
              <div className="image-grid-premium">
                <label htmlFor="fileInput" className="upload-box-premium">
                  <div className="upload-content">
                    <AiOutlineCloudUpload size={32} />
                    <span>Upload Image</span>
                    <small>PNG, JPG up to 5MB</small>
                  </div>
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {uploadImage && (
                  <div className="upload-loading">
                    <Spinner size="sm" color="primary" />
                    <span>Uploading...</span>
                  </div>
                )}
                {formValues.images.map((img, idx) => (
                  <div key={idx} className="image-preview-premium">
                    <img src={img} alt={`restaurant-${idx}`} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="remove-image-btn"
                    >
                      <AiOutlineCloseCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="name" className="form-label-premium">
                    Restaurant Name <span className="required">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter restaurant name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="cuisineType" className="form-label-premium">
                    Cuisine Type <span className="required">*</span>
                  </Label>
                  <Input
                    id="cuisineType"
                    name="cuisineType"
                    placeholder="e.g., Italian, Chinese, Indian"
                    value={formValues.cuisineType}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label for="description" className="form-label-premium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="textarea"
                    rows="3"
                    placeholder="Describe your restaurant, specialties, and ambiance..."
                    value={formValues.description}
                    onChange={handleInputChange}
                    className="form-textarea-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label for="openingHours" className="form-label-premium">
                    <FaClock className="label-icon" />
                    Opening Hours
                  </Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    placeholder="e.g., Mon-Sun : 9:00 AM - 12:00 PM"
                    value={formValues.openingHours}
                    onChange={handleInputChange}
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>

          {/* Location Section */}
          <div className={`form-section ${activeSection === 'location' ? 'active' : 'hidden'}`}>
            <div className="section-title-premium">
              <FaMapMarkerAlt />
              <h3>Location Details</h3>
            </div>

            <Row form>
              <Col md={12}>
                <FormGroup>
                  <Label for="streetAddress" className="form-label-premium">
                    Street Address <span className="required">*</span>
                  </Label>
                  <Input
                    id="streetAddress"
                    name="streetAddress"
                    placeholder="Enter street address"
                    value={formValues.streetAddress}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="city" className="form-label-premium">
                    City <span className="required">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formValues.city}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="stateProvider" className="form-label-premium">
                    State <span className="required">*</span>
                  </Label>
                  <Input
                    id="stateProvider"
                    name="stateProvider"
                    placeholder="State"
                    value={formValues.stateProvider}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="postalCode" className="form-label-premium">
                    Postal Code <span className="required">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Postal code"
                    value={formValues.postalCode}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="country" className="form-label-premium">
                    Country <span className="required">*</span>
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Country"
                    value={formValues.country}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>

          {/* Contact Section */}
          <div className={`form-section ${activeSection === 'contact' ? 'active' : 'hidden'}`}>
            <div className="section-title-premium">
              <FaPhone />
              <h3>Contact Information</h3>
            </div>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="mobile" className="form-label-premium">
                    <FaPhone className="label-icon" />
                    Mobile Number <span className="required">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formValues.mobile}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="email" className="form-label-premium">
                    <FaEnvelope className="label-icon" />
                    Email Address <span className="required">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="restaurant@example.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                    required
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="twitter" className="form-label-premium">
                    <FaTwitter className="label-icon" />
                    Twitter Handle
                  </Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    placeholder="@restaurant"
                    value={formValues.twitter}
                    onChange={handleInputChange}
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="instagram" className="form-label-premium">
                    <FaInstagram className="label-icon" />
                    Instagram Handle
                  </Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    placeholder="@restaurant"
                    value={formValues.instagram}
                    onChange={handleInputChange}
                    className="form-input-premium"
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>

          {/* Form Actions */}
          <div className="form-actions-premium">
            <Button 
              type="button" 
              className="cancel-btn-premium"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="submit-btn-premium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="light" />
                  Creating...
                </>
              ) : (
                <>
                  <AiOutlineCheckCircle />
                  Create Restaurant
                </>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;