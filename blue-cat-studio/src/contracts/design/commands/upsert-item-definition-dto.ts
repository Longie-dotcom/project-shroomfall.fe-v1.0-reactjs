/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemType } from "../../enums/meta/item/item-type";
import type { ItemCategory } from "../../enums/meta/item/item-category";
import type { EntityAction } from "../../enums/entity/entity-action";
import type { SpawnEntityConfigDTO } from "../../domain/definition/meta/spawn-entity-config-dto";
import type { ApplyEffectConfigDTO } from "../../domain/definition/meta/apply-effect-config-dto";
import type { EquipConfigDTO } from "../../domain/definition/meta/equip-config-dto";
import type { CostConfigDTO } from "../../domain/definition/meta/cost-config-dto";

export interface UpsertItemDefinitionDTO {
  iD: string;
  type: ItemType;
  category: ItemCategory;
  maxStack?: number;
  maxDurability?: number;
  triggeredAction?: EntityAction;
  spawnEntityConfig?: SpawnEntityConfigDTO;
  applyEffectConfig?: ApplyEffectConfigDTO;
  equipConfig?: EquipConfigDTO;
  costConfig: CostConfigDTO;
}
