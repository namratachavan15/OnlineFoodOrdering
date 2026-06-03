import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { FaUtensils, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useRestaurantContext } from "../../component/State/Restaurant/RestaurantContext";
import "./FoodCategory.css";

const CreateFoodCategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { createCategory, usersRestaurant, getRestaurantsCategory } = useRestaurantContext();
  const jwt = localStorage.getItem("jwt");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) return;
    
    setIsSubmitting(true);
    const data = {
      name: formData.categoryName,
      restaurantId: usersRestaurant.id,
    };
    
    try {
      await createCategory({ reqData: data, jwt });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ categoryName: "" });
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="category-form-premium">
      {showSuccess && (
        <div className="category-success-toast">
          <FaCheckCircle />
          <span>Category created successfully!</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="category-form-header">
          <div className="category-form-icon">
            <FaUtensils />
          </div>
          <h3>Create New Category</h3>
          <p>Add a food category for your restaurant menu</p>
        </div>

        <FormGroup>
          <Label for="categoryName" className="category-form-label">
            Category Name
          </Label>
          <Input
            type="text"
            id="categoryName"
            name="categoryName"
            placeholder="e.g., Appetizers, Main Course, Desserts"
            value={formData.categoryName}
            onChange={handleInputChange}
            required
            className="category-form-input"
            autoFocus
          />
        </FormGroup>

        <div className="category-form-actions">
          <Button type="button" className="category-cancel-btn" onClick={onCancel}>
            <FaTimesCircle /> Cancel
          </Button>
          <Button type="submit" className="category-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-sm"></span>
                Creating...
              </>
            ) : (
              <>
                <FaCheckCircle /> Create Category
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateFoodCategoryForm;