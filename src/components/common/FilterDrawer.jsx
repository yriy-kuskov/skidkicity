import React, { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';

export default function FilterDrawer({ 
  isOpen, 
  onClose, 
  activeFilters, 
  onApply,
  stores = [],      // Получаем извне
  categories = [],  // Получаем извне
  isLoadingMetadata // Флаг загрузки
}) {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Синхронизируем выбор при открытии шторки
  useEffect(() => {
    if (isOpen) {
      setSelectedStores(activeFilters.stores.map(String));
      setSelectedCategories(activeFilters.categories.map(String));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, activeFilters]);

  const toggleItem = (id, currentList, setList) => {
    const stringId = String(id);
    setList(currentList.includes(stringId) 
      ? currentList.filter(item => item !== stringId) 
      : [...currentList, stringId]
    );
  };

  const handleApply = () => {
    onApply({ stores: selectedStores, categories: selectedCategories });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button 
            onClick={() => { setSelectedStores([]); setSelectedCategories([]); }} 
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            Сбросить
          </button>
          <h3 className="text-base font-semibold text-gray-900">Фильтры</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoadingMetadata ? (
            <div className="flex justify-center py-20">
               <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Магазины</h4>
                <div className="grid grid-cols-2 gap-3">
                  {stores.map(store => {
                    const isSelected = selectedStores.includes(String(store.id));
                    return (
                      <button
                        key={store.id}
                        onClick={() => toggleItem(store.id, selectedStores, setSelectedStores)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/[0.03] ring-1 ring-primary' 
                            : 'border-gray-100 hover:border-gray-300 bg-gray-50/30'
                        }`}
                      >
                        <span className="text-lg">{store.logo || '🏪'}</span>
                        <span className={`text-sm truncate ${isSelected ? 'text-primary font-medium' : 'text-gray-600'}`}>{store.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Категории</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const isSelected = selectedCategories.includes(String(cat.id));
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleItem(cat.id, selectedCategories, setSelectedCategories)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary border-primary text-white shadow-sm' 
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-50">
          <button
            onClick={handleApply}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}