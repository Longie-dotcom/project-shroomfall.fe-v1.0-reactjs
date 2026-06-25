import { SpawnTargetType } from "../../../../contracts/enums/meta/item/spawn-target-type";

interface SpawnConfigData {
    targetType?: SpawnTargetType;
    maxRange?: number;
    entityDefinitionID?: string;
}

interface Props {
    styles: any;
    spawnConfig: SpawnConfigData;
    onChange: (field: string, value: any) => void;
    onRemove: () => void;
}

export function ItemSpawnEntityConfig({ styles, spawnConfig, onChange, onRemove }: Props) {
    return (
        <div className={styles.configSection}>
            <div className={styles.configHeader}>
                <span className={styles.itemFormLabel}>Entity Summoning Configuration</span>
                <button type="button" onClick={onRemove} className={styles.removeBtn}>
                    Remove Configuration
                </button>
            </div>
            <div className={`${styles.itemFormGrid} ${styles.structuralTriple}`}>
                <div className={styles.itemFormGroup}>
                    <label className={styles.itemFormLabel}>Target Scheme</label>
                    <select
                        value={spawnConfig?.targetType || SpawnTargetType.WorldPosition}
                        onChange={(e) => onChange('targetType', e.target.value)}
                        className={styles.itemSelectInput}
                    >
                        {Object.values(SpawnTargetType).map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.itemFormGroup}>
                    <label className={styles.itemFormLabel}>Max Range</label>
                    <input
                        type="number"
                        value={spawnConfig?.maxRange || 0}
                        onChange={(e) => onChange('maxRange', Number(e.target.value))}
                        className={styles.itemTextInput}
                        min={0}
                    />
                </div>

                <div className={styles.itemFormGroup}>
                    <label className={styles.itemFormLabel}>Entity Reference Key</label>
                    <input
                        type="text"
                        value={spawnConfig?.entityDefinitionID || ''}
                        onChange={(e) => onChange('entityDefinitionID', e.target.value)}
                        className={`${styles.itemTextInput} ${styles.fontMonoInput}`}
                        placeholder="ent_goblin_grunt"
                    />
                </div>
            </div>
        </div>
    );
}