import React, {useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {AuthContext} from '../../context/AuthContext';
import { buildApiUrl } from '../../utils/apiConfig';
import './CartDetail.css';

export default function CartDetail() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToPayment = async () => {
    if (items.length === 0) return;

    // Verificar que hay un token activo
    if (!accessToken) {
      alert('Debe iniciar sesión para realizar un pedido');
      navigate('/');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        supplies: items.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      };

      // Usar el gateway para peticiones de órdenes con autorización
      const apiUrl = buildApiUrl('ORDERS', '/api/v1/orders');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.status === 201) {
        alert('¡Pedido realizado correctamente!');
        clearCart();
        navigate('/profile');
      } else if (response.status === 401) {
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente');
        navigate('/');
      } else {
        throw new Error('Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Tu carrito</h1>
          <Link to="/products" className="continue-shopping">← Continuar comprando</Link>
        </div>
        <div className="empty-cart-page">
          <div className="sad-face-large">😞</div>
          <h2>Tu carrito está vacío</h2>
          <p>Parece que no has añadido ningún producto a tu carrito.</p>
          <Link to="/products" className="shop-now-btn">
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1>Tu carrito</h1>
        <Link to="/products" className="continue-shopping">← Continuar comprando</Link>
      </div>

      <div className="cart-page-content">
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.id} className="cart-page-item">
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-description">{item.description}</p>
                <div className="cart-item-actions">
                  <Link to={`/products/${item.id}`} className="view-product-link">
                    Ver producto
                  </Link>
                </div>
              </div>

              <div className="cart-item-pricing">
                <p className="item-price">€{item.price}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="item-total">€{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-content">
            <h3>Resumen del pedido</h3>
            <div className="summary-line">
              <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} productos):</span>
              <span>€{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>€{getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              className="proceed-payment-btn"
              onClick={handleProceedToPayment}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? 'Procesando...' : 'Proceder al pago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
