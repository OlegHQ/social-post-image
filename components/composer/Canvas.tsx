import React from 'react';
import {
  getCanvasConfig,
  type CanvasPreset,
} from '@/lib/tokens/canvas';
import {
  getTheme,
  createTheme,
  generateThemeCSS,
  type Theme,
} from '@/lib/themes';
import type { CanvasConfig, ThemeConfig } from '@/lib/types';

export interface CanvasProps {
  /** Canvas configuration */
  canvas: CanvasConfig;
  /** Theme configuration */
  theme: ThemeConfig;
  /** Child content */
  children: React.ReactNode;
  /** Show debug grid overlay */
  showGrid?: boolean;
  /** Scale factor for preview (e.g., 0.5 for half size) */
  scale?: number;
  /** Additional className */
  className?: string;
}

/**
 * Canvas component - Root container for poster rendering
 * Sets up dimensions, theme, and provides the rendering context
 */
export function Canvas({
  canvas,
  theme,
  children,
  showGrid = false,
  scale = 1,
  className,
}: CanvasProps) {
  // Resolve canvas dimensions
  const baseConfig = canvas.preset
    ? getCanvasConfig(canvas.preset as CanvasPreset)
    : { width: 1080, height: 1350, padding: 60, columns: 12, gap: 20 };

  const width = canvas.width ?? baseConfig.width;
  const height = canvas.height ?? baseConfig.height;
  const padding = canvas.padding ?? baseConfig.padding;

  // Resolve theme
  let resolvedTheme: Theme;
  if (theme.custom) {
    resolvedTheme = theme.custom;
  } else if (theme.preset) {
    resolvedTheme = theme.overrides
      ? createTheme(theme.preset, theme.overrides)
      : getTheme(theme.preset);
  } else {
    resolvedTheme = getTheme('swiss-red');
  }

  const containerStyle: React.CSSProperties = {
    width: width * scale,
    height: height * scale,
    overflow: 'hidden',
    position: 'relative',
  };

  const canvasStyle: React.CSSProperties = {
    width,
    height,
    padding,
    backgroundColor: resolvedTheme.colors.background,
    color: resolvedTheme.colors.foreground,
    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    position: 'relative',
    boxSizing: 'border-box',
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'top left',
    display: 'flex',
    flexDirection: 'column',
  };

  // Generate inline CSS variables for theme
  const themeStyles = `
    .swiss-canvas {
      ${generateThemeCSS(resolvedTheme)}
    }
  `;

  return (
    <div className={className} style={containerStyle}>
      <style>{themeStyles}</style>
      <div
        className="swiss-canvas"
        data-theme={resolvedTheme.id}
        style={canvasStyle}
      >
        {children}
        {showGrid && <GridOverlay columns={baseConfig.columns} gap={baseConfig.gap} />}
      </div>
    </div>
  );
}

/**
 * Debug grid overlay component
 */
function GridOverlay({ columns, gap }: { columns: number; gap: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        pointerEvents: 'none',
        opacity: 0.1,
      }}
    >
      {Array.from({ length: columns }, (_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#FF0000',
            height: '100%',
          }}
        />
      ))}
    </div>
  );
}
