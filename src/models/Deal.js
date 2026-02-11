import { BaseModel } from '@cakereact/core';
import { ImageOptimizer } from '@cakereact/core';
import { UploadImageBehavior } from '@cakereact/core';

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
            maxWidth: 400,
            maxHeight: 400,
            quality: 0.6,
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