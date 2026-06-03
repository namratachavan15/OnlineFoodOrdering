import React, { useState, useEffect } from 'react';
import { IoMdCreate, IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaSearch, FaUtensils, FaPlus, FaCheckCircle } from "react-icons/fa";
import { Card, CardHeader, Input, Badge, Label, Button, FormGroup } from 'reactstrap'; 
import CreateFoodCategoryForm from './CreateFoodCategoryForm';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import './FoodCategory.css';

const FoodCategoryTable = () => {
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModal, setEditModal] = useState(false);
  
  const { usersRestaurant, getRestaurantsCategory, restaurantCategory, deleteCategory, updateCategory } = useRestaurantContext();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (usersRestaurant?.id) {
      getRestaurantsCategory(usersRestaurant.id, jwt);
    }
  }, [usersRestaurant?.id, jwt]);

  const toggleModal = () => {
    setModal(!modal);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory({ categoryId, jwt });
      getRestaurantsCategory(usersRestaurant?.id, jwt);
    }
  };

  const handleUpdateCategory = async (categoryName) => {
    const data = {
      id: selectedCategory.id,
      name: categoryName,
      restaurantId: usersRestaurant.id,
    };
    await updateCategory({ reqData: data, jwt });
    setEditModal(false);
   getRestaurantsCategory({
  restaurantId: usersRestaurant.id,
  jwt
});
  };

  const filteredCategories = restaurantCategory.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshCategories = () => {
   getRestaurantsCategory({
  restaurantId: usersRestaurant.id,
  jwt
});
  };

  return (
    <>
      <div className="category-container-premium">
        <Card className="category-card-premium">
          <CardHeader className="category-card-header">
            <div className="header-left-section">
              <div className="header-icon-wrapper">
                <FaUtensils />
              </div>
              <div>
                <h5 className="header-title">Food Categories</h5>
                <p className="header-subtitle">Manage your menu categories</p>
              </div>
            </div>
            <button onClick={toggleModal} className="create-category-btn">
              <FaPlus /> Add Category
            </button>
          </CardHeader>

          {/* Search Bar */}
          <div className="category-search-wrapper">
            <div className="search-input-container">
              <FaSearch className="search-icon-category" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="category-search-input"
              />
            </div>
            <div className="category-stats">
              <span className="stats-badge">
                Total: {restaurantCategory.length}
              </span>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="categories-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item, index) => (
                <div key={item.id || index} className="category-card-item">
                  <div className="category-card-content">
                    <div className="category-avatar">
                      <span className="category-avatar-text">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="category-info">
                      <h4 className="category-name">{item.name}</h4>
                      <div className="category-meta">
                        <Badge className="category-badge">
                          ID: {index + 1}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="category-actions">
                    <button 
                      className="category-action-btn edit"
                      onClick={() => handleEdit(item)}
                    >
                      <MdEdit />
                    </button>
                    <button 
                      className="category-action-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-category-state">
                <div className="empty-icon">🍽️</div>
                <h3>No categories found</h3>
                <p>Create your first food category to organize your menu</p>
                <button onClick={toggleModal} className="empty-create-btn">
                  <FaPlus /> Create Category
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create Category Modal */}
      {modal && (
        <div className="category-modal-overlay" onClick={toggleModal}>
          <div className="category-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Create New Category</h3>
              <button className="category-modal-close" onClick={toggleModal}>
                <IoMdClose />
              </button>
            </div>
            <div className="category-modal-body">
              <CreateFoodCategoryForm 
                onSuccess={() => {
                  toggleModal();
                  refreshCategories();
                }}
                onCancel={toggleModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editModal && selectedCategory && (
        <div className="category-modal-overlay" onClick={() => setEditModal(false)}>
          <div className="category-modal-container category-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Edit Category</h3>
              <button className="category-modal-close" onClick={() => setEditModal(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className="category-modal-body">
              <div className="edit-category-form">
                <FormGroup>
                  <Label className="category-form-label">Category Name</Label>
                  <Input
                    type="text"
                    defaultValue={selectedCategory.name}
                    id="editCategoryName"
                    className="category-form-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCategory(e.target.value);
                      }
                    }}
                  />
                </FormGroup>
                <div className="category-form-actions">
                  <Button type="button" className="category-cancel-btn" onClick={() => setEditModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    className="category-submit-btn"
                    onClick={(e) => {
                      const input = document.getElementById('editCategoryName');
                      handleUpdateCategory(input.value);
                    }}
                  >
                    <FaCheckCircle /> Update Category

                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCategoryTable;