import React from 'react';
import styles from './WorkspaceSidebar.module.css';
import { Role } from '../../../contracts/enums/identity/role';

interface WorkspaceSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  userRole: string;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ currentPath, onNavigate, userRole }) => {
  const menuItems = [
    { name: 'Dashboard', path: 'dashboard', icon: '📊', adminOnly: true },
    { name: 'Effect Design', path: 'effect-designer', icon: '🛠️' },
    { name: 'Item Design', path: 'item-designer', icon: '🛠️' },
    { name: 'Entity Design', path: 'entity-designer', icon: '🛠️' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <span className={styles.logo}>🐱</span> BLUE CAT STUDIO
      </div>

      {/* Navigation List */}
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          if (item.adminOnly && userRole !== Role.Admin) return null;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`${styles.navButton} ${isActive ? styles.activeButton : ''}`}
            >
              <span>{item.icon}</span> {item.name}
            </button>
          );
        })}
      </nav>

      {/* System Status / Footprint */}
      <div className={styles.footer}>
        <div>Environment: <span className={styles.envStatus}>Production</span></div>
        <div>Version: <span className={styles.versionText}>v1.0.0</span></div>
      </div>
    </div>
  );
};