/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { AttributeDefinitionDTO } from "../../domain/definition/attribute/attribute-definition-dto";
import type { EffectDefinitionDTO } from "../../domain/definition/meta/effect-definition-dto";
import type { ItemDefinitionDTO } from "../../domain/definition/meta/item-definition-dto";
import type { EntityDefinitionDTO } from "../../domain/definition/entity/entity-definition-dto";
import type { InteractableDefinitionDTO } from "../../domain/definition/entity/interactable-definition-dto";
import type { PortalDefinitionDTO } from "../../domain/definition/entity/portal-definition-dto";
import type { CellDefinitionDTO } from "../../domain/definition/world/cell-definition-dto";
import type { EntitySpawnRuleDefinitionDTO } from "../../domain/definition/world/entity-spawn-rule-definition-dto";
import type { RoomDefinitionDTO } from "../../domain/definition/world/room-definition-dto";
import type { RoomConnectionDefinitionDTO } from "../../domain/definition/world/room-connection-definition-dto";
import type { LocaleDTO } from "../../domain/definition/locale/locale-dto";

export interface DefinitionSnapshotDTO {
  version: number;
  attributes: AttributeDefinitionDTO[];
  effects: EffectDefinitionDTO[];
  items: ItemDefinitionDTO[];
  entities: EntityDefinitionDTO[];
  interactables: InteractableDefinitionDTO[];
  portals: PortalDefinitionDTO[];
  cells: CellDefinitionDTO[];
  entitySpawnRules: EntitySpawnRuleDefinitionDTO[];
  rooms: RoomDefinitionDTO[];
  roomConnections: RoomConnectionDefinitionDTO[];
  locales: LocaleDTO[];
}
