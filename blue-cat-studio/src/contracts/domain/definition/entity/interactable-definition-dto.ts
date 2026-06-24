/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "./component-definition-dto";
import type { WorldObjectInteractionType } from "../../../enums/entity/world-object-interaction-type";

export interface InteractableDefinitionDTO extends ComponentDefinitionDTO {
  type: WorldObjectInteractionType;
}
