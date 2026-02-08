// src/models/DealType.js
import { BaseModel } from "../cakereact/src";

export class DealTypeModel extends BaseModel {
  constructor() {
    super('deal_types', {
      displayField: 'name',
    });
  }
}