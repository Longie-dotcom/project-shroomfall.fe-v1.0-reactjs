import { FormRow, FormField, Input } from './EntityFormHelpers';
import { enumToString, enumToIndex } from '../../utils/enum-helper';
import { AttributeType } from '../../contracts/enums/meta/effect/attribute-type';
import { CollisionLayer } from '../../contracts/enums/entity/collision-layer';
import { CollisionShapeType } from '../../contracts/enums/entity/collision-shape-type';
import { useDesignAllItems } from '../../api/hooks/useDesign';
import { ItemQuality } from '../../contracts/enums/meta/item/item-quality';
import { useRef } from 'react';

import styles from './EntityForms.module.css';

export const CollisionForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const handleEnumChange = (field: 'shapeType' | 'layer' | 'mask', enumObj: any, value: string) => {
        onChange({
            ...data,
            [field]: enumToIndex(enumObj, value),
        });
    };

    return (
        <>
            <FormRow>
                <FormField label="Shape Type">
                    <select
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                        value={enumToString(CollisionShapeType, data.shapeType)}
                        onChange={e => handleEnumChange('shapeType', CollisionShapeType, e.target.value)}
                    >
                        {Object.values(CollisionShapeType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Layer">
                    <select
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                        value={enumToString(CollisionLayer, data.layer)}
                        onChange={e => handleEnumChange('layer', CollisionLayer, e.target.value)}
                    >
                        {Object.values(CollisionLayer).map(layer => (
                            <option key={layer} value={layer}>{layer}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Mask">
                    <select
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                        value={enumToString(CollisionLayer, data.mask)}
                        onChange={e => handleEnumChange('mask', CollisionLayer, e.target.value)}
                    >
                        {Object.values(CollisionLayer).map(mask => (
                            <option key={mask} value={mask}>{mask}</option>
                        ))}
                    </select>
                </FormField>
            </FormRow>

            <FormRow>
                <FormField label="Width">
                    <Input
                        type="number"
                        step="any"
                        value={data.width ?? 0}
                        onChange={e => onChange({ ...data, width: parseFloat(e.target.value) || 0 })}
                    />
                </FormField>
                <FormField label="Height">
                    <Input
                        type="number"
                        step="any"
                        value={data.height ?? 0}
                        onChange={e => onChange({ ...data, height: parseFloat(e.target.value) || 0 })}
                    />
                </FormField>
                <FormField label="Radius">
                    <Input
                        type="number"
                        step="any"
                        value={data.radius ?? 0}
                        onChange={e => onChange({ ...data, radius: parseFloat(e.target.value) || 0 })}
                    />
                </FormField>
            </FormRow>

            <FormRow>
                <FormField label="Offset X">
                    <Input
                        type="number"
                        step="any"
                        value={data.offsetX ?? 0}
                        onChange={e => onChange({ ...data, offsetX: parseFloat(e.target.value) || 0 })}
                    />
                </FormField>
                <FormField label="Offset Y">
                    <Input
                        type="number"
                        step="any"
                        value={data.offsetY ?? 0}
                        onChange={e => onChange({ ...data, offsetY: parseFloat(e.target.value) || 0 })}
                    />
                </FormField>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={!!data.isBlocking}
                        onChange={e => onChange({ ...data, isBlocking: e.target.checked })}
                    /> Is Blocking Physical Movement
                </label>
            </FormRow>
        </>
    );
};

export const AIForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormRow>
        <FormField label="Aggro Radius"><Input type="number" step="any" value={data.aggroRadius ?? 0} onChange={e => onChange({ ...data, aggroRadius: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="Leash Distance"><Input type="number" step="any" value={data.leashDistance ?? 0} onChange={e => onChange({ ...data, leashDistance: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="Think Interval (sec)"><Input type="number" step="any" value={data.thinkInterval ?? 0} onChange={e => onChange({ ...data, thinkInterval: parseFloat(e.target.value) || 0 })} /></FormField>
        <label className={styles.checkboxLabel} style={{ marginTop: '20px' }}>
            <input type="checkbox" checked={!!data.isAIControlled} onChange={e => onChange({ ...data, isAIControlled: e.target.checked })} /> Is AI Controlled
        </label>
    </FormRow>
);

export const LifetimeForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormField label="Lifetime Duration (sec)">
        <Input type="number" step="any" value={data.lifetime ?? 0} onChange={e => onChange({ ...data, lifetime: parseFloat(e.target.value) || 0 })} />
    </FormField>
);

export const PortalForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <>
        <FormRow>
            <FormField label="Local Trigger Offset X"><Input type="number" step="any" value={data.localTriggerOffsetX ?? 0} onChange={e => onChange({ ...data, localTriggerOffsetX: parseFloat(e.target.value) || 0 })} /></FormField>
            <FormField label="Local Trigger Offset Y"><Input type="number" step="any" value={data.localTriggerOffsetY ?? 0} onChange={e => onChange({ ...data, localTriggerOffsetY: parseFloat(e.target.value) || 0 })} /></FormField>
        </FormRow>
        <FormRow>
            <FormField label="Trigger Width"><Input type="number" step="any" value={data.triggerWidth ?? 0} onChange={e => onChange({ ...data, triggerWidth: parseFloat(e.target.value) || 0 })} /></FormField>
            <FormField label="Trigger Height"><Input type="number" step="any" value={data.triggerHeight ?? 0} onChange={e => onChange({ ...data, triggerHeight: parseFloat(e.target.value) || 0 })} /></FormField>
        </FormRow>
    </>
);

export const ProjectileForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormRow>
        <FormField label="Velocity Vector Speed"><Input type="number" step="any" value={data.velocity ?? 0} onChange={e => onChange({ ...data, velocity: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="On Impact Spawn Entity ID"><Input value={data.onImpactSpawnEntityDefinitionID || ''} onChange={e => onChange({ ...data, onImpactSpawnEntityDefinitionID: e.target.value || null })} /></FormField>
    </FormRow>
);

export const InteractableForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormField label="Interaction Matrix Type Rule">
        <Input type="number" value={data.type ?? 0} onChange={e => onChange({ ...data, type: parseInt(e.target.value, 10) || 0 })} />
    </FormField>
);

export const AppearanceForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const updateSkinHsv = (hsvField: 'h' | 's' | 'v', val: number) => {
        const currentHsv = data.skinColor || { h: 0, s: 0, v: 0 };
        onChange({
            ...data,
            skinColor: { ...currentHsv, [hsvField]: val }
        });
    };

    const effectiveSkinId = data.skinID || 'UNKNOWN';

    return (
        <>
            <FormRow>
                <FormField label="Skin Atlas ID">
                    <Input
                        disabled
                        value={effectiveSkinId}
                        style={{
                            background: '#cbd5e1',
                            color: '#475569',
                            cursor: 'not-allowed',
                            fontWeight: effectiveSkinId === 'UNKNOWN' ? 'bold' : 'normal'
                        }}
                    />
                </FormField>
            </FormRow>

            {/* Editable HSV Shading Controls */}
            <div className={styles.hsvContainer}>
                <strong>Skin Color (HSV)</strong>
                <FormRow>
                    <FormField label="Skin H">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.h ?? 0}
                            onChange={e => updateSkinHsv('h', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                    <FormField label="Skin S">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.s ?? 0}
                            onChange={e => updateSkinHsv('s', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                    <FormField label="Skin V">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.v ?? 0}
                            onChange={e => updateSkinHsv('v', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                </FormRow>
            </div>
        </>
    );
};

export const TriggeredEffectForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const effectIDs = data.effectDefinitionIDs || [];
    const addEffect = () => onChange({ ...data, effectDefinitionIDs: [...effectIDs, ''] });
    const removeEffect = (index: number) => onChange({ ...data, effectDefinitionIDs: effectIDs.filter((_: any, i: number) => i !== index) });
    const updateEffect = (index: number, val: string) => {
        const updated = [...effectIDs];
        updated[index] = val;
        onChange({ ...data, effectDefinitionIDs: updated });
    };

    return (
        <div className={styles.triggeredEffectContainer}>
            <span className={styles.sectionTitle}>Triggered Effect Definition Pipelines</span>
            {effectIDs.map((id: string, index: number) => (
                <div key={index} style={{ display: 'flex', gap: '8px' }}>
                    <Input style={{ flex: 1 }} value={id} placeholder="Effect ID GUID Reference" onChange={e => updateEffect(index, e.target.value)} />
                    <button type="button" onClick={() => removeEffect(index)} className={styles.deleteButton}>Delete</button>
                </div>
            ))}
            <button type="button" onClick={addEffect} className={styles.addButton}>
                + Add Effect Link Hook
            </button>
        </div>
    );
};

export const InventoryForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const defaultItems = data.defaultItems || [];

    // Fetch items with the complete ItemDefinitionQueryDTO structure
    const { data: itemsData } = useDesignAllItems({
        searchTerm: '',
        type: undefined as any,
        category: undefined as any,
        pageNumber: 1,
        pageSize: 100,
    });

    const itemList = itemsData?.items || [];

    const addItem = () =>
        onChange({
            ...data,
            defaultItems: [
                ...defaultItems,
                {
                    definitionID: itemList[0]?.iD || '',
                    amount: 1,
                    quality: ItemQuality.Medium
                }
            ]
        });

    const removeItem = (index: number) =>
        onChange({
            ...data,
            defaultItems: defaultItems.filter((_: any, i: number) => i !== index)
        });

    const updateItem = (index: number, fields: any) => {
        const updatedItems = defaultItems.map((item: any, i: number) => i === index ? { ...item, ...fields } : item);
        onChange({ ...data, defaultItems: updatedItems });
    };

    // Helper to properly convert enum string back to index before committing payload
    const handleQualityChange = (index: number, value: string) => {
        updateItem(index, {
            quality: enumToIndex(ItemQuality, value) as any
        });
    };

    return (
        <>
            <FormField label="Base Inventory Slot Count Capacity">
                <Input
                    type="number"
                    style={{ width: '120px' }}
                    value={data.slotCount ?? 0}
                    onChange={e => onChange({ ...data, slotCount: parseInt(e.target.value, 10) || 0 })}
                />
            </FormField>

            <div className={styles.inventoryList}>
                <span className={styles.sectionTitle}>Starting Loot Drops / Default Items</span>

                {defaultItems.map((item: any, index: number) => (
                    <div key={index} className={styles.inventoryItem}>
                        <FormField label="Item Definition">
                            <select
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', width: '100%' }}
                                value={item.definitionID || ''}
                                onChange={e => updateItem(index, { definitionID: e.target.value })}
                            >
                                <option value="">-- Select Item Template --</option>
                                {itemList.map((itemDef: any) => (
                                    <option key={itemDef.id} value={itemDef.id}>
                                        {itemDef.presentation?.name || itemDef.id}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Quantity">
                            <Input
                                type="number"
                                placeholder="Qty"
                                value={item.amount ?? 1}
                                onChange={e => updateItem(index, { amount: parseInt(e.target.value, 10) || 1 })}
                            />
                        </FormField>

                        <FormField label="Quality">
                            <select
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', width: '100%' }}
                                value={enumToString(ItemQuality, item.quality)}
                                onChange={e => handleQualityChange(index, e.target.value)}
                            >
                                {Object.values(ItemQuality).map(q => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                        </FormField>

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className={styles.inventoryRemoveButton}
                            style={{ marginTop: '22px' }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addItem} className={styles.addButton}>
                    + Add Entry Template
                </button>
            </div>
        </>
    );
};

export const CharacteristicForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attributeValues = data.attributeValues || [];

    const addAttribute = () =>
        onChange({
            ...data,
            attributeValues: [
                ...attributeValues,
                {
                    iD: crypto.randomUUID(),
                    type: enumToIndex(AttributeType, AttributeType.Health) as any,
                    baseValue: 0,
                    min: 0,
                    max: 100,
                    attributeGrowthValues: []
                }
            ]
        });

    // Changed from iD to index lookup
    const removeAttribute = (index: number) =>
        onChange({
            ...data,
            attributeValues: attributeValues.filter((_: any, i: number) => i !== index)
        });

    // Changed from iD to index lookup to isolate updates perfectly
    const updateAttribute = (index: number, fields: any) => {
        onChange({
            ...data,
            attributeValues: attributeValues.map((attr: any, i: number) => i === index ? { ...attr, ...fields } : attr)
        });
    };

    const addGrowth = (index: number, growths: any[]) => {
        updateAttribute(index, {
            attributeGrowthValues: [
                ...growths,
                {
                    iD: crypto.randomUUID(),
                    level: growths.length + 1,
                    growthValue: 0
                }
            ]
        });
    };

    const handleAttributeTypeChange = (index: number, stringValue: string) => {
        updateAttribute(index, {
            type: enumToIndex(AttributeType, stringValue) as any
        });
    };

    const sanitizeImportedData = (items: any[]) => {
        return items.map(attr => {
            const { level, ...restOfAttr } = attr;
            return {
                ...restOfAttr,
                iD: attr.iD || attr.id || crypto.randomUUID(), // Fallback to lowercase 'id' if present
                type: typeof attr.type === 'string'
                    ? enumToIndex(AttributeType, attr.type)
                    : attr.type,
                attributeGrowthValues: (attr.attributeGrowthValues || []).map((growth: any) => ({
                    iD: growth.iD || growth.id || crypto.randomUUID(),
                    level: growth.level,
                    growthValue: growth.growthValue ?? 0
                }))
            };
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                const rawAttributes = Array.isArray(importedData)
                    ? importedData
                    : importedData.attributeValues || [importedData];

                const sanitizedAttributes = sanitizeImportedData(rawAttributes);

                onChange({
                    ...data,
                    attributeValues: [...attributeValues, ...sanitizedAttributes]
                });
            } catch (err) {
                alert('Failed to parse JSON file. Please provide a valid attribute JSON structure.');
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const handleDownloadJson = () => {
        const stripIds = (items: any[]) => {
            return items.map(({ iD, id, level, ...rest }) => ({
                ...rest,
                attributeGrowthValues: rest.attributeGrowthValues?.map(({ iD: gId, id: gLegacyId, ...gRest }: any) => ({ ...gRest })) || []
            }));
        };

        const cleanAttributes = stripIds(attributeValues);
        const jsonString = JSON.stringify({ attributeValues: cleanAttributes }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attributes_template_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.characteristicContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={styles.sectionTitle}>Core RPG Attribute Matrices</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="application/json"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={styles.addButton}
                        style={{ background: '#e2e8f0', margin: 0 }}
                    >
                        📄 Upload JSON
                    </button>

                    {attributeValues.length > 0 && (
                        <button
                            type="button"
                            onClick={handleDownloadJson}
                            className={styles.addButton}
                            style={{ background: '#cbd5e1', margin: 0 }}
                        >
                            ⬇️ Export JSON
                        </button>
                    )}
                </div>
            </div>

            {/* Added index to the map parameters */}
            {attributeValues.map((attr: any, index: number) => (
                <div key={attr.iD || attr.id || index} className={styles.attributeCard}>
                    <div className={styles.attributeHeader}>
                        <FormField label="Attribute Type">
                            <select
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
                                value={enumToString(AttributeType, attr.type)}
                                onChange={e => handleAttributeTypeChange(index, e.target.value)}
                            >
                                {Object.values(AttributeType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </FormField>

                        <button
                            type="button"
                            onClick={() => removeAttribute(index)}
                            className={styles.deleteStatButton}
                        >
                            Delete Stat
                        </button>
                    </div>

                    <FormRow>
                        <FormField label="Base Value">
                            <Input
                                type="number"
                                value={attr.baseValue ?? 0}
                                onChange={e => updateAttribute(index, { baseValue: parseFloat(e.target.value) || 0 })}
                            />
                        </FormField>
                        <FormField label="Min Clamp">
                            <Input
                                type="number"
                                value={attr.min ?? 0}
                                onChange={e => updateAttribute(index, { min: parseFloat(e.target.value) || 0 })}
                            />
                        </FormField>
                        <FormField label="Max Clamp">
                            <Input
                                type="number"
                                value={attr.max ?? 100}
                                onChange={e => updateAttribute(index, { max: parseFloat(e.target.value) || 0 })}
                            />
                        </FormField>
                    </FormRow>

                    <div className={styles.levelScalerBox}>
                        <div className={styles.levelScalerTitle}>Level Scaler Curves</div>

                        {/* Added the growthGrid layout layer here */}
                        <div className={styles.growthGrid}>
                            {attr.attributeGrowthValues?.map((growth: any) => (
                                <div key={growth.iD || `level-${growth.level}`} className={styles.levelScalerRow}>
                                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', minWidth: '34px' }}>
                                        Lvl {growth.level}:
                                    </span>
                                    <Input
                                        type="number"
                                        style={{ padding: '2px 4px', width: '100%', minWidth: '50px', fontSize: '12px' }}
                                        value={growth.growthValue}
                                        onChange={e => {
                                            const nextGrowths = attr.attributeGrowthValues.map((g: any) => ({
                                                ...g,
                                                growthValue: g.level === growth.level
                                                    ? parseFloat(e.target.value) || 0
                                                    : g.growthValue
                                            }));
                                            updateAttribute(index, { attributeGrowthValues: nextGrowths });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addGrowth(index, attr.attributeGrowthValues || [])}
                            className={styles.addGrowthButton}
                        >
                            Add Growth Interval
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addAttribute} className={styles.addButton}>
                Add New Attribute
            </button>
        </div>
    );
};