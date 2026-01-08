import type { PosterDefinition, ThemePreset, PrimitiveNode } from '@/lib/types';

/**
 * Two-Tone Quote Preset
 * Quote with alternating word colors (Edward Tufte style)
 */
export interface TwoToneQuoteOptions {
  /** Quote text - use \n for line breaks */
  quote: string;
  /** Words to highlight in accent color (white) */
  highlightedWords: string[];
  author: string;
  authorItalic?: boolean;
  edgeText?: string;
  theme?: ThemePreset;
}

/**
 * Build a single line with colored words
 */
function buildQuoteLine(
  lineText: string,
  highlightedWords: string[],
  normalizedHighlights: string[]
): PrimitiveNode {
  const words = lineText.split(/\s+/).filter(Boolean);

  // Build the line content with proper spacing
  const lineContent = words.map((word, idx) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
    const isHighlighted = normalizedHighlights.includes(cleanWord);
    const isLast = idx === words.length - 1;

    return {
      type: 'text' as const,
      content: isLast ? word : word + ' ',
      variant: 'headline' as const,
      color: isHighlighted ? 'accent' : 'foreground',
      style: {
        display: 'inline',
        fontWeight: '900',
        fontSize: '72px',
        lineHeight: '1.0',
      },
    };
  });

  return {
    type: 'box',
    style: {
      display: 'block',
      marginBottom: '4px',
    },
    children: lineContent,
  };
}

export function createTwoToneQuote(options: TwoToneQuoteOptions): PosterDefinition {
  const {
    quote,
    highlightedWords,
    author,
    authorItalic = true,
    edgeText,
    theme = 'tufte-blue',
  } = options;

  // Normalize highlighted words for comparison
  const normalizedHighlights = highlightedWords.map((w) =>
    w.toLowerCase().replace(/[.,!?;:'"]/g, '')
  );

  // Split quote into lines
  const lines = quote.split('\n').filter(Boolean);

  // Build line nodes
  const lineNodes: PrimitiveNode[] = lines.map((line) =>
    buildQuoteLine(line, highlightedWords, normalizedHighlights)
  );

  return {
    name: `Two-Tone Quote - ${author}`,
    canvas: { preset: 'linkedin-portrait' },
    theme: { preset: theme },
    root: {
      type: 'stack',
      direction: 'vertical',
      gap: 0,
      style: { flex: 1 },
      children: [
        { type: 'spacer', size: 'flex' },

        // Quote lines
        {
          type: 'stack',
          direction: 'vertical',
          gap: 0,
          children: lineNodes,
        },

        { type: 'spacer', size: 6 },

        // Author attribution
        {
          type: 'text',
          content: author,
          variant: 'subhead',
          color: 'foreground',
          italic: authorItalic,
          style: {
            fontWeight: '400',
          },
        },

        { type: 'spacer', size: 'flex' },

        // Edge text at bottom right (not rotated - simpler approach)
        ...(edgeText
          ? [{
              type: 'stack' as const,
              direction: 'horizontal' as const,
              justify: 'end' as const,
              children: [{
                type: 'text' as const,
                content: edgeText,
                variant: 'meta' as const,
                color: 'foreground' as const,
                style: {
                  opacity: '0.7',
                  fontSize: '10px',
                },
              }],
            }]
          : []),
      ],
    },
  };
}
