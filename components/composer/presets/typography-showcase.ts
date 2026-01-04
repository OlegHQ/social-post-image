import type { PosterDefinition, ThemePreset } from '@/lib/types';

/**
 * Typography Showcase Preset
 * Creates a poster featuring a large letterform with font information
 */
export interface TypographyShowcaseOptions {
  letter: string;
  fontName: string;
  fontVariant?: string;
  tagline?: string;
  titleWords?: string[];
  bodyText?: string;
  showCharset?: boolean;
  uppercaseChars?: string;
  lowercaseChars?: string;
  symbolChars?: string;
  footerLeftPrimary?: string;
  footerLeftSecondary?: string;
  theme?: ThemePreset;
}

export function createTypographyShowcase(options: TypographyShowcaseOptions): PosterDefinition {
  const {
    letter,
    fontName,
    fontVariant = 'Grotesk',
    tagline = 'swiss style',
    titleWords = ['swiss', 'typography', 'swiss'],
    bodyText = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
    showCharset = true,
    uppercaseChars = 'ABCDEFGHIJKLMNOP\nQRSTUVWXYZ',
    lowercaseChars = 'abcdefghijklmnopqr\nstuvwxyz',
    symbolChars = '1234567890$?\n&%@!*()=',
    footerLeftPrimary = 'typografie',
    footerLeftSecondary = 'schweizer',
    theme = 'neue-teal',
  } = options;

  return {
    name: `Typography Showcase - ${fontName}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'box',
      style: { display: 'flex', flexDirection: 'column', flex: '1', position: 'relative', overflow: 'hidden' },
      children: [
        {
          type: 'box',
          style: { position: 'absolute', left: '-5%', bottom: '-12%', width: '110%', height: '75%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: '0', pointerEvents: 'none' },
          children: [{ type: 'text', content: letter, variant: 'hero', color: 'foreground', style: { fontSize: '900px', lineHeight: '0.75', fontWeight: '900', letterSpacing: '-0.02em' } }],
        },
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          style: { flex: '1', position: 'relative', zIndex: '1' },
          children: [
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'between',
              children: [
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
              ],
            },
            {
              type: 'stack',
              direction: 'vertical',
              gap: 0,
              style: { marginTop: '8px' },
              children: titleWords.map((word, i) => {
                const textColor = i === 0 ? 'accent' : 'foreground';
                return {
                  type: 'text' as const,
                  content: word,
                  variant: 'hero' as const,
                  color: textColor as 'accent' | 'foreground',
                  uppercase: false,
                  style: { lineHeight: '0.82', letterSpacing: '-0.03em' },
                };
              }),
            },
            { type: 'spacer', size: 6 },
            {
              type: 'grid',
              columns: '200px 1fr 200px',
              gap: 4,
              style: { flex: '1' },
              children: [
                {
                  type: 'stack',
                  direction: 'vertical',
                  gap: 4,
                  column: '1',
                  style: { paddingTop: '20px' },
                  children: [
                    { type: 'text', content: tagline, variant: 'meta', color: 'accent' },
                    {
                      type: 'stack',
                      direction: 'vertical',
                      gap: 1,
                      children: [{ type: 'text', content: fontName, variant: 'title', color: 'foreground', style: { fontWeight: '900' } }],
                    },
                    { type: 'text', content: bodyText, variant: 'meta', color: 'muted', style: { maxWidth: '180px', lineHeight: '1.4' } },
                  ],
                },
                { type: 'box', column: '2', children: [] },
                ...(showCharset
                  ? [{
                      type: 'stack' as const,
                      direction: 'vertical' as const,
                      gap: 3 as const,
                      column: '3',
                      align: 'end' as const,
                      style: { paddingTop: '20px' },
                      children: [
                        { type: 'text' as const, content: fontName, variant: 'label' as const, color: 'foreground' as const, align: 'right' as const },
                        { type: 'text' as const, content: uppercaseChars, variant: 'meta' as const, color: 'foreground' as const, align: 'right' as const, style: { whiteSpace: 'pre-line', lineHeight: '1.3' } },
                        { type: 'text' as const, content: lowercaseChars, variant: 'meta' as const, color: 'foreground' as const, align: 'right' as const, style: { whiteSpace: 'pre-line', lineHeight: '1.3' } },
                        { type: 'text' as const, content: symbolChars, variant: 'meta' as const, color: 'foreground' as const, align: 'right' as const, style: { whiteSpace: 'pre-line', lineHeight: '1.3' } },
                        { type: 'text' as const, content: fontVariant, variant: 'title' as const, color: 'accent' as const, align: 'right' as const, style: { marginTop: '16px' } },
                      ],
                    }]
                  : []),
              ],
            },
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'between',
              align: 'end',
              style: { marginTop: 'auto', paddingTop: '20px' },
              children: [
                {
                  type: 'stack',
                  direction: 'horizontal',
                  gap: 2,
                  children: [
                    { type: 'text', content: footerLeftPrimary, variant: 'meta', color: 'accent' },
                    { type: 'text', content: footerLeftSecondary, variant: 'meta', color: 'muted' },
                  ],
                },
                { type: 'text', content: tagline, variant: 'meta', color: 'muted' },
              ],
            },
          ],
        },
      ],
    },
  };
}
