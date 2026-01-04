import type { PosterDefinition, ThemePreset } from '@/lib/types';

/**
 * Hot Take Poster Preset
 * Creates a contrarian statement poster for strong opinions
 */
export interface HotTakeOptions {
  prefix?: string;
  statement: string;
  author: string;
  hashtag?: string;
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
        { type: 'spacer', size: 8 },
        { type: 'text', content: prefix, variant: 'label', color: 'accent', uppercase: true, style: { letterSpacing: '0.1em' } },
        { type: 'spacer', size: 6 },
        { type: 'divider', color: 'foreground', thickness: 'thick' },
        { type: 'spacer', size: 8 },
        { type: 'text', content: statement, variant: 'hero', color: 'foreground', style: { lineHeight: '1.05', letterSpacing: '-0.04em' } },
        { type: 'spacer', size: 8 },
        { type: 'divider', color: 'foreground', thickness: 'thick' },
        { type: 'spacer', size: 'flex' },
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            { type: 'text', content: `@${author}`, variant: 'label', color: 'muted', style: { fontWeight: '400' } },
            ...(hashtag ? [{ type: 'text' as const, content: hashtag, variant: 'label' as const, color: 'accent' as const }] : []),
          ],
        },
      ],
    },
  };
}
