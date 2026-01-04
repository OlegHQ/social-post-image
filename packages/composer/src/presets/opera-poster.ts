import type { PosterDefinition, ThemePreset, PrimitiveNode } from '../types';

/**
 * Opera/Venue Poster Preset
 * Creates a classic Swiss-style venue poster with geometric accent squares
 *
 * Based on: Opernhaus Zurich posters by Josef Muller-Brockmann
 */
export interface OperaPosterOptions {
  /** Venue name displayed as large headline (e.g., "Opernhaus Zurich") */
  venueName: string;
  /** Main event title displayed prominently (e.g., "I Vespri siciliani") */
  eventTitle: string;
  /** Subtitle or translation (e.g., "Die sizilianische Vesper") */
  subtitle?: string;
  /**
   * Metadata columns (3 recommended for reference fidelity)
   * Each column has a heading and list of entries
   */
  metadataColumns?: Array<{
    /** Column heading (e.g., "Musikalische Leitung:") */
    label: string;
    /** List of items/names */
    items: string[];
  }>;
  /** Show accent squares flanking the title (default: true) */
  showAccentSquares?: boolean;
  /** Size of accent squares in pixels (default: 100) */
  squareSize?: number;
  /** Footer text (e.g., "Gestaltung: Muller-Brockmann") */
  footerText?: string;
  /** Theme preset (default: 'vignelli-cream' for closest match) */
  theme?: ThemePreset;
}

export function createOperaPoster(options: OperaPosterOptions): PosterDefinition {
  const {
    venueName,
    eventTitle,
    subtitle,
    metadataColumns = [],
    showAccentSquares = true,
    squareSize = 100,
    footerText,
    theme = 'vignelli-cream',
  } = options;

  // Build title section with optional accent squares
  const buildTitleSection = (): PrimitiveNode => {
    const titleContent: PrimitiveNode = {
      type: 'stack',
      direction: 'vertical',
      align: 'center',
      gap: 2,
      children: [
        {
          type: 'text',
          content: eventTitle,
          variant: 'headline',
          color: 'foreground',
          align: 'center',
        },
        ...(subtitle
          ? [
              {
                type: 'text' as const,
                content: subtitle,
                variant: 'body' as const,
                color: 'muted' as const,
                align: 'center' as const,
              },
            ]
          : []),
      ],
    };

    if (!showAccentSquares) {
      return titleContent;
    }

    return {
      type: 'stack',
      direction: 'horizontal',
      justify: 'center',
      align: 'center',
      gap: 8,
      children: [
        {
          type: 'box',
          color: 'accent',
          width: `${squareSize}px`,
          height: `${squareSize}px`,
        },
        titleContent,
        {
          type: 'box',
          color: 'accent',
          width: `${squareSize}px`,
          height: `${squareSize}px`,
        },
      ],
    };
  };

  // Build metadata grid
  const buildMetadataGrid = (): PrimitiveNode | null => {
    if (metadataColumns.length === 0) return null;

    return {
      type: 'grid',
      columns: Math.min(metadataColumns.length, 4),
      gap: 6,
      children: metadataColumns.slice(0, 4).map((col) => ({
        type: 'stack' as const,
        direction: 'vertical' as const,
        gap: 1 as const,
        children: [
          {
            type: 'text' as const,
            content: col.label,
            variant: 'body' as const,
            color: 'foreground' as const,
            style: { fontWeight: '700' },
          },
          ...col.items.map((item) => ({
            type: 'text' as const,
            content: item,
            variant: 'meta' as const,
            color: 'foreground' as const,
          })),
        ],
      })),
    };
  };

  const metadataGrid = buildMetadataGrid();

  return {
    name: `Opera - ${venueName} - ${eventTitle}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: '1' },
      children: [
        // Venue headline
        {
          type: 'text',
          content: venueName,
          variant: 'hero',
          color: 'foreground',
          style: {
            letterSpacing: '-0.04em',
            lineHeight: '0.9',
          },
        },
        // Spacer after headline
        { type: 'spacer', size: 8 },
        // Metadata grid (if provided)
        ...(metadataGrid ? [metadataGrid] : []),
        // Flexible spacer to center title
        { type: 'spacer', size: 'flex' },
        // Title section with accent squares
        buildTitleSection(),
        // Flexible spacer below title
        { type: 'spacer', size: 'flex' },
        // Divider
        { type: 'divider', color: 'foreground', thickness: 'medium' },
        // Spacer before footer
        { type: 'spacer', size: 4 },
        // Footer text (if provided)
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
