/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemType } from "../../../enums/meta/item/item-type";
import type { ItemCategory } from "../../../enums/meta/item/item-category";
import type { EntityAction } from "../../../enums/entity/entity-action";
import type { ItemPresentationDefinitionDTO } from "./item-presentation-definition-dto";
import type { SpawnEntityConfigDTO } from "./spawn-entity-config-dto";
import type { ApplyEffectConfigDTO } from "./apply-effect-config-dto";
import type { EquipConfigDTO } from "./equip-config-dto";
import type { CostConfigDTO } from "./cost-config-dto";

export interface ItemDefinitionDTO {
  iD: string;
  type: ItemType;
  category: ItemCategory;
  maxStack: number;
  maxDurability: number;
  triggeredAction: EntityAction;
  presentation: ItemPresentationDefinitionDTO;
  spawnEntityConfig: SpawnEntityConfigDTO;
  applyEffectConfig: ApplyEffectConfigDTO;
  equipConfig: EquipConfigDTO;
  costConfig: CostConfigDTO;
}
