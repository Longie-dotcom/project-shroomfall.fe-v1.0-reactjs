import { useState, useEffect } from "react";
import type { ItemDefinitionDTO } from "../contracts/domain/definition/meta/item-definition-dto";
import { ItemType } from "../contracts/enums/meta/item/item-type";
import { ItemCategory } from "../contracts/enums/meta/item/item-category";
import { EntityAction } from "../contracts/enums/entity/entity-action";
import { SpawnTargetType } from "../contracts/enums/meta/item/spawn-target-type";
import { ItemConsumptionMethod } from "../contracts/enums/meta/item/item-consumption-method";
import { EquipmentSlot } from "../contracts/enums/meta/item/equipment-slot";
import type { UpsertItemDefinitionDTO } from "../contracts/design/commands/upsert-item-definition-dto";
import { enumToString } from "../utils/enum-helper";

export const useItemUpsertForm = (item?: ItemDefinitionDTO | null) => {

  // Track layout active toggles for optional parameters in UI
  const [activeConfigs, setActiveConfigs] = useState({
    spawn: false,
    effect: false,
    equip: false
  });

  // Local Form Payload State Management
  const [formData, setFormData] = useState<UpsertItemDefinitionDTO>({
    iD: '',
    type: ItemType.Material,
    category: ItemCategory.Material,
    maxStack: null as any,
    maxDurability: 100,
    triggeredAction: EntityAction.NONE,
    costConfig: {
      method: ItemConsumptionMethod.None,
      value: 0
    }
  });

  // Sync state whenever the prop instance properties change
  useEffect(() => {
    if (item) {
      setFormData({
        iD: item.iD ?? '',
        type: enumToString(ItemType, item.type) as ItemType,
        category: enumToString(ItemCategory, item.category) as ItemCategory,
        maxStack: item.maxStack ?? null as any,
        maxDurability: item.maxDurability,
        triggeredAction:
          item.triggeredAction === null
            ? EntityAction.NONE
            : enumToString(EntityAction, item.triggeredAction) as EntityAction,
        costConfig: {
          method: enumToString(
            ItemConsumptionMethod,
            item.costConfig?.method
          ) as ItemConsumptionMethod,
          value: item.costConfig?.value ?? 0
        },
        spawnEntityConfig: item.spawnEntityConfig
          ? {
            ...item.spawnEntityConfig,
            targetType: enumToString(
              SpawnTargetType,
              item.spawnEntityConfig.targetType
            ) as SpawnTargetType
          }
          : undefined,
        applyEffectConfig: item.applyEffectConfig,
        equipConfig: item.equipConfig
          ? {
            ...item.equipConfig,
            slot: enumToString(
              EquipmentSlot,
              item.equipConfig.slot
            ) as EquipmentSlot
          }
          : undefined
      });

      setActiveConfigs({
        spawn: !!item.spawnEntityConfig,
        effect: !!item.applyEffectConfig,
        equip: !!item.equipConfig
      });
    } else {
      setFormData({
        iD: '',
        type: ItemType.Material,
        category: ItemCategory.Material,
        maxStack: null as any,
        maxDurability: null,
        triggeredAction: EntityAction.NONE,
        costConfig: { method: ItemConsumptionMethod.None, value: 0 }
      });
      setActiveConfigs({ spawn: false, effect: false, equip: false });
    }
  }, [item]);

   return {
   formData,
   setFormData,
   activeConfigs,
   setActiveConfigs
 };
}