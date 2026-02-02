'use client';

import { useState } from 'react';
import { PresetSelector } from './PresetSelector';
import { DesignsPanel } from './DesignsPanel';
import { LayersPanel } from './LayersPanel';
import { ThemeSelector } from './ThemeSelector';
import { CanvasSelector } from './CanvasSelector';
import { Editor } from '../Editor';
import { AIGenerator } from '../AIGenerator';
import styles from './Sidebar.module.css';

type SidebarTab = 'presets' | 'design';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('presets');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.logo}>Swiss</h1>
            <span className={styles.tagline}>Content Generator</span>
          </div>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(true)}
            title="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'presets' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          Presets
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'design' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'presets' && (
          <>
            <AIGenerator />
            <DesignsPanel />
            <PresetSelector />
          </>
        )}
        {activeTab === 'design' && (
          <>
            <LayersPanel />
            <div className={styles.section}>
              <Editor />
            </div>
            <CanvasSelector />
            <ThemeSelector />
          </>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Create beautiful Swiss-style posters for social media.
        </p>
      </div>
    </aside>
  );
}
