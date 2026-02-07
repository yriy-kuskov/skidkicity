import { BaseModel } from '../cakereact/src/Model/BaseModel';

export class CategoryModel extends BaseModel {
  constructor() {
    super('categories', {
      displayField: 'name',
    });
  }
}