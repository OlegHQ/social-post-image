import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Type Specimen Preset
 * Font showcase with stacked typography lines
 */
export interface TypeSpecimenOptions {
  // Meta info
  fontFamily: string;
  fontWeights?: string;
  charset?: string;
  releaseDate?: string;

  // Main stacked lines
  stackedLines: string[];
  lineSpacing?: 'tight' | 'normal' | 'loose';
  uppercase?: boolean;

  // Footer
  footerColumns?: Array<{
    label: string;
    value: string;
  }>;

  // Optional logo/brand text
  centerLogo?: string;

  theme?: ThemePreset;
}

export function createTypeSpecimen(options: TypeSpecimenOptions): PosterDefinition {
  const {
    fontFamily,
    fontWeights = '10 weights + Italics',
    charset = 'Latin Extended-A',
    releaseDate,
    stackedLines,
    lineSpacing = 'tight',
    uppercase = true,
    footerColumns = [],
    centerLogo,
    theme = 'neon-green',
  } = options;

  // Map line spacing to line-height values
  const lineHeightMap = {
    tight: '0.85',
    normal: '1.0',
    loose: '1.15',
  };

  // Build stacked lines
  const buildStackedLines = (): PrimitiveNode[] =>
    stackedLines.map((line) => ({
      type: 'text' as const,
      content: uppercase ? line.toUpperCase() : line,
      variant: 'hero' as const,
      color: 'foreground' as const,
      style: {
        fontSize: '95px',
        fontWeight: '900',
        lineHeight: lineHeightMap[lineSpacing],
        letterSpacing: '-0.02em',
      },
    }));

  // Build footer column
  const buildFooterColumn = (column: { label: string; value: string }, align: 'left' | 'center' | 'right'): PrimitiveNode => ({
    type: 'stack',
    direction: 'vertical',
    gap: 0,
    style: { textAlign: align },
    children: [
      {
        type: 'text',
        content: column.label,
        variant: 'meta',
        color: 'muted',
        style: { textAlign: align },
      },
      {
        type: 'text',
        content: column.value,
        variant: 'meta',
        color: 'foreground',
        style: { fontWeight: '500', textAlign: align },
      },
    ],
  });

  return {
    name: `Type Specimen - ${fontFamily}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        // Header row
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          children: [
            // Left meta
            {
              type: 'stack',
              direction: 'vertical',
              gap: 0,
              children: [
                {
                  type: 'text',
                  content: `${fontFamily} [Font Family]`,
                  variant: 'meta',
                  color: 'foreground',
                },
                {
                  type: 'text',
                  content: fontWeights,
                  variant: 'meta',
                  color: 'foreground',
                },
                {
                  type: 'text',
                  content: charset,
                  variant: 'meta',
                  color: 'foreground',
                },
              ],
            },
            // Right release date
            ...(releaseDate
              ? [{
                  type: 'text' as const,
                  content: `Release: ${releaseDate}`,
                  variant: 'meta' as const,
                  color: 'foreground' as const,
                  style: { textAlign: 'right' as const },
                }]
              : []),
          ],
        },

        { type: 'spacer', size: 'flex' },

        // Stacked lines (main content)
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          children: buildStackedLines(),
        },

        { type: 'spacer', size: 'flex' },

        // Footer row
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            // Left footer column
            ...(footerColumns[0]
              ? [buildFooterColumn(footerColumns[0], 'left')]
              : [{ type: 'spacer' as const, size: 1 as const }]),

            // Center logo/brand
            ...(centerLogo
              ? [{
                  type: 'text' as const,
                  content: centerLogo,
                  variant: 'body' as const,
                  color: 'foreground' as const,
                  italic: true,
                  style: { fontFamily: 'cursive' },
                }]
              : [{ type: 'spacer' as const, size: 1 as const }]),

            // Right footer column
            ...(footerColumns[1]
              ? [buildFooterColumn(footerColumns[1], 'right')]
              : [{ type: 'spacer' as const, size: 1 as const }]),
          ],
        },
      ],
    },
  };
}
