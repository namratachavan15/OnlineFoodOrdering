import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { FaCheckCircle, FaTimesCircle, FaUtensils } from "react-icons/fa";
import { useRestaurantContext } from "../../component/State/Restaurant/RestaurantContext";
import { useIngredients } from "../../component/State/Ingredient/IngredientsContext";
import "./Ingredients.css";

const CreateIngredientForm = ({ onSuccess, onCancel, item, isEdit }) => {
  const jwt = localStorage.getItem("jwt");
  const {
    createIngredient,
    updateIngredient,
    category,
    getIngredientsOfRestaurant,
    getIngredientsCategory,
  } = useIngredients();
  const { usersRestaurant } = useRestaurantContext();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (usersRestaurant?.id && jwt) {
      getIngredientsCategory({ id: usersRestaurant.id, jwt });
    }
    if (item && isEdit) {
      setFormData({
        name: item.name || "",
        categoryId: item.category?.id || "",
      });
    }
  }, [usersRestaurant?.id, jwt, item, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    const data = {
      name: formData.name,
      categoryId: parseInt(formData.categoryId),
      restaurantId: usersRestaurant.id,
    };
    
    try {
      if (isEdit && item) {
        await updateIngredient({ id: item.id, data, jwt });
      } else {
        await createIngredient({ data, jwt });
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ name: "", categoryId: "" });
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error saving ingredient:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="ingredient-form-premium">
      {showSuccess && (
        <div className="success-toast-ing">
          <FaCheckCircle />
          <span>{isEdit ? 'Ingredient updated!' : 'Ingredient created!'}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="form-header-ing">
          <div className="form-icon-ing">
            <FaUtensils />
          </div>
          <h3>{isEdit ? 'Edit Ingredient' : 'New Ingredient'}</h3>
          <p>Add ingredients for your recipes</p>
        </div>

        <FormGroup>
          <Label for="name" className="form-label-ing">
            Ingredient Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Tomato, Cheese, Basil"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="form-input-ing"
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label for="categoryId" className="form-label-ing">
            Category
          </Label>
          <Input
            type="select"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="form-select-ing"
          >
            <option value="">Select Category</option>
            {category && category.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Input>
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
                {isEdit ? 'Update Ingredient' : 'Create Ingredient'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateIngredientForm;