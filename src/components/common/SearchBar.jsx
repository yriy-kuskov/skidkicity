import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, Store, Tag } from 'lucide-react';
import { getQuickSearch } from '../../lib/api/search'; // Импортируем наш новый API

/**
 * @component SearchBar
 * @description Строка поиска с Debounce, кнопкой очистки и автоподсказками.
 */
export default function SearchBar({ value, onChange, placeholder = 'Поиск...', onFilterClick }) {
  const [localValue, setLocalValue] = useState(value);
  const [suggestions, setSuggestions] = useState({ products: [], stores: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Синхронизация с внешним значением (например, при сбросе фильтров)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Закрытие подсказок при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      };
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Эффект для автоподсказок и основного поиска (Debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      // 1. Обновляем основной фильтр (существующая логика)
      if (localValue !== value) {
        onChange(localValue);
      }

      // 2. Логика подсказок
      if (localValue.trim().length >= 2) {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const results = await getQuickSearch(localValue, controller.signal);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions({ products: [], stores: [] });
        setShowSuggestions(false);
      }
    }, 500); // Немного уменьшил задержку для отзывчивости

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleSelectSuggestion = (name) => {
    setLocalValue(name);
    onChange(name);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setSuggestions({ products: [], stores: [] });
    setShowSuggestions(false);
  };

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <div className="flex gap-2">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          
          <input
            type="text"
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={() => localValue.length >= 2 && setShowSuggestions(true)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base transition-all shadow-sm"
          />

          {localValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 active:scale-90 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <button 
          onClick={onFilterClick}
          className="bg-white border border-gray-300 rounded-xl px-4 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Выпадающий список подсказок */}
      {showSuggestions && (suggestions.products.length > 0 || suggestions.stores.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Категория: Магазины */}
          {suggestions.stores.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">Магазины</div>
              {suggestions.stores.map((store) => (
                <button
                  key={`store-${store.id}`}
                  onClick={() => handleSelectSuggestion(store.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Store className="w-4 h-4 text-primary" />
                  <span className="text-gray-700">{store.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Разделитель */}
          {suggestions.stores.length > 0 && suggestions.products.length > 0 && <div className="border-t border-gray-100" />}

          {/* Категория: Товары */}
          {suggestions.products.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">Товары</div>
              {suggestions.products.map((product) => (
                <button
                  key={`prod-${product.id}`}
                  onClick={() => handleSelectSuggestion(product.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Tag className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-700">{product.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};