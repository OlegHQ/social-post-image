import type { PosterDefinition, ThemePreset } from '../types';

/**
 * Typography Showcase Preset
 * Creates a poster featuring a large letterform with font information
 *
 * Based on Swiss typography poster style (Neue Haas Grotesk showcases)
 * Reference: references/6907afda5f7abfe2b2273ba5de3ab856.jpg
 */
export interface TypographyShowcaseOptions {
  /** The featured letter (single character) */
  letter: string;
  /** Font/typeface name (e.g., "Neue Haas") */
  fontName: string;
  /** Font variant (e.g., "Grotesk") */
  fontVariant?: string;
  /** Short tagline */
  tagline?: string;
  /** Main title words (displayed stacked, typically 3 words) */
  titleWords?: string[];
  /** Body text / description */
  bodyText?: string;
  /** Show character set */
  showCharset?: boolean;
  /** Theme preset */
  theme?: ThemePreset;
}

export function createTypographyShowcase(options: TypographyShowcaseOptions): PosterDefinition {
  const {
    letter,
    fontName,
    fontVariant = 'Grotesk',
    tagline = 'swiss style',
    titleWords = ['swiss', 'typography', 'swiss'],
    bodyText = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    showCharset = true,
    theme = 'neue-teal',
  } = options;

  return {
    name: `Typography Showcase - ${fontName}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'box',
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // ═══════════════════════════════════════════════════════════════
        // LAYER 0: Giant Letter (Background)
        // Positioned absolutely to fill most of the canvas
        // ═══════════════════════════════════════════════════════════════
        {
          type: 'box',
          style: {
            position: 'absolute',
            left: '-5%',
            bottom: '-12%',
            width: '110%',
            height: '75%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: '0',
            pointerEvents: 'none',
          },
          children: [
            {
              type: 'text',
              content: letter,
              variant: 'hero',
              color: 'foreground',
              style: {
                fontSize: '900px',
                lineHeight: '0.75',
                fontWeight: '900',
                letterSpacing: '-0.02em',
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════
        // LAYER 1: Content Overlay
        // All content positioned above the letter
        // ═══════════════════════════════════════════════════════════════
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          style: {
            flex: '1',
            position: 'relative',
            zIndex: '1',
          },
          children: [
            // ─────────────────────────────────────────────────────────────
            // Top tagline row
            // ─────────────────────────────────────────────────────────────
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'between',
              children: [
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
              ],
            },

            // ─────────────────────────────────────────────────────────────
            // Title words stacked with tight leading (overlapping effect)
            // ─────────────────────────────────────────────────────────────
            {
              type: 'stack',
              direction: 'vertical',
              gap: 0,
              style: { marginTop: '8px' },
              children: titleWords.map((word, i) => ({
                type: 'text' as const,
                content: word,
                variant: 'hero' as const,
                color: (i === 0 ? 'accent' : 'foreground') as const,
                uppercase: false,
                style: {
                  lineHeight: '0.82',
                  letterSpacing: '-0.03em',
                },
              })),
            },

            // ─────────────────────────────────────────────────────────────
            // Spacer to push content down
            // ─────────────────────────────────────────────────────────────
            { type: 'spacer', size: 6 },

            // ─────────────────────────────────────────────────────────────
            // Main content grid (font info, character sets)
            // ─────────────────────────────────────────────────────────────
            {
              type: 'grid',
              columns: '200px 1fr 200px',
              gap: 4,
              style: { flex: '1' },
              children: [
                // LEFT COLUMN: Font info + body text
                {
                  type: 'stack',
                  direction: 'vertical',
                  gap: 4,
                  column: '1',
                  style: { paddingTop: '20px' },
                  children: [
                    { type: 'text', content: tagline, variant: 'meta', color: 'accent' },
                    {
                      type: 'stack',
                      direction: 'vertical',
                      gap: 1,
                      children: [
                        {
                          type: 'text',
                          content: fontName,
                          variant: 'title',
                          color: 'foreground',
                          style: { fontWeight: '900' },
                        },
                      ],
                    },
                    {
                      type: 'text',
                      content: bodyText,
                      variant: 'meta',
                      color: 'muted',
                      style: { maxWidth: '180px', lineHeight: '1.4' },
                    },
                  ],
                },

                // CENTER COLUMN: Empty (letter shows through)
                {
                  type: 'box',
                  column: '2',
                  children: [],
                },

                // RIGHT COLUMN: Character sets + font variant
                ...(showCharset
                  ? [
                      {
                        type: 'stack' as const,
                        direction: 'vertical' as const,
                        gap: 3 as const,
                        column: '3',
                        align: 'end' as const,
                        style: { paddingTop: '20px' },
                        children: [
                          // Font name header
                          {
                            type: 'text' as const,
                            content: fontName,
                            variant: 'label' as const,
                            color: 'foreground' as const,
                            align: 'right' as const,
                          },
                          // Character sets
                          {
                            type: 'text' as const,
                            content: 'ABCDEFGHIJKLMNOP\nQRSTUVWXYZ',
                            variant: 'meta' as const,
                            color: 'foreground' as const,
                            align: 'right' as const,
                            style: { whiteSpace: 'pre-line', lineHeight: '1.3' },
                          },
                          {
                            type: 'text' as const,
                            content: 'abcdefghijklmnopqr\nstuvwxyz',
                            variant: 'meta' as const,
                            color: 'foreground' as const,
                            align: 'right' as const,
                            style: { whiteSpace: 'pre-line', lineHeight: '1.3' },
                          },
                          {
                            type: 'text' as const,
                            content: '1234567890$?\n&%@!*()=',
                            variant: 'meta' as const,
                            color: 'foreground' as const,
                            align: 'right' as const,
                            style: { whiteSpace: 'pre-line', lineHeight: '1.3' },
                          },
                          // Font variant (displayed vertically in spirit)
                          {
                            type: 'text' as const,
                            content: fontVariant,
                            variant: 'title' as const,
                            color: 'accent' as const,
                            align: 'right' as const,
                            style: { marginTop: '16px' },
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            },

            // ─────────────────────────────────────────────────────────────
            // Bottom taglines
            // ─────────────────────────────────────────────────────────────
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'between',
              align: 'end',
              style: { marginTop: 'auto', paddingTop: '20px' },
              children: [
                {
                  type: 'stack',
                  direction: 'horizontal',
                  gap: 2,
                  children: [
                    { type: 'text', content: 'typografie', variant: 'meta', color: 'accent' },
                    { type: 'text', content: 'schweizer', variant: 'meta', color: 'muted' },
                  ],
                },
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
              ],
            },
          ],
        },
      ],
    },
  };
}
