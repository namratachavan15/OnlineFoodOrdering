// MenuCard.js - Professional Redesign

import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Badge, 
  Modal, 
  ModalBody, 
  ModalHeader, 
  ModalFooter,
  Spinner 
} from 'reactstrap';
import { 
  FaPlus, 
  FaMinus, 
  FaLeaf, 
  FaDrumstick, 
  FaFire, 
  FaCheckCircle,
  FaInfoCircle,
  FaShoppingCart 
} from 'react-icons/fa';
import { useCart } from '../State/Cart/CartContext';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItemToCart } = useCart();

  // Sample add-ons (in real app, these would come from API)
  const availableAddons = [
    { id: 1, name: "Extra Cheese", price: 30 },
    { id: 2, name: "Extra Sauce", price: 20 },
    { id: 3, name: "Double Portion", price: 50 }
  ];

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddonToggle = (addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateTotalPrice = () => {
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return (item.price + addonsTotal) * quantity;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    
     const addonPrice = selectedAddons.reduce(
    (sum, addon) => sum + addon.price,
    0
  );

    const reqData = {
      token: localStorage.getItem("jwt"),
      foodId: item.id,
      quantity: quantity,
      ingredients: selectedAddons.map(a => a.name),
       addonPrice: addonPrice,
      specialInstructions: specialInstructions,
    };
    
    await addItemToCart(reqData);
    setAddingToCart(false);
    setModalOpen(false);
    
    // Reset state
    setQuantity(1);
    setSelectedAddons([]);
    setSpecialInstructions("");
  };

  const isVegetarian = item.vegetarian !== false;
  const isSpicy = item.spicy === true;
  const isPopular = item.popular === true;

  return (
    <>
      <Card className="menu-card-modern">
        {/* Image Section with Badges */}
        <div className="menu-card-image">
          <img 
            src={item.images?.[0] || '/api/placeholder/300/200'} 
            alt={item.name}
          />
          <div className="image-badges">
            {isVegetarian && (
              <Badge className="badge-veg">
                <FaLeaf /> Pure Veg
              </Badge>
            )}
            {isSpicy && (
              <Badge className="badge-spicy">
                <FaFire /> Spicy
              </Badge>
            )}
            {isPopular && (
              <Badge className="badge-popular">
                ⭐ Popular
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="menu-card-content">
          <div className="card-header">
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
            </div>
            <div className="item-price">
              <span className="currency">₹</span>
              <span className="price">{item.price}</span>
            </div>
          </div>

          {/* Customization Options */}
          {item.hasCustomizations && (
            <div className="customization-preview">
              <button 
                className="customize-btn"
                onClick={() => setModalOpen(true)}
              >
                <FaInfoCircle /> Customize
              </button>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="cart-actions">
            <div className="quantity-selector">
              <button 
                className="qty-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <FaPlus />
              </button>
            </div>
            <Button 
              className="add-to-cart-btn"
              onClick={() => setModalOpen(true)}
            >
              <FaShoppingCart /> Add to Cart
            </Button>
          </div>
        </div>
      </Card>

      {/* Customization Modal */}
      <Modal 
        isOpen={modalOpen} 
        toggle={() => setModalOpen(false)}
        className="menu-modal"
        size="lg"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          <div className="modal-header-content">
            <img 
              src={item.images?.[0]} 
              alt={item.name}
              className="modal-item-image"
            />
            <div>
              <h3>{item.name}</h3>
              <p className="modal-price">₹{item.price}</p>
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleAddToCart}>
            {/* Quantity Section */}
            <div className="modal-section">
              <label className="section-label">Quantity</label>
              <div className="quantity-selector-large">
                <button 
                  type="button"
                  className="qty-btn-large"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="qty-value-large">{quantity}</span>
                <button 
                  type="button"
                  className="qty-btn-large"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Add-ons Section */}
            {availableAddons.length > 0 && (
              <div className="modal-section">
                <label className="section-label">Add-ons (Optional)</label>
                <div className="addons-grid">
                  {availableAddons.map(addon => (
                    <div 
                      key={addon.id}
                      className={`addon-card ${selectedAddons.find(a => a.id === addon.id) ? 'selected' : ''}`}
                      onClick={() => handleAddonToggle(addon)}
                    >
                      <div className="addon-info">
                        <span className="addon-name">{addon.name}</span>
                        <span className="addon-price">+₹{addon.price}</span>
                      </div>
                      {selectedAddons.find(a => a.id === addon.id) && (
                        <FaCheckCircle className="addon-check" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="modal-section">
              <label className="section-label">Special Instructions</label>
              <textarea
                className="special-instructions"
                placeholder="e.g., Less spicy, No onions, Extra sauce..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows="3"
              />
            </div>

            {/* Price Summary */}
            <div className="price-summary">
              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{item.price * quantity}</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="summary-row">
                  <span>Add-ons</span>
                  <span>+₹{selectedAddons.reduce((sum, a) => sum + a.price, 0) * quantity}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{calculateTotalPrice()}</span>
              </div>
            </div>
          </form>
        </ModalBody>
        
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="confirm-add-btn"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <>
                <Spinner size="sm" /> Adding...
              </>
            ) : (
              <>
                <FaShoppingCart /> Add to Cart • ₹{calculateTotalPrice()}
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MenuCard;