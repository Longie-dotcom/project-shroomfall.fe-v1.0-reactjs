/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "./component-definition-dto";
import type { CollisionShapeType } from "../../../enums/entity/collision-shape-type";
import type { CollisionLayer } from "../../../enums/entity/collision-layer";

export interface CollisionDefinitionDTO extends ComponentDefinitionDTO {
  shapeType: CollisionShapeType;
  width: number;
  height: number;
  radius: number;
  isBlocking: boolean;
  layer: CollisionLayer;
  mask: CollisionLayer;
  offsetX: number;
  offsetY: number;
}
