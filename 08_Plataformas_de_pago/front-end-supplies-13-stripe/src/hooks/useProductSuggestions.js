import { useState, useCallback } from 'react';
import { buildApiUrl } from '../utils/apiConfig';

export function useProductSuggestions() {
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    const fetchSuggestions = useCallback(async (searchTerm, currentType = '') => {
        if (!searchTerm || searchTerm.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);

        try {
            const params = new URLSearchParams();
            params.append('name', searchTerm.trim());
            params.append('page', '0');
            params.append('size', '8'); // Limitamos a 8 sugerencias

            if (currentType) {
                params.append('type', currentType);
            }

            const url = buildApiUrl('CATALOGUE', '/api/v1/supplies');
            const fullUrl = `${url}?${params.toString()}`;

            const response = await fetch(fullUrl, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`Error ${response.status}: ${response.statusText}`);
                setSuggestions([]);
                return;
            }

            const data = await response.json();
            setSuggestions(data.supplies || []);

        } catch (err) {
            console.error('Error fetching suggestions:', err);
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, []);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
    }, []);

    return {
        suggestions,
        loadingSuggestions,
        fetchSuggestions,
        clearSuggestions
    };
}
