import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Showcase Poster Preset
 * Creates a bold poster with primary/secondary headings and optional info columns
 * Swiss-style left-aligned layout with geometric accent squares
 */
export interface ShowcasePosterOptions {
  primaryHeading: string;
  secondaryHeading: string;
  supportingText?: string;
  infoColumns?: Array<{ heading: string; items: string[] }>;
  showAccentSquares?: boolean;
  squareSize?: number;
  footerText?: string;
  theme?: ThemePreset;
}

export function createShowcasePoster(options: ShowcasePosterOptions): PosterDefinition {
  const {
    primaryHeading,
    secondaryHeading,
    supportingText,
    infoColumns = [],
    showAccentSquares = true,
    squareSize = 100,
    footerText,
    theme = 'vignelli-cream',
  } = options;

  const buildTitleSection = (): PrimitiveNode => {
    const titleContent: PrimitiveNode = {
      type: 'stack',
      direction: 'vertical',
      gap: 2,
      children: [
        { type: 'text', content: secondaryHeading, variant: 'headline', color: 'foreground' },
        ...(supportingText ? [{ type: 'text' as const, content: supportingText, variant: 'body' as const, color: 'muted' as const }] : []),
      ],
    };

    if (!showAccentSquares) return titleContent;

    return {
      type: 'stack',
      direction: 'horizontal',
      align: 'center',
      gap: 8,
      children: [
        { type: 'box', color: 'accent', width: `${squareSize}px`, height: `${squareSize}px` },
        titleContent,
      ],
    };
  };

  const buildInfoGrid = (): PrimitiveNode | null => {
    if (infoColumns.length === 0) return null;

    return {
      type: 'grid',
      columns: Math.min(infoColumns.length, 4),
      gap: 6,
      children: infoColumns.slice(0, 4).map((col) => ({
        type: 'stack' as const,
        direction: 'vertical' as const,
        gap: 1 as const,
        children: [
          { type: 'text' as const, content: col.heading, variant: 'body' as const, color: 'foreground' as const, style: { fontWeight: '700' } },
          ...col.items.map((item) => ({ type: 'text' as const, content: item, variant: 'meta' as const, color: 'foreground' as const })),
        ],
      })),
    };
  };

  const infoGrid = buildInfoGrid();

  return {
    name: `Showcase - ${primaryHeading.slice(0, 30)}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: '1' },
      children: [
        { type: 'text', content: primaryHeading, variant: 'hero', color: 'foreground', style: { letterSpacing: '-0.04em', lineHeight: '0.9' } },
        { type: 'spacer', size: 8 },
        ...(infoGrid ? [infoGrid] : []),
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
