import React, { useState, useEffect, useRef } from "react";
import "./Products.css";
import { useProducts } from "../../hooks/useProducts";
import { Link } from "react-router-dom";
import ProductsFilter from "../ProductsFilter/ProductsFilter";

export default function Products() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const observerRef = useRef();

    // Custom hook que maneja toda la lógica de productos con filtros y paginación
    const {
        products,
        loading,
        loadingMore,
        error: fetchError,
        hasMoreProducts,
        totalProducts,
        aggregations,
        filters,
        loadMoreProducts,
        applyFilters
    } = useProducts();

    // Configurar intersection observer para scroll infinito
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreProducts && !loadingMore) {
                    loadMoreProducts();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMoreProducts, loadingMore, loadMoreProducts]);

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function handleChange(e) {
        const value = e.target.value;
        setEmail(value);
        if (value === "" || validateEmail(value)) {
            setError("");
        } else {
            setError("Introduce un correo electrónico válido.");
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (validateEmail(email)) {
            console.log("Correo enviado:", email);
            setEmail("");
            setError("");
        } else {
            setError("Introduce un correo electrónico válido.");
            alert("El correo no es válido");
        }
    }

    return (
        <div className="products">
            {/* Filtros de búsqueda */}
            <ProductsFilter
                filters={filters}
                onFiltersChange={applyFilters}
                aggregations={aggregations}
            />

            {/* Sección de productos */}
            <section className="products-section">
                <h2>Productos Disponibles</h2>

                {loading && <p className="loading-message">Cargando productos...</p>}

                {fetchError && <p className="fetch-error">{fetchError}</p>}

                {!loading && products.length === 0 && (
                    <div className="no-products">
                        <p>No se encontraron productos con los filtros aplicados.</p>
                        <p>Intenta ajustar los criterios de búsqueda.</p>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <>
                        <div className="products-info">
                            <p>
                                Mostrando {products.length} de {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-header">
                                        <h3 className="product-name">{product.name}</h3>
                                        <span className="product-type">{product.type}</span>
                                    </div>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-footer">
                                        <span className="product-price">€{product.price}</span>
                                        <span className="product-stock">Stock: {product.stock}</span>
                                    </div>
                                    <div className="product-actions">
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="view-detail-btn"
                                        >
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Elemento para detectar scroll infinito y botón de cargar más */}
                        {hasMoreProducts && (
                            <div className="load-more-section">
                                <div ref={observerRef} className="scroll-trigger">
                                    {loadingMore && (
                                        <div className="loading-more">
                                            <p>Cargando más productos...</p>
                                            <div className="loading-spinner"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Botón manual para cargar más */}
                                {!loadingMore && (
                                    <div className="load-more-button-container">
                                        <button
                                            className="load-more-btn"
                                            onClick={loadMoreProducts}
                                            disabled={loadingMore}
                                        >
                                            Cargar más productos
                                        </button>
                                        <p className="load-more-hint">
                                            O simplemente continúa haciendo scroll hacia abajo
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!hasMoreProducts && products.length > 0 && (
                            <div className="end-of-results">
                                <p>✅ Has visto todos los productos disponibles</p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Formulario de newsletter */}
            <section className="newsletter-section">
                <h2>Newsletter</h2>
                <form className="newsletter-form" onSubmit={handleSubmit} autoComplete="off">
                    <label htmlFor="newsletter-email">Suscríbete a la newsletter:</label>
                    <input
                        id="newsletter-email"
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={handleChange}
                    />
                    <button type="submit">Enviar</button>
                    <p className="newsletter-error">
                        {error}
                    </p>
                </form>
            </section>
        </div>
    );
}
