import React, { useState } from 'react';
import { useDesignAllEffects } from '../../../api/hooks/useDesign'; // Assuming matching query hook exists
import { EffectRowForm } from './EffectRowForm';

import { EffectType } from '../../../contracts/enums/meta/effect/effect-type';
import { AttributeType } from '../../../contracts/enums/meta/effect/attribute-type';

import type { EffectDefinitionQueryDTO } from '../../../contracts/design/commands/effect-definition-query-dto';

import styles from './EffectManagement.module.css';

export const EffectManagement: React.FC = () => {
  // Query parameters state matching backend API boundaries
  const [queryParams, setQueryParams] = useState<Partial<EffectDefinitionQueryDTO>>({
    searchTerm: '',
    type: undefined,
    attributeType: undefined,
    pageNumber: 1,
    pageSize: 9
  });

  // Fetch live effect collections from data engine cache hook
  const { data, isLoading, isError, refetch } = useDesignAllEffects(queryParams as EffectDefinitionQueryDTO);

  // Layout orchestration inline creation flag
  const [isCreatingInline, setIsCreatingInline] = useState<boolean>(false);

  // Safe layout filter resets pagination back to index step 1
  const updateFilterField = (field: keyof EffectDefinitionQueryDTO, value: any) => {
    setQueryParams(prev => ({
      ...prev,
      [field]: value || undefined,
      pageNumber: 1
    }));
  };

  const shiftPage = (direction: number) => {
    setQueryParams(prev => ({
      ...prev,
      pageNumber: Math.max(1, (prev.pageNumber || 1) + direction)
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.title}>Effect Blueprint Matrix</h1>
        {!isCreatingInline && (
          <button className={styles.primaryButton} onClick={() => setIsCreatingInline(true)}>
            New Effect
          </button>
        )}
      </header>

      {/* --- Filter & Telemetry Search Subbar --- */}
      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by keyword identifier..."
          value={queryParams.searchTerm || ''}
          onChange={(e) => updateFilterField('searchTerm', e.target.value)}
          className={styles.filterInput}
        />

        <select
          value={queryParams.type || ''}
          onChange={(e) => updateFilterField('type', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Calculation Types</option>
          {Object.values(EffectType).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={queryParams.attributeType || ''}
          onChange={(e) => updateFilterField('attributeType', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Target Attributes</option>
          {Object.values(AttributeType).map(attr => (
            <option key={attr} value={attr}>{attr}</option>
          ))}
        </select>
      </div>

      {/* Layout Grid Layout Panel Wrapper */}
      <main className={`${styles.mainGrid} ${styles.fullWidth}`}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Effect Engine Specs</h2>

          {isLoading ? (
            <div className={styles.statusMessage}>Loading runtime engine specs...</div>
          ) : isError ? (
            <div className={styles.statusMessage}>
              Failed to sync telemetry definitions.{' '}
              <button
                className={styles.retryButton}
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID / Unique Key</th>
                    <th>Type</th>
                    <th>Target Attribute</th>
                    <th>Scaling Source</th>
                    <th>Value</th>
                    <th>Duration</th>
                    <th>Tick Interval</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Top Inline Row Insertion Point */}
                  {isCreatingInline && (
                    <EffectRowForm
                      isInitialCreateRow={true}
                      onSuccessCallback={() => {
                        refetch();
                        setIsCreatingInline(false);
                      }}
                      onCancelCallback={() => setIsCreatingInline(false)}
                    />
                  )}

                  {data?.items && data.items.length > 0 ? (
                    data.items.map((effect, index) => (
                      <EffectRowForm
                        key={effect.iD || (effect as any).id || index}
                        effect={effect}
                        onSuccessCallback={() => refetch()}
                      />
                    ))
                  ) : (
                    !isCreatingInline && (
                      <tr>
                        <td colSpan={7} className={styles.statusMessage}>
                          No matching blueprint definitions returned from server core.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* --- Pagination Controls Matrix --- */}
              <div className={styles.pagination}>
                <button className={styles.paginationButton}
                  disabled={(queryParams.pageNumber || 1) <= 1}
                  onClick={() => shiftPage(-1)}
                >
                  Previous
                </button>
                <span className={styles.paginationText}>Page {queryParams.pageNumber}</span>
                <button className={styles.paginationButton}
                  disabled={!data || data.items.length < (queryParams.pageSize || 15)}
                  onClick={() => shiftPage(1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
