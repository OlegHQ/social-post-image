import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Numbered Principles Preset
 * Editorial numbered list layout (Dieter Rams 10 Principles style)
 */
export interface NumberedPrinciplesOptions {
  // Title
  titleBold: string;
  titleRegular: string;
  subtitle?: string;
  subtitleMeta?: string;

  // Principles array
  principles: Array<{
    number: number;
    keyword: string;
    explanation: string;
    translation?: string;
  }>;

  // Footer
  taglineBold?: string;
  taglineAccent?: string;
  footerMeta?: string;

  theme?: ThemePreset;
}

export function createNumberedPrinciples(options: NumberedPrinciplesOptions): PosterDefinition {
  const {
    titleBold,
    titleRegular,
    subtitle,
    subtitleMeta,
    principles,
    taglineBold,
    taglineAccent,
    footerMeta,
    theme = 'rams-brown',
  } = options;

  // Build a single principle row
  const buildPrincipleRow = (principle: {
    number: number;
    keyword: string;
    explanation: string;
    translation?: string;
  }): PrimitiveNode => ({
    type: 'grid',
    columns: '50px 1.4fr 1fr 1fr',
    gap: 3,
    style: { marginBottom: '4px', alignItems: 'start' },
    children: [
      // Number - thin weight, left aligned
      {
        type: 'text',
        content: String(principle.number),
        variant: 'headline',
        color: 'foreground',
        style: {
          fontSize: '48px',
          fontWeight: '300',
          lineHeight: '1',
        },
      },
      // Keyword - large, bold, orange/accent
      {
        type: 'text',
        content: `${principle.keyword}.`,
        variant: 'headline',
        color: 'accent',
        style: {
          fontSize: '52px',
          fontWeight: '700',
          lineHeight: '1',
          letterSpacing: '-0.01em',
        },
      },
      // Explanation column
      {
        type: 'stack',
        direction: 'vertical',
        gap: 1,
        children: [
          {
            type: 'text',
            content: `${principle.number}.`,
            variant: 'meta',
            color: 'foreground',
            style: {
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '2px',
            },
          },
          {
            type: 'text',
            content: `Good design is ${principle.keyword}.`,
            variant: 'meta',
            color: 'foreground',
            style: {
              fontSize: '9px',
              fontWeight: '700',
              marginBottom: '4px',
            },
          },
          {
            type: 'text',
            content: principle.explanation,
            variant: 'meta',
            color: 'foreground',
            style: {
              fontSize: '9px',
              lineHeight: '1.3',
              opacity: '0.85',
            },
          },
        ],
      },
      // Translation column (optional)
      ...(principle.translation
        ? [{
            type: 'stack' as const,
            direction: 'vertical' as const,
            gap: 1 as const,
            children: [
              {
                type: 'text' as const,
                content: `${principle.number}.`,
                variant: 'meta' as const,
                color: 'foreground' as const,
                style: {
                  fontSize: '9px',
                  fontWeight: '700',
                  marginBottom: '2px',
                },
              },
              {
                type: 'text' as const,
                content: principle.translation,
                variant: 'meta' as const,
                color: 'foreground' as const,
                style: {
                  fontSize: '9px',
                  lineHeight: '1.3',
                  opacity: '0.85',
                },
              },
            ],
          }]
        : [{
            type: 'spacer' as const,
            size: 1 as const,
          }]),
    ],
  });

  return {
    name: `Numbered Principles - ${titleBold}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        // Title row - "Good design is"
        {
          type: 'stack',
          direction: 'horizontal',
          gap: 2,
          style: { marginBottom: '8px' },
          children: [
            {
              type: 'text',
              content: titleBold,
              variant: 'headline',
              color: 'foreground',
              style: {
                fontSize: '58px',
                fontWeight: '700',
                letterSpacing: '-0.02em',
              },
            },
            {
              type: 'text',
              content: titleRegular,
              variant: 'headline',
              color: 'foreground',
              style: {
                fontSize: '58px',
                fontWeight: '300',
                letterSpacing: '-0.02em',
              },
            },
          ],
        },

        // Subtitle row - "Ten Principles..." and "From Dieter Rams"
        ...(subtitle || subtitleMeta
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'between' as const,
              style: { marginBottom: '24px' },
              children: [
                {
                  type: 'text' as const,
                  content: subtitle || '',
                  variant: 'body' as const,
                  color: 'foreground' as const,
                  style: { fontSize: '14px' },
                },
                {
                  type: 'stack' as const,
                  direction: 'vertical' as const,
                  gap: 0 as const,
                  style: { textAlign: 'right' },
                  children: [
                    {
                      type: 'text' as const,
                      content: 'From',
                      variant: 'meta' as const,
                      color: 'foreground' as const,
                      style: { fontSize: '12px' },
                    },
                    {
                      type: 'text' as const,
                      content: subtitleMeta || '',
                      variant: 'body' as const,
                      color: 'foreground' as const,
                      style: { fontSize: '14px', fontWeight: '700' },
                    },
                  ],
                },
              ],
            }]
          : []),

        // Principles list
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          children: principles.map(buildPrincipleRow),
        },

        { type: 'spacer', size: 'flex' },

        // Footer tagline - "Less and More"
        ...(taglineBold || taglineAccent
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              gap: 3 as const,
              style: { marginBottom: '8px' },
              children: [
                ...(taglineBold
                  ? [{
                      type: 'text' as const,
                      content: taglineBold,
                      variant: 'headline' as const,
                      color: 'foreground' as const,
                      style: {
                        fontSize: '58px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                      },
                    }]
                  : []),
                ...(taglineAccent
                  ? [{
                      type: 'text' as const,
                      content: taglineAccent,
                      variant: 'headline' as const,
                      color: 'accent' as const,
                      style: {
                        fontSize: '58px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                      },
                    }]
                  : []),
              ],
            }]
          : []),

        // Footer meta - designer credit
        ...(footerMeta
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'end' as const,
              children: [{
                type: 'text' as const,
                content: footerMeta,
                variant: 'meta' as const,
                color: 'foreground' as const,
                style: {
                  fontSize: '9px',
                  opacity: '0.7',
                },
              }],
            }]
          : []),
      ],
    },
  };
}
