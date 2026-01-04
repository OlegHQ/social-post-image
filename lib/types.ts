/**
 * Swiss Design System - Declarative Language Types
 *
 * This module defines the declarative language schema for composing
 * Swiss-style designs programmatically. AI systems can use this schema
 * to generate poster definitions.
 */

import type { TextVariant, BorderThickness } from '@/components/primitives/types';
import type { SpacingKey } from '@/lib/tokens/spacing';
import type { CanvasPreset } from '@/lib/tokens/canvas';
import type { ColorToken, Theme, ThemePreset } from '@/lib/themes';

// Re-export useful types
export type { TextVariant, SpacingKey, ColorToken, CanvasPreset, ThemePreset };

/**
 * Color value - can be a theme token or direct hex/rgb value
 */
export type ColorValue = ColorToken | string;

/**
 * Base node interface - all nodes have these optional properties
 */
interface BaseNode {
  /** Optional ID for targeting specific nodes */
  id?: string;
  /** Custom CSS styles to apply */
  style?: Record<string, string | number>;
}

/**
 * Text node - renders typography
 */
export interface TextNode extends BaseNode {
  type: 'text';
  /** The text content to render */
  content: string;
  /** Typography variant */
  variant?: TextVariant;
  /** Text color (token or hex) */
  color?: ColorValue;
  /** Transform to uppercase */
  uppercase?: boolean;
  /** Render in italic */
  italic?: boolean;
  /** Text alignment */
  align?: 'left' | 'right' | 'center';
  /** Maximum width constraint */
  maxWidth?: string;
}

/**
 * Box node - container with background/border
 */
export interface BoxNode extends BaseNode {
  type: 'box';
  /** Background color */
  color?: ColorValue;
  /** Padding on all sides */
  padding?: SpacingKey;
  /** Horizontal padding */
  paddingX?: SpacingKey;
  /** Vertical padding */
  paddingY?: SpacingKey;
  /** Show border */
  border?: boolean;
  /** Border thickness */
  borderWidth?: BorderThickness;
  /** Border color */
  borderColor?: ColorValue;
  /** Fixed width */
  width?: string;
  /** Fixed height */
  height?: string;
  /** Minimum height */
  minHeight?: string;
  /** Child nodes */
  children?: PrimitiveNode[];
}

/**
 * Stack node - flex layout (vertical or horizontal)
 */
export interface StackNode extends BaseNode {
  type: 'stack';
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Gap between children */
  gap?: SpacingKey;
  /** Cross-axis alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis alignment */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Allow wrapping */
  wrap?: boolean;
  /** Flex value */
  flex?: number | string;
  /** Child nodes */
  children: PrimitiveNode[];
}

/**
 * Grid node - CSS Grid layout
 */
export interface GridNode extends BaseNode {
  type: 'grid';
  /** Number of columns or template string */
  columns?: number | string;
  /** Row template string */
  rows?: string;
  /** Gap between cells */
  gap?: SpacingKey;
  /** Column gap */
  columnGap?: SpacingKey;
  /** Row gap */
  rowGap?: SpacingKey;
  /** Named grid areas */
  areas?: string;
  /** Child nodes with optional positioning */
  children: (PrimitiveNode & {
    /** Grid column position */
    column?: string;
    /** Grid row position */
    row?: string;
    /** Named grid area */
    area?: string;
  })[];
}

/**
 * Divider node - horizontal rule
 */
export interface DividerNode extends BaseNode {
  type: 'divider';
  /** Line color */
  color?: ColorValue;
  /** Line thickness */
  thickness?: BorderThickness;
  /** Vertical margin */
  margin?: SpacingKey;
}

/**
 * Spacer node - empty space (fixed or flexible)
 */
export interface SpacerNode extends BaseNode {
  type: 'spacer';
  /** Size of space, or 'flex' for flexible */
  size?: SpacingKey | 'flex';
  /** Direction (for fixed size) */
  direction?: 'vertical' | 'horizontal';
}

/**
 * Series number node - large number display
 */
export interface SeriesNumberNode extends BaseNode {
  type: 'seriesNumber';
  /** The number to display */
  number: number | string;
  /** Display size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Number color */
  color?: ColorValue;
  /** Pad single digits with zero */
  padZero?: boolean;
}

/**
 * Series dots node - dot indicator
 */
export interface SeriesDotsNode extends BaseNode {
  type: 'seriesDots';
  /** Number of filled dots */
  filled?: number;
  /** Total number of dots */
  total?: number;
  /** Unfilled dot color */
  color?: ColorValue;
  /** Filled dot color */
  filledColor?: ColorValue;
  /** Dot size */
  size?: 'sm' | 'md' | 'lg';
  /** Gap between dots */
  gap?: SpacingKey;
}

/**
 * Header compound node - pre-built header with metadata columns
 */
export interface HeaderNode extends BaseNode {
  type: 'header';
  /** Main title */
  title?: string;
  /** Subtitle or author name */
  subtitle?: string;
  /** Metadata columns (up to 4) */
  columns?: string[];
  /** Show divider below header */
  showDivider?: boolean;
}

/**
 * Footer compound node - pre-built footer with author info
 */
export interface FooterNode extends BaseNode {
  type: 'footer';
  /** Author name */
  author?: string;
  /** Author metadata (title, company, etc.) */
  authorMeta?: string;
  /** Topic or category */
  topic?: string;
  /** Series number */
  seriesNumber?: number | string;
  /** Show series dots */
  showDots?: boolean;
  /** Dots configuration */
  dotsConfig?: {
    filled?: number;
    total?: number;
  };
}

/**
 * Image node - display an image
 */
export interface ImageNode extends BaseNode {
  type: 'image';
  /** Image source URL */
  src: string;
  /** Alt text */
  alt?: string;
  /** Object fit */
  fit?: 'cover' | 'contain' | 'fill';
  /** Width */
  width?: string;
  /** Height */
  height?: string;
}

/**
 * Union type of all primitive nodes
 */
export type PrimitiveNode =
  | TextNode
  | BoxNode
  | StackNode
  | GridNode
  | DividerNode
  | SpacerNode
  | SeriesNumberNode
  | SeriesDotsNode
  | HeaderNode
  | FooterNode
  | ImageNode;

/**
 * Canvas configuration
 */
export interface CanvasConfig {
  /** Use a preset canvas size */
  preset?: CanvasPreset;
  /** Custom width (overrides preset) */
  width?: number;
  /** Custom height (overrides preset) */
  height?: number;
  /** Custom padding (overrides preset) */
  padding?: number;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Use a preset theme */
  preset?: ThemePreset;
  /** Custom theme object */
  custom?: Theme;
  /** Override specific colors */
  overrides?: Partial<Theme['colors']>;
}

/**
 * Root poster definition
 * This is the main schema for defining a complete poster
 */
export interface PosterDefinition {
  /** Optional poster ID */
  id?: string;
  /** Optional poster name */
  name?: string;
  /** Canvas size configuration */
  canvas: CanvasConfig;
  /** Theme/color configuration */
  theme: ThemeConfig;
  /** Root layout node */
  root: PrimitiveNode;
}

/**
 * Type guard for checking node types
 */
export function isNodeType<T extends PrimitiveNode['type']>(
  node: PrimitiveNode,
  type: T
): node is Extract<PrimitiveNode, { type: T }> {
  return node.type === type;
}
