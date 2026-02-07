import { BaseModel } from '../cakereact/src/Model/BaseModel';

export class StoreModel extends BaseModel {
  constructor() {
    super('stores', {
      displayField: 'name',
    });
  }
}