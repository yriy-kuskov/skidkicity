import { BaseModel } from '../cakereact/src/Model/BaseModel';
import { ImageOptimizer } from '../cakereact/src/Utils/ImageOptimizer';
import { UploadImageBehavior } from '../cakereact/src/Model/Behaviors/UploadImageBehavior';

export class DealModel extends BaseModel {
  constructor() {
    super('deals', {
      displayField: 'description',
    });
    
    this.uploader = new UploadImageBehavior({
      // Поле 1: С фото и оптимизацией
      image_url: {
        folder: 'deals',
        transformers: [
          // Оптимизируем: макс. ширина 800px, качество 70%, формат WebP (он легче)
          (file) => ImageOptimizer.compress(file, { 
            maxWidth: 800, 
            quality: 0.7,
            mimeType: 'image/webp' 
         })
        ]
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