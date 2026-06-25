import React, { useState } from 'react';
import { useUpsertItemDefinition, useDesignAllEffects } from '../../../api/hooks/useDesign';
import { useItemUpsertForm } from '../../../hooks/useItemUpsertForm';
import { ItemType } from '../../../contracts/enums/meta/item/item-type';
import { ItemCategory } from '../../../contracts/enums/meta/item/item-category';
import { ItemConsumptionMethod } from '../../../contracts/enums/meta/item/item-consumption-method';
import { EquipmentSlot } from '../../../contracts/enums/meta/item/equipment-slot';
import { SpawnTargetType } from '../../../contracts/enums/meta/item/spawn-target-type';
import { EntityAction } from '../../../contracts/enums/entity/entity-action';
import { enumToIndex } from '../../../utils/enum-helper';
import type { UpsertItemDefinitionDTO } from '../../../contracts/design/commands/upsert-item-definition-dto';
import type { ItemDefinitionDTO } from '../../../contracts/domain/definition/meta/item-definition-dto';
import { ItemCostConfig } from './ItemConfig/ItemCostConfig';
import { ItemApplyEffectConfig } from './ItemConfig/ItemApplyEffectConfig';
import { ItemEquipmentConfig } from './ItemConfig/ItemEquipmentConfig';
import { ItemSpawnEntityConfig } from './ItemConfig/ItemSpawnEntityConfig';

import styles from './ItemManagement.module.css';

interface ItemUpsertFormProps {
  item?: ItemDefinitionDTO | null;
  onClose: () => void;
}

export const ItemUpsertForm: React.FC<ItemUpsertFormProps> = ({ item, onClose }) => {
  const {
    mutate: upsertItem,
    isPending
  } = useUpsertItemDefinition();

  const {
    formData,
    setFormData,
    activeConfigs,
    setActiveConfigs
  } = useItemUpsertForm(item);

  // Search filter query state for the Effects Matrix component
  const [effectSearch, setEffectSearch] = useState('');

  // Fetching effects dataset exclusively
  const { data: effectsData, isLoading: isLoadingEffects } = useDesignAllEffects({
    searchTerm: effectSearch,
    type: '' as any,
    attributeType: '' as any,
    sourceType: '' as any,
    pageNumber: 1,
    pageSize: 50
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number' && value === '') {
      setFormData(prev => ({ ...prev, [name]: null as any }));
      return;
    }

    const isNumeric = type === 'number' || (value.trim() !== '' && !isNaN(Number(value)));

    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value
    }));
  };

  const handleNestedInputChange = (
    configKey: 'spawnEntityConfig' | 'equipConfig' | 'costConfig',
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey]!,
        [field]: value
      }
    }));
  };

  const toggleConfigurationBlock = (block: 'spawn' | 'effect' | 'equip', activate: boolean) => {
    setActiveConfigs(prev => ({ ...prev, [block]: activate }));
    setFormData(prev => {
      const next = { ...prev };
      if (!activate) {
        delete next[block === 'spawn' ? 'spawnEntityConfig' : block === 'effect' ? 'applyEffectConfig' : 'equipConfig'];
      } else {
        if (block === 'spawn') {
          next.spawnEntityConfig = { entityDefinitionID: '', targetType: SpawnTargetType.WorldPosition, maxRange: 0 };
        } else if (block === 'effect') {
          next.applyEffectConfig = { effectDefinitionIDs: [] };
        } else if (block === 'equip') {
          next.equipConfig = { slot: EquipmentSlot.Chest };
        }
      }
      return next;
    });
  };

  const toggleEffectAssociation = (effectId: string) => {
    setFormData(prev => {
      const currentIds = prev.applyEffectConfig?.effectDefinitionIDs || [];
      const updatedIds = currentIds.includes(effectId)
        ? currentIds.filter(id => id !== effectId)
        : [...currentIds, effectId];

      return {
        ...prev,
        applyEffectConfig: { ...prev.applyEffectConfig!, effectDefinitionIDs: updatedIds }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UpsertItemDefinitionDTO = {
      iD: formData.iD,

      type: enumToIndex(ItemType, formData.type) as any,
      category: enumToIndex(ItemCategory, formData.category) as any,

      maxStack: (formData.maxStack !== undefined && formData.maxStack !== null && Number(formData.maxStack) > 0)
        ? Number(formData.maxStack)
        : null as any,

      maxDurability: formData.maxDurability,

      triggeredAction: (formData.triggeredAction === EntityAction.NONE || !formData.triggeredAction)
        ? null as any
        : enumToIndex(EntityAction, formData.triggeredAction) as any,

      costConfig: {
        method: enumToIndex(ItemConsumptionMethod, formData.costConfig.method) as any,
        value: formData.costConfig.value
      },

      spawnEntityConfig: (activeConfigs.spawn && formData.spawnEntityConfig?.entityDefinitionID)
        ? {
          ...formData.spawnEntityConfig,
          targetType: enumToIndex(SpawnTargetType, formData.spawnEntityConfig.targetType) as any
        }
        : null as any,

      applyEffectConfig: (activeConfigs.effect && formData.applyEffectConfig?.effectDefinitionIDs?.length)
        ? formData.applyEffectConfig
        : null as any,

      equipConfig: activeConfigs.equip
        ? {
          ...formData.equipConfig,
          slot: enumToIndex(EquipmentSlot, formData.equipConfig?.slot) as any
        }
        : null as any
    };

    upsertItem(payload as any, {
      onSuccess: () => {
        if (onClose) onClose();
      },
      onError: (err: any) => {
        alert(`Validation Error: ${JSON.stringify(err.response?.data || err.message)}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.itemFormContainer}>
      <h3 className={styles.itemFormTitle}>
        {item ? `Modify Blueprint [${formData.iD}]` : 'Assemble New Item Blueprint'}
      </h3>

      {/* Primary Key Identifier Input */}
      <div className={styles.itemFormGroup}>
        <label className={styles.itemFormLabel}>System ID Signature</label>
        <input
          type="text"
          name="iD"
          value={formData.iD}
          onChange={handleInputChange}
          disabled={!!item}
          className={`${styles.itemTextInput} ${styles.fontMonoInput}`}
          placeholder="item_potion_healing_t1"
          required
        />
      </div>

      {/* Row 1: Metas */}
      <div className={styles.itemFormGrid}>
        <div className={styles.itemFormGroup}>
          <label className={styles.itemFormLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.maxStack !== null && formData.maxStack !== undefined && Number(formData.maxStack) > 0}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  maxStack: e.target.checked ? 99 : null as any
                }));
              }}
            />
            Is Stackable Item?
          </label>
          <input
            type="number"
            name="maxStack"
            value={formData.maxStack ?? ''}
            onChange={handleInputChange}
            disabled={formData.maxStack === null || formData.maxStack === undefined}
            className={styles.itemTextInput}
            placeholder="Not Stackable (Single Instance)"
            min={1}
            style={{
              opacity: (formData.maxStack === null || formData.maxStack === undefined) ? 0.5 : 1,
              backgroundColor: (formData.maxStack === null || formData.maxStack === undefined) ? '#f1f5f9' : '#fff'
            }}
          />
        </div>

        <div className={styles.itemFormGroup}>
          <label className={styles.itemFormLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              /* Evaluates to true if it has any valid number (even 0) */
              checked={formData.maxDurability !== null && formData.maxDurability !== undefined}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  /* If checked, use its existing value, or fall back to 100 instead of null */
                  maxDurability: e.target.checked
                    ? (prev.maxDurability ?? 100)
                    : null
                }));
              }}
            />
            Has Durability?
          </label>

          <input
            type="number"
            name="maxDurability"
            value={formData.maxDurability ?? ''}
            onChange={handleInputChange}
            disabled={formData.maxDurability === null || formData.maxDurability === undefined}
            className={styles.itemTextInput}
            placeholder="Unlimited / No Durability"
            min={1}
            style={{
              opacity: (formData.maxDurability === null || formData.maxDurability === undefined) ? 0.5 : 1,
              backgroundColor: (formData.maxDurability === null || formData.maxDurability === undefined) ? '#f1f5f9' : '#fff'
            }}
          />
        </div>
      </div>

      {/* Row 2: Enums definitions parsing */}
      <div className={`${styles.itemFormGrid} ${styles.structuralTriple}`}>
        <div className={styles.itemFormGroup}>
          <label className={styles.itemFormLabel}>Item Type</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className={styles.itemSelectInput}>
            {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className={styles.itemFormGroup}>
          <label className={styles.itemFormLabel}>Category</label>
          <select name="category" value={formData.category} onChange={handleInputChange} className={styles.itemSelectInput}>
            {Object.values(ItemCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.itemFormGroup}>
          <label className={styles.itemFormLabel}>Triggered Action</label>
          <select name="triggeredAction" value={formData.triggeredAction} onChange={handleInputChange} className={styles.itemSelectInput}>
            {Object.values(EntityAction).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <hr className={styles.itemFormDivider} />

      {/* Sub-Section 1: Cost Matrix Block (Mandatory) */}
      <ItemCostConfig
        styles={styles}
        costConfig={formData.costConfig}
        onChange={(field, value) => handleNestedInputChange("costConfig", field, value)}
      />

      <hr className={styles.itemFormDivider} />

      {/* Optional Configuration Module Injectors */}
      <h4 className={styles.configSubHeading}>Optional Configuration Blueprints</h4>
      <div className={styles.moduleToggleBar}>
        {!activeConfigs.equip && <button type="button" onClick={() => toggleConfigurationBlock('equip', true)} className={styles.itemBtnSecondary}>+ Add Equipment Rules</button>}
        {!activeConfigs.spawn && <button type="button" onClick={() => toggleConfigurationBlock('spawn', true)} className={styles.itemBtnSecondary}>+ Add Spawning Config</button>}
        {!activeConfigs.effect && <button type="button" onClick={() => toggleConfigurationBlock('effect', true)} className={styles.itemBtnSecondary}>+ Add Linked Effects</button>}
      </div>

      {/* Equipment Configuration Panel */}
      {activeConfigs.equip && (
        <ItemEquipmentConfig
          styles={styles}
          slot={formData.equipConfig?.slot || EquipmentSlot.Chest}
          onChange={(field, value) => handleNestedInputChange('equipConfig', field, value)}
          onRemove={() => toggleConfigurationBlock('equip', false)}
        />
      )}

      {/* Sub-Section 2: Spawn Entity Config Block */}
      {activeConfigs.spawn && (
        <ItemSpawnEntityConfig
          styles={styles}
          spawnConfig={formData.spawnEntityConfig || {}}
          onChange={(field, value) => handleNestedInputChange('spawnEntityConfig', field, value)}
          onRemove={() => toggleConfigurationBlock('spawn', false)}
        />
      )}

      {/* Sub-Section 3: Applied Effect Binding Matrix List */}
      {activeConfigs.effect && (
        <ItemApplyEffectConfig
          styles={styles}
          effectsData={effectsData}
          isLoadingEffects={isLoadingEffects}
          selectedEffectIDs={formData.applyEffectConfig?.effectDefinitionIDs || []}
          effectSearch={effectSearch}
          setEffectSearch={setEffectSearch}
          onToggleEffect={toggleEffectAssociation}
          onRemove={() => toggleConfigurationBlock('effect', false)}
        />
      )}

      {/* Actions Footer */}
      <div className={styles.itemFormActions}>
        <button type="button" onClick={onClose} className={styles.itemBtnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className={styles.itemBtnPrimary}>
          {isPending ? 'Saving Blueprint...' : 'Commit Configuration Blueprint'}
        </button>
      </div>
    </form>
  );
};