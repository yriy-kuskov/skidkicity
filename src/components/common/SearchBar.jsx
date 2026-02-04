import { Search, SlidersHorizontal } from 'lucide-react';

/**
 * @component SearchBar
 * @description Универсальная строка поиска для фильтрации товаров или скидок.
 * @param {string} value - Текущее значение поиска.
 * @param {function} onChange - Коллбэк при изменении текста.
 * @param {string} [placeholder="Поиск..."] - Текст-заполнитель для инпута.
 * @param {function} [onFilterClick] - (Optional) Обработка клика по кнопке фильтров.
 */
export default function SearchBar({ value, onChange, placeholder = "Поиск...", onFilterClick }) {
  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder} // Теперь используется значение из пропсов
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button 
          onClick={onFilterClick}
          className="bg-white border border-gray-300 rounded-lg px-4 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}