/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemType } from "../../enums/meta/item/item-type";
import type { ItemCategory } from "../../enums/meta/item/item-category";

export interface ItemDefinitionQueryDTO {
  searchTerm: string;
  type: ItemType;
  category: ItemCategory;
  pageNumber: number;
  pageSize: number;
}
