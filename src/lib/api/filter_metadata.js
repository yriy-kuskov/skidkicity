import { supabase } from '../supabase'

/**
 * Получает список всех магазинов для фильтра
 */
export async function fetchStores() {
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, logo')
      .order('name');
    if (error) throw error;
    return data;
  }
  
  /**
   * Получает список всех категорий для фильтра
   */
  export async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return data;
  }