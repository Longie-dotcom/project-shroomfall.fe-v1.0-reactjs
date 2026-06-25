/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectType } from "../../enums/meta/effect/effect-type";
import type { AttributeType } from "../../enums/meta/effect/attribute-type";

export interface EffectDefinitionQueryDTO {
  searchTerm: string;
  type: EffectType;
  attributeType: AttributeType;
  sourceType: AttributeType;
  pageNumber: number;
  pageSize: number;
}
