import { BaseModel } from '@cakereact/core';

export class StoreModel extends BaseModel {
  constructor() {
    super('stores', {
      displayField: 'name',
    });
  }
}