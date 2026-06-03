import React, { useEffect, useState } from 'react';
import './Menu.css';
import { IoMdCreate, IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit, MdOutlineInventory, MdSearch } from "react-icons/md";
import { FaLeaf, FaDrumstickBite, FaSpinner } from "react-icons/fa";
import { Card, CardHeader, Input, Badge, Spinner } from 'reactstrap';
import CreateMenuForm from './CreateMenuForm';
import { useMenuItemContext } from '../../component/State/Menu/MenuItemContext';
import { useRestaurantContext } from '../../component/State/Restaurant/RestaurantContext';

const MenuTable = () => {
  const jwt = localStorage.getItem('jwt');
  const { getMenuItemsByRestaurantId, menuItems, deleteMenuItem, loading } = useMenuItemContext();
  const { usersRestaurant } = useRestaurantContext();

  const [menuModal, setMenuModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
console.log("Menu Items:", menuItems);

  useEffect(() => {
    if (usersRestaurant?.id) {
      getMenuItemsByRestaurantId({
        restaurantId: usersRestaurant.id,
        jwt,
        vegetarian: undefined,
        seasonal: undefined,
        foodCategory: undefined,
      });
    }
  }, [usersRestaurant?.id, jwt]);

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem({ foodId, jwt });
      getMenuItemsByRestaurantId({
        restaurantId: usersRestaurant.id,
        jwt,
        vegetarian: undefined,
        seasonal: undefined,
        foodCategory: undefined,
      });
    }
  };

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setMenuModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setMenuModal(false);
    setSelectedItem(null);
    document.body.style.overflow = 'auto';
  };

  const handleSuccess = () => {
    getMenuItemsByRestaurantId({
      restaurantId: usersRestaurant.id,
      jwt,
      vegetarian: undefined,
      seasonal: undefined,
      foodCategory: undefined,
    });
    handleCloseModal();
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ingredients?.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'veg' && item.vegetarian) ||
                           (selectedCategory === 'nonveg' && !item.vegetarian);
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Items', count: menuItems.length, icon: '🍽️' },
    { value: 'veg', label: 'Vegetarian', count: menuItems.filter(i => i.vegetarian).length, icon: '🌱' },
    { value: 'nonveg', label: 'Non-Veg', count: menuItems.filter(i => !i.vegetarian).length, icon: '🍗' }
  ];

  return (
    <>
      <div className="menu-container-premium">
        <Card className="menu-card-premium">
          <CardHeader className="menu-card-header">
            <div className="header-info-section">
              <div className="header-icon-wrapper menu-icon">
                🍽️
              </div>
              <div>
                <h5>Menu Items</h5>
                <p>Manage your restaurant menu</p>
              </div>
            </div>
            <button onClick={() => handleOpenModal(null)} className="create-menu-btn">
              <IoMdCreate /> Add New Item
            </button>
          </CardHeader>

          {/* Search and Filters */}
          <div className="menu-search-section">
            <div className="search-input-wrapper-menu">
              <MdSearch className="search-icon-menu" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="menu-search-input"
              />
            </div>
            <div className="menu-filter-buttons">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  className={`filter-chip-menu ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                  <span className="filter-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="menu-items-grid">
            {loading ? (
              <div className="loading-state-menu">
                <FaSpinner className="spinning" />
                <p>Loading menu items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="menu-item-card">
                  <div className="menu-item-image">
                    <img src={item.images?.[0] || '/api/placeholder/300/200'} alt={item.name} />
                    <Badge className={`veg-badge-menu ${item.vegetarian ? 'veg' : 'non-veg'}`}>
                      {item.vegetarian ? <FaLeaf /> : <FaDrumstickBite />}
                      {item.vegetarian ? 'Veg' : 'Non-Veg'}
                    </Badge>
                    <div className="menu-item-actions-overlay">
                      <button className="menu-action-btn edit" onClick={() => handleOpenModal(item)}>
                        <MdEdit />
                      </button>
                      <button className="menu-action-btn delete" onClick={() => handleDeleteFood(item.id)}>
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                  
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <h3 className="menu-item-name">{item.name}</h3>
                      <p className="menu-item-price">₹{item.price}</p>
                    </div>
                    
                    {item.description && (
                      <p className="menu-item-description">{item.description.substring(0, 80)}...</p>
                    )}
                    
                    <div className="menu-item-ingredients">
                      {item.ingredients?.slice(0, 4).map((ingredient, idx) => (
                        <span key={idx} className="ingredient-tag-menu">
                          {ingredient.name}
                        </span>
                      ))}
                      {item.ingredients?.length > 4 && (
                        <span className="ingredient-tag-menu more">+{item.ingredients.length - 4}</span>
                      )}
                    </div>
                    
                 <div className="menu-item-footer">
  <Badge className="category-tag-menu">
    {item.foodcategory?.name || 'Uncategorized'}
  </Badge>
</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-menu-state-premium">
                <div className="empty-icon">🍽️</div>
                <h3>No menu items found</h3>
                <p>{searchTerm ? 'Try a different search term' : 'Add your first menu item to get started'}</p>
                {!searchTerm && (
                  <button onClick={() => handleOpenModal(null)} className="empty-add-btn-menu">
                    <IoMdCreate /> Add Menu Item
                  </button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {menuModal && (
        <div className="menu-modal-overlay" onClick={handleCloseModal}>
          <div className="menu-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="menu-modal-header-premium">
              <div className="modal-title-section">
                <div className="modal-icon-wrapper">
                  {selectedItem ? <MdEdit /> : <IoMdCreate />}
                </div>
                <h3>{selectedItem ? 'Edit Menu Item' : 'Create New Menu Item'}</h3>
              </div>
              <button className="modal-close-btn-premium" onClick={handleCloseModal}>
                <IoMdClose />
              </button>
            </div>
            <div className="menu-modal-body-premium">
              <CreateMenuForm 
                item={selectedItem} 
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuTable;