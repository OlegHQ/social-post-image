/**
 * HTML Document Generator
 * Generates complete HTML documents from poster definitions
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  getCanvasConfig,
  getTheme,
  createTheme,
  generateThemeCSS,
  type CanvasPreset,
  type Theme,
} from '@swiss/primitives';
import { LayoutRenderer, type PosterDefinition } from '@swiss/composer';

/**
 * Generate complete HTML document for rendering
 */
export function generateHTML(definition: PosterDefinition): string {
  // Resolve canvas
  const baseConfig = definition.canvas.preset
    ? getCanvasConfig(definition.canvas.preset as CanvasPreset)
    : { width: 1080, height: 1350, padding: 60, columns: 12, gap: 20 };

  const width = definition.canvas.width ?? baseConfig.width;
  const height = definition.canvas.height ?? baseConfig.height;
  const padding = definition.canvas.padding ?? baseConfig.padding;

  // Resolve theme
  let resolvedTheme: Theme;
  if (definition.theme.custom) {
    resolvedTheme = definition.theme.custom;
  } else if (definition.theme.preset) {
    resolvedTheme = definition.theme.overrides
      ? createTheme(definition.theme.preset, definition.theme.overrides)
      : getTheme(definition.theme.preset);
  } else {
    resolvedTheme = getTheme('swiss-red');
  }

  // Render React to static markup
  const content = renderToStaticMarkup(
    React.createElement(LayoutRenderer, { definition })
  );

  // Generate complete HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    body {
      font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: ${resolvedTheme.colors.background};
      color: ${resolvedTheme.colors.foreground};
    }

    /* Theme CSS Variables */
    :root {
      ${generateThemeCSS(resolvedTheme)}
    }

    /* Canvas container */
    .swiss-canvas {
      width: ${width}px;
      height: ${height}px;
      padding: ${padding}px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Typography defaults */
    p, h1, h2, h3, h4, h5, h6 {
      margin: 0;
    }

    /* Ensure proper image handling */
    img {
      display: block;
      max-width: 100%;
    }

    /* HR reset */
    hr {
      border: none;
    }

    /* Canvas overflow handling */
    .swiss-canvas {
      overflow: hidden;
    }

    /*
     * Default whitespace handling for text elements.
     * Individual elements can override via inline style.
     * Using normal instead of pre-wrap to avoid unexpected spacing.
     */
    .swiss-text {
      white-space: normal;
    }

    /* Block-level display for series numbers */
    .swiss-series-number {
      display: block;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}
