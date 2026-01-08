import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Manifesto Quotes Preset
 * Statement words with supporting quotes in asymmetric two-column layout
 */
export interface ManifestoQuotesOptions {
  // Left statement
  statementLines: string[];
  statementPunctuation?: string;
  statementVariant?: 'hero' | 'display' | 'headline';

  // Right quotes
  supportingQuotes: Array<{
    quote: string;
    author: string;
  }>;

  // Branding
  brandIcon?: string;

  theme?: ThemePreset;
}

export function createManifestoQuotes(options: ManifestoQuotesOptions): PosterDefinition {
  const {
    statementLines,
    statementPunctuation = '.',
    statementVariant = 'hero',
    supportingQuotes = [],
    brandIcon,
    theme = 'monochrome',
  } = options;

  // Build statement lines
  const buildStatementLines = (): PrimitiveNode[] => {
    const lines = [...statementLines];
    // Add punctuation to the last line
    if (lines.length > 0 && statementPunctuation) {
      lines[lines.length - 1] = lines[lines.length - 1] + statementPunctuation;
    }

    return lines.map((line) => ({
      type: 'text' as const,
      content: line,
      variant: statementVariant,
      color: 'foreground' as const,
      style: {
        fontSize: '130px',
        fontWeight: '900',
        lineHeight: '0.92',
        letterSpacing: '-0.03em',
      },
    }));
  };

  // Build quote block
  const buildQuoteBlock = (item: { quote: string; author: string }): PrimitiveNode => ({
    type: 'stack',
    direction: 'vertical',
    gap: 1,
    style: { marginBottom: '24px' },
    children: [
      {
        type: 'text',
        content: `"${item.quote}"`,
        variant: 'body',
        color: 'foreground',
        style: { lineHeight: '1.4' },
      },
      {
        type: 'text',
        content: `- ${item.author}`,
        variant: 'meta',
        color: 'muted',
        style: { marginTop: '4px' },
      },
    ],
  });

  return {
    name: `Manifesto - ${statementLines[0] || 'Statement'}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'grid',
      columns: '1.8fr 1fr',
      gap: 6,
      style: { flex: 1, alignItems: 'start' },
      children: [
        // Left column - Statement
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          style: { paddingTop: '20px' },
          children: [
            ...buildStatementLines(),

            { type: 'spacer', size: 'flex' },

            // Brand icon at bottom left
            ...(brandIcon
              ? [{
                  type: 'text' as const,
                  content: brandIcon,
                  variant: 'title' as const,
                  color: 'foreground' as const,
                  style: { marginTop: 'auto' },
                }]
              : []),
          ],
        },

        // Right column - Quotes
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          style: {
            paddingTop: '40px',
            justifyContent: 'flex-end',
            height: '100%',
          },
          children: [
            { type: 'spacer', size: 'flex' },
            ...supportingQuotes.map(buildQuoteBlock),
          ],
        },
      ],
    },
  };
}
