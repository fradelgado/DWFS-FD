import React, { useContext } from "react";
import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useLogin } from "../../hooks/useLogin.js";
import { useOrders } from "../../hooks/useOrders.js";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { logout } = useLogin();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();

  if (!user) {
    return null; // PrivateRoute se encargará de la redirección
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "entregado": return "status-delivered";
      case "en_proceso": return "status-processing";
      case "pendiente": return "status-pending";
      default: return "status-default";
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "entregado": return "Entregado";
      case "en_proceso": return "En proceso";
      case "pendiente": return "Pendiente";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <button onClick={logout} className="logout-btn">
          Cerrar sesión
        </button>
      </div>

      <div className="profile-content">
        <div className="company-info">
          <h2>Información de la empresa</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Nombre:</label>
              <span>{user.company.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.company.email}</span>
            </div>
            <div className="info-item">
              <label>Teléfono:</label>
              <span>{user.company.phone}</span>
            </div>
            <div className="info-item">
              <label>Dirección:</label>
              <span>{user.company.address}</span>
            </div>
            <div className="info-item">
              <label>CIF:</label>
              <span>{user.company.cif}</span>
            </div>
            <div className="info-item">
              <label>Sector:</label>
              <span>{user.company.sector}</span>
            </div>
            <div className="info-item">
              <label>Empleados:</label>
              <span>{user.company.employeeCount}</span>
            </div>
            <div className="info-item">
              <label>Fundada:</label>
              <span>{user.company.founded}</span>
            </div>
          </div>
        </div>

        <div className="recent-orders">
          <h2>Pedidos recientes</h2>

          {ordersLoading && (
            <div className="loading-container">
              <p>Cargando pedidos...</p>
            </div>
          )}

          {ordersError && (
            <div className="error-container">
              <p className="error-message">{ordersError}</p>
            </div>
          )}

          {!ordersLoading && orders.length === 0 && (
            <div className="no-orders">
              <p>No tienes pedidos recientes</p>
            </div>
          )}

          {!ordersLoading && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.id}</h3>
                      <p className="order-date">{formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="order-total">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Productos:</h4>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.name} - {formatPrice(item.price)} c/u
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.comment && (
                    <div className="order-comment">
                      <h4>Estado del pedido:</h4>
                      <p>{order.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
