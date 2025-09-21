import { useState, useEffect, useContext } from 'react';
import { buildApiUrl } from '../utils/apiConfig';
import { AuthContext } from '../context/AuthContext';

// Mock data para cuando falle la petición HTTP
const mockOrders = {
  "recentOrders": [
    {
      "id": "ORDER-1756421808661",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 9198.45,
      "comment": "Su pedido está siendo preparado en nuestro almacén. Tiempo estimado de entrega: 2-3 días laborables.",
      "items": [
        {
          "name": "Silla Ergonómica Herman Miller",
          "quantity": 3,
          "price": 899.5
        },
        {
          "name": "Laptop Dell XPS 13",
          "quantity": 5,
          "price": 1299.99
        }
      ]
    },
    {
      "id": "ORDER-1756422082878",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 9198.45,
      "comment": "Pedido en proceso de envío. Se ha aplicado un pequeño retraso debido a alta demanda.",
      "items": [
        {
          "name": "Silla Ergonómica Herman Miller",
          "quantity": 3,
          "price": 899.5
        },
        {
          "name": "Laptop Dell XPS 13",
          "quantity": 5,
          "price": 1299.99
        }
      ]
    },
    {
      "id": "ORDER-1756422157513",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 15494.95,
      "comment": "Pedido de gran volumen confirmado. Entrega programada para mañana por la mañana.",
      "items": [
        {
          "name": "Silla Ergonómica Herman Miller",
          "quantity": 10,
          "price": 899.5
        },
        {
          "name": "Laptop Dell XPS 13",
          "quantity": 5,
          "price": 1299.99
        }
      ]
    },
    {
      "id": "ORDER-1756422285222",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 126.93,
      "comment": "Productos de oficina listos para envío. Llegada estimada en 24 horas.",
      "items": [
        {
          "name": "Post-it Notes 3x3 Amarillo 12 pads",
          "quantity": 3,
          "price": 16.99
        },
        {
          "name": "Rotuladores Sharpie Permanent Pack 12",
          "quantity": 4,
          "price": 18.99
        }
      ]
    },
    {
      "id": "ORDER-1756422445046",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 6499.95,
      "comment": "Pedido de equipos informáticos verificado. Preparación en curso para envío express.",
      "items": [
        {
          "name": "Laptop Dell XPS 13",
          "quantity": 5,
          "price": 1299.99
        }
      ]
    },
    {
      "id": "ORDER-1756422633004",
      "date": "2025-08-29",
      "status": "EN_PROCESO",
      "total": 1799.94,
      "comment": "Las impresoras están siendo embaladas cuidadosamente. Envío previsto para esta tarde.",
      "items": [
        {
          "name": "Impresora HP LaserJet Pro",
          "quantity": 6,
          "price": 299.99
        }
      ]
    }
  ]
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar que hay un token activo
        if (!accessToken) {
          throw new Error('No hay token de acceso activo');
        }

        // Usar el gateway para peticiones de órdenes
        const apiUrl = buildApiUrl('ORDERS', '/api/v1/orders');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        };

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.recentOrders || []);
      } catch (err) {
        console.warn('Error fetching orders from API, using mock data:', err.message);
        setError(`Error al cargar pedidos: ${err.message}`);
        // Usar datos mock cuando falla la petición
        setOrders(mockOrders.recentOrders);
      } finally {
        setLoading(false);
      }
    };

    // Solo hacer la petición si hay accessToken
    if (accessToken) {
      fetchOrders();
    } else {
      setLoading(false);
      setError('No hay token de acceso activo');
    }
  }, [accessToken]);

  return { orders, loading, error };
};
