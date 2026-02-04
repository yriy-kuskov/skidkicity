import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

/**
 * @component SearchBar
 * @description Универсальная строка поиска с Debounce и кнопкой очистки.
 */
export default function SearchBar({ value, onChange, placeholder = 'Поиск...', onFilterClick }) {
  // Локальное состояние для мгновенного отображения ввода
  const [localValue, setLocalValue] = useState(value);

  // Синхронизация локального значения с внешним (на случай сброса фильтров извне)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Эффект Debounce: обновляем глобальный фильтр только после паузы в 600мс
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
          
          <input
            type="text"
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base transition-all"
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
    </div>
  );
}