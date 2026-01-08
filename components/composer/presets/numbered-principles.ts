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
  taglineRegular?: string;
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
    taglineRegular,
    footerMeta,
    theme = 'rams-brown',
  } = options;

  // Build principle row
  const buildPrincipleRow = (principle: {
    number: number;
    keyword: string;
    explanation: string;
    translation?: string;
  }): PrimitiveNode => ({
    type: 'grid',
    columns: '40px 150px 1fr 1fr',
    gap: 3,
    style: { marginBottom: '12px', alignItems: 'start' },
    children: [
      // Number
      {
        type: 'text',
        content: String(principle.number),
        variant: 'title',
        color: 'foreground',
        style: {
          fontWeight: '400',
          lineHeight: '1',
        },
      },
      // Keyword
      {
        type: 'text',
        content: `${principle.keyword}.`,
        variant: 'headline',
        color: 'accent',
        style: {
          fontWeight: '700',
          lineHeight: '1',
          fontSize: '38px',
          letterSpacing: '-0.01em',
        },
      },
      // Explanation
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
            style: { fontWeight: '700' },
          },
          {
            type: 'text',
            content: `Good design is ${principle.keyword.toLowerCase()}.`,
            variant: 'meta',
            color: 'foreground',
            style: { fontWeight: '700' },
          },
          {
            type: 'text',
            content: principle.explanation,
            variant: 'meta',
            color: 'foreground',
            style: { lineHeight: '1.4', opacity: 0.85 },
          },
        ],
      },
      // Translation (optional)
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
                style: { fontWeight: '700' },
              },
              {
                type: 'text' as const,
                content: principle.translation,
                variant: 'meta' as const,
                color: 'foreground' as const,
                style: { lineHeight: '1.4', opacity: 0.85 },
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
      gap: 4,
      style: { flex: 1 },
      children: [
        // Title row
        {
          type: 'stack',
          direction: 'horizontal',
          gap: 2,
          children: [
            {
              type: 'text',
              content: titleBold,
              variant: 'headline',
              color: 'foreground',
              style: {
                fontSize: '72px',
                fontWeight: '900',
                letterSpacing: '-0.02em',
              },
            },
            {
              type: 'text',
              content: titleRegular,
              variant: 'headline',
              color: 'foreground',
              style: {
                fontSize: '72px',
                fontWeight: '300',
                letterSpacing: '-0.02em',
              },
            },
          ],
        },

        // Subtitle row
        ...(subtitle || subtitleMeta
          ? [{
              type: 'grid' as const,
              columns: '1fr 1fr',
              gap: 4 as const,
              children: [
                {
                  type: 'text' as const,
                  content: subtitle || '',
                  variant: 'body' as const,
                  color: 'foreground' as const,
                },
                {
                  type: 'text' as const,
                  content: subtitleMeta || '',
                  variant: 'body' as const,
                  color: 'foreground' as const,
                  style: { textAlign: 'right' as const },
                },
              ],
            }]
          : []),

        { type: 'spacer', size: 2 },

        // Principles list
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          children: principles.map(buildPrincipleRow),
        },

        { type: 'spacer', size: 'flex' },

        // Footer tagline
        ...(taglineBold || taglineRegular
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              gap: 2 as const,
              children: [
                ...(taglineBold
                  ? [{
                      type: 'text' as const,
                      content: taglineBold,
                      variant: 'headline' as const,
                      color: 'foreground' as const,
                      style: { fontWeight: '900' },
                    }]
                  : []),
                ...(taglineRegular
                  ? [{
                      type: 'text' as const,
                      content: taglineRegular,
                      variant: 'headline' as const,
                      color: 'accent' as const,
                      style: { fontWeight: '300' },
                    }]
                  : []),
              ],
            }]
          : []),

        // Footer meta
        ...(footerMeta
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'end' as const,
              children: [{
                type: 'text' as const,
                content: footerMeta,
                variant: 'meta' as const,
                color: 'muted' as const,
              }],
            }]
          : []),
      ],
    },
  };
}
