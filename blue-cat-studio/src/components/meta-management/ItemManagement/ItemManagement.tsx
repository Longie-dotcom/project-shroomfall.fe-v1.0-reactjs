import React, { useState } from 'react';
import { useDesignAllItems } from '../../../api/hooks/useDesign';
import { ItemUpsertForm } from './ItemUpsertForm';

// --- TypeGen Enums ---
import { ItemType } from '../../../contracts/enums/meta/item/item-type';
import { ItemCategory } from '../../../contracts/enums/meta/item/item-category';

// --- Type Gen DTO Imports ---
import type { ItemDefinitionDTO } from '../../../contracts/domain/definition/meta/item-definition-dto';
import type { ItemDefinitionQueryDTO } from '../../../contracts/design/commands/item-definition-query-dto';

import styles from './ItemManagement.module.css';

export const ItemManagement: React.FC = () => {
    // Balanced default state binding for ItemDefinitionQueryDTO pipeline
    const [queryParams, setQueryParams] = useState<Partial<ItemDefinitionQueryDTO>>({
        searchTerm: '',
        type: undefined,
        category: undefined,
        pageNumber: 1,
        pageSize: 15
    });

    // Fetch items array matching dynamic internal engine configurations
    const { data: itemsData, isLoading: itemsLoading } = useDesignAllItems(queryParams as ItemDefinitionQueryDTO);

    // Layout orchestration workbench states
    const [selectedItem, setSelectedItem] = useState<ItemDefinitionDTO | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const handleOpenCreateMode = () => {
        setSelectedItem(null);
        setIsFormOpen(true);
    };

    const handleOpenEditMode = (blueprint: ItemDefinitionDTO) => {
        setSelectedItem({
            ...blueprint,
            iD: (blueprint as any).id
        });
        setIsFormOpen(true);
    };

    const handleCloseFormWorkspace = () => {
        setIsFormOpen(false);
        setSelectedItem(null);
    };

    // Safe layout filter adjustments resets current viewport back to sheet index 1
    const updateFilterField = (field: keyof ItemDefinitionQueryDTO, value: any) => {
        setQueryParams(prev => ({
            ...prev,
            [field]: value || undefined,
            pageNumber: 1
        }));
    };

    const shiftPage = (direction: number) => {
        setQueryParams(prev => {
            const nextPage = Math.max(1, (prev.pageNumber || 1) + direction);
            return {
                ...prev,
                pageNumber: nextPage
            };
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.dashboardHeader}>
                <h1 className={styles.title}>System Item Blueprints</h1>
                {!isFormOpen && (
                    <button className={styles.primaryButton} onClick={handleOpenCreateMode}>
                        New Item
                    </button>
                )}
            </header>

            {/* --- Filter & Telemetry Search Subbar --- */}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Filter blueprints by keyword..."
                    value={queryParams.searchTerm || ''}
                    onChange={(e) => updateFilterField('searchTerm', e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={queryParams.type || ''}
                    onChange={(e) => updateFilterField('type', e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">All Item Types</option>
                    {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                    value={queryParams.category || ''}
                    onChange={(e) => updateFilterField('category', e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">All Categories</option>
                    {Object.values(ItemCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Splitscreen configuration environment */}
            <main className={`${styles.mainGrid} ${!isFormOpen ? styles.fullWidth : ''}`}>

                {/* LEFT COLUMN: The Filtered Data Grid Index */}
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>Item Definition Pipelines</h2>

                    {itemsLoading ? (
                        <div className={styles.statusMessage}>Syncing active asset pipelines...</div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Blueprint Identifier</th>
                                        <th>Type Architecture</th>
                                        {!isFormOpen && (<th>Sub-Category</th>)}
                                        {!isFormOpen && (<th>Stack Capacity</th>)}
                                        {!isFormOpen && (<th>Attached Modules</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsData?.items.map((item) => {
                                        const isCurrentlySelected = selectedItem?.iD === item.iD;
                                        const itemId = (item as any).id;
                                        return (
                                            <tr
                                                key={itemId}
                                                onClick={() => handleOpenEditMode(item)}
                                                className={`${styles.row} ${isCurrentlySelected ? styles.selectedRow : ''}`}
                                            >
                                                <td className={styles.fontMono}>{itemId}</td>
                                                <td>{item.type}</td>
                                                {!isFormOpen && (<td>{item.category}</td>)}
                                                {/* Fixed: Display explicit string flag if field resolves as null/undefined inside list column view */}
                                                {!isFormOpen && (<td>{(item.maxStack === null || item.maxStack === undefined) ? '❌ Unstackable' : `📦 ${item.maxStack}`}</td>)}
                                                {!isFormOpen && (
                                                    <td>
                                                        <div className={styles.badgeContainer}>
                                                            <span className={`${styles.badge} ${item.costConfig ? styles.activeBadge : ''}`}>
                                                                Cost
                                                            </span>
                                                            <span className={`${styles.badge} ${item.equipConfig ? styles.activeBadge : ''}`}>
                                                                Equip
                                                            </span>
                                                            <span className={`${styles.badge} ${item.spawnEntityConfig ? styles.activeBadge : ''}`}>
                                                                Spawn
                                                            </span>
                                                            <span className={`${styles.badge} ${item.applyEffectConfig?.effectDefinitionIDs?.length ? styles.activeBadge : ''}`}>
                                                                Effects ({item.applyEffectConfig?.effectDefinitionIDs?.length || 0})
                                                            </span>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {(!itemsData?.items || itemsData.items.length === 0) && (
                                <div className={styles.statusMessage}>No system definitions exist matching parameters.</div>
                            )}

                            {/* --- Pagination Controls Matrix --- */}
                            <div className={styles.pagination}>
                                <button
                                    className={`${styles.paginationButton}`}
                                    disabled={(queryParams.pageNumber || 1) <= 1}
                                    onClick={() => shiftPage(-1)}
                                >
                                    Previous
                                </button>
                                <span className={styles.paginationText}>Page {queryParams.pageNumber}</span>
                                <button
                                    className={`${styles.paginationButton}`}
                                    disabled={!itemsData || itemsData.items.length < (queryParams.pageSize || 15)}
                                    onClick={() => shiftPage(1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* RIGHT COLUMN: The Dynamic Workspace Form Panel */}
                {isFormOpen && (
                    <section className={styles.panel}>
                        <ItemUpsertForm
                            item={selectedItem}
                            onClose={handleCloseFormWorkspace}
                        />
                    </section>
                )}
            </main>
        </div>
    );
};