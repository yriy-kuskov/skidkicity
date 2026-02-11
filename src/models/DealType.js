// src/models/DealType.js
import { BaseModel } from "@cakereact/core";

export class DealTypeModel extends BaseModel {
  constructor() {
    super('deal_types', {
      displayField: 'name',
    });
  }
}