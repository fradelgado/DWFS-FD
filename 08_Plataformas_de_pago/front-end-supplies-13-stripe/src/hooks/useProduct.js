import { useState, useEffect } from "react";
import { mockProductDetails } from "../utils/mockProductDetails";
import { buildApiUrl } from "../utils/apiConfig";

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("ID de producto no válido");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        // Usar el gateway para peticiones de catálogo
        const apiUrl = buildApiUrl('CATALOGUE', `/api/v1/supplies/${productId}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('Error al cargar el producto del servidor');
        }

        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.log("Error en petición HTTP:", err.message);
        console.log("Cargando datos de respaldo para producto ID:", productId);

        // Cargar datos de respaldo con un pequeño delay para simular carga
        setTimeout(() => {
          const productData = mockProductDetails[productId];
          if (productData) {
            setProduct(productData);
            setError("Datos cargados desde caché local");
          } else {
            setError("Producto no encontrado");
          }
          setLoading(false);
        }, 800);
      }
    };

    fetchProduct();
  }, [productId]); // Se ejecuta cuando cambia el productId

  return { product, loading, error };
}
