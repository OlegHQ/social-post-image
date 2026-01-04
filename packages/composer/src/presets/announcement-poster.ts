import type { PosterDefinition, ThemePreset } from '../types';

/**
 * Announcement Poster Preset
 * Creates an article/launch announcement poster
 *
 * Swiss Design Elements:
 * - Label in ACCENT color box (solid background, white text)
 * - Title in HERO size, UPPERCASE, LEFT-ALIGNED
 * - Double-line dividers for visual weight
 * - Teaser text with arrow prefix (→)
 * - URL in code/mono style at bottom
 *
 * Reference: references/84c25c2*.jpg
 */
export interface AnnouncementOptions {
  /** Label text (e.g., "NEW POST", "JUST SHIPPED", "ANNOUNCEMENT") */
  label: string;
  /** Main title */
  title: string;
  /** Teaser/key insight preview */
  teaser?: string;
  /** URL to the content */
  url?: string;
  /** Author name */
  author: string;
  /** Theme preset */
  theme?: ThemePreset;
}

export function createAnnouncementPoster(options: AnnouncementOptions): PosterDefinition {
  const {
    label,
    title,
    teaser,
    url,
    author,
    theme = 'swiss-red',
  } = options;

  return {
    name: `Announcement - ${title.slice(0, 30)}...`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        // Label badge with accent background
        {
          type: 'box',
          color: 'accent',
          padding: 2,
          style: {
            display: 'inline-block',
            alignSelf: 'flex-start',
          },
          children: [
            {
              type: 'text',
              content: label,
              variant: 'label',
              uppercase: true,
              style: {
                color: '#FFFFFF',
                fontWeight: '700',
                letterSpacing: '0.1em',
              },
            },
          ],
        },

        // Spacer
        { type: 'spacer', size: 6 },

        // Double divider (thick line)
        {
          type: 'divider',
          color: 'foreground',
          thickness: 'thick',
        },

        // Spacer after divider
        { type: 'spacer', size: 8 },

        // Main title - UPPERCASE, large, left-aligned
        {
          type: 'text',
          content: title,
          variant: 'hero',
          color: 'foreground',
          uppercase: true,
          style: {
            lineHeight: '0.95',
            letterSpacing: '-0.04em',
          },
        },

        // Spacer before bottom divider
        { type: 'spacer', size: 8 },

        // Double divider (thick line)
        {
          type: 'divider',
          color: 'foreground',
          thickness: 'thick',
        },

        // Spacer after divider
        { type: 'spacer', size: 6 },

        // Teaser with arrow prefix (if provided)
        ...(teaser
          ? [
              {
                type: 'text' as const,
                content: `→ ${teaser}`,
                variant: 'subhead' as const,
                color: 'foreground' as const,
                style: {
                  lineHeight: '1.3',
                  maxWidth: '90%',
                },
              },
            ]
          : []),

        // Flexible spacer
        { type: 'spacer', size: 'flex' },

        // Divider before footer
        { type: 'divider', color: 'muted' },

        // Spacer after divider
        { type: 'spacer', size: 4 },

        // Footer section
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            // URL (if provided)
            ...(url
              ? [
                  {
                    type: 'text' as const,
                    content: url,
                    variant: 'label' as const,
                    color: 'accent' as const,
                    style: {
                      fontFamily: 'monospace',
                      letterSpacing: '0.02em',
                    },
                  },
                ]
              : []),
            // Author
            {
              type: 'text',
              content: `@${author}`,
              variant: 'label',
              color: 'muted',
              style: { fontWeight: '400' },
            },
          ],
        },
      ],
    },
  };
}
