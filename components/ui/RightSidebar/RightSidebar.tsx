'use client';

import { useState } from 'react';
import { AddLayerPanel } from './AddLayerPanel';
import { Inspector } from '../Inspector';
import styles from './RightSidebar.module.css';

export function RightSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <aside className={styles.sidebarCollapsed}>
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setIsCollapsed(false)}
          title="Expand sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Properties</h2>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(true)}
          title="Collapse sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <AddLayerPanel />

        <div className={styles.panel}>
          <button
            type="button"
            className={styles.panelHeader}
            onClick={() => setInspectorCollapsed(!inspectorCollapsed)}
          >
            <span className={styles.panelTitle}>Inspector</span>
            <span className={styles.panelChevron}>{inspectorCollapsed ? '+' : '−'}</span>
          </button>

          {!inspectorCollapsed && (
            <div className={styles.panelContent}>
              <Inspector />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
