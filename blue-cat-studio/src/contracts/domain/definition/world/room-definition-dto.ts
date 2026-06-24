/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { RoomType } from "../../../enums/world/room-type";
import type { RoomPresentationDefinitionDTO } from "./room-presentation-definition-dto";

export interface RoomDefinitionDTO {
  iD: string;
  type: RoomType;
  presentation: RoomPresentationDefinitionDTO;
}
