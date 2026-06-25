import React, { useState } from 'react';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceHeader } from './WorkspaceHeader';
import { ROUTES } from '../../../constants/routes.constants';
import { EffectManagement } from '../../meta-management/EffectManagement/EffectManagement';
import { ItemManagement } from '../../meta-management/ItemManagement/ItemManagement';
import type { UserSession } from '../../../models/UserSession';
import styles from './WorkspaceLayout.module.css';
import { EntityManagement } from '../../entity-management/EntityManagement';

interface WorkspaceLayoutProps {
  user: UserSession | null;
  onLogout: () => void;
  children?: React.ReactNode; 
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ user, onLogout, children }) => {
  const [currentPath, setCurrentPath] = useState<string>('dashboard');

  if (!user) {
    window.location.href = ROUTES.LOGIN;
    return null;
  }

  return (
    <div className={styles.layoutWrapper}>
      
      {/* 🧭 Sidebar connected with state pathing metrics */}
      <WorkspaceSidebar 
        currentPath={currentPath} 
        onNavigate={setCurrentPath} 
        userRole={user.role} 
      />

      <div className={styles.contentPane}>
        
        {/* 👤 Header displays current user info and remote deployment IP */}
        <WorkspaceHeader username={user.name} role={user.role} onLogout={onLogout} />

        {/* 💻 Main Canvas Viewport renders content based on active path or children */}
        <main className={styles.mainCanvas}>
          {children ? (
            children
          ) : (
            <div className={styles.fallbackContainer}>
              {currentPath === 'dashboard' && (
                <div>
                  <h1 className={styles.heading}>Dashboard Overview</h1>
                  <p className={styles.description}>Welcome to Shroomfall runtime telemetry monitoring canvas.</p>
                </div>
              )}
              {currentPath === 'effect-designer' && (
                <EffectManagement />
              )}
              {currentPath === 'item-designer' && (
                <ItemManagement />
              )}
              {currentPath === 'entity-designer' && (
                <EntityManagement />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};