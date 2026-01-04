import type { PosterDefinition, ThemePreset } from '../types';

/**
 * Hot Take Poster Preset
 * Creates a contrarian statement poster for strong opinions
 *
 * Swiss Design Elements:
 * - Prefix label in ACCENT color, UPPERCASE
 * - Main statement in LARGE size (display/hero), LEFT-ALIGNED
 * - Thick horizontal dividers above and below statement
 * - Very generous vertical spacing
 *
 * Reference: references/9af1686*.jpg, references/bf2a7f9*.jpg
 */
export interface HotTakeOptions {
  /** Prefix label (e.g., "UNPOPULAR OPINION:", "HOT TAKE:", "CONTROVERSIAL:") */
  prefix?: string;
  /** The main statement */
  statement: string;
  /** Author name */
  author: string;
  /** Optional hashtag (e.g., "#Tech") */
  hashtag?: string;
  /** Theme preset */
  theme?: ThemePreset;
}

export function createHotTakePoster(options: HotTakeOptions): PosterDefinition {
  const {
    prefix = 'UNPOPULAR OPINION:',
    statement,
    author,
    hashtag,
    theme = 'swiss-red',
  } = options;

  return {
    name: `Hot Take - ${statement.slice(0, 30)}...`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        // Top spacer for visual balance
        { type: 'spacer', size: 8 },

        // Prefix label
        {
          type: 'text',
          content: prefix,
          variant: 'label',
          color: 'accent',
          uppercase: true,
          style: {
            letterSpacing: '0.1em',
          },
        },

        // Spacer before divider
        { type: 'spacer', size: 6 },

        // Thick top divider
        {
          type: 'divider',
          color: 'foreground',
          thickness: 'thick',
        },

        // Spacer after top divider
        { type: 'spacer', size: 8 },

        // Main statement - large, bold, left-aligned
        {
          type: 'text',
          content: statement,
          variant: 'hero',
          color: 'foreground',
          style: {
            lineHeight: '1.05',
            letterSpacing: '-0.04em',
          },
        },

        // Spacer before bottom divider
        { type: 'spacer', size: 8 },

        // Thick bottom divider
        {
          type: 'divider',
          color: 'foreground',
          thickness: 'thick',
        },

        // Flexible spacer to push footer down
        { type: 'spacer', size: 'flex' },

        // Footer section
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            // Author
            {
              type: 'text',
              content: `@${author}`,
              variant: 'label',
              color: 'muted',
              style: {
                fontWeight: '400',
              },
            },
            // Hashtag (if provided)
            ...(hashtag
              ? [
                  {
                    type: 'text' as const,
                    content: hashtag,
                    variant: 'label' as const,
                    color: 'accent' as const,
                  },
                ]
              : []),
          ],
        },
      ],
    },
  };
}
