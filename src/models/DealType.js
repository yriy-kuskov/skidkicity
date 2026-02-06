// src/models/DealType.js
import { BaseModel } from '../cakereact/src/Model/BaseModel';

export const DealTypeModel = new BaseModel('deal_types', {
  displayField: 'name',
  // Здесь мы можем позже добавить hasMany: { Deals: { ... } }
});