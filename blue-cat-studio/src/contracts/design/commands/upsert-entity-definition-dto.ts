/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityType } from "../../enums/entity/entity-type";
import type { ComponentDefinitionDTO } from "../../domain/definition/entity/component-definition-dto";

export interface UpsertEntityDefinitionDTO {
  iD: string;
  type: EntityType;
  components: ComponentDefinitionDTO[];
}
