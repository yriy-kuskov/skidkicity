import { BaseModel } from '../cakereact/src/Model/BaseModel';

export const ProductModel = new BaseModel('products', {
  displayField: 'name',
  // Здесь мы можем позже добавить hasMany: { Deals: { ... } }
});