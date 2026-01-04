/**
 * Swiss Design System - Composer Package
 *
 * Declarative layout composition for Swiss-style designs.
 * Use this package to define posters programmatically and render them.
 *
 * @packageDocumentation
 */

// Types
export * from './types';

// Core components
export { Canvas, type CanvasProps } from './Canvas';
export { LayoutRenderer, NodeRenderer, type LayoutRendererProps } from './LayoutRenderer';

// Presets
export * from './presets';

// Validation Schemas (for CLI/API)
export * from './schemas';
