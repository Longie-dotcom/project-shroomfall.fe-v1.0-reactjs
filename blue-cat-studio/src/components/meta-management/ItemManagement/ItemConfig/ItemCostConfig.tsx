import { ItemConsumptionMethod } from "../../../../contracts/enums/meta/item/item-consumption-method";

interface Props {
    styles: any;
    costConfig: {
        method: ItemConsumptionMethod;
        value: number;
    };
    onChange: (field: string, value: any) => void;
}

export function ItemCostConfig({
    styles,
    costConfig,
    onChange
}: Props) {
    return (
        <div>
            <h4 className={styles.configSubHeading}>
                Cost & Consumption Settings
            </h4>
            <div className={styles.itemFormGrid}>
                <div className={styles.itemFormGroup}>
                    <label className={styles.itemFormLabel}>
                        Consumption Method
                    </label>
                    <select
                        value={
                            costConfig?.method 
                            ?? ItemConsumptionMethod.None
                        }
                        onChange={(e) =>
                            onChange(
                                "method",
                                e.target.value
                            )
                        }
                        className={styles.itemSelectInput}
                    >
                        {Object.values(ItemConsumptionMethod).map(m => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.itemFormGroup}>
                    <label className={styles.itemFormLabel}>
                        Consumption Cost Value
                    </label>
                    <input
                        type="number"
                        value={costConfig?.value ?? 0}
                        onChange={(e) =>
                            onChange(
                                "value",
                                Number(e.target.value)
                            )
                        }
                        className={styles.itemTextInput}
                        min={0}
                    />
                </div>
            </div>
        </div>
    );
}