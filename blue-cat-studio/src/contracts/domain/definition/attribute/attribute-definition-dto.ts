/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { AttributeType } from "../../../enums/meta/effect/attribute-type";
import type { LocalizedTextDTO } from "../locale/localized-text-dto";
import type { DomainType } from "../../../enums/meta/effect/domain-type";

export interface AttributeDefinitionDTO {
  type: AttributeType;
  localizedText: LocalizedTextDTO;
  domainType: DomainType;
}
