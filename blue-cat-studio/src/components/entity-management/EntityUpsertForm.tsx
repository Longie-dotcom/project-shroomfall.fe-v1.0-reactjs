import React, { useState, useEffect } from 'react';
import { EntityType } from '../../contracts/enums/entity/entity-type';
import { ItemQuality } from '../../contracts/enums/meta/item/item-quality';
import { FormField, Input, ComponentCard } from './EntityFormHelpers';
import { ComponentRegistry, EntitySchemaRules } from './EntityRegistry';
import { useUpsertEntityDefinition, useDesignEntityDetail } from '../../api/hooks/useDesign';
import { enumToIndex } from '../../utils/enum-helper';

interface EntityUpsertFormProps {
    entityId?: string;
    onClose: () => void;
}

export const EntityUpsertForm: React.FC<EntityUpsertFormProps> = ({ entityId, onClose }) => {
    const isEditing = !!entityId;

    // Fetch detailed pre-fill schema if an existing ID is passed
    const { data: detailData } = useDesignEntityDetail(entityId || '');
    const { mutate: upsertEntity, isPending } = useUpsertEntityDefinition();

    const [selectedType, setSelectedType] = useState<EntityType | ''>('');
    const [entityIdVal, setEntityIdVal] = useState('');
    const [componentsData, setComponentsData] = useState<Record<string, any>>({});
    const [componentOrder, setComponentOrder] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Synchronize explicit layout arrays when server data details pack changes
    useEffect(() => {
        const keys = Object.keys(componentsData);
        setComponentOrder(prev => {
            const existingValid = prev.filter(k => keys.includes(k));
            const newKeys = keys.filter(k => !prev.includes(k));
            return [...existingValid, ...newKeys];
        });
    }, [componentsData]);

    // Populate form if in edit mode
    useEffect(() => {
        if (isEditing && detailData) {
            setEntityIdVal(entityId);
            setSelectedType(detailData.type);

            const loadedComponents: Record<string, any> = {};
            detailData.components?.forEach(c => {
                loadedComponents[c.componentType] = c;
            });

            setComponentsData(loadedComponents);
        } else if (!isEditing) {
            setEntityIdVal('');
            setSelectedType('');
            setComponentsData({});
        }
    }, [isEditing, detailData]);

    // Initialize mandatory components if selecting template during creation (Strict Registry Rule)
    useEffect(() => {
        if (isEditing) return; // Skip resets during edits
        if (!selectedType) {
            setComponentsData({});
            return;
        }
        const requiredComponents = EntitySchemaRules[selectedType] || [];
        const initialPayload: Record<string, any> = {};

        requiredComponents.forEach(comp => {
            initialPayload[comp] = { ComponentType: comp };
        });

        setComponentsData(initialPayload);
    }, [selectedType, isEditing]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedOrder = [...componentOrder];
        const [movedItem] = updatedOrder.splice(draggedIndex, 1);
        updatedOrder.splice(targetIndex, 0, movedItem);

        setComponentOrder(updatedOrder);
        setDraggedIndex(null);
    };

    const handleComponentChange = (componentType: string, updatedData: any) => {
        setComponentsData(prev => ({
            ...prev,
            [componentType]: { ...updatedData, ComponentType: componentType }
        }));
    };

    const removeComponent = (componentType: string) => {
        setComponentsData(prev => {
            const next = { ...prev };
            delete next[componentType];
            return next;
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedType) return;

        const targetEntityTypeIndex = typeof selectedType === 'number'
            ? selectedType
            : enumToIndex(EntityType, selectedType);

        // Convert component enums to numeric indexes recursively before payload commitment
        const processedComponents = Object.values(componentsData).map(comp => {
            const clonedComp = { ...comp };

            if (clonedComp.defaultItems && Array.isArray(clonedComp.defaultItems)) {
                clonedComp.defaultItems = clonedComp.defaultItems.map((item: any) => ({
                    ...item,
                    quality: typeof item.quality === 'string' ? enumToIndex(ItemQuality, item.quality) : item.quality
                }));
            }

            return clonedComp;
        });

        const payload = {
            iD: entityIdVal,
            type: targetEntityTypeIndex,
            components: processedComponents
        };

        upsertEntity(payload as any, {
            onSuccess: () => {
                if (onClose) onClose();
            },
            onError: () => { }
        });
    };


    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>

                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>
                        {isEditing ? `Modify Entity [${entityIdVal}]` : 'Polymorphic Entity Definition Studio'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                        Back to Catalog
                    </button>
                </div>

                {/* Top Parameters Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    <FormField label="Entity Unique Guid Identifier">
                        <Input
                            required
                            disabled={isEditing}
                            value={entityIdVal}
                            onChange={e => setEntityIdVal(e.target.value)}
                            placeholder="e.g., ent_skeleton_boss"
                        />
                    </FormField>

                    <FormField label="Base Entity Template Type">
                        <select
                            disabled={isEditing}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? '#e2e8f0' : '#f8fafc', height: '38px', outline: 'none' }}
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value as EntityType)}
                        >
                            <option value="">-- Choose Template Entity Blueprint --</option>
                            {Object.values(EntityType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </FormField>
                </div>

                {selectedType && (
                    <>
                        <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
                        <h3 style={{ margin: 0, color: '#334155', fontSize: '16px', fontWeight: 600 }}>Entity Schema Architecture Configuration</h3>

                        {/* Container layout wrapper (using Masonry column width style here for flawless flow) */}
                        <div style={{ columnWidth: '460px', columnGap: '20px', width: '100%' }}>
                            {componentOrder.map((compKey, index) => {
                                const config = ComponentRegistry[compKey];
                                if (!config) return null;
                                const FormComponent = config.component;

                                return (
                                    <ComponentCard
                                        key={compKey}
                                        title={config.title}
                                        data={componentsData[compKey] || {}}
                                        entityType={selectedType}
                                        componentType={compKey}
                                        rules={EntitySchemaRules}
                                        onRemove={() => removeComponent(compKey)}

                                        /* Drag and drop hook integrations */
                                        draggable
                                        isDragging={draggedIndex === index}
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDrop={() => handleDrop(index)}
                                        onDragEnd={() => setDraggedIndex(null)}
                                    >
                                        <FormComponent
                                            data={componentsData[compKey] || {}}
                                            onChange={(d: any) => handleComponentChange(compKey, d)}
                                        />
                                    </ComponentCard>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Footer Submit Button Wrapper */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button
                        type="submit"
                        disabled={isPending || !selectedType}
                        style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: selectedType ? 'pointer' : 'not-allowed', opacity: selectedType ? 1 : 0.6, transition: 'background 0.2s' }}
                    >
                        {isPending ? 'Committing Blueprint...' : 'Save Dynamic Entity Blueprint Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};