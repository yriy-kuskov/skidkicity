import { supabase } from '../supabase';
import { generateAndUploadBarcode } from './barcodes';

/**
 * Поиск товара во внутренней БД по штрих-коду.
 * Подтягивает имя категории через JOIN с таблицей categories.
 * @param {string} barcode - Штрих-код товара.
 * @returns {Promise<Object|null>} - Объект товара или null, если не найден.
 */
export async function fetchProductByBarcode(barcode) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories ( name )
    `)
    .eq('barcode', barcode);

    if (error) {
      // Если ошибка 406 всё еще тут, значит проблема в структуре БД (см. шаг 2)
      console.error("Ошибка при поиске:", error.message);
      throw error;
    }
  
    // Если массив пустой — товара нет, возвращаем null без ошибки
    if (!data || data.length === 0) return null;
  
    const product = data[0];

  // Преобразуем вложенный объект категории в плоское поле для удобства UI
  return {
    ...product,
    category: product.categories?.name || 'Разное'
  };
}

/**
 * Создает новую запись товара в базе данных.
 * @param {Object} params - Данные товара.
 * @returns {Promise<Object>} - Созданная запись товара.
 * @description Автоматически генерирует изображение штрихкода перед сохранением.
 */
export async function createProduct({ barcode, name, category_id, image_url }) {
  // 1. Сначала генерируем картинку штрихкода
  const barcodeImageUrl = await generateAndUploadBarcode(barcode);

  // 2. Сохраняем товар со всеми ссылками
  const { data, error } = await supabase
    .from('products')
    .insert({ 
      barcode, 
      name, 
      category_id, 
      image_url, 
      barcode_image_url: barcodeImageUrl
    })
    .select(`*, categories(name)`)
    .single();

    if (error) {
      console.error('Ошибка при создании товара:', error.message);
      throw error;
    }

  return data;
}