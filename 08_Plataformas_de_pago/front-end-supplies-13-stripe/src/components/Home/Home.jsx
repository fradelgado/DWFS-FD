import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <h1>UNIR Supplies</h1>
      <p>Bienvenido a la plataforma de suministros para tiendas UNIR.</p>
      <p>Explora nuestros productos y encuentra las mejores soluciones para tu negocio.</p>

      <div className="home-features">
        <div className="feature-card">
          <h3>Productos de Calidad</h3>
          <p>Contamos con una amplia gama de productos tecnológicos para equipar tu tienda.</p>
        </div>
        <div className="feature-card">
          <h3>Tiendas Físicas</h3>
          <p>Visita nuestras tiendas en Logroño para recibir atención personalizada.</p>
        </div>
        <div className="feature-card">
          <h3>Soporte 24/7</h3>
          <p>Nuestro equipo está disponible para ayudarte en todo momento.</p>
        </div>
      </div>
    </div>
  );
}
