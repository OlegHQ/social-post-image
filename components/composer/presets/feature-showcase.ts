import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Feature Showcase Preset
 * Creates a giant keyword poster with info sections in corners
 */
export type MarkerIcon = 'triangle' | 'double-triangle' | 'L' | 'square' | 'circle' | 'none';

export interface InfoSection {
  icon?: MarkerIcon;
  title: string;
  body: string;
}

export interface FeatureShowcaseOptions {
  keyword: string;
  subtitle?: string;
  topRight?: InfoSection;
  bottomLeft?: InfoSection;
  bottomRight?: InfoSection;
  lowercase?: boolean;
  keywordSize?: string;
  showBottomBar?: boolean;
  theme?: ThemePreset;
}

function createMarker(icon: MarkerIcon): PrimitiveNode | null {
  switch (icon) {
    case 'triangle':
      return { type: 'box', style: { width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '16px solid var(--color-accent)' } };
    case 'double-triangle':
      return {
        type: 'stack',
        direction: 'vertical',
        gap: 1,
        children: [
          { type: 'box', style: { width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid var(--color-accent)' } },
          { type: 'box', style: { width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid var(--color-accent)' } },
        ],
      };
    case 'L':
      return { type: 'box', color: 'accent', style: { width: '20px', height: '20px', clipPath: 'polygon(0 0, 35% 0, 35% 65%, 100% 65%, 100% 100%, 0 100%)' } };
    case 'square':
      return { type: 'box', color: 'accent', style: { width: '18px', height: '18px' } };
    case 'circle':
      return { type: 'box', color: 'accent', style: { width: '18px', height: '18px', borderRadius: '50%' } };
    case 'none':
    default:
      return null;
  }
}

function createInfoSection(section: InfoSection, align: 'left' | 'right'): PrimitiveNode {
  const { icon = 'square', title, body } = section;
  const marker = createMarker(icon);

  return {
    type: 'stack',
    direction: 'vertical',
    gap: 2,
    align: align === 'right' ? 'end' : 'start',
    children: [
      ...(marker ? [marker] : []),
      { type: 'text', content: title, variant: 'label', color: 'accent', align },
      { type: 'text', content: body, variant: 'body', color: 'foreground', align, style: { maxWidth: '240px' } },
    ],
  };
}

export function createFeatureShowcase(options: FeatureShowcaseOptions): PosterDefinition {
  const {
    keyword,
    subtitle,
    topRight,
    bottomLeft,
    bottomRight,
    lowercase = true,
    keywordSize = '200px',
    showBottomBar = true,
    theme = 'orange-energy',
  } = options;

  const displayKeyword = lowercase ? keyword.toLowerCase() : keyword.toUpperCase();

  return {
    name: `Feature - ${keyword}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: '1' },
      children: [
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'end',
          children: [...(topRight ? [createInfoSection(topRight, 'right')] : [{ type: 'spacer' as const, size: 8 as const }])],
        },
        { type: 'spacer', size: 'flex' },
        { type: 'text', content: displayKeyword, variant: 'hero', color: 'accent', style: { fontSize: keywordSize, fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '0.85' } },
        ...(subtitle
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'end' as const,
              children: [{ type: 'text' as const, content: subtitle, variant: 'title' as const, color: 'accent' as const, style: { maxWidth: '500px' } }],
            }]
          : []),
        { type: 'spacer', size: 'flex' },
        {
          type: 'stack',
          direction: 'horizontal',
          justify: 'between',
          align: 'end',
          children: [
            ...(bottomLeft ? [createInfoSection(bottomLeft, 'left')] : [{ type: 'spacer' as const, size: 4 as const }]),
            { type: 'spacer', size: 'flex' },
            ...(bottomRight ? [createInfoSection(bottomRight, 'right')] : [{ type: 'spacer' as const, size: 4 as const }]),
          ],
        },
        { type: 'spacer', size: 6 },
        ...(showBottomBar ? [{ type: 'box' as const, color: 'accent' as const, style: { height: '8px', width: '100%' } }] : []),
      ],
    },
  };
}
