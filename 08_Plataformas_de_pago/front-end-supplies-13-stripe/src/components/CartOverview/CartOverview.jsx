import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './CartOverview.css';

export default function CartOverview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Solo mostrar el carrito en la página de productos
  const shouldShowCart = location.pathname.startsWith('/products');

  const toggleCart = () => {
    setIsExpanded(!isExpanded);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToCart = () => {
    navigate('/cart');
    setIsExpanded(false);
  };

  if (!shouldShowCart) {
    return null;
  }

  return (
    <div className={`cart-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="cart-toggle" onClick={toggleCart}>
        <div className="cart-icon">
          🛒
        </div>
        {!isExpanded && getTotalItems() > 0 && (
          <span className="cart-badge">{getTotalItems()}</span>
        )}
      </div>

      {isExpanded && (
        <div className="cart-content">
          <div className="cart-header">
            <h3>Carrito de compras</h3>
            <button className="close-cart" onClick={toggleCart}>×</button>
          </div>

          <div className="cart-items">
            {items.length === 0 ? (
              <div className="empty-cart">
                <div className="sad-face">😞</div>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">€{item.price}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                <div className="cart-total">
                  <strong>Total: €{getTotalPrice().toFixed(2)}</strong>
                </div>
                <div className="cart-actions">
                  <button className="proceed-to-cart-btn" onClick={handleProceedToCart}>
                    Tramitar pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
