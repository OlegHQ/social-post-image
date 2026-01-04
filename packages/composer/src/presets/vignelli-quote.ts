import type { PosterDefinition, ThemePreset } from '../types';

/**
 * Vignelli Quote Preset
 * Creates a Massimo Vignelli-inspired quote poster
 *
 * Based on the "Five phrases to live by" poster series
 */
export interface VignelliQuoteOptions {
  /** The full quote text */
  quote: string;
  /** Key phrase to emphasize (displayed larger below quote) */
  emphasisPhrase: string;
  /** Author name */
  author: string;
  /** Author metadata (birth year, company, etc.) */
  authorMeta?: string;
  /** Series title */
  seriesTitle?: string;
  /** Series number (will be displayed as 01, 02, etc.) */
  seriesNumber?: number;
  /** Metadata columns for header (4 max) */
  metaColumns?: string[];
  /** Theme preset or custom */
  theme?: ThemePreset;
  /** Topic or additional context */
  topic?: string;
}

export function createVignelliQuote(options: VignelliQuoteOptions): PosterDefinition {
  const {
    quote,
    emphasisPhrase,
    author,
    authorMeta,
    seriesTitle = 'Five phrases to live by:',
    seriesNumber = 1,
    metaColumns,
    theme = 'vignelli-gold',
    topic,
  } = options;

  return {
    name: `Vignelli Quote - ${author}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 6,
      style: { flex: 1 },
      children: [
        // Header section
        {
          type: 'stack',
          direction: 'vertical',
          gap: 4,
          children: [
            // Series title and author
            {
              type: 'stack',
              direction: 'horizontal',
              gap: 2,
              align: 'center',
              children: [
                {
                  type: 'text',
                  content: seriesTitle,
                  variant: 'meta',
                  color: 'foreground',
                },
                {
                  type: 'text',
                  content: author,
                  variant: 'meta',
                  color: 'accent',
                  italic: true,
                },
              ],
            },
            // Metadata columns (if provided)
            ...(metaColumns && metaColumns.length > 0
              ? [
                  {
                    type: 'grid' as const,
                    columns: Math.min(metaColumns.length, 4),
                    gap: 5 as const,
                    children: metaColumns.slice(0, 4).map((text) => ({
                      type: 'text' as const,
                      content: text,
                      variant: 'meta' as const,
                      color: 'foreground' as const,
                    })),
                  },
                ]
              : []),
            // Divider
            { type: 'divider' },
          ],
        },
        // Quote section
        {
          type: 'text',
          content: quote,
          variant: 'subhead',
          italic: true,
          color: 'foreground',
        },
        // Emphasis section
        {
          type: 'text',
          content: emphasisPhrase,
          variant: 'display',
          color: 'accent',
        },
        // Flexible spacer to push footer down
        { type: 'spacer', size: 'flex' },
        // Footer section
        {
          type: 'footer',
          author,
          authorMeta,
          topic,
          seriesNumber,
          showDots: true,
          dotsConfig: { filled: 3, total: 5 },
        },
      ],
    },
  };
}
