// src/components/layout/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, userRole }) => {
  const menuItems = [
    { name: 'Dashboard', path: 'dashboard', icon: '📊' },
    { name: 'Blueprint Designer', path: 'designer', icon: '🛠️' },
    { name: 'Server Settings', path: 'settings', icon: '⚙️', adminOnly: true },
  ];

  return (
    <div style={{ width: '260px', backgroundColor: '#0f172a', color: '#f8fafc', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' }}>
      {/* Brand Header */}
      <div style={{ padding: '24px', fontSize: '18px', fontWeight: 'bold', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>🐱</span> BLUE CAT STUDIO
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          if (item.adminOnly && userRole !== 'Admin') return null;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', transition: 'all 0.2s',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? '600' : '400'
              }}
              onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = '#1e293b')}
              onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>{item.icon}</span> {item.name}
            </button>
          );
        })}
      </nav>

      {/* System Status / Footprint */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b', backgroundColor: '#0b0f19', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>Environment: <span style={{ color: '#10b981', fontWeight: '600' }}>Production</span></div>
        <div>Version: <span style={{ color: '#94a3b8' }}>v1.0.0</span></div>
      </div>
    </div>
  );
};