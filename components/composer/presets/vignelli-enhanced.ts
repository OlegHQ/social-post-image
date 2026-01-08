import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Vignelli Enhanced Preset
 * Advanced Vignelli-style quote poster with 4-column header and customizable footer
 * Supports both dark (vignelli-gold) and orange (vignelli-orange) variants
 */
export interface VignelliEnhancedOptions {
  // Header section
  seriesTitle?: string;
  authorName?: string;
  headerColumns?: string[];

  // Quote section
  quote: string;
  emphasisPhrase: string;
  quoteItalic?: boolean;
  quoteVariant?: 'subhead' | 'title';
  emphasisVariant?: 'display' | 'hero';

  // Footer section
  leftDots?: { filled: number; total: number };
  rightDots?: { filled: number; total: number };
  bioColumns?: Array<{ title?: string; text: string }>;
  seriesNumber?: number;

  theme?: ThemePreset;
}

export function createVignelliEnhanced(options: VignelliEnhancedOptions): PosterDefinition {
  const {
    seriesTitle = 'Five phrases to live by:',
    authorName = 'Massimo Vignelli',
    headerColumns = [],
    quote,
    emphasisPhrase,
    quoteItalic = true,
    quoteVariant = 'subhead',
    emphasisVariant = 'display',
    leftDots = { filled: 3, total: 3 },
    rightDots = { filled: 2, total: 2 },
    bioColumns = [],
    seriesNumber = 2,
    theme = 'vignelli-gold',
  } = options;

  // Build dot group
  const buildDotGroup = (filled: number, total: number): PrimitiveNode => ({
    type: 'stack',
    direction: 'horizontal',
    gap: 1,
    children: Array.from({ length: total }, (_, i) => ({
      type: 'box' as const,
      color: i < filled ? 'accent' : 'muted',
      style: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
      },
      children: [],
    })),
  });

  // Build bio column
  const buildBioColumn = (column: { title?: string; text: string }): PrimitiveNode => ({
    type: 'stack',
    direction: 'vertical',
    gap: 1,
    children: [
      ...(column.title
        ? [{
            type: 'text' as const,
            content: column.title,
            variant: 'meta' as const,
            color: 'foreground' as const,
            style: { fontWeight: '700' },
          }]
        : []),
      {
        type: 'text',
        content: column.text,
        variant: 'meta',
        color: 'foreground',
      },
    ],
  });

  // Build header columns grid
  const buildHeaderGrid = (): PrimitiveNode | null => {
    if (headerColumns.length === 0) return null;
    return {
      type: 'grid',
      columns: Math.min(headerColumns.length, 4),
      gap: 4,
      children: headerColumns.slice(0, 4).map((text) => ({
        type: 'text' as const,
        content: text,
        variant: 'meta' as const,
        color: 'foreground' as const,
        style: { lineHeight: '1.4' },
      })),
    };
  };

  const headerGrid = buildHeaderGrid();

  return {
    name: `Vignelli Enhanced - ${authorName}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 4,
      style: { flex: 1 },
      children: [
        // Header section
        {
          type: 'stack',
          direction: 'vertical',
          gap: 3,
          children: [
            // Series title and author
            {
              type: 'stack',
              direction: 'horizontal',
              gap: 2,
              children: [
                { type: 'text', content: seriesTitle, variant: 'meta', color: 'foreground' },
                { type: 'text', content: authorName, variant: 'meta', color: 'accent', italic: true },
              ],
            },
            // Header columns
            ...(headerGrid ? [headerGrid] : []),
          ],
        },

        // Divider
        { type: 'divider', color: 'foreground' },

        { type: 'spacer', size: 2 },

        // Quote
        {
          type: 'text',
          content: quote,
          variant: quoteVariant,
          color: 'foreground',
          italic: quoteItalic,
          style: {
            lineHeight: '1.15',
            fontWeight: quoteItalic ? '400' : '700',
          },
        },

        // Emphasis phrase
        {
          type: 'text',
          content: emphasisPhrase,
          variant: emphasisVariant,
          color: 'accent',
          style: {
            lineHeight: '0.95',
            fontWeight: '900',
            letterSpacing: '-0.02em',
          },
        },

        { type: 'spacer', size: 'flex' },

        // Divider before footer
        { type: 'divider', color: 'foreground', thickness: 'thin' },

        // Footer section
        {
          type: 'grid',
          columns: '1fr 2fr 2fr 1fr',
          gap: 3,
          style: { marginTop: '12px', alignItems: 'end' },
          children: [
            // Left dots
            {
              type: 'stack',
              direction: 'vertical',
              gap: 2,
              children: [
                buildDotGroup(leftDots.filled, leftDots.total),
                ...(bioColumns[0] ? [buildBioColumn(bioColumns[0])] : []),
              ],
            },
            // Right dots (above second bio column)
            {
              type: 'stack',
              direction: 'vertical',
              gap: 2,
              children: [
                buildDotGroup(rightDots.filled, rightDots.total),
                ...(bioColumns[1] ? [buildBioColumn(bioColumns[1])] : []),
              ],
            },
            // Empty space or additional content
            { type: 'spacer', size: 1 },
            // Series number
            {
              type: 'text',
              content: String(seriesNumber).padStart(2, '0'),
              variant: 'display',
              color: 'accent',
              style: {
                textAlign: 'right',
                fontWeight: '400',
                lineHeight: '1',
              },
            },
          ],
        },
      ],
    },
  };
}
