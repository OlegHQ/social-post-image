import type { PosterDefinition, ThemePreset } from '@/lib/types';

/**
 * Announcement Poster Preset
 * Creates an article/launch announcement poster
 */
export interface AnnouncementOptions {
  label: string;
  title: string;
  teaser?: string;
  teaserPrefix?: string;
  url?: string;
  author: string;
  authorPrefix?: string;
  theme?: ThemePreset;
}

export function createAnnouncementPoster(options: AnnouncementOptions): PosterDefinition {
  const { label, title, teaser, teaserPrefix = '→', url, author, authorPrefix = '@', theme = 'swiss-red' } = options;

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
        {
          type: 'box',
          color: 'accent',
          padding: 2,
          style: { display: 'inline-block', alignSelf: 'flex-start' },
          children: [{ type: 'text', content: label, variant: 'label', uppercase: true, style: { color: '#FFFFFF', fontWeight: '700', letterSpacing: '0.1em' } }],
        },
        { type: 'spacer', size: 6 },
        { type: 'divider', color: 'foreground', thickness: 'thick' },
        { type: 'spacer', size: 8 },
        { type: 'text', content: title, variant: 'hero', color: 'foreground', uppercase: true, style: { lineHeight: '0.95', letterSpacing: '-0.04em' } },
        { type: 'spacer', size: 8 },
        { type: 'divider', color: 'foreground', thickness: 'thick' },
        { type: 'spacer', size: 6 },
        ...(teaser ? [{ type: 'text' as const, content: `${teaserPrefix} ${teaser}`, variant: 'subhead' as const, color: 'foreground' as const, style: { lineHeight: '1.3', maxWidth: '90%' } }] : []),
        { type: 'spacer', size: 'flex' },
        { type: 'divider', color: 'muted' },
        { type: 'spacer', size: 4 },
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            ...(url ? [{ type: 'text' as const, content: url, variant: 'label' as const, color: 'accent' as const, style: { fontFamily: 'monospace', letterSpacing: '0.02em' } }] : []),
            { type: 'text', content: `${authorPrefix}${author}`, variant: 'label', color: 'muted', style: { fontWeight: '400' } },
          ],
        },
      ],
    },
  };
}
