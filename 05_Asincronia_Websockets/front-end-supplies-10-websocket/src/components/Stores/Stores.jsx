import React, { useState, useEffect } from "react";
import "./Stores.css";

const mockStores = [
  {
    id: 1,
    name: "UNIR Supplies Centro",
    address: "Calle Gran Vía, 45, 26005 Logroño",
    phone: "+34 941 234 567",
    schedule: "L-V: 9:00-20:00, S: 10:00-14:00",
    services: ["Ventas", "Soporte técnico", "Instalación"]
  },
  {
    id: 2,
    name: "UNIR Supplies Norte",
    address: "Avenida de la Paz, 128, 26004 Logroño",
    phone: "+34 941 345 678",
    schedule: "L-V: 8:30-19:30, S: 9:00-13:00",
    services: ["Ventas", "Reparaciones", "Consultoría"]
  },
  {
    id: 3,
    name: "UNIR Supplies Sur",
    address: "Calle Portales, 67, 26001 Logroño",
    phone: "+34 941 456 789",
    schedule: "L-V: 9:30-20:30, S: 10:00-15:00",
    services: ["Ventas", "Formación", "Mantenimiento"]
  },
  {
    id: 4,
    name: "UNIR Supplies Oeste",
    address: "Calle Marqués de Murrieta, 89, 26005 Logroño",
    phone: "+34 941 567 890",
    schedule: "L-V: 9:00-19:00, S: 10:00-14:00",
    services: ["Ventas", "Soporte", "Garantías"]
  }
];

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadStores = () => {
      setTimeout(() => {
        setStores(mockStores);
        setLoading(false);
      }, 800);
    };

    loadStores();
  }, []);

  return (
    <div className="stores">
      <section className="stores-section">
        <h2>Nuestras Tiendas en Logroño</h2>
        <p className="stores-intro">
          Visita cualquiera de nuestras tiendas físicas en Logroño para recibir
          atención personalizada y conocer nuestros productos de primera mano.
        </p>

        {loading && <p className="loading-message">Cargando tiendas...</p>}

        {!loading && stores.length > 0 && (
          <div className="stores-grid">
            {stores.map(store => (
              <div key={store.id} className="store-card">
                <div className="store-header">
                  <h3 className="store-name">{store.name}</h3>
                </div>
                <div className="store-info">
                  <div className="store-detail">
                    <strong>📍 Dirección:</strong>
                    <span>{store.address}</span>
                  </div>
                  <div className="store-detail">
                    <strong>📞 Teléfono:</strong>
                    <span>{store.phone}</span>
                  </div>
                  <div className="store-detail">
                    <strong>🕒 Horario:</strong>
                    <span>{store.schedule}</span>
                  </div>
                  <div className="store-detail">
                    <strong>🛠️ Servicios:</strong>
                    <div className="services-list">
                      {store.services.map((service, index) => (
                        <span key={index} className="service-tag">{service}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
