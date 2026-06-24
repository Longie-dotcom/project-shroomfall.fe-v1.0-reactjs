// src/components/layout/WorkspaceLayout.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface UserSession {
  name: string;
  role: 'Admin' | 'Designer' | 'Player';
}

interface WorkspaceLayoutProps {
  user: UserSession | null;
  onLogout: () => void;
  // This layout will now orchestrate the view state or act as a router layout wrapper
  children?: React.ReactNode; 
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ user, onLogout, children }) => {
  // 🧭 Track which sub-panel the operator is currently viewing inside Blue Cat Studio
  const [currentPath, setCurrentPath] = useState<string>('dashboard');

  // 🔒 1. Force Authorization check before rendering anything
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 🧭 2. Sidebar connected with state pathing metrics */}
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={setCurrentPath} 
        userRole={user.role} 
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* 👤 3. Header displays current user info and remote deployment IP */}
        <Header username={user.name} role={user.role} onLogout={onLogout} />

        {/* 💻 4. Main Canvas Viewport renders content based on active path or children */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
          {children ? (
            children
          ) : (
            // Fallback rendering placeholder logic if you aren't using React Router routes yet
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              {currentPath === 'dashboard' && (
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Dashboard Overview</h1>
                  <p style={{ color: '#64748b' }}>Welcome to Shroomfall runtime telemetry monitoring canvas.</p>
                </div>
              )}
              {currentPath === 'designer' && (
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Blueprint Designer</h1>
                  <p style={{ color: '#64748b' }}>Construct and upload schema DTOs to the remote server engine.</p>
                </div>
              )}
              {currentPath === 'settings' && user.role === 'Admin' && (
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Server Settings</h1>
                  <p style={{ color: '#64748b' }}>System diagnostics, signal network frequencies, and access controls.</p>
                </div>
              )}
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};