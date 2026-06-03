import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaBoxes } from "react-icons/fa";
import { useRestaurantContext } from "../../component/State/Restaurant/RestaurantContext";
import { useIngredients } from "../../component/State/Ingredient/IngredientsContext";
import "./Ingredients.css";

const CreateIngredientCategoryForm = ({ onSuccess, onCancel, item, isEdit }) => {
  const [formData, setFormData] = useState({ 
    name: item?.name || "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const jwt = localStorage.getItem("jwt");
  const { createIngredientCategory, updateIngredientCategory, getIngredientsCategory } = useIngredients();
  const { usersRestaurant } = useRestaurantContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    const data = {
      name: formData.name,
      restaurantId: usersRestaurant.id,
    };
    
    try {
      if (isEdit && item) {
        await updateIngredientCategory({ id: item.id, data, jwt });
      } else {
        await createIngredientCategory({ data, jwt });
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: "" });
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="category-form-premium-ing">
      {showSuccess && (
        <div className="success-toast-ing">
          <FaCheckCircle />
          <span>{isEdit ? 'Category updated!' : 'Category created!'}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="form-header-ing">
          <div className="form-icon-ing category">
            <FaBoxes />
          </div>
          <h3>{isEdit ? 'Edit Category' : 'New Category'}</h3>
          <p>Organize your ingredients by category</p>
        </div>

        <FormGroup>
          <Label for="name" className="form-label-ing">
            Category Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Vegetables, Spices, Dairy"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-input-ing"
            autoFocus
          />
        </FormGroup>

        <div className="form-actions-ing">
          <Button type="button" className="cancel-btn-ing" onClick={onCancel}>
            <FaTimesCircle /> Cancel
          </Button>
          <Button type="submit" className="submit-btn-ing" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner-sm"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FaCheckCircle />
                {isEdit ? 'Update Category' : 'Create Category'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateIngredientCategoryForm;