import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Извлекаем фильтры из URL
  const filters = useMemo(() => ({
    query: searchParams.get('q') || '',
    stores: searchParams.get('stores')?.split(',').filter(Boolean) || [],
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || []
  }), [searchParams]);

  // 2. Универсальное обновление параметров
  const updateFilters = useCallback((newParams) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : String(value).trim() !== '')) {
        const val = Array.isArray(value) 
          ? [...new Set(value.map(String).filter(Boolean))].join(',') 
          : value;
        params.set(key === 'query' ? 'q' : key, val);
      } else {
        params.delete(key === 'query' ? 'q' : key);
      }
    });
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // 3. Точечное удаление одного элемента или полная очистка
  const removeFilter = useCallback((type, id = 'all') => {
    if (id === 'all') {
      const params = new URLSearchParams(searchParams);
      params.delete(type);
      setSearchParams(params);
    } else {
      const updated = filters[type].filter(item => item !== String(id));
      updateFilters({ [type]: updated });
    }
  }, [filters, searchParams, updateFilters, setSearchParams]);

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams()); // Полная очистка URL
  }, [setSearchParams]);

  return { filters, updateFilters, removeFilter, clearAll };
}