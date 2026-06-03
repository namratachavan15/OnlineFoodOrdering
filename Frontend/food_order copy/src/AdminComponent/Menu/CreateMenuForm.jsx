import React, { useState, useEffect } from "react";
import {
  Button, Form, FormGroup, Label, Input, Row, Col, Spinner
} from "reactstrap";
import { 
  AiOutlinePlusCircle, 
  AiOutlineCloseCircle, 
  AiOutlineCheckCircle 
} from "react-icons/ai";
import { 
  FaCloudUploadAlt, 
  FaTag, 
  FaMoneyBillWave, 
  FaLeaf, 
  FaDrumstickBite,
  FaTimesCircle
} from "react-icons/fa";
import { useMenuItemContext } from "../../component/State/Menu/MenuItemContext";
import { useIngredients } from "../../component/State/Ingredient/IngredientsContext";
import { useRestaurantContext } from "../../component/State/Restaurant/RestaurantContext";
import { uploadImageToCloud } from "./../../util/UploadToCloudary";
import "./Menu.css";

const CreateMenuForm = ({ item, onSuccess, onCancel }) => {
  const [uploadImage, setUploadImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const jwt = localStorage.getItem('jwt');
  const { createMenuItem, updateMenuItem } = useMenuItemContext();
  const { getIngredientsOfRestaurant, ingredients } = useIngredients();
  const { usersRestaurant, getRestaurantsCategory, restaurantCategory } = useRestaurantContext();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: null,
    vegetarian: true,
    seasonal: false,
    ingredients: [],
    images: [],
  });

  useEffect(() => {
    if (usersRestaurant?.id) {
      getIngredientsOfRestaurant({ jwt, id: usersRestaurant.id });
      getRestaurantsCategory({ restaurantId: usersRestaurant?.id, jwt });
    }
  }, [usersRestaurant?.id]);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.foodcategory?.id || item.category || null,
        vegetarian: item.vegetarian !== undefined ? item.vegetarian : true,
        seasonal: item.seasonal || false,
        ingredients: item.ingredients || [],
        images: item.images || [],
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'select-multiple') {
      const selectedIngredients = Array.from(selectedOptions, (option) => {
        const ingredient = ingredients.find((ing) => ing.id === parseInt(option.value));
        return { id: ingredient.id, name: ingredient.name, category: ingredient.category };
      });
      setFormData({ ...formData, ingredients: selectedIngredients });
    } else if (type === 'select-one') {
      setFormData({ ...formData, [name]: value === '' ? null : parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadImage(true);
    const image = await uploadImageToCloud(file);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, image],
    }));
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const menuData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      vegetarian: formData.vegetarian,
      seasonal: formData.seasonal,
      ingredients: formData.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        category: ing.category
      })),
      images: formData.images,
      restaurantId: usersRestaurant.id,
    };
    
    try {
      if (item) {
        await updateMenuItem({ foodId: item.id, menu: menuData, jwt });
      } else {
         console.log("Sending menuData:", menuData);
        await createMenuItem({ menu: menuData, jwt });
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error saving menu item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-menu-form-premium">
      {showSuccess && (
        <div className="success-toast-menu">
          <AiOutlineCheckCircle />
          <span>{item ? 'Item updated successfully!' : 'Item created successfully!'}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Form Header */}
        <div className="form-header-menu">
          <div className="form-icon-menu">
            🍽️
          </div>
          <h3>{item ? 'Edit Menu Item' : 'New Menu Item'}</h3>
          <p>Add delicious items to your restaurant menu</p>
        </div>

        {/* Image Upload Section */}
        <div className="image-upload-section-menu">
          <Label className="section-label-menu">Food Images</Label>
          <div className="image-grid-menu">
            <label htmlFor="menuFileInput" className="upload-box-menu">
              <div className="upload-content-menu">
                <FaCloudUploadAlt size={24} />
                <span>Upload</span>
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              id="menuFileInput"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {uploadImage && (
              <div className="upload-loading-menu">
                <Spinner size="sm" color="danger" />
              </div>
            )}
            {formData.images.map((img, index) => (
              <div key={index} className="image-preview-menu">
                <img src={img} alt={`preview-${index}`} />
                <button type="button" onClick={() => handleRemoveImage(index)} className="remove-image-menu">
                  <AiOutlineCloseCircle />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Row>
          <Col md={12}>
            <FormGroup>
              <Label className="form-label-menu">Item Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Margherita Pizza"
                required
                className="form-input-menu"
              />
            </FormGroup>
          </Col>

          <Col md={12}>
            <FormGroup>
              <Label className="form-label-menu">Description</Label>
              <Input
                type="textarea"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, ingredients, and preparation style..."
                className="form-textarea-menu"
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label className="form-label-menu">
                <FaMoneyBillWave className="label-icon-menu" /> Price *
              </Label>
              <Input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="form-input-menu"
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label className="form-label-menu">
                <FaTag className="label-icon-menu" /> Category
              </Label>
              <Input
                type="select"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="form-select-menu"
              >
                <option value="">Select Category</option>
                {restaurantCategory?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>

        {/* Dietary Options */}
        <div className="dietary-options-menu">
          <Label className="section-label-menu">Dietary Information</Label>
          <div className="options-row-menu">
            <label className={`dietary-chip-menu ${formData.vegetarian ? 'active' : ''}`}>
              <input
                type="checkbox"
                name="vegetarian"
                checked={formData.vegetarian}
                onChange={handleChange}
              />
              <FaLeaf /> Vegetarian
            </label>
            <label className={`dietary-chip-menu ${formData.seasonal ? 'active' : ''}`}>
              <input
                type="checkbox"
                name="seasonal"
                checked={formData.seasonal}
                onChange={handleChange}
              />
              <FaDrumstickBite /> Seasonal Special
            </label>
          </div>
        </div>

        {/* Ingredients Selection */}
        <div className="ingredients-section-menu">
          <Label className="section-label-menu">Ingredients</Label>
          <Input
            type="select"
            name="ingredients"
            multiple
            value={formData.ingredients.map((i) => i.id)}
            onChange={handleChange}
            className="ingredients-select-menu"
          >
            {ingredients?.map((ing) => (
              <option key={ing.id} value={ing.id}>{ing.name}</option>
            ))}
          </Input>
          
          {formData.ingredients.length > 0 && (
            <div className="selected-ingredients-menu">
              {formData.ingredients.map((ing, idx) => (
                <span key={idx} className="selected-ingredient-menu">
                  {ing.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions-menu">
          <Button type="button" className="cancel-btn-menu" onClick={onCancel}>
            <FaTimesCircle /> Cancel
          </Button>
          <Button type="submit" className="submit-btn-menu" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="light" />
                {item ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <AiOutlineCheckCircle />
                {item ? 'Update Item' : 'Create Item'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateMenuForm;