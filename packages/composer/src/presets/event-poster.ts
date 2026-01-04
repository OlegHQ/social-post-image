import type { PosterDefinition, ThemePreset } from '../types';

/**
 * Event Poster Preset
 * Creates an event information poster with diagonal slash separators
 *
 * Based on Swiss event poster style (Salt Lake Art Center reference)
 */
export interface EventPosterOptions {
  /** Event title */
  title: string;
  /** Event subtitle or type */
  subtitle?: string;
  /** Day of week */
  dayOfWeek?: string;
  /** Date (e.g., "FEB 21ST") */
  date: string;
  /** Venue/location name */
  venue: string;
  /** Address lines */
  address?: string[];
  /** Website */
  website?: string;
  /** Time slots */
  timeSlots?: Array<{ label: string; time: string }>;
  /** Price tiers */
  priceTiers?: Array<{ label: string; price: string }>;
  /** Call to action URL and text */
  cta?: { url: string; text: string };
  /** Theme preset */
  theme?: ThemePreset;
}

export function createEventPoster(options: EventPosterOptions): PosterDefinition {
  const {
    title,
    subtitle,
    dayOfWeek,
    date,
    venue,
    address = [],
    website,
    timeSlots = [],
    priceTiers = [],
    cta,
    theme = 'monochrome',
  } = options;

  return {
    name: `Event - ${title}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 8,
      align: 'end',
      style: { flex: 1 },
      children: [
        // Header - Event info label
        {
          type: 'stack',
          direction: 'vertical',
          align: 'end',
          gap: 1,
          children: [
            {
              type: 'text',
              content: subtitle || 'EVENT',
              variant: 'label',
              color: 'foreground',
              align: 'right',
            },
            {
              type: 'text',
              content: 'INFORMATION:',
              variant: 'label',
              color: 'foreground',
              align: 'right',
            },
          ],
        },
        // Date block
        {
          type: 'stack',
          direction: 'horizontal',
          gap: 2,
          align: 'end',
          children: [
            ...(dayOfWeek
              ? [
                  {
                    type: 'text' as const,
                    content: dayOfWeek.toUpperCase(),
                    variant: 'meta' as const,
                    color: 'muted' as const,
                  },
                  {
                    type: 'text' as const,
                    content: '/',
                    variant: 'headline' as const,
                    color: 'foreground' as const,
                  },
                ]
              : []),
            {
              type: 'text',
              content: date,
              variant: 'headline',
              color: 'foreground',
            },
          ],
        },
        // Venue block
        {
          type: 'stack',
          direction: 'horizontal',
          gap: 4,
          align: 'start',
          children: [
            // Address on left
            ...(address.length > 0 || website
              ? [
                  {
                    type: 'stack' as const,
                    direction: 'vertical' as const,
                    gap: 0 as const,
                    align: 'end' as const,
                    children: [
                      ...address.map((line) => ({
                        type: 'text' as const,
                        content: line,
                        variant: 'meta' as const,
                        color: 'muted' as const,
                        align: 'right' as const,
                      })),
                      ...(website
                        ? [
                            {
                              type: 'text' as const,
                              content: website,
                              variant: 'meta' as const,
                              color: 'muted' as const,
                              align: 'right' as const,
                            },
                          ]
                        : []),
                    ],
                  },
                ]
              : []),
            {
              type: 'text',
              content: '/',
              variant: 'hero',
              color: 'foreground',
              style: { fontSize: '140px' },
            },
            // Venue name
            {
              type: 'stack',
              direction: 'vertical',
              gap: 0,
              children: venue.split(' ').map((word) => ({
                type: 'text' as const,
                content: word,
                variant: 'headline' as const,
                color: 'foreground' as const,
              })),
            },
          ],
        },
        // Time slots
        ...(timeSlots.length > 0
          ? [
              {
                type: 'stack' as const,
                direction: 'vertical' as const,
                gap: 2 as const,
                align: 'end' as const,
                children: timeSlots.map((slot) => ({
                  type: 'stack' as const,
                  direction: 'horizontal' as const,
                  gap: 2 as const,
                  align: 'end' as const,
                  children: [
                    {
                      type: 'text' as const,
                      content: slot.label.toUpperCase(),
                      variant: 'meta' as const,
                      color: 'muted' as const,
                    },
                    {
                      type: 'text' as const,
                      content: '/',
                      variant: 'title' as const,
                      color: 'foreground' as const,
                    },
                    {
                      type: 'text' as const,
                      content: slot.time,
                      variant: 'title' as const,
                      color: 'foreground' as const,
                    },
                  ],
                })),
              },
            ]
          : []),
        // Price tiers
        ...(priceTiers.length > 0
          ? [
              {
                type: 'grid' as const,
                columns: Math.min(priceTiers.length, 4),
                gap: 4 as const,
                children: priceTiers.map((tier) => ({
                  type: 'stack' as const,
                  direction: 'vertical' as const,
                  gap: 1 as const,
                  align: 'end' as const,
                  children: [
                    {
                      type: 'text' as const,
                      content: tier.label.toUpperCase(),
                      variant: 'meta' as const,
                      color: 'muted' as const,
                      align: 'right' as const,
                    },
                    {
                      type: 'text' as const,
                      content: '/',
                      variant: 'subhead' as const,
                      color: 'foreground' as const,
                    },
                    {
                      type: 'text' as const,
                      content: tier.price,
                      variant: 'title' as const,
                      color: 'foreground' as const,
                    },
                  ],
                })),
              },
            ]
          : []),
        // Spacer
        { type: 'spacer', size: 'flex' },
        // CTA
        ...(cta
          ? [
              {
                type: 'stack' as const,
                direction: 'horizontal' as const,
                gap: 2 as const,
                align: 'end' as const,
                children: [
                  {
                    type: 'text' as const,
                    content: cta.url,
                    variant: 'meta' as const,
                    color: 'muted' as const,
                    align: 'right' as const,
                  },
                  {
                    type: 'text' as const,
                    content: '/',
                    variant: 'title' as const,
                    color: 'foreground' as const,
                  },
                  {
                    type: 'text' as const,
                    content: cta.text,
                    variant: 'title' as const,
                    color: 'foreground' as const,
                  },
                ],
              },
            ]
          : []),
      ],
    },
  };
}
