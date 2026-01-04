import type { PosterDefinition, ThemePreset, PrimitiveNode } from '../types';

/**
 * Season/Program Poster Preset
 * Creates a red background poster with multiple event listings
 *
 * Based on: Opernhaus Zurich season opening posters
 */
export interface SeasonPosterOptions {
  /** Venue/organization name */
  venueName: string;
  /** Season title (e.g., "Season Opening 2024/25") */
  seasonTitle: string;
  /** Array of events to display */
  events: EventBlock[];
  /** Optional footer text */
  footerText?: string;
  /** Theme preset (default: 'swiss-red-inverted') */
  theme?: ThemePreset;
}

export interface EventBlock {
  /** Event title - displayed prominently */
  title: string;
  /** Date string (e.g., "Saturday, September 3rd") */
  date: string;
  /** Time string (e.g., "7:00 PM") */
  time: string;
  /** Status label (e.g., "World Premiere", "New Production") */
  status?: string;
  /** Description/subtitle */
  description?: string;
  /** Credits list */
  credits?: CreditEntry[];
}

export interface CreditEntry {
  /** Role name (e.g., "Musical Direction", "Choreography") */
  role: string;
  /** Person name */
  name: string;
}

function createEventBlockNode(event: EventBlock): PrimitiveNode {
  const {
    title,
    date,
    time,
    status,
    description,
    credits = [],
  } = event;

  return {
    type: 'stack',
    direction: 'vertical',
    gap: 4,
    children: [
      // Event title - large and prominent
      {
        type: 'text',
        content: title,
        variant: 'headline',
        color: 'foreground',
        style: { fontWeight: '700' },
      },
      // Two-column grid: date/time on left, description/credits on right
      {
        type: 'grid',
        columns: '1fr 2fr',
        gap: 6,
        children: [
          // Left column: date, time, status
          {
            type: 'stack',
            direction: 'vertical',
            gap: 1,
            children: [
              {
                type: 'text',
                content: date,
                variant: 'body',
                color: 'foreground',
              },
              {
                type: 'text',
                content: time,
                variant: 'body',
                color: 'foreground',
              },
              ...(status
                ? [
                    {
                      type: 'text' as const,
                      content: status,
                      variant: 'body' as const,
                      color: 'foreground' as const,
                      italic: true,
                    },
                  ]
                : []),
            ],
          },
          // Right column: description + credits
          {
            type: 'stack',
            direction: 'vertical',
            gap: 2,
            children: [
              ...(description
                ? [
                    {
                      type: 'text' as const,
                      content: description,
                      variant: 'body' as const,
                      color: 'foreground' as const,
                      style: { fontWeight: '700' },
                    },
                  ]
                : []),
              // Credits as stacked role: name entries
              ...credits.map((credit) => ({
                type: 'text' as const,
                content: `${credit.role}: ${credit.name}`,
                variant: 'meta' as const,
                color: 'foreground' as const,
              })),
            ],
          },
        ],
      },
    ],
  };
}

export function createSeasonPoster(options: SeasonPosterOptions): PosterDefinition {
  const {
    venueName,
    seasonTitle,
    events,
    footerText,
    theme = 'swiss-red-inverted',
  } = options;

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
        // Header section
        {
          type: 'stack',
          direction: 'vertical',
          gap: 2,
          children: [
            // Venue name
            {
              type: 'text',
              content: venueName,
              variant: 'headline',
              color: 'foreground',
              style: {
                letterSpacing: '-0.02em',
              },
            },
            // Season title
            {
              type: 'text',
              content: seasonTitle,
              variant: 'title',
              color: 'foreground',
            },
          ],
        },
        // Event blocks
        ...events.map((event) => createEventBlockNode(event)),
        // Flexible spacer (push footer down if space remains)
        { type: 'spacer', size: 'flex' },
        // Optional footer
        ...(footerText
          ? [
              {
                type: 'text' as const,
                content: footerText,
                variant: 'meta' as const,
                color: 'muted' as const,
              },
            ]
          : []),
      ],
    },
  };
}
