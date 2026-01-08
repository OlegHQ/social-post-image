import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Split Statement Preset
 * Playful diagonal text flow with framed card (Empatia style)
 */
export interface SplitStatementOptions {
  // Top-left text
  topLines: string[];
  topInlineWord?: string;

  // Bottom-right text
  bottomWord: string;

  // Footer
  brandName?: string;
  url?: string;

  // Styling
  framePadding?: number;
  cardPadding?: number;

  theme?: ThemePreset;
}

export function createSplitStatement(options: SplitStatementOptions): PosterDefinition {
  const {
    topLines,
    topInlineWord,
    bottomWord,
    brandName,
    url,
    framePadding = 40,
    cardPadding = 60,
    theme = 'empatia-mint',
  } = options;

  // Build top text section
  const buildTopSection = (): PrimitiveNode => {
    const lineNodes: PrimitiveNode[] = [];

    topLines.forEach((line, index) => {
      const isLastLine = index === topLines.length - 1;

      // For the last line, add inline word if provided
      if (isLastLine && topInlineWord) {
        lineNodes.push({
          type: 'stack',
          direction: 'horizontal',
          gap: 2,
          align: 'end',
          children: [
            {
              type: 'text',
              content: line,
              variant: 'headline',
              color: 'foreground',
              style: {
                fontSize: '56px',
                fontWeight: '700',
                lineHeight: '0.95',
              },
            },
            {
              type: 'text',
              content: topInlineWord,
              variant: 'body',
              color: 'foreground',
              style: {
                fontSize: '18px',
                fontWeight: '400',
                alignSelf: 'flex-end',
              },
            },
          ],
        });
      } else {
        lineNodes.push({
          type: 'text',
          content: line,
          variant: 'headline',
          color: 'foreground',
          style: {
            fontSize: '56px',
            fontWeight: '700',
            lineHeight: '0.95',
          },
        });
      }
    });

    return {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      children: lineNodes,
    };
  };

  return {
    name: `Split Statement - ${bottomWord}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'box',
      color: 'background',
      padding: 0,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: `${framePadding}px`,
      },
      children: [
        // Inner card
        {
          type: 'box',
          color: 'accent',
          padding: 0,
          style: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: `${cardPadding}px`,
            position: 'relative',
          },
          children: [
            // Top-left text
            buildTopSection(),

            { type: 'spacer', size: 'flex' },

            // Bottom-right text
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'end',
              children: [
                {
                  type: 'text',
                  content: bottomWord,
                  variant: 'headline',
                  color: 'foreground',
                  style: {
                    fontSize: '72px',
                    fontWeight: '700',
                    textAlign: 'right',
                  },
                },
              ],
            },

            { type: 'spacer', size: 6 },

            // Footer inside card
            {
              type: 'stack',
              direction: 'horizontal',
              justify: 'between',
              align: 'end',
              children: [
                // Brand name
                ...(brandName
                  ? [{
                      type: 'text' as const,
                      content: brandName,
                      variant: 'body' as const,
                      color: 'foreground' as const,
                      style: { fontWeight: '700' },
                    }]
                  : [{ type: 'spacer' as const, size: 1 as const }]),

                // URL
                ...(url
                  ? [{
                      type: 'text' as const,
                      content: url,
                      variant: 'meta' as const,
                      color: 'foreground' as const,
                      italic: true,
                    }]
                  : []),
              ],
            },
          ],
        },
      ],
    },
  };
}
