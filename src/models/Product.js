import { BaseModel } from '../cakereact/src/Model/BaseModel';
import { ImageOptimizer } from '../cakereact/src/Utils/ImageOptimizer';
import { UploadImageBehavior } from '../cakereact/src/Model/Behaviors/UploadImageBehavior';

export class ProductModel extends BaseModel {
  constructor() {
    super('products', {
      displayField: 'name',
    });
    
    this.uploader = new UploadImageBehavior({
      // Поле 1: С фото и оптимизацией
      image_url: {
        folder: 'products',
        transformers: [
          // Оптимизируем: макс. ширина 800px, качество 70%, формат WebP (он легче)
          (file) => ImageOptimizer.compress(file, { 
            maxWidth: 800,
            maxHeight: 800, 
            quality: 0.6,
            mimeType: 'image/webp' 
         })
        ]
      },
      // Поле 2: Штрих-код (загружаем "как есть", без потерь качества)
      barcode_image_url: {
        folder: 'barcodes'
      }
    }, 'deal-images');
  }

  async save(data) {
    const preparedData = await this.uploader.processUploads(data, this);
    return super.save(preparedData); //
  }

  // Не забудь добавить delete, чтобы чистить файлы
  async delete(id) {
    const record = await this.findById(id);
    if (record) {
      await this.uploader.deleteAllFiles(record);
    }
    return super.delete(id);
  }
}