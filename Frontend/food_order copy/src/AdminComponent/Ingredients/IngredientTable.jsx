import React, { useEffect, useState } from "react";
import { IoMdCreate, IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { FaToggleOn, FaToggleOff, FaSpinner } from "react-icons/fa";
import { Card, CardHeader, Input, Badge, Spinner } from "reactstrap";
import CreateIngredientForm from "./CreateIngredientForm";
import { useRestaurantContext } from "../../component/State/Restaurant/RestaurantContext";
import { useIngredients } from "../../component/State/Ingredient/IngredientsContext";
import "./Ingredients.css";

const IngredientTable = () => {
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(null);
  
  const jwt = localStorage.getItem("jwt");
  const { 
    getIngredientsOfRestaurant, 
    updateStockOfIngredient, 
    ingredients,
    deleteIngredient,
    loading 
  } = useIngredients();
  const { usersRestaurant } = useRestaurantContext();

  useEffect(() => {
    if (usersRestaurant?.id) {
      getIngredientsOfRestaurant({ jwt, id: usersRestaurant.id });
    }
  }, [usersRestaurant?.id, jwt]);

  const toggleModal = () => {
    setModal(!modal);
    setSelectedIngredient(null);
  };

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient);
    setEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      await deleteIngredient({ id, jwt });
      getIngredientsOfRestaurant({ jwt, id: usersRestaurant.id });
    }
  };

  const handleUpdateStock = async (id) => {
    if (!id || !jwt) return;
    setUpdatingStock(id);
    await updateStockOfIngredient({ id, jwt });
    setUpdatingStock(null);
    getIngredientsOfRestaurant({ jwt, id: usersRestaurant.id });
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshIngredients = () => {
    getIngredientsOfRestaurant({ jwt, id: usersRestaurant.id });
  };

  return (
    <>
      <div className="ingredient-table-premium">
        <Card className="ingredient-card">
          <CardHeader className="ingredient-card-header">
            <div className="header-info">
              <div className="header-icon ingredient-icon">
                🥗
              </div>
              <div>
                <h5>Ingredients Inventory</h5>
                <p>Manage your stock and ingredients</p>
              </div>
            </div>
            <button onClick={toggleModal} className="create-btn">
              <IoMdCreate /> Add Ingredient
            </button>
          </CardHeader>

          {/* Search Bar */}
          <div className="ingredient-search-section">
            <div className="search-input-wrapper">
              <MdSearch className="search-icon-ing" />
              <Input
                type="text"
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ingredient-search-input"
              />
            </div>
            <div className="ingredient-stats">
              <Badge className="stats-badge-ing">
                Total: {ingredients.length}
              </Badge>
              <Badge className="stats-badge-ing in-stock">
                In Stock: {ingredients.filter(i => i.inStock).length}
              </Badge>
            </div>
          </div>

          {/* Ingredients Grid */}
          <div className="ingredients-grid">
            {loading ? (
              <div className="loading-state">
                <FaSpinner className="spinning" />
                <p>Loading ingredients...</p>
              </div>
            ) : filteredIngredients.length > 0 ? (
              filteredIngredients.map((item) => (
                <div key={item.id} className="ingredient-card-item">
                  <div className="ingredient-card-content">
                    <div className="ingredient-avatar">
                      <span className="ingredient-avatar-text">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ingredient-info">
                      <h4 className="ingredient-name">{item.name}</h4>
                      <div className="ingredient-meta">
                        <Badge className="category-badge-ing">
                          {item.category?.name || 'Uncategorized'}
                        </Badge>
                        <Badge className="ingredient-id-badge">
                          ID: {item.id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="ingredient-actions">
                    <button 
                      className={`stock-toggle-btn ${item.inStock ? 'in-stock' : 'out-stock'}`}
                      onClick={() => handleUpdateStock(item.id)}
                      disabled={updatingStock === item.id}
                    >
                      {updatingStock === item.id ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        <>
                          {item.inStock ? <FaToggleOn /> : <FaToggleOff />}
                          <span>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                        </>
                      )}
                    </button>
                    <button 
                      className="action-icon-btn edit"
                      onClick={() => handleEdit(item)}
                    >
                      <MdEdit />
                    </button>
                    <button 
                      className="action-icon-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-ingredient-state">
                <div className="empty-icon">🥗</div>
                <h3>No ingredients found</h3>
                <p>Add your first ingredient to start managing inventory</p>
                <button onClick={toggleModal} className="empty-add-btn">
                  <IoMdCreate /> Add Ingredient
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create Ingredient Modal */}
      {modal && (
        <div className="ingredient-modal-overlay" onClick={toggleModal}>
          <div className="ingredient-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="ingredient-modal-header">
              <h3>Add New Ingredient</h3>
              <button className="modal-close-btn" onClick={toggleModal}>
                <IoMdClose />
              </button>
            </div>
            <div className="ingredient-modal-body">
              <CreateIngredientForm 
                onSuccess={() => {
                  toggleModal();
                  refreshIngredients();
                }}
                onCancel={toggleModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Ingredient Modal */}
      {editModal && selectedIngredient && (
        <div className="ingredient-modal-overlay" onClick={() => setEditModal(false)}>
          <div className="ingredient-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="ingredient-modal-header">
              <h3>Edit Ingredient</h3>
              <button className="modal-close-btn" onClick={() => setEditModal(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className="ingredient-modal-body">
              <CreateIngredientForm 
                item={selectedIngredient}
                onSuccess={() => {
                  setEditModal(false);
                  refreshIngredients();
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

export default IngredientTable;