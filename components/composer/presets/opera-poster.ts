import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Opera/Venue Poster Preset
 * Creates a classic Swiss-style venue poster with geometric accent squares
 */
export interface OperaPosterOptions {
  venueName: string;
  eventTitle: string;
  subtitle?: string;
  metadataColumns?: Array<{ label: string; items: string[] }>;
  showAccentSquares?: boolean;
  squareSize?: number;
  footerText?: string;
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

  const buildTitleSection = (): PrimitiveNode => {
    const titleContent: PrimitiveNode = {
      type: 'stack',
      direction: 'vertical',
      align: 'center',
      gap: 2,
      children: [
        { type: 'text', content: eventTitle, variant: 'headline', color: 'foreground', align: 'center' },
        ...(subtitle ? [{ type: 'text' as const, content: subtitle, variant: 'body' as const, color: 'muted' as const, align: 'center' as const }] : []),
      ],
    };

    if (!showAccentSquares) return titleContent;

    return {
      type: 'stack',
      direction: 'horizontal',
      justify: 'center',
      align: 'center',
      gap: 8,
      children: [
        { type: 'box', color: 'accent', width: `${squareSize}px`, height: `${squareSize}px` },
        titleContent,
        { type: 'box', color: 'accent', width: `${squareSize}px`, height: `${squareSize}px` },
      ],
    };
  };

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
          { type: 'text' as const, content: col.label, variant: 'body' as const, color: 'foreground' as const, style: { fontWeight: '700' } },
          ...col.items.map((item) => ({ type: 'text' as const, content: item, variant: 'meta' as const, color: 'foreground' as const })),
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
        { type: 'text', content: venueName, variant: 'hero', color: 'foreground', style: { letterSpacing: '-0.04em', lineHeight: '0.9' } },
        { type: 'spacer', size: 8 },
        ...(metadataGrid ? [metadataGrid] : []),
        { type: 'spacer', size: 'flex' },
        buildTitleSection(),
        { type: 'spacer', size: 'flex' },
        { type: 'divider', color: 'foreground', thickness: 'medium' },
        { type: 'spacer', size: 4 },
        ...(footerText ? [{ type: 'text' as const, content: footerText, variant: 'meta' as const, color: 'muted' as const }] : []),
      ],
    },
  };
}
