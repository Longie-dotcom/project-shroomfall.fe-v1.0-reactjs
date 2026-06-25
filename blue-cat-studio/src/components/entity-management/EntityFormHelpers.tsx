import React, { useState } from 'react';

export const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>{children}</div>
);

export const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>
    {label}
    {children}
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#f8fafc', ...props.style }} />
);

// Expanded props to receive Drag & Drop event handlers from the parent layout loop
interface ComponentCardProps<T> {
  title: string;
  data: T;
  entityType: any;
  componentType: string;
  rules: Record<any, string[]>;
  onRemove: () => void;
  children: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const ComponentCard = <T extends { ComponentType: string }>({
  title,
  entityType,
  componentType,
  rules,
  onRemove,
  children,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging
}: ComponentCardProps<T>) => {
  const isRequired = rules[entityType]?.includes(componentType);
  
  // Local state to manage collapse/expand toggle clicking
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        border: isDragging ? '2px dashed #0284c7' : '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '16px', 
        background: '#ffffff', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        opacity: isDragging ? 0.4 : 1,
        transition: 'opacity 0.15s ease, border-color 0.15s ease',
        breakInside: 'avoid', // Crucial rule if you chose Option 1 (Masonry style Layout)
        marginBottom: '20px'
      }}
    >
      {/* Header Container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none', paddingBottom: '8px', marginBottom: '4px' }}>
        
        {/* Clickable zone to collapse/expand form content */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', flexGrow: 1 }}
        >
          {/* Drag Handle Indicator Icon */}
          <span style={{ cursor: 'grab', color: '#94a3b8', fontSize: '16px', fontWeight: 'bold', paddingRight: '2px' }} title="Drag to reorder">
            ⋮⋮
          </span>

          {/* Chevron Toggler Indicator */}
          <span style={{ fontSize: '11px', color: '#64748b', transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
            ▼
          </span>

          <span style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{title}</span>
          
          {isRequired && (
            <span style={{ fontSize: '11px', fontWeight: 500, background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
              Required
            </span>
          )}
        </div>

        {/* Action Button Area */}
        {!isRequired && (
          <button 
            type="button" 
            onClick={onRemove}
            style={{ padding: '4px 8px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
          >
            Remove
          </button>
        )}
      </div>

      {/* Collapsible content wrapper */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
};