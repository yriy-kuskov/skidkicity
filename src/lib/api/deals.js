import { supabase } from '../supabase'

/**
 * Загружает скидки с учетом фильтрации на стороне БД и пагинации.
 * Добавлена поддержка AbortSignal для отмены запросов.
 */
export async function fetchDeals({ 
  page = 0, 
  pageSize = 10, 
  query = '', 
  stores = [], 
  categories = [],
  signal = null // Принимаем сигнал отмены
}) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let productIds = null;
  let storeIdsForQuery = null;

  // 1. Сначала обрабатываем поисковый запрос (если он есть)
  if (query) {
    const productSearchFields = `name.ilike.%${query}%,barcode.ilike.%${query}%`;
    
    // Передаем signal в запрос поиска продуктов
    const { data: matchedProducts } = await supabase
      .from('products')
      .select('id', { abortSignal: signal }) 
      .or(productSearchFields);
    
    // Передаем signal в запрос поиска магазинов
    const { data: matchedStores } = await supabase
      .from('stores')
      .select('id', { abortSignal: signal })
      .ilike('name', `%${query}%`);

    productIds = matchedProducts?.map(p => p.id) || [];
    storeIdsForQuery = matchedStores?.map(s => s.id) || [];
  }

  // 2. Базовый запрос сделок
  // В select вторым аргументом передаем настройки с abortSignal
  let request = supabase
    .from('deals')
    .select(`
      id, old_price, new_price, image_url, created_at,
      products!inner ( 
        id, name, image_url, barcode_image_url, category_id,
        categories!inner ( id, name ) 
      ), 
      stores!inner ( id, name, logo )
    `, { count: 'exact', abortSignal: signal }); 

  // 3. ПРИМЕНЯЕМ ФИЛЬТРЫ
  if (query) {
    if (productIds.length === 0 && storeIdsForQuery.length === 0) {
      return { deals: [], totalCount: 0, hasMore: false };
    }
    
    const orConditions = [];
    if (productIds.length > 0) orConditions.push(`product_id.in.(${productIds.join(',')})`);
    if (storeIdsForQuery.length > 0) orConditions.push(`store_id.in.(${storeIdsForQuery.join(',')})`);
    
    if (orConditions.length > 0) {
      request = request.or(orConditions.join(','));
    }
  }

  if (stores && stores.length > 0) {
    request = request.in('store_id', stores);
  }
  
  if (categories && categories.length > 0) {
    request = request.in('products.category_id', categories);
  }

  // 4. Выполнение запроса
  const { data, error, count } = await request
    .order('created_at', { ascending: false })
    .range(from, to);

  // Если запрос был отменен, Supabase может вернуть специфическую ошибку,
  // которую ваш try-catch в HomePage успешно перехватит как AbortError.
  if (error) throw error;

  const deals = (data || []).map((deal) => {
    const discount = deal.old_price && deal.new_price 
      ? Math.round(((deal.old_price - deal.new_price) / deal.old_price) * 100) 
      : 0;
    return {
      id: deal.id,
      name: deal.products?.name,
      category: deal.products?.categories?.name,
      image_url: deal.products?.image_url,
      barcode_image_url: deal.products?.barcode_image_url,
      proof_image_url: deal.image_url,
      oldPrice: deal.old_price,
      newPrice: deal.new_price,
      discount,
      addedDate: deal.created_at,
      store: deal.stores
    };
  });

  return { deals, totalCount: count || 0, hasMore: count ? to < (count - 1) : false };
}

/**
 * Создает новую скидку (связывает товар и магазин).
 */
export async function createDeal({ productId, storeId, oldPrice, newPrice, imageUrl }) {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      product_id: productId,
      store_id: storeId,
      old_price: parseFloat(oldPrice),
      new_price: parseFloat(newPrice),
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}