// src/components/common/ActiveFilters.jsx
export default function ActiveFilters({ filters, onRemove, onClearAll, storeList, categoryList }) {
    const getName = (id, list) => list.find(i => String(i.id) === String(id))?.name || id;
  
    if (!filters.stores.length && !filters.categories.length) return null;
  
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.stores.map(id => (
          <Chip key={id} label={getName(id, storeList)} onClick={() => onRemove('stores', id)} />
        ))}
        {filters.categories.map(id => (
          <Chip key={id} label={getName(id, categoryList)} onClick={() => onRemove('categories', id)} />
        ))}
        <button onClick={onClearAll} className="text-xs text-gray-400 hover:text-red-500 ml-2">
          Сбросить всё
        </button>
      </div>
    );
  }
  
  // Вспомогательный мирок-компонент для красоты
  const Chip = ({ label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-[11px] font-medium hover:bg-gray-200 transition-colors">
      {label} <span className="text-gray-400">×</span>
    </button>
  );