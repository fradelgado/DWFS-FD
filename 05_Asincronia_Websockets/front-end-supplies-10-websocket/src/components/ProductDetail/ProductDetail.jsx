import React from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const { product, loading, error } = useProduct(productId);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading-container">
          <p className="loading-message">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-detail">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>No se pudo encontrar el producto solicitado.</p>
          <Link to="/products" className="back-link">← Volver a productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/products" className="back-link">← Volver a productos</Link>
      </div>

      {error && <p className="fetch-error">{error}</p>}

      {product && (
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[0]}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%23999' font-family='Arial' font-size='16'%3EImagen del producto%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - Vista ${index + 1}`}
                    className="thumbnail"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='75' viewBox='0 0 100 75'%3E%3Crect width='100' height='75' fill='%23f0f0f0'/%3E%3Ctext x='50' y='40' text-anchor='middle' fill='%23999' font-family='Arial' font-size='10'%3EImg%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <span className="product-category">{product.type}</span>
            </div>

            <p className="product-description">{product.description}</p>
            <p className="product-full-description">{product.fullDescription}</p>

            <div className="product-pricing">
              <span className="product-price">€{product.price}</span>
              <span className="product-stock">
                {product.stock > 0 ? (
                  `${product.stock} unidades disponibles`
                ) : (
                  <span className="out-of-stock">Sin stock</span>
                )}
              </span>
            </div>

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {product.stock > 0 ? "Añadir al carrito" : "Sin stock"}
              </button>
            </div>

            <div className="product-specifications">
              <h3>Especificaciones técnicas</h3>
              <div className="specs-grid">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-label">{spec.specKey}:</span>
                    <span className="spec-value">{spec.specValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
