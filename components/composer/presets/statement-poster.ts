import type { PosterDefinition, ThemePreset, TextVariant } from '@/lib/types';

/**
 * Statement Poster Preset
 * Creates a simple, powerful statement poster with headline and optional details
 */
export interface StatementPosterOptions {
  headline: string;
  subheadline?: string;
  postNumber?: string;
  author?: string;
  topic?: string;
  accentBox?: { label?: string; value: string };
  showAccentBox?: boolean;
  headlineVariant?: TextVariant;
  headlineUppercase?: boolean;
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
    showAccentBox = true,
    headlineVariant = 'hero',
    headlineUppercase = true,
    theme = 'swiss-red',
  } = options;

  // Only show accent box if showAccentBox is true AND accentBox data is provided
  const shouldShowAccentBox = showAccentBox && accentBox;

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
        ...(postNumber
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'between' as const,
              children: [{ type: 'text' as const, content: postNumber, variant: 'label' as const, color: 'muted' as const }],
            }]
          : []),
        { type: 'spacer', size: 'flex' },
        {
          type: 'stack',
          direction: 'vertical',
          gap: 8,
          children: [
            { type: 'text', content: headline, variant: headlineVariant, color: 'foreground', uppercase: headlineUppercase, style: { marginLeft: '-0.05em' } },
            ...(subheadline
              ? [{ type: 'text' as const, content: subheadline, variant: 'subhead' as const, color: 'muted' as const, maxWidth: '60%' }]
              : []),
          ],
        },
        { type: 'spacer', size: 'flex' },
        ...(shouldShowAccentBox && accentBox
          ? [{
              type: 'box' as const,
              color: 'accent' as const,
              padding: 6 as const,
              style: { alignSelf: 'flex-end', minWidth: '200px' },
              children: [{
                type: 'stack' as const,
                direction: 'vertical' as const,
                gap: 2 as const,
                align: 'end' as const,
                children: [
                  ...(accentBox.label ? [{ type: 'text' as const, content: accentBox.label, variant: 'label' as const, color: 'background' as const }] : []),
                  { type: 'text' as const, content: accentBox.value, variant: 'headline' as const, color: 'background' as const },
                ],
              }],
            }]
          : []),
        { type: 'divider' },
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          children: [
            ...(author ? [{ type: 'text' as const, content: author, variant: 'label' as const, color: 'foreground' as const }] : []),
            ...(topic ? [{ type: 'text' as const, content: topic, variant: 'label' as const, color: 'muted' as const }] : []),
          ],
        },
      ],
    },
  };
}
