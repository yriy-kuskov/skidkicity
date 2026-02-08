import { BaseModel } from '../cakereact/src';

export class CategoryModel extends BaseModel {
  constructor() {
    super('categories', {
      displayField: 'name',
    });
  }
}