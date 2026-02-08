import { BaseModel } from '../cakereact/src';

export class StoreModel extends BaseModel {
  constructor() {
    super('stores', {
      displayField: 'name',
    });
  }
}