import { supabase } from '../supabase';

/**
 * Глобальная конфигурация областей поиска.
 * Легко расширяется для админки, ЛК и т.д.
 */
const SCOPE_CONFIG = {
  products: {
    table: 'products',
    searchColumn: 'name',
    select: 'name, id',
  },
  stores: {
    table: 'stores',
    searchColumn: 'name',
    select: 'name, id',
  },
  categories: {
    table: 'categories',
    searchColumn: 'name',
    select: 'name, id',
  },
  // Для будущей админки
  users: {
    table: 'profiles', // или 'users'
    searchColumn: 'email',
    select: 'email, id, full_name',
  },
  // Для личного кабинета (пример с фильтрацией)
  favorites: {
    table: 'favorites',
    searchColumn: 'product_name', // Предположим, есть денормализованное поле или вьюха
    select: 'product_id, product_name',
  }
};

/**
 * Универсальная функция получения подсказок.
 * * @param {string} scope - Ключ из SCOPE_CONFIG (products, users, etc.)
 * @param {string} query - Строка поиска
 * @param {Object} options - Дополнительные параметры (limit, filters)
 * @param {AbortSignal} signal - Сигнал отмены запроса
 */
export async function getSuggestions(scope, query, options = {}, signal = null) {
  const config = SCOPE_CONFIG[scope];
  
  if (!config || !query || query.length < 2) return [];

  const { limit = 10, filters = {} } = options;

  let request = supabase
    .from(config.table)
    .select(config.select)
    .ilike(config.searchColumn, `%${query}%`)
    .limit(limit)
    .abortSignal(signal);

  // Динамически применяем дополнительные фильтры (например, user_id)
  Object.entries(filters).forEach(([column, value]) => {
    request = request.eq(column, value);
  });

  const { data, error } = await request;

  if (error) {
    if (error.name === 'AbortError') return [];
    console.error(`[Search API] Error in scope "${scope}":`, error);
    return [];
  }

  return data;
}

/**
 * Пример использования для глобального поиска по нескольким областям сразу.
 */
export async function getQuickSearch(query, signal = null) {
  if (!query || query.length < 2) return { products: [], stores: [] };

  try {
    const [products, stores] = await Promise.all([
      getSuggestions('products', query, { limit: 5 }, signal),
      getSuggestions('stores', query, { limit: 3 }, signal)
    ]);

    return { products, stores };
  } catch (err) {
    return { products: [], stores: [] };
  }
}