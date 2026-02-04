import { useState } from 'react';
import { Search, Loader2, Barcode } from 'lucide-react';

/**
 * @component BarcodeSearch
 * @description Поле ввода штрих-кода с защитой от вылета за границы экрана на мобильных.
 * CURSOR: Не меняй логику onKeyPress, она важна для работы со сканерами (имитация Enter).
 */
export default function BarcodeSearch({ onSearch, isSearching }) {
  const [barcode, setBarcode] = useState('');

  const handleSearch = () => {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode) return;
    onSearch(cleanBarcode);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
        <Barcode className="w-4 h-4 text-primary" />
        Штрих-код товара
      </label>
      
      {/* w-full и flex-wrap (опционально) или просто правильный flex-shrink */}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          inputMode="numeric"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Наведите сканер или введите цифры"
          /* min-w-0 — критически важно, чтобы инпут мог сужаться.
             text-base — предотвращает зум на iPhone.
          */
          className="flex-1 min-w-0 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-primary focus:bg-white focus:outline-none transition-all font-mono text-base md:text-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !barcode.trim()}
          /* flex-shrink-0 — запрещает кнопке уменьшаться, выталкивая инпут.
             white-space-nowrap — запрещает перенос текста внутри кнопки.
          */
          className="flex-shrink-0 bg-primary hover:bg-red-600 disabled:bg-gray-200 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:shadow-none flex items-center justify-center min-w-[60px]"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}