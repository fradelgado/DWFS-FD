import { useState, useEffect, useCallback } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);
    const [aggregations, setAggregations] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const [filters, setFilters] = useState({
        name: '',
        type: ''
    });

    const buildQueryParams = useCallback((page = 0, currentFilters = filters) => {
        const params = new URLSearchParams();

        if (page > 0) {
            params.append('page', page.toString());
        }

        if (currentFilters.name && currentFilters.name.trim().length >= 3) {
            params.append('name', currentFilters.name.trim());
        }

        if (currentFilters.type) {
            params.append('type', currentFilters.type);
        }

        return params.toString();
    }, [filters]);

    const fetchProducts = useCallback(async (page = 0, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        setError(null);

        try {
            const queryParams = buildQueryParams(page);
            const url = buildApiUrl('CATALOGUE', '/api/v1/supplies');
            const fullUrl = `${url}${queryParams ? `?${queryParams}` : ''}`;

            const response = await fetch(fullUrl, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`Error ${response.status}: ${response.statusText}`);
                setError('Error al cargar productos. Por favor, inténtalo de nuevo.');
                if (!append) {
                    setProducts([]);
                }
                return;
            }

            const data = await response.json();

            // Actualizar productos
            if (append) {
                setProducts(prev => [...prev, ...data.supplies]);
            } else {
                setProducts(data.supplies);
                setCurrentPage(0);
            }

            // Actualizar metadatos
            setTotalProducts(data.total);
            setAggregations(data.aggregations || []);

            // Verificar si hay más productos
            const currentTotal = append ? products.length + data.supplies.length : data.supplies.length;
            setHasMoreProducts(currentTotal < data.total);

            if (append) {
                setCurrentPage(page);
            }

        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error al cargar productos. Por favor, inténtalo de nuevo.');

            if (!append) {
                setProducts([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [buildQueryParams, products.length]);

    const loadMoreProducts = useCallback(() => {
        if (!loadingMore && hasMoreProducts) {
            fetchProducts(currentPage + 1, true);
        }
    }, [currentPage, loadingMore, hasMoreProducts, fetchProducts]);

    const applyFilters = useCallback((newFilters) => {
        // Validar filtro de nombre
        if (newFilters.name && newFilters.name.trim().length > 0 && newFilters.name.trim().length < 3) {
            return;
        }

        setFilters(newFilters);
        setCurrentPage(0);
        setProducts([]);
        setHasMoreProducts(true);

        // Hacer la búsqueda con los nuevos filtros desde la página 0
        const queryParams = buildQueryParams(0, newFilters);
        const url = buildApiUrl('CATALOGUE', '/api/v1/supplies');
        const fullUrl = `${url}${queryParams ? `?${queryParams}` : ''}`;

        setLoading(true);
        setError(null);

        fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Error ${response.status}: ${response.statusText}`);
                setError('Error al cargar productos. Por favor, inténtalo de nuevo.');
                setProducts([]);
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setProducts(data.supplies);
                setTotalProducts(data.total);
                setAggregations(data.aggregations || []);
                setHasMoreProducts(data.supplies.length < data.total);
                setCurrentPage(0);
            }
        })
        .catch(err => {
            console.error('Error fetching products:', err);
            setError('Error al cargar productos. Por favor, inténtalo de nuevo.');
            setProducts([]);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [buildQueryParams]);

    // Cargar productos iniciales
    useEffect(() => {
        fetchProducts(0, false);
    }, []);

    return {
        products,
        loading,
        loadingMore,
        error,
        hasMoreProducts,
        totalProducts,
        aggregations,
        filters,
        loadMoreProducts,
        applyFilters
    };
}
