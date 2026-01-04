import type { PosterDefinition, ThemePreset } from '@/lib/types';

/**
 * Vignelli Quote Preset
 * Creates a Massimo Vignelli-inspired quote poster
 */
export interface VignelliQuoteOptions {
  quote: string;
  emphasisPhrase: string;
  author: string;
  authorMeta?: string;
  seriesTitle?: string;
  seriesNumber?: number;
  metaColumns?: string[];
  theme?: ThemePreset;
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
        {
          type: 'stack',
          direction: 'vertical',
          gap: 4,
          children: [
            {
              type: 'stack',
              direction: 'horizontal',
              gap: 2,
              align: 'center',
              children: [
                { type: 'text', content: seriesTitle, variant: 'meta', color: 'foreground' },
                { type: 'text', content: author, variant: 'meta', color: 'accent', italic: true },
              ],
            },
            ...(metaColumns && metaColumns.length > 0
              ? [{
                  type: 'grid' as const,
                  columns: Math.min(metaColumns.length, 4),
                  gap: 5 as const,
                  children: metaColumns.slice(0, 4).map((text) => ({
                    type: 'text' as const,
                    content: text,
                    variant: 'meta' as const,
                    color: 'foreground' as const,
                  })),
                }]
              : []),
            { type: 'divider' },
          ],
        },
        { type: 'text', content: quote, variant: 'subhead', italic: true, color: 'foreground' },
        { type: 'text', content: emphasisPhrase, variant: 'display', color: 'accent' },
        { type: 'spacer', size: 'flex' },
        { type: 'footer', author, authorMeta, topic, seriesNumber, showDots: true, dotsConfig: { filled: 3, total: 5 } },
      ],
    },
  };
}
