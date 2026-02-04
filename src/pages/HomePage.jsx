import { useState, useEffect } from 'react'
import { fetchStores, fetchCategories } from '../lib/api/filter_metadata'
import { useFilters } from '../hooks/useFilters'
import { useStatus } from '../hooks/useStatus'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useDeals } from '../hooks/useDeals'
import { Loader2 } from 'lucide-react'

import SearchBar from '../components/common/SearchBar'
import ActiveFilters from '../components/common/ActiveFilters'
import FilterDrawer from '../components/common/FilterDrawer'
import DataGrid from '../components/entities/DataGrid'
import StatusState from '../components/common/StatusState'
import LiteModeBanner from '../components/common/LiteModeBanner'

export default function HomePage() {
  const [allStores, setAllStores] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);

  // 1. Умные хуки логики
  const { filters, updateFilters, removeFilter, clearAll } = useFilters();
  const { deals, loading, error, totalCount, page, hasMore, loadDeals } = useDeals(filters);
  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => loadDeals(page + 1, false)
  });

  // 2. Статусы (медленный инет, пустые результаты и т.д.)
  const { statusType, resetSlow } = useStatus({ items: deals, loading, error, filters });

  // Эффекты
  useEffect(() => { loadDeals(0, true); }, [filters, loadDeals]);
  
  useEffect(() => {
    Promise.all([fetchStores(), fetchCategories()]).then(([s, c]) => {
      setAllStores(s); setAllCategories(c);
    });
  }, []);

  const handleToggleLiteMode = (val) => {
    setIsLiteMode(val);
    resetSlow();
    loadDeals(0, true);
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto px-4 md:px-8">
      <SearchBar 
        value={filters.query} 
        onChange={(v) => updateFilters({ query: v })} 
        onFilterClick={() => setIsFilterOpen(true)} 
      />

      {isLiteMode && <LiteModeBanner onDisable={() => handleToggleLiteMode(false)} />}

      <ActiveFilters filters={filters} onRemove={removeFilter} onClearAll={clearAll} storeList={allStores} categoryList={allCategories} />

      {statusType ? (
        <StatusState 
          type={statusType} isLiteMode={isLiteMode} errorMessage={error}
          onAction={() => statusType === 'no_results' ? clearAll() : (isLiteMode ? handleToggleLiteMode(false) : loadDeals(0, true))}
          onSecondaryAction={statusType === 'slow_connection' && !isLiteMode ? () => handleToggleLiteMode(true) : null}
        />
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center text-sm">
            <h2 className="font-semibold text-gray-400 uppercase tracking-widest">
              {filters.query ? `Поиск: ${filters.query}` : 'Акции'}
            </h2>
            <div className="font-bold text-gray-900">Найдено: {totalCount}</div>
          </div>

          <DataGrid items={deals} liteMode={isLiteMode} />
          
          {/* Лоадер пагинации внизу */}
          <div ref={lastElementRef} className="py-10 flex justify-center">
            {loading && hasMore && <Loader2 className="w-8 h-8 text-primary animate-spin opacity-20" />}
          </div>
        </>
      )}

      {/* Глобальный лоадер при первой загрузке */}
      {loading && deals.length === 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} activeFilters={filters} onApply={updateFilters} stores={allStores} categories={allCategories} />
    </div>
  )
}