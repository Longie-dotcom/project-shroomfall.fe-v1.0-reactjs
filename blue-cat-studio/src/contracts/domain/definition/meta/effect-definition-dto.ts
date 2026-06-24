/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectType } from "../../../enums/meta/effect/effect-type";
import type { AttributeType } from "../../../enums/meta/effect/attribute-type";
import type { EffectPresentationDefinitionDTO } from "./effect-presentation-definition-dto";

export interface EffectDefinitionDTO {
  iD: string;
  type: EffectType;
  attributeType: AttributeType;
  sourceType: AttributeType;
  value: number;
  duration: number;
  interval: number;
  presentation: EffectPresentationDefinitionDTO;
}
