import JsBarcode from 'jsbarcode';
import { uploadImage } from '../api'; // Используем твой готовый метод 

/**
 * Генерирует PNG штрихкода локально и загружает его через существующий api.js
 * @param {string} barcode - Значение штрихкода (EAN-13).
 * @returns {Promise<string|null>} - Публичная ссылка на изображение.
 */
export async function generateAndUploadBarcode(barcode) {
  try {
    // 1. Генерируем ШК на невидимом canvas
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcode, {
      format: 'EAN13',
      width: 2,
      height: 100,
      displayValue: true,
      fontSize: 16,
      background: '#ffffff',
      margin: 10
    });

    // 2. Превращаем результат в Blob и создаем File объект
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], `${barcode}.png`, { type: 'image/png' });

    // 3. Используем ТВОЙ метод для загрузки в папку 'barcodes' 
    // Он сам создаст уникальное имя с меткой времени и вернет публичную ссылку.
    return await uploadImage(file, 'barcodes', barcode);
  } catch (err) {
    console.error('Ошибка в модуле штрихкодов:', err);
    return null;
  }
}