import { useState, useMemo } from 'react';

/**
 * Custom hook for search and filtering functionality
 */
// Helper function outside the hook to prevent initialization issues
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const useSearch = (data, searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({});

  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let result = [...data];

    // Apply search with better matching
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          if (!value) return false;
          
          const stringValue = value.toString().toLowerCase();
          // Check for exact match, partial match, or word match
          return stringValue.includes(searchLower) || 
                 stringValue.split(' ').some(word => word.startsWith(searchLower));
        });
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
            const numValue = parseFloat(itemValue);
            return numValue >= value.min && numValue <= value.max;
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting with better handling
    if (sortBy) {
      result.sort((a, b) => {
        let aValue = getNestedValue(a, sortBy);
        let bValue = getNestedValue(b, sortBy);
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortOrder === 'desc' ? 1 : -1;
        if (bValue == null) return sortOrder === 'desc' ? -1 : 1;
        
        // Handle date sorting
        if (sortBy === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // Handle string sorting (case insensitive)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, searchTerm, sortBy, sortOrder, filters, searchFields]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
    setSortOrder('asc');
  };

  const removeFilter = (key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    updateFilter,
    removeFilter,
    clearFilters,
    filteredData: filteredAndSortedData,
    totalResults: filteredAndSortedData.length,
    hasActiveFilters: searchTerm.trim() !== '' || Object.keys(filters).length > 0 || sortBy !== ''
  };
};