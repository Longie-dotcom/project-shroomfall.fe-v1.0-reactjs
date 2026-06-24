import React from 'react';

interface HeaderProps {
  username: string;
  role: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, role, onLogout }) => {
  return (
    <header style={{ height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
      {/* Search / Context Tracking */}
      <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
        Live Server Workspace: <span style={{ color: '#0f172a', fontWeight: '600' }}>207.148.72.68</span>
      </div>

      {/* Profile actions alignment */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{username}</div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{role}</div>
        </div>

        <button 
          onClick={onLogout}
          style={{ padding: '8px 14px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          Disconnect
        </button>
      </div>
    </header>
  );
};