import { AttributeType } from "../../../../contracts/enums/meta/effect/attribute-type";
import { EffectType } from "../../../../contracts/enums/meta/effect/effect-type";

interface ItemApplyEffectConfigProps {
    styles: any;
    effectsData?: {
        items: any[];
    };
    isLoadingEffects: boolean;
    selectedEffectIDs: string[];
    effectSearch: string;
    setEffectSearch: (value: string) => void;
    onToggleEffect: (effectId: string) => void;
    onRemove: () => void;
    param?: any;
}

export function ItemApplyEffectConfig({
    styles,
    effectsData,
    isLoadingEffects,
    selectedEffectIDs,
    effectSearch,
    setEffectSearch,
    onToggleEffect,
    onRemove,
    param
}: ItemApplyEffectConfigProps) {
    const getEnumValue = (enumObject: any, value: any) => {
        if (value === null || value === undefined) return "None";
        if (typeof value === "number") return Object.values(enumObject)[value];
        return enumObject[value] ?? value;
    };

    return (
        <div className={styles.configSection}>
            <div className={styles.configHeader}>
                <label className={styles.itemFormLabel}>
                    Applied Effect Config ({selectedEffectIDs.length} Active)
                    {param && <span className="text-sm ml-2">[{String(param)}]</span>}
                </label>
                <button type="button" onClick={onRemove} className={styles.removeBtn}>
                    Remove Configuration
                </button>
            </div>

            <div className={styles.effectSearchWrapper}>
                <input
                    type="text"
                    placeholder="Search active game effects pipeline..."
                    value={effectSearch}
                    onChange={e => setEffectSearch(e.target.value)}
                    className={`${styles.itemTextInput} ${styles.searchSubInput}`}
                />
            </div>

            <div className={styles.effectSelectionMatrix}>
                {isLoadingEffects ? (
                    <div className={styles.matrixStatus}>Syncing effect data models...</div>
                ) : (
                    effectsData?.items.map((eff: any) => {
                        const effectId = eff.id || eff.iD || eff.Id;
                        const isSelected = selectedEffectIDs.includes(effectId);
                        const attributeType = getEnumValue(AttributeType, eff.attributeType);
                        const sourceType = getEnumValue(AttributeType, eff.sourceType);
                        const effectType = getEnumValue(EffectType, eff.type);

                        return (
                            <div
                                key={effectId}
                                onClick={() => onToggleEffect(effectId)}
                                className={`${styles.matrixRowItem} ${isSelected ? styles.rowActive : ''}`}
                            >
                                <div className={styles.matrixRowCheck}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className={styles.matrixCheckbox}
                                    />
                                </div>
                                <div className={styles.matrixRowDetails}>
                                    <div className={`${styles.matrixRowTitle} ${styles.fontMonoInput}`}>
                                        {effectId}
                                    </div>
                                    <div className={styles.matrixRowSubtitle}>
                                        Modifies: <strong>{attributeType}</strong>
                                        {sourceType !== "None" && ` (Source Scaling: ${sourceType})`}
                                        {eff.value !== undefined && ` | Value: ${eff.value}`}
                                        {effectType && ` [Calc: ${effectType}]`}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {!isLoadingEffects && effectsData?.items.length === 0 && (
                    <div className={styles.matrixStatusEmpty}>
                        No system effects match your query parameters.
                    </div>
                )}
            </div>
        </div>
    );
}