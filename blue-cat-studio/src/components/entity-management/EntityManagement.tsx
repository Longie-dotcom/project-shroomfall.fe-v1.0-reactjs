import React, { useState } from 'react';
import { useDesignAllEntities } from '../../api/hooks/useDesign';
import { EntityUpsertForm } from './EntityUpsertForm';
import { EntityType } from '../../contracts/enums/entity/entity-type';
import type { EntityDefinitionQueryDTO } from '../../contracts/design/commands/entity-definition-query-dto';
import { enumToString } from '../../utils/enum-helper';

export const EntityManagement: React.FC = () => {
  // 1. Unified Query state to ensure dropdown filtering triggers automatic hook refetching
  const [queryParams, setQueryParams] = useState<EntityDefinitionQueryDTO & { typeFilter?: string }>({
    searchTerm: '',
    pageNumber: 1,
    pageSize: 12,
    typeFilter: '', 
  });
  
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  // Fetching catalog list using the current query state parameter group
  const { data: pagedEntities, isLoading, refetch } = useDesignAllEntities(queryParams as any);

  const handleCloseForm = () => {
    setActiveFormId(null);
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams(prev => ({ ...prev, searchTerm: e.target.value, pageNumber: 1 }));
  };

  // Connect the select element directly into the query state pipeline
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams(prev => ({ ...prev, typeFilter: e.target.value, pageNumber: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({ ...prev, pageNumber: newPage }));
  };

  const totalPages = pagedEntities?.totalCount 
    ? Math.ceil(pagedEntities.totalCount / queryParams.pageSize) 
    : 1;

  // Intercept view swapping if an active ID target is registered
  if (activeFormId) {
    return (
      <EntityUpsertForm 
        entityId={activeFormId === 'new' ? '' : activeFormId} 
        onClose={handleCloseForm} 
      />
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px' }}>Entity Directory Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Search blueprints, configure game units, and register structural components.</p>
        </div>
        <button 
          onClick={() => setActiveFormId('new')}
          style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)' }}
        >
          + Assemble New Entity
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: '16px', background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>
          Search Entities (ID, Tags)
          <input 
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
            placeholder="ent_..." 
            value={queryParams.searchTerm} 
            onChange={handleSearchChange} 
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>
          Filter by Base Template
          <select 
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
            value={queryParams.typeFilter} 
            onChange={handleTypeChange}
          >
            <option value="">Show All Schemas</option>
            {Object.values(EntityType)
              .filter(v => typeof v === 'string') // Safely strip numeric reverse keys if EntityType is a traditional numeric enum
              .map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
          </select>
        </label>
      </div>

      {/* Grid View Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Indexing blueprints...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {pagedEntities?.items?.map((entity: any) => {
              // Defensive Casing Engine: Locate the key whether the serializer emitted 'iD', 'id', or 'Id'
              const resolvedId = entity.iD ?? entity.id ?? entity.Id;

              return (
                <div 
                  key={resolvedId ?? Math.random().toString()} 
                  style={{ background: '#fff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}
                >
                  <div>
                    <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        <span>{enumToString(EntityType, entity.type, "Unknown Type")}</span>
                    </span>
                    <h4 style={{ margin: '8px 0 4px 0', fontSize: '16px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resolvedId || "Unnamed Blueprint"}
                    </h4>
                  </div>
                  <button 
                    onClick={() => {
                      if (resolvedId) {
                        setActiveFormId(resolvedId);
                      } else {
                        alert("Error: This entity card has no valid unique ID property field!");
                      }
                    }}
                    style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#334155', cursor: 'pointer', textAlign: 'center' }}
                  >
                    Inspect Components
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
            <button 
              disabled={queryParams.pageNumber <= 1}
              onClick={() => handlePageChange(queryParams.pageNumber - 1)}
              style={{ padding: '6px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: queryParams.pageNumber <= 1 ? 'not-allowed' : 'pointer', opacity: queryParams.pageNumber <= 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: 500 }}>
              Page {queryParams.pageNumber} of {totalPages}
            </span>
            <button 
              disabled={queryParams.pageNumber >= totalPages}
              onClick={() => handlePageChange(queryParams.pageNumber + 1)}
              style={{ padding: '6px 16px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: queryParams.pageNumber >= totalPages ? 'not-allowed' : 'pointer', opacity: queryParams.pageNumber >= totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};