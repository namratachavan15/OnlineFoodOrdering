import React, { useEffect, useState } from 'react'
import { IoMdCreate, IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaSearch, FaBoxes } from "react-icons/fa";
import { Card, CardHeader, Input, Badge } from 'reactstrap'; 
import CreateIngredientCategoryForm from './CreateIngredientCategoryForm';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';
import { useIngredients } from '../../component/State/Ingredient/IngredientsContext';
import "./Ingredients.css";

const IngredientCategoryTable = () => {
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const jwt = localStorage.getItem('jwt');
  const { getIngredientsCategory, category, deleteIngredientCategory, loading } = useIngredients();
  const { usersRestaurant } = useRestaurantContext();
  
  useEffect(() => {
    if (usersRestaurant?.id) {
      getIngredientsCategory({ id: usersRestaurant.id, jwt });
    }
  }, [usersRestaurant?.id, jwt]);

  const toggleModal = () => {
    setModal(!modal);
    setSelectedCategory(null);
  };

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteIngredientCategory({ id, jwt });
      getIngredientsCategory({ id: usersRestaurant.id, jwt });
    }
  };

  const filteredCategories = category.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshCategories = () => {
    getIngredientsCategory({ id: usersRestaurant.id, jwt });
  };

  return (
    <>
      <div className="category-table-premium">
        <Card className="category-card-ing">
          <CardHeader className="category-card-header-ing">
            <div className="header-info">
              <div className="header-icon category-icon">
                <FaBoxes />
              </div>
              <div>
                <h5>Ingredient Categories</h5>
                <p>Organize your ingredients</p>
              </div>
            </div>
            <button onClick={toggleModal} className="create-btn small">
              <IoMdCreate /> Add Category
            </button>
          </CardHeader>

          {/* Search Bar */}
          <div className="category-search-section">
            <div className="search-input-wrapper small">
              <FaSearch className="search-icon-ing" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="category-search-input"
              />
            </div>
            <div className="category-stats">
              <Badge className="stats-badge-ing">
                Total: {category.length}
              </Badge>
            </div>
          </div>

          {/* Categories List */}
          <div className="categories-list">
            {loading ? (
              <div className="loading-state small">
                <div className="spinner-sm"></div>
                <p>Loading categories...</p>
              </div>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <div key={item.id} className="category-list-item">
                  <div className="category-item-content">
                    <div className="category-color-dot">
                      <span className="dot" style={{ backgroundColor: `hsl(${item.id * 40 % 360}, 70%, 50%)` }}></span>
                    </div>
                    <div className="category-item-info">
                      <span className="category-item-name">{item.name}</span>
                      <span className="category-item-id">ID: {item.id}</span>
                    </div>
                  </div>
                  <div className="category-item-actions">
                    <button className="action-btn-icon edit" onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button className="action-btn-icon delete" onClick={() => handleDelete(item.id)}>
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-category-state-ing">
                <div className="empty-icon">📦</div>
                <p>No categories yet</p>
                <button onClick={toggleModal} className="empty-add-link">
                  Create your first category
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
              <h3>Add Ingredient Category</h3>
              <button className="modal-close-btn" onClick={toggleModal}>
                <IoMdClose />
              </button>
            </div>
            <div className="category-modal-body">
              <CreateIngredientCategoryForm 
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
          <div className="category-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="category-modal-header">
              <h3>Edit Category</h3>
              <button className="modal-close-btn" onClick={() => setEditModal(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className="category-modal-body">
              <CreateIngredientCategoryForm 
                item={selectedCategory}
                onSuccess={() => {
                  setEditModal(false);
                  refreshCategories();
                }}
                onCancel={() => setEditModal(false)}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientCategoryTable;