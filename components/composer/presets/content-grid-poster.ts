import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Content Grid Poster Preset
 * Creates a bold poster with content blocks in a 2-column grid layout
 * Great for: key points, tips, features, steps, summaries
 */
export interface ContentGridPosterOptions {
  brandName: string;
  sectionTitle: string;
  contentBlocks: ContentBlock[];
  footerText?: string;
  theme?: ThemePreset;
}

export interface ContentBlock {
  title: string;
  shortLabel?: string;
  subLabel?: string;
  badge?: string;
  description?: string;
  attribution?: string;
}

function createContentBlockNode(block: ContentBlock): PrimitiveNode {
  const { title, shortLabel, subLabel, badge, description, attribution } = block;

  // Build left column content (short labels)
  const leftColumnChildren: PrimitiveNode[] = [];
  if (shortLabel) {
    leftColumnChildren.push({ type: 'text', content: shortLabel, variant: 'body', color: 'foreground' });
  }
  if (subLabel) {
    leftColumnChildren.push({ type: 'text', content: subLabel, variant: 'body', color: 'foreground' });
  }
  if (badge) {
    leftColumnChildren.push({ type: 'text' as const, content: badge, variant: 'body' as const, color: 'foreground' as const, italic: true });
  }

  // Build right column content (description and attribution)
  const rightColumnChildren: PrimitiveNode[] = [];
  if (description) {
    rightColumnChildren.push({ type: 'text' as const, content: description, variant: 'body' as const, color: 'foreground' as const, style: { fontWeight: '700' } });
  }
  if (attribution) {
    rightColumnChildren.push({ type: 'text' as const, content: attribution, variant: 'meta' as const, color: 'foreground' as const });
  }

  // If no left column content, use single column layout
  const hasLeftColumn = leftColumnChildren.length > 0;
  const hasRightColumn = rightColumnChildren.length > 0;

  return {
    type: 'stack',
    direction: 'vertical',
    gap: 4,
    children: [
      { type: 'text', content: title, variant: 'headline', color: 'foreground', style: { fontWeight: '700' } },
      ...(hasLeftColumn || hasRightColumn
        ? [{
            type: 'grid' as const,
            columns: hasLeftColumn ? '1fr 2fr' : '1fr',
            gap: 6 as const,
            children: [
              ...(hasLeftColumn
                ? [{
                    type: 'stack' as const,
                    direction: 'vertical' as const,
                    gap: 1 as const,
                    children: leftColumnChildren,
                  }]
                : []),
              ...(hasRightColumn
                ? [{
                    type: 'stack' as const,
                    direction: 'vertical' as const,
                    gap: 2 as const,
                    children: rightColumnChildren,
                  }]
                : []),
            ],
          }]
        : []),
    ],
  };
}

export function createContentGridPoster(options: ContentGridPosterOptions): PosterDefinition {
  const { brandName, sectionTitle, contentBlocks, footerText, theme = 'swiss-red-inverted' } = options;

  return {
    name: `Content Grid - ${brandName.slice(0, 20)}`,
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
            { type: 'text', content: brandName, variant: 'headline', color: 'foreground', style: { letterSpacing: '-0.02em' } },
            { type: 'text', content: sectionTitle, variant: 'title', color: 'foreground' },
          ],
        },
        ...contentBlocks.map((block) => createContentBlockNode(block)),
        { type: 'spacer', size: 'flex' },
        ...(footerText ? [{ type: 'text' as const, content: footerText, variant: 'meta' as const, color: 'muted' as const }] : []),
      ],
    },
  };
}
