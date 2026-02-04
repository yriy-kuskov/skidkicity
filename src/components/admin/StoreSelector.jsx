import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

/**
 * @component StoreSelector
 * @description Компонент для выбора магазина из БД. Поддерживает сохранение выбора в sessionStorage.
 * @param {function} onSelect - Функция-коллбэк, вызываемая при выборе магазина. Передает объект магазина.
 * @param {Object} selectedStore - Текущий выбранный объект магазина для подсветки активного состояния.
 */
export default function StoreSelector({ onSelect, selectedStore }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Константа для ключа в сессии (прописана внутри, чтобы не экспортировать лишнего)
  const STORE_STORAGE_KEY = 'skidki-city-selected-store';

  useEffect(() => {
    async function fetchStores() {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('name');

        if (error) throw error;
        if (data) {
          setStores(data);
          
          // Восстановление из сессии
          const saved = sessionStorage.getItem(STORE_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            const exists = data.find(s => s.id === parsed.id);
            if (exists) {
              onSelect(exists);
              return;
            }
          }
          // По умолчанию выбираем первый
          if (data.length > 0 && !selectedStore) {
            onSelect(data[0]);
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки магазинов:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, [onSelect, selectedStore]);

  const handleSelect = (store) => {
    sessionStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(store));
    onSelect(store);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <span className="text-sm text-gray-400 font-medium">Загружаем магазины...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <label className="block text-xs font-black mb-4 text-gray-400 text-center uppercase tracking-widest">
        Выберите магазин
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {stores.map(s => (
          <button 
            key={s.id} 
            onClick={() => handleSelect(s)} 
            className={`flex flex-col items-center p-3 border-2 rounded-2xl transition-all ${
              selectedStore?.id === s.id 
                ? 'border-primary bg-red-50 shadow-sm transform scale-105' 
                : 'border-gray-50 hover:border-gray-200'
            }`}
          >
            <span className="text-3xl mb-1">{s.logo || '🏪'}</span>
            <span className="text-[10px] font-bold text-gray-700 truncate w-full text-center">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}