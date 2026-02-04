import { supabase } from '../supabase'

/**
 * Получает полный список всех категорий из БД, отсортированный по алфавиту.
 * @returns {Promise<Array>} - Список объектов {id, name, created_at}.
 */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

/**
 * Проверяет наличие категории в базе. Если её нет — создает новую.
 * Используется в форме добавления товара.
 * @param {string} name - Название категории.
 * @returns {Promise<number>} - Возвращает ID категории.
 */
export async function ensureCategory(name) {
  if (!name) return null;
  
  // upsert добавит запись или вернет существующую при конфликте по полю 'name'
  const { data, error } = await supabase
    .from('categories')
    .upsert({ name }, { onConflict: 'name' })
    .select()
    .single();
    
  if (error) throw error;
  return data.id;
}