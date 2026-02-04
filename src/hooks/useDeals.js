import { useState, useCallback, useRef } from 'react';
import { fetchDeals } from '../lib/api/deals';

export function useDeals(filters) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const abortControllerRef = useRef(null);

  const loadDeals = useCallback(async (pageNum, isNewSearch = false) => {
    // Отмена предыдущего запроса (Race Condition fix)
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    if (isNewSearch) {
      setDeals([]);
      setPage(0);
    }

    try {
      const result = await fetchDeals({
        ...filters,
        page: pageNum,
        pageSize: 12,
        signal: controller.signal
      });

      setDeals(prev => isNewSearch ? result.deals : [...prev, ...result.deals]);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      if (abortControllerRef.current === controller) setLoading(false);
    }
  }, [filters]);

  return { deals, loading, error, totalCount, page, hasMore, loadDeals };
}