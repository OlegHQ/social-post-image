'use client';

import { PresetSelector } from './PresetSelector';
import { DesignsPanel } from './DesignsPanel';
import { LayersPanel } from './LayersPanel';
import { Inspector } from '../Inspector';
import { ThemeSelector } from './ThemeSelector';
import { CanvasSelector } from './CanvasSelector';
import { Editor } from '../Editor';
import { AIGenerator } from '../AIGenerator';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Swiss</h1>
        <span className={styles.tagline}>Content Generator</span>
      </div>

      <div className={styles.content}>
        <AIGenerator />
        <DesignsPanel />
        <LayersPanel />
        <div className={styles.section}>
          <Inspector />
        </div>
        <PresetSelector />
        <div className={styles.section}>
          <Editor />
        </div>
        <ThemeSelector />
        <CanvasSelector />
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Create beautiful Swiss-style posters for social media.
        </p>
      </div>
    </aside>
  );
}
