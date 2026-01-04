import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Season/Program Poster Preset
 * Creates a red background poster with multiple event listings
 */
export interface SeasonPosterOptions {
  venueName: string;
  seasonTitle: string;
  events: EventBlock[];
  footerText?: string;
  theme?: ThemePreset;
}

export interface EventBlock {
  title: string;
  date: string;
  time: string;
  status?: string;
  description?: string;
  credits?: CreditEntry[];
}

export interface CreditEntry {
  role: string;
  name: string;
}

function createEventBlockNode(event: EventBlock): PrimitiveNode {
  const { title, date, time, status, description, credits = [] } = event;

  return {
    type: 'stack',
    direction: 'vertical',
    gap: 4,
    children: [
      { type: 'text', content: title, variant: 'headline', color: 'foreground', style: { fontWeight: '700' } },
      {
        type: 'grid',
        columns: '1fr 2fr',
        gap: 6,
        children: [
          {
            type: 'stack',
            direction: 'vertical',
            gap: 1,
            children: [
              { type: 'text', content: date, variant: 'body', color: 'foreground' },
              { type: 'text', content: time, variant: 'body', color: 'foreground' },
              ...(status ? [{ type: 'text' as const, content: status, variant: 'body' as const, color: 'foreground' as const, italic: true }] : []),
            ],
          },
          {
            type: 'stack',
            direction: 'vertical',
            gap: 2,
            children: [
              ...(description ? [{ type: 'text' as const, content: description, variant: 'body' as const, color: 'foreground' as const, style: { fontWeight: '700' } }] : []),
              ...credits.map((credit) => ({ type: 'text' as const, content: `${credit.role}: ${credit.name}`, variant: 'meta' as const, color: 'foreground' as const })),
            ],
          },
        ],
      },
    ],
  };
}

export function createSeasonPoster(options: SeasonPosterOptions): PosterDefinition {
  const { venueName, seasonTitle, events, footerText, theme = 'swiss-red-inverted' } = options;

  return {
    name: `Season - ${venueName} - ${seasonTitle}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 8,
      style: { flex: '1' },
      children: [
        {
          type: 'stack',
          direction: 'vertical',
          gap: 2,
          children: [
            { type: 'text', content: venueName, variant: 'headline', color: 'foreground', style: { letterSpacing: '-0.02em' } },
            { type: 'text', content: seasonTitle, variant: 'title', color: 'foreground' },
          ],
        },
        ...events.map((event) => createEventBlockNode(event)),
        { type: 'spacer', size: 'flex' },
        ...(footerText ? [{ type: 'text' as const, content: footerText, variant: 'meta' as const, color: 'muted' as const }] : []),
      ],
    },
  };
}
