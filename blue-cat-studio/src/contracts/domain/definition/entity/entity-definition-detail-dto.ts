/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityType } from "../../../enums/entity/entity-type";
import type { EntityPresentationDefinitionDTO } from "./entity-presentation-definition-dto";
import type { ComponentDefinitionDTO } from "./component-definition-dto";

export interface EntityDefinitionDetailDTO {
  iD: string;
  type: EntityType;
  presentation: EntityPresentationDefinitionDTO;
  components: ComponentDefinitionDTO[];
}
