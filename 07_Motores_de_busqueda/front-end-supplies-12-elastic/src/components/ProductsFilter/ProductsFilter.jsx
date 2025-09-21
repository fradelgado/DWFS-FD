import React, { useState, useEffect, useRef } from "react";
import "./ProductsFilter.css";

export default function ProductsFilter({ filters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [priceTimeout, setPriceTimeout] = useState(null);

  // Opciones de tipo de producto
  const productTypes = [
    { value: "", label: "Todos los tipos" },
    { value: "Electronics", label: "Electrónicos" },
    { value: "Furniture", label: "Muebles" },
    { value: "Stationery", label: "Papelería" }
  ];

  // Efecto para manejar el debounce en la búsqueda por nombre
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      // Solo hacer petición si:
      // 1. El campo está vacío (permite búsqueda por otros filtros)
      // 2. O tiene 3 o más caracteres
      if (localFilters.name === "" || localFilters.name.length >= 3) {
        if (localFilters.name !== filters.name) {
          onFiltersChange(localFilters);
        }
      }
    }, 500); // Esperar 500ms después de que el usuario deje de escribir

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localFilters.name]);

  // Efecto para manejar el debounce en los precios (slider y inputs)
  useEffect(() => {
    if (priceTimeout) {
      clearTimeout(priceTimeout);
    }

    const timeout = setTimeout(() => {
      if (
        localFilters.minPrice !== filters.minPrice ||
        localFilters.maxPrice !== filters.maxPrice
      ) {
        onFiltersChange(localFilters);
      }
    }, 300); // Timeout más corto para precios

    setPriceTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localFilters.minPrice, localFilters.maxPrice]);

  // Aplicar filtro de tipo inmediatamente
  useEffect(() => {
    if (localFilters.type !== filters.type) {
      onFiltersChange(localFilters);
    }
  }, [localFilters.type]);

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (field, value) => {
    const numValue = parseInt(value) || 0;

    // Validar rangos
    if (field === 'minPrice') {
      const validMin = Math.max(0, Math.min(numValue, localFilters.maxPrice - 1));
      setLocalFilters(prev => ({
        ...prev,
        minPrice: validMin
      }));
    } else if (field === 'maxPrice') {
      const validMax = Math.min(10000, Math.max(numValue, localFilters.minPrice + 1));
      setLocalFilters(prev => ({
        ...prev,
        maxPrice: validMax
      }));
    }
  };

  const handleReset = () => {
    const resetFilters = {
      name: "",
      minPrice: 0,
      maxPrice: 10000,
      type: ""
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="products-filter">
      <div className="filter-section">
        <h3>Buscar productos</h3>

        {/* Barra de búsqueda por nombre */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos... (mínimo 3 caracteres)"
            value={localFilters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Filtros adicionales */}
        <div className="filters-row">
          {/* Filtro de tipo */}
          <div className="filter-group">
            <label htmlFor="type-select">Tipo de producto:</label>
            <select
              id="type-select"
              value={localFilters.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="type-select"
            >
              {productTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de precio */}
          <div className="filter-group price-group">
            <label>Rango de precio:</label>
            <div className="price-inputs">
              <div className="price-input-group">
                <label htmlFor="min-price">Mín:</label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  max="9999"
                  value={localFilters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>€</span>
              </div>
              <div className="price-input-group">
                <label htmlFor="max-price">Máx:</label>
                <input
                  id="max-price"
                  type="number"
                  min="1"
                  max="10000"
                  value={localFilters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="price-input"
                />
                <span>€</span>
              </div>
            </div>

            {/* Barra deslizante para el rango de precios */}
            <div className="price-slider">
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={localFilters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="slider min-slider"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={localFilters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="slider max-slider"
              />
            </div>
            <div className="price-range-display">
              €{localFilters.minPrice} - €{localFilters.maxPrice}
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="filter-group">
            <button onClick={handleReset} className="reset-filters-btn">
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
