import { BaseModel } from '../cakereact/src/Model/BaseModel';

export const CategoryModel = new BaseModel('categories', {
  displayField: 'name',
  // Здесь мы можем позже добавить hasMany: { Deals: { ... } }
});