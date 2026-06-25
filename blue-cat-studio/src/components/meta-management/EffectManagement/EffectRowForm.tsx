import React, { useState, useEffect, useRef } from 'react';
import { useUpsertEffectDefinition } from '../../../api/hooks/useDesign';
import { AttributeType } from '../../../contracts/enums/meta/effect/attribute-type';
import { EffectType } from '../../../contracts/enums/meta/effect/effect-type';
import type { UpsertEffectDefinitionDTO } from '../../../contracts/design/commands/upsert-effect-definition-dto';
import type { EffectDefinitionDTO } from '../../../contracts/domain/definition/meta/effect-definition-dto';
import { enumToString, enumToIndex } from '../../../utils/enum-helper';

import styles from './EffectManagement.module.css';

interface EffectRowFormProps {
  effect?: EffectDefinitionDTO | null;
  isInitialCreateRow?: boolean;
  onSuccessCallback?: () => void;
  onCancelCallback?: () => void;
}

interface FormState extends Omit<UpsertEffectDefinitionDTO, 'duration' | 'interval' | 'sourceType'> {
  sourceType: AttributeType | '';
  duration: number | '';
  interval: number | '';
}

// Track which specific field is being edited inline
type EditableField = 'type' | 'attributeType' | 'sourceType' | 'value' | 'duration' | 'interval' | null;

export const EffectRowForm: React.FC<EffectRowFormProps> = ({
  effect,
  isInitialCreateRow = false,
  onSuccessCallback,
  onCancelCallback
}) => {
  if (!effect && !isInitialCreateRow) {
    return null;
  }

  const { mutate: upsertEffect } = useUpsertEffectDefinition();

  // Tracks the active field cell being edited
  const [activeField, setActiveField] = useState<EditableField>(isInitialCreateRow ? 'type' : null);
  const cellRef = useRef<HTMLTableCellElement>(null);

  const [formData, setFormData] = useState<FormState>({
    iD: '',
    type: EffectType.Flat,
    attributeType: AttributeType.AttackDamage,
    sourceType: '',
    value: 0,
    duration: '',
    interval: '',
  });

  const resetFormState = () => {
    if (effect) {
      const extractedID = effect.iD || (effect as any).id || '';
      setFormData({
        iD: extractedID.toString(),
        type: enumToString(EffectType, effect.type) as EffectType,
        attributeType: enumToString(AttributeType, effect.attributeType) as AttributeType,
        sourceType: enumToString(AttributeType, effect.sourceType) as AttributeType,
        value: effect.value ?? 0,
        duration: effect.duration !== null && effect.duration !== undefined ? effect.duration : '',
        interval: effect.interval !== null && effect.interval !== undefined ? effect.interval : '',
      });
    } else {
      setFormData({
        iD: '',
        type: EffectType.Flat,
        attributeType: AttributeType.AttackDamage,
        sourceType: '',
        value: 0,
        duration: '',
        interval: '',
      });
    }
  };

  useEffect(() => {
    resetFormState();
  }, [effect]);

  // Focus inputs automatically when cell activates
  useEffect(() => {
    if (activeField && cellRef.current) {
      const input = cellRef.current.querySelector('input, select') as HTMLElement;
      if (input) input.focus();
    }
  }, [activeField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // Dispatches save routine immediately down to server context engine
  const executeSave = () => {
    const safeID = (formData.iD || '').toString().trim();
    if (!safeID) {
      handleCancel();
      return;
    }

    const payload = {
      iD: safeID,
      type: enumToIndex(EffectType, formData.type),
      attributeType: enumToIndex(AttributeType, formData.attributeType),
      value: formData.value,
      sourceType: formData.sourceType === '' ? null : enumToIndex(AttributeType, formData.sourceType),
      duration: formData.duration === '' ? null : formData.duration,
      interval: formData.interval === '' ? null : formData.interval,
    };

    upsertEffect(payload as any, {
      onSuccess: () => {
        if (isInitialCreateRow) {
          setFormData({ iD: '', type: EffectType.Flat, attributeType: AttributeType.AttackDamage, sourceType: '', value: 0, duration: '', interval: '' });
        }
        setActiveField(null);
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: () => {
        handleCancel();
      }
    });
  };

  const handleCancel = () => {
    resetFormState();
    if (isInitialCreateRow) {
      if (onCancelCallback) onCancelCallback();
    } else {
      setActiveField(null);
    }
  };

  // Listen to spreadsheet navigation commands (Enter / Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const startEdit = (field: EditableField) => {
    if (isInitialCreateRow) return; // Top creation bar remains fully editable 
    setActiveField(field);
  };

  const fallbackId = effect?.iD || (effect as any)?.id || '';

  return (
    <tr className={isInitialCreateRow ? `${styles.row} ${styles.createRow}` : styles.row}>
      {/* --- ID Cell --- */}
      <td className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}>
        {isInitialCreateRow ? (
          <input
            type="text"
            name="iD"
            value={formData.iD}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Press Enter to Save Row..."
            className={styles.idInput}
          />
        ) : (
          <span className={styles.idDisplay}>{fallbackId}</span>
        )}
      </td>

      {/* --- Calculation Type Cell --- */}
      <td
        ref={activeField === 'type' ? cellRef : null}
        onClick={() => startEdit('type')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'type' || isInitialCreateRow ? (
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.selectField}
          >
            {Object.values(EffectType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <span className={styles.badge}>
            {effect && enumToString(EffectType, effect.type) as EffectType}
          </span>
        )}
      </td>

      {/* --- Target Attribute Cell --- */}
      <td
        ref={activeField === 'attributeType' ? cellRef : null}
        onClick={() => startEdit('attributeType')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'attributeType' || isInitialCreateRow ? (
          <select
            name="attributeType"
            value={formData.attributeType}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.selectField}
          >
            {Object.values(AttributeType).map(attr => <option key={attr} value={attr}>{attr}</option>)}
          </select>
        ) : (
          <span>
            {enumToString(AttributeType, effect.attributeType) as AttributeType}
          </span>
        )}
      </td>

      {/* --- Scaling Source Cell --- */}
      <td
        ref={activeField === 'sourceType' ? cellRef : null}
        onClick={() => startEdit('sourceType')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'sourceType' || isInitialCreateRow ? (
          <select
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.selectField}
          >
            <option value="">-- None --</option>
            {Object.values(AttributeType).map(attr => <option key={attr} value={attr}>{attr}</option>)}
          </select>
        ) : (
          <span>
            {effect
              ? enumToString(AttributeType, effect.sourceType) as AttributeType
              : <em className={styles.dimmedText}>None</em>
            }
          </span>
        )}
      </td>

      {/* --- Value Cell --- */}
      <td
        ref={activeField === 'value' ? cellRef : null}
        onClick={() => startEdit('value')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'value' || isInitialCreateRow ? (
          <input
            type="number"
            name="value"
            step="any"
            value={formData.value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.numberInput}
          />
        ) : (
          <span>{effect?.value}</span>
        )}
      </td>

      {/* --- Duration Cell --- */}
      <td
        ref={activeField === 'duration' ? cellRef : null}
        onClick={() => startEdit('duration')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'duration' || isInitialCreateRow ? (
          <input
            type="number"
            name="duration"
            placeholder="Infinite"
            value={formData.duration}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.numberInput}
          />
        ) : (
          <span>{effect?.duration ? `${effect?.duration}s` : '∞'}</span>
        )}
      </td>

      {/* --- Interval Cell --- */}
      <td
        ref={activeField === 'interval' ? cellRef : null}
        onClick={() => startEdit('interval')}
        className={`${styles.editableCell} ${isInitialCreateRow ? styles.createRowCell : ''}`}
      >
        {activeField === 'interval' || isInitialCreateRow ? (
          <input
            type="number"
            name="interval"
            placeholder="Instant"
            value={formData.interval}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={styles.numberInput}
          />
        ) : (
          <span>{effect?.interval ? `${effect?.interval}s` : <em className={styles.dimmedText}>Instant</em>}</span>
        )}
      </td>
    </tr>
  );
};