import { supabase } from './supabase'

/**
 * Имя корзины (bucket) в Supabase Storage, где хранятся все изображения.
 */
export const BUCKET_NAME = 'deal-images'

/**
 * Универсальная функция для загрузки изображений.
 * @param {File} file - Объект файла из input или камеры.
 * @param {string} folder - Папка в хранилище ('products' или 'deals').
 * @param {string|number} identifier - Уникальная строка (например, штрих-код или ID).
 * @returns {Promise<string|null>} - Возвращает публичную ссылку на файл.
 */
export async function uploadImage(file, folder, identifier) {
  if (!file) return null

  // Генерируем уникальное имя файла с меткой времени, чтобы избежать дублей
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${folder}/${identifier}-${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Ошибка загрузки в Storage:', error.message)
    throw error
  }

  // Получаем и возвращаем прямую публичную ссылку на загруженный файл
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}