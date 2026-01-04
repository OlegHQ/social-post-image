import React from 'react';
import { themes, type ThemePreset } from '@swiss/primitives';
import { useDesign } from '../../context/DesignContext';
import styles from './Sidebar.module.css';

export function ThemeSelector() {
  const { state, setTheme } = useDesign();
  const currentTheme = state.definition.theme.preset || 'swiss-red';

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Theme</h3>
      <div className={styles.themeGrid}>
        {Object.entries(themes).map(([id, theme]) => (
          <button
            key={id}
            className={`${styles.themeSwatch} ${currentTheme === id ? styles.themeSwatchActive : ''}`}
            onClick={() => setTheme(id as ThemePreset)}
            title={theme.name}
          >
            <div
              className={styles.themePreview}
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.foreground,
              }}
            >
              <div
                className={styles.themeAccent}
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            <span className={styles.themeName}>{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
