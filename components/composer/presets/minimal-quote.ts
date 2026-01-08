import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Minimal Quote Preset
 * Simple quote poster with explanation paragraph (Dieter Rams style)
 */
export interface MinimalQuoteOptions {
  quote: string;
  explanation?: string;
  tagline?: string;
  author: string;
  authorPrefix?: string;
  brand?: string;
  showIcon?: boolean;
  theme?: ThemePreset;
}

export function createMinimalQuote(options: MinimalQuoteOptions): PosterDefinition {
  const {
    quote,
    explanation,
    tagline,
    author,
    authorPrefix = '~',
    brand,
    showIcon = true,
    theme = 'rams-warm',
  } = options;

  // Build icon section (simplified Braun radio representation)
  const buildIconSection = (): PrimitiveNode => ({
    type: 'box',
    padding: 4,
    style: {
      width: '100px',
      height: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: '1px solid currentColor',
    },
    children: [
      {
        type: 'box',
        style: {
          width: '60px',
          height: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '2px',
        },
        children: Array.from({ length: 8 }, () => ({
          type: 'box' as const,
          color: 'foreground' as const,
          style: { width: '4px', height: '8px' },
          children: [],
        })),
      },
      {
        type: 'box',
        style: {
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid currentColor',
        },
        children: [
          {
            type: 'box',
            color: 'foreground',
            style: { width: '6px', height: '6px', borderRadius: '50%' },
            children: [],
          },
        ],
      },
    ],
  });

  return {
    name: `Minimal Quote - ${author}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 6,
      style: { flex: 1 },
      children: [
        // Icon section
        ...(showIcon
          ? [buildIconSection()]
          : []),

        { type: 'spacer', size: 4 },

        // Quote
        {
          type: 'text',
          content: quote,
          variant: 'title',
          color: 'foreground',
          style: {
            fontWeight: '700',
            lineHeight: '1.2',
          },
        },

        // Divider
        {
          type: 'box',
          color: 'foreground',
          style: { width: '60px', height: '2px', marginTop: '16px', marginBottom: '16px' },
          children: [],
        },

        // Explanation
        ...(explanation
          ? [{
              type: 'text' as const,
              content: explanation,
              variant: 'body' as const,
              color: 'foreground' as const,
              style: { maxWidth: '70%' },
            }]
          : []),

        // Tagline
        ...(tagline
          ? [{
              type: 'text' as const,
              content: tagline,
              variant: 'body' as const,
              color: 'foreground' as const,
              style: { marginTop: '8px' },
            }]
          : []),

        { type: 'spacer', size: 4 },

        // Author
        {
          type: 'text',
          content: `${authorPrefix} ${author}`,
          variant: 'body',
          color: 'muted',
          italic: true,
        },

        { type: 'spacer', size: 'flex' },

        // Brand footer
        ...(brand
          ? [{
              type: 'text' as const,
              content: brand,
              variant: 'label' as const,
              color: 'foreground' as const,
              uppercase: true,
              style: { letterSpacing: '0.1em' },
            }]
          : []),
      ],
    },
  };
}
