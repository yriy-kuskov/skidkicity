import { useState, useEffect } from 'react';

export function useStatus({ items, loading, initialLoading, error, filters = {} }) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      // Если загрузка идет дольше 10 секунд — ставим флаг "медленно"
      timer = setTimeout(() => setIsSlow(true), 10000);
    } else {
      setIsSlow(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const getStatusType = () => {
    // 1. Проверка сети
    if (!navigator.onLine) return 'offline';

    // 2. Медленное соединение (показываем, только если еще грузимся)
    if (isSlow && loading) return 'slow_connection';

    // 3. Ошибка API
    if (error) return 'error';

    // 4. Пустые результаты
    if (!loading && !initialLoading && items.length === 0) {
      const hasActiveFilters = Object.values(filters).some(v => 
        Array.isArray(v) ? v.length > 0 : Boolean(v)
      );
      return hasActiveFilters ? 'no_results' : 'empty';
    }

    return null; // Всё хорошо, данные есть
  };

  return { 
    statusType: getStatusType(), 
    resetSlow: () => setIsSlow(false) 
  };
}