/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "./component-definition-dto";

export interface CollisionDefinitionDTO extends ComponentDefinitionDTO {
  shapeType: string;
  width: number;
  height: number;
  radius: number;
  isBlocking: boolean;
  layer: string;
  mask: string;
  offsetX: number;
  offsetY: number;
}
