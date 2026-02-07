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
          (file) => ImageOptimizer.compress(file, { quality: 0.6 }) // Передаем функцию
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
}