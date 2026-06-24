/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "./component-definition-dto";
import type { HSVDTO } from "../../../common/hsvdto";

export interface AppearanceDefinitionDTO extends ComponentDefinitionDTO {
  skinID: string;
  skinColor: HSVDTO;
  hairID: string;
  eyesID: string;
  shirtID: string;
  pantID: string;
  hairColor: HSVDTO;
  pantColor: HSVDTO;
}
