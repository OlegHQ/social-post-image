import type { PosterDefinition, ThemePreset, TextVariant } from '../types';

/**
 * Statement Poster Preset
 * Creates a simple, powerful statement poster with headline and optional details
 *
 * Clean Swiss-style layout with strong typography
 */
export interface StatementPosterOptions {
  /** Main headline text */
  headline: string;
  /** Subheadline or context */
  subheadline?: string;
  /** Series/post number */
  postNumber?: string;
  /** Author name */
  author?: string;
  /** Topic or category */
  topic?: string;
  /** Accent box content (e.g., a stat or key point) */
  accentBox?: {
    label?: string;
    value: string;
  };
  /** Headline variant */
  headlineVariant?: TextVariant;
  /** Headline uppercase */
  headlineUppercase?: boolean;
  /** Theme preset */
  theme?: ThemePreset;
}

export function createStatementPoster(options: StatementPosterOptions): PosterDefinition {
  const {
    headline,
    subheadline,
    postNumber,
    author,
    topic,
    accentBox,
    headlineVariant = 'hero',
    headlineUppercase = true,
    theme = 'swiss-red',
  } = options;

  return {
    name: `Statement - ${headline.slice(0, 30)}...`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 6,
      style: { flex: 1 },
      children: [
        // Header with post number
        ...(postNumber
          ? [
              {
                type: 'stack' as const,
                direction: 'horizontal' as const,
                justify: 'between' as const,
                children: [
                  {
                    type: 'text' as const,
                    content: postNumber,
                    variant: 'label' as const,
                    color: 'muted' as const,
                  },
                ],
              },
            ]
          : []),
        // Spacer to center content
        { type: 'spacer', size: 'flex' },
        // Main content
        {
          type: 'stack',
          direction: 'vertical',
          gap: 8,
          children: [
            // Headline
            {
              type: 'text',
              content: headline,
              variant: headlineVariant,
              color: 'foreground',
              uppercase: headlineUppercase,
              style: { marginLeft: '-0.05em' }, // Optical alignment
            },
            // Subheadline
            ...(subheadline
              ? [
                  {
                    type: 'text' as const,
                    content: subheadline,
                    variant: 'subhead' as const,
                    color: 'muted' as const,
                    maxWidth: '60%',
                  },
                ]
              : []),
          ],
        },
        // Spacer
        { type: 'spacer', size: 'flex' },
        // Accent box (optional)
        ...(accentBox
          ? [
              {
                type: 'box' as const,
                color: 'accent' as const,
                padding: 6 as const,
                border: true,
                borderColor: 'foreground' as const,
                style: {
                  alignSelf: 'flex-end',
                  minWidth: '200px',
                },
                children: [
                  {
                    type: 'stack' as const,
                    direction: 'vertical' as const,
                    gap: 2 as const,
                    align: 'center' as const,
                    children: [
                      ...(accentBox.label
                        ? [
                            {
                              type: 'text' as const,
                              content: accentBox.label,
                              variant: 'label' as const,
                              color: 'background' as const,
                            },
                          ]
                        : []),
                      {
                        type: 'text' as const,
                        content: accentBox.value,
                        variant: 'headline' as const,
                        color: 'background' as const,
                      },
                    ],
                  },
                ],
              },
            ]
          : []),
        // Divider
        { type: 'divider' },
        // Footer
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          children: [
            ...(author
              ? [
                  {
                    type: 'text' as const,
                    content: author,
                    variant: 'label' as const,
                    color: 'foreground' as const,
                  },
                ]
              : []),
            ...(topic
              ? [
                  {
                    type: 'text' as const,
                    content: topic,
                    variant: 'label' as const,
                    color: 'muted' as const,
                  },
                ]
              : []),
          ],
        },
      ],
    },
  };
}
