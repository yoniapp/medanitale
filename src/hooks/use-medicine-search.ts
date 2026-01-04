"use client";

import { useState, useEffect, useCallback } from 'react';

interface MedicineSuggestion {
    name: string;
}

export const useMedicineSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = useCallback(async (name: string) => {
        if (name.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // RxNorm Approximate Matching / Spelling Suggestions API
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(name)}`);
            const data = await response.json();

            const suggestionList = data.suggestionGroup?.suggestionList?.suggestion || [];
            setSuggestions(suggestionList);
        } catch (error) {
            console.error('Error fetching medicine suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                fetchSuggestions(searchTerm);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, fetchSuggestions]);

    return {
        searchTerm,
        setSearchTerm,
        suggestions,
        loading,
    };
};
