/**
 * Вспомогательная функция для очистки тегов категорий от Open Food Facts.
 */
function formatCategory(tags) {
    if (!tags?.length) return 'Разное'
    const last = tags[tags.length - 1]
    const part = last.includes(':') ? last.split(':')[1] : last
    return part
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }
  
  /**
   * Ищет информацию о товаре в глобальной базе Open Food Facts.
   * @param {string} barcode - Штрих-код.
   * @returns {Promise<Object|null>} - Данные товара (имя, фото, категория).
   */
  export async function searchExternalProduct(barcode) {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
        { headers: { 'User-Agent': 'SkidkiCity/1.0' } }
      )
      const json = await response.json()
  
      if (json.status === 1 && json.product) {
        const p = json.product
        return {
          name: p.product_name_ru || p.product_name || 'Неизвестный товар',
          image: p.image_front_url || p.image_url || null,
          category: formatCategory(p.categories_tags) || 'Разное',
        }
      }
    } catch (err) {
      console.warn('Ошибка внешнего поиска (OFF):', err)
    }
    return null
  }