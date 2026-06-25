import React from 'react';
import styles from './WorkspaceHeader.module.css';

interface WorkspaceHeaderProps {
  username: string;
  role: string;
  onLogout: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ username, role, onLogout }) => {
  return (
    <header className={styles.header}>
      {/* Search / Context Tracking */}
      <div className={styles.serverStatus}>
        Live Server Workspace: <span className={styles.ipAddress}>207.148.72.68</span>
      </div>

      {/* Profile actions alignment */}
      <div className={styles.profileActions}>
        <div className={styles.userInfo}>
          <div className={styles.username}>{username}</div>
          <div className={styles.role}>{role}</div>
        </div>

        <button onClick={onLogout} className={styles.disconnectButton}>
          Disconnect
        </button>
      </div>
    </header>
  );
};