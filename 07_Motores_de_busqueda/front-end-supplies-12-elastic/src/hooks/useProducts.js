import { useState, useEffect, useCallback } from "react";
import { mockProducts } from "../utils/mockData";
import { buildApiUrl } from "../utils/apiConfig";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Estados para filtros
  const [filters, setFilters] = useState({
    name: "",
    minPrice: 0,
    maxPrice: 10000,
    type: ""
  });

  const buildQueryParams = (page = 0, currentFilters = filters) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    // Solo incluir el filtro de nombre si está vacío O tiene 3+ caracteres
    if (currentFilters.name && currentFilters.name.length >= 3) {
      params.append('name', currentFilters.name);
    }

    if (currentFilters.minPrice > 0) {
      params.append('minPrice', currentFilters.minPrice.toString());
    }

    if (currentFilters.maxPrice < 10000) {
      params.append('maxPrice', currentFilters.maxPrice.toString());
    }

    if (currentFilters.type) {
      params.append('type', currentFilters.type);
    }

    return params.toString();
  };

  const fetchProducts = useCallback(async (page = 0, isLoadMore = false, currentFilters = filters) => {
    console.log(`🔍 Fetching products - Page: ${page}, IsLoadMore: ${isLoadMore}, Filters:`, currentFilters);

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setProducts([]);
    }

    setError("");

    try {
      const queryParams = buildQueryParams(page, currentFilters);
      const apiUrl = buildApiUrl('CATALOGUE', `/api/v1/supplies?${queryParams}`);
      console.log(`📡 API URL: ${apiUrl}`);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Error al cargar productos del servidor');
      }

      const data = await response.json();
      const newProducts = data.supplies || [];
      console.log(`📦 Received ${newProducts.length} products`);

      if (newProducts.length === 0) {
        console.log("❌ No more products available");
        setHasMoreProducts(false);
      } else {
        if (isLoadMore) {
          console.log("➕ Adding products to existing list");
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          console.log("🔄 Replacing product list");
          setProducts(newProducts);
          setHasMoreProducts(true);
        }
        setCurrentPage(page);
      }

    } catch (err) {
      console.log("❌ Error en petición HTTP:", err.message);
      console.log("📋 Cargando datos de respaldo...");

      // Cargar datos de respaldo con un pequeño delay para simular carga
      setTimeout(() => {
        if (!isLoadMore) {
          setProducts(mockProducts);
        }
        setError("Datos cargados desde caché local");
        setHasMoreProducts(false);
      }, 1000);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // Función para cargar más productos (scroll infinito)
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMoreProducts) {
      fetchProducts(currentPage + 1, true);
    }
  }, [fetchProducts, currentPage, loadingMore, hasMoreProducts]);

  // Función para aplicar filtros
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
    setHasMoreProducts(true);
    fetchProducts(0, false, newFilters);
  }, [fetchProducts]);

  // Efecto inicial para cargar productos
  useEffect(() => {
    fetchProducts(0, false);
  }, []);

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMoreProducts,
    filters,
    loadMoreProducts,
    applyFilters
  };
}
