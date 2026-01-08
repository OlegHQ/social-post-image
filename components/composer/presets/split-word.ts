import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Split Word Preset
 * Giant word split across lines (Vignelli tribute style)
 */
export interface SplitWordOptions {
  url?: string;
  wordPart1: string;
  wordPart2: string;
  wordColor?: 'foreground' | 'accent';
  supportingQuote?: string;
  bioColumns?: Array<{
    primary: string;
    secondary?: string;
    tertiary?: string;
  }>;
  theme?: ThemePreset;
}

export function createSplitWord(options: SplitWordOptions): PosterDefinition {
  const {
    url,
    wordPart1,
    wordPart2,
    wordColor = 'accent',
    supportingQuote,
    bioColumns = [],
    theme = 'monochrome',
  } = options;

  // Build bio column node
  const buildBioColumn = (column: { primary: string; secondary?: string; tertiary?: string }): PrimitiveNode => ({
    type: 'stack',
    direction: 'vertical',
    gap: 1,
    children: [
      {
        type: 'text',
        content: column.primary,
        variant: 'meta',
        color: 'foreground',
        style: { fontWeight: '700' },
      },
      ...(column.secondary
        ? [{
            type: 'text' as const,
            content: column.secondary,
            variant: 'meta' as const,
            color: 'muted' as const,
          }]
        : []),
      ...(column.tertiary
        ? [{
            type: 'text' as const,
            content: column.tertiary,
            variant: 'meta' as const,
            color: 'muted' as const,
          }]
        : []),
    ],
  });

  return {
    name: `Split Word - ${wordPart1}${wordPart2}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: {
      preset: theme,
      // Override accent to red for the classic "Forever" look when using monochrome
      ...(theme === 'monochrome' ? { overrides: { accent: '#E30613' } } : {}),
    },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        // URL (optional)
        ...(url
          ? [{
              type: 'text' as const,
              content: url,
              variant: 'meta' as const,
              color: 'muted' as const,
            }]
          : []),

        { type: 'spacer', size: 6 },

        // Split word - Part 1
        {
          type: 'text',
          content: wordPart1,
          variant: 'hero',
          color: wordColor,
          style: {
            fontSize: '220px',
            fontWeight: '900',
            lineHeight: '0.85',
            letterSpacing: '-0.03em',
          },
        },

        // Split word - Part 2
        {
          type: 'text',
          content: wordPart2,
          variant: 'hero',
          color: wordColor,
          style: {
            fontSize: '220px',
            fontWeight: '900',
            lineHeight: '0.85',
            letterSpacing: '-0.03em',
          },
        },

        { type: 'spacer', size: 8 },

        // Supporting quote
        ...(supportingQuote
          ? [{
              type: 'text' as const,
              content: supportingQuote,
              variant: 'title' as const,
              color: 'foreground' as const,
              style: {
                fontSize: '48px',
                fontWeight: '700',
                lineHeight: '1.15',
              },
            }]
          : []),

        { type: 'spacer', size: 'flex' },

        // Bio columns footer
        ...(bioColumns.length > 0
          ? [{
              type: 'grid' as const,
              columns: Math.min(bioColumns.length, 3) as number,
              gap: 4 as const,
              children: bioColumns.slice(0, 3).map(buildBioColumn),
            }]
          : []),
      ],
    },
  };
}
