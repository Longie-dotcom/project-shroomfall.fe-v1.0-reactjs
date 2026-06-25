import { EquipmentSlot } from '../../../../contracts/enums/meta/item/equipment-slot';

interface Props {
    styles: any;
    slot: EquipmentSlot;
    onChange: (field: string, value: any) => void;
    onRemove: () => void;
}

export function ItemEquipmentConfig({ styles, slot, onChange, onRemove }: Props) {
    return (
        <div className={styles.configSection}>
            <div className={styles.configHeader}>
                <span className={styles.itemFormLabel}>Equipment Module Allocation</span>
                <button type="button" onClick={onRemove} className={styles.removeBtn}>
                    Remove Configuration
                </button>
            </div>
            <div className={styles.itemFormGroup}>
                <label className={styles.itemFormLabel}>Target Armor/Weapon Slot</label>
                <select
                    value={slot || EquipmentSlot.Chest}
                    onChange={(e) => onChange('slot', e.target.value)}
                    className={styles.itemSelectInput}
                >
                    {Object.values(EquipmentSlot).map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}