import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Paragraph Quote Preset
 * Multi-paragraph quote poster (Müller-Brockmann style)
 */
export interface ParagraphQuoteOptions {
  paragraphs: string[];
  paragraphGap?: 'small' | 'medium' | 'large';
  author: string;
  authorPrefix?: string;
  cornerText?: string;
  showGridLines?: boolean;
  theme?: ThemePreset;
}

export function createParagraphQuote(options: ParagraphQuoteOptions): PosterDefinition {
  const {
    paragraphs,
    paragraphGap = 'medium',
    author,
    authorPrefix = '—',
    cornerText,
    showGridLines = false,
    theme = 'swiss-red-inverted',
  } = options;

  // Map gap sizes to spacing tokens
  const gapMap = {
    small: 4,
    medium: 6,
    large: 8,
  } as const;

  const gap = gapMap[paragraphGap];

  // Build grid lines overlay
  const buildGridLines = (): PrimitiveNode => ({
    type: 'box',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '4px',
      opacity: 0.15,
      pointerEvents: 'none',
    },
    children: Array.from({ length: 12 }, () => ({
      type: 'box' as const,
      style: {
        borderLeft: '1px solid currentColor',
        height: '100%',
      },
      children: [],
    })),
  });

  // Build paragraph nodes
  const paragraphNodes: PrimitiveNode[] = paragraphs.map((text, index) => ({
    type: 'text' as const,
    content: text,
    variant: 'title' as const,
    color: 'foreground' as const,
    style: {
      fontSize: '52px',
      fontWeight: '700',
      lineHeight: '1.15',
      letterSpacing: '-0.01em',
      ...(index > 0 ? { marginTop: `${gap * 8}px` } : {}),
    },
  }));

  return {
    name: `Paragraph Quote - ${author}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1, position: 'relative' },
      children: [
        // Optional grid lines
        ...(showGridLines ? [buildGridLines()] : []),

        // Main content wrapper
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          style: { flex: 1, zIndex: 1 },
          children: [
            { type: 'spacer', size: 4 },

            // Paragraphs
            ...paragraphNodes,

            { type: 'spacer', size: 'flex' },

            // Author attribution
            {
              type: 'text',
              content: `${authorPrefix}${author}`,
              variant: 'title',
              color: 'foreground',
              style: {
                fontSize: '42px',
                fontWeight: '700',
                marginTop: '40px',
              },
            },

            // Corner text (optional)
            ...(cornerText
              ? [{
                  type: 'stack' as const,
                  direction: 'horizontal' as const,
                  justify: 'end' as const,
                  children: [{
                    type: 'text' as const,
                    content: cornerText,
                    variant: 'meta' as const,
                    color: 'foreground' as const,
                    style: { opacity: 0.7 },
                  }],
                }]
              : []),
          ],
        },
      ],
    },
  };
}
