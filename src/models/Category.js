import { BaseModel } from '@cakereact/core';

export class CategoryModel extends BaseModel {
  constructor() {
    super('categories', {
      displayField: 'name',
    });
  }
}