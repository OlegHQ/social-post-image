/**
 * Test Matrix Generator
 * Generates all combinations of presets, themes, and canvas sizes for testing
 *
 * 8 presets × 12 themes × 4 canvases = 384 test combinations
 */

import {
  createVignelliQuote,
  createStatementPoster,
  createTypographyShowcase,
  // New presets
  createHotTakePoster,
  createComparisonPoster,
  createListPoster,
  createMetricPoster,
  createAnnouncementPoster,
  type PosterDefinition,
} from '@swiss/composer';
import type { ThemePreset, CanvasPreset } from '@swiss/primitives';
import type { TestCase } from '../types.js';

/**
 * Available presets (8 total)
 */
export const PRESETS = [
  'vignelli-quote',
  'statement-poster',
  'typography-showcase',
  // New 5 presets
  'hot-take-poster',
  'comparison-poster',
  'list-poster',
  'metric-poster',
  'announcement-poster',
] as const;

/**
 * Available themes (12 total)
 */
export const THEMES: ThemePreset[] = [
  // Original 7
  'swiss-red',
  'klein-blue',
  'monochrome',
  'vignelli-gold',
  'vignelli-cream',
  'neue-teal',
  'orange-energy',
  // New 5
  'midnight-gold',
  'forest-contrast',
  'brutalist-concrete',
  'tech-terminal',
  'paper-ink',
];

/**
 * Available canvas sizes (4 main social media formats)
 */
export const CANVAS_SIZES: CanvasPreset[] = [
  'linkedin-portrait',
  'linkedin-square',
  'instagram-portrait',
  'twitter',
];

/**
 * Sample data for each preset type
 */
const SAMPLE_DATA = {
  'vignelli-quote': {
    quote:
      'We like design to be visually powerful, intellectually elegant, and above all timeless.',
    emphasisPhrase: 'visually powerful, intellectually elegant.',
    author: 'Massimo Vignelli',
    authorMeta: 'Born 1931 in Milan, Italy',
    seriesNumber: 1,
  },
  'statement-poster': {
    headline: 'Design is\nthinking\nmade visual',
    subheadline: 'Create beautiful Swiss-style posters',
    author: 'Designer',
    topic: 'Design',
  },
  'typography-showcase': {
    letter: 'G',
    fontName: 'Neue Haas',
    fontVariant: 'Grotesk',
    titleWords: ['swiss', 'typography', 'swiss'],
  },
  // New preset sample data
  'hot-take-poster': {
    prefix: 'UNPOPULAR OPINION:',
    statement: 'Microservices are a tax on your startup that you cannot afford early on',
    author: 'nexo.sh',
    hashtag: '#Tech',
  },
  'comparison-poster': {
    topic: 'MICROSERVICES TAX',
    leftTitle: 'Promise',
    rightTitle: 'Reality',
    leftPoints: ['Scalability', 'Independence', 'Tech flexibility'],
    rightPoints: ['DevOps complexity', 'Network latency', 'Debugging hell'],
    verdict: 'Start with a monolith. Split when you must.',
    author: 'nexo.sh',
  },
  'list-poster': {
    headline: '5 THINGS I LEARNED',
    subheadline: 'building dev teams at scale',
    items: [
      { title: 'Hire for curiosity', subtitle: 'Not just credentials' },
      { title: 'Code review is teaching', subtitle: 'Not gatekeeping' },
      { title: 'Ship daily', subtitle: 'Feedback loops matter' },
      { title: 'Document decisions', subtitle: 'Memory fades fast' },
      { title: 'Celebrate failures', subtitle: 'They teach more than wins' },
    ],
    author: 'nexo.sh',
  },
  'metric-poster': {
    context: 'Based on 500+ startup interviews',
    metric: '73%',
    metricLabel: 'percent',
    statement: 'of startups fail due to premature scaling and over-engineering',
    source: 'State of DevOps 2024',
    author: 'nexo.sh',
  },
  'announcement-poster': {
    label: 'NEW POST',
    title: 'Why Microservices Are a Tax on Your Startup',
    teaser: 'The hidden costs nobody talks about until it is too late',
    url: 'nexo.sh/microservices',
    author: 'nexo.sh',
  },
};

/**
 * Generate a poster definition for a given preset and theme
 */
export function generateDefinition(
  preset: string,
  theme: ThemePreset,
  canvas: CanvasPreset
): PosterDefinition {
  let definition: PosterDefinition;

  switch (preset) {
    case 'vignelli-quote':
      definition = createVignelliQuote({
        ...SAMPLE_DATA['vignelli-quote'],
        theme,
      });
      break;

    case 'statement-poster':
      definition = createStatementPoster({
        ...SAMPLE_DATA['statement-poster'],
        theme,
      });
      break;

    case 'typography-showcase':
      definition = createTypographyShowcase({
        ...SAMPLE_DATA['typography-showcase'],
        theme,
      });
      break;

    case 'hot-take-poster':
      definition = createHotTakePoster({
        ...SAMPLE_DATA['hot-take-poster'],
        theme,
      });
      break;

    case 'comparison-poster':
      definition = createComparisonPoster({
        ...SAMPLE_DATA['comparison-poster'],
        theme,
      });
      break;

    case 'list-poster':
      definition = createListPoster({
        ...SAMPLE_DATA['list-poster'],
        theme,
      });
      break;

    case 'metric-poster':
      definition = createMetricPoster({
        ...SAMPLE_DATA['metric-poster'],
        theme,
      });
      break;

    case 'announcement-poster':
      definition = createAnnouncementPoster({
        ...SAMPLE_DATA['announcement-poster'],
        theme,
      });
      break;

    default:
      throw new Error(`Unknown preset: ${preset}`);
  }

  // Override canvas
  definition.canvas = { preset: canvas };

  return definition;
}

/**
 * Generate the full test matrix
 */
export function generateTestMatrix(options?: {
  preset?: string;
  theme?: string;
  canvas?: string;
}): TestCase[] {
  const testCases: TestCase[] = [];

  const presets = options?.preset ? [options.preset] : PRESETS;
  const themes = options?.theme ? [options.theme as ThemePreset] : THEMES;
  const canvases = options?.canvas ? [options.canvas as CanvasPreset] : CANVAS_SIZES;

  for (const preset of presets) {
    for (const theme of themes) {
      for (const canvas of canvases) {
        const id = `${preset}_${theme}_${canvas}`;
        const definition = generateDefinition(preset, theme as ThemePreset, canvas as CanvasPreset);

        testCases.push({
          id,
          preset,
          theme,
          canvas,
          definition,
        });
      }
    }
  }

  return testCases;
}

/**
 * Get total test count for a matrix configuration
 */
export function getMatrixSize(options?: {
  preset?: string;
  theme?: string;
  canvas?: string;
}): number {
  const presets = options?.preset ? 1 : PRESETS.length;
  const themes = options?.theme ? 1 : THEMES.length;
  const canvases = options?.canvas ? 1 : CANVAS_SIZES.length;

  return presets * themes * canvases;
}
