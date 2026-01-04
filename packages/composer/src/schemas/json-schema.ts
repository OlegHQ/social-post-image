/**
 * JSON Schema Export for External AI Tools
 *
 * Converts Zod schemas to JSON Schema format that can be used by
 * external AI tools to generate valid template options.
 */

import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  VignelliQuoteOptionsSchema,
  StatementPosterOptionsSchema,
  TypographyShowcaseOptionsSchema,
  HotTakeOptionsSchema,
  AnnouncementOptionsSchema,
  // refs2 templates
  OperaPosterOptionsSchema,
  SeasonPosterOptionsSchema,
  FeatureShowcaseOptionsSchema,
  ThemePresetSchema,
  CanvasPresetSchema,
  PresetIdSchema,
} from './validation';

// Schema registry for JSON Schema conversion
const zodSchemaRegistry: Record<string, unknown> = {
  'vignelli-quote': VignelliQuoteOptionsSchema,
  'statement-poster': StatementPosterOptionsSchema,
  'typography-showcase': TypographyShowcaseOptionsSchema,
  'hot-take-poster': HotTakeOptionsSchema,
  'announcement-poster': AnnouncementOptionsSchema,
  // refs2 templates
  'opera-poster': OperaPosterOptionsSchema,
  'season-poster': SeasonPosterOptionsSchema,
  'feature-showcase': FeatureShowcaseOptionsSchema,
};

/**
 * Get JSON Schema for a specific preset
 */
export function getJsonSchema(presetId: string): object | null {
  const zodSchema = zodSchemaRegistry[presetId];
  if (!zodSchema) {
    return null;
  }
  return zodToJsonSchema(zodSchema as Parameters<typeof zodToJsonSchema>[0], {
    name: presetId,
    $refStrategy: 'none',
  });
}

/**
 * Get JSON Schemas for all presets
 */
export function getAllJsonSchemas(): Record<string, object> {
  const schemas: Record<string, object> = {};
  for (const presetId of Object.keys(zodSchemaRegistry)) {
    const schema = getJsonSchema(presetId);
    if (schema) {
      schemas[presetId] = schema;
    }
  }
  return schemas;
}

/**
 * Get JSON Schema for theme presets
 */
export function getThemeSchema(): object {
  return zodToJsonSchema(ThemePresetSchema, {
    name: 'ThemePreset',
    $refStrategy: 'none',
  });
}

/**
 * Get JSON Schema for canvas presets
 */
export function getCanvasSchema(): object {
  return zodToJsonSchema(CanvasPresetSchema, {
    name: 'CanvasPreset',
    $refStrategy: 'none',
  });
}

/**
 * Get list of all preset IDs
 */
export function getPresetIdSchema(): object {
  return zodToJsonSchema(PresetIdSchema, {
    name: 'PresetId',
    $refStrategy: 'none',
  });
}

/**
 * Get a summary of all available presets for LLM prompting
 */
export function getPresetSummary(): string {
  return `
Available Swiss Design Poster Presets:

1. vignelli-quote
   - Quote poster with emphasis phrase (Massimo Vignelli style)
   - Fields: quote, emphasisPhrase, author, authorMeta?, seriesNumber?, topic?

2. statement-poster
   - Simple bold headline poster
   - Fields: headline, subheadline?, author?, topic?, headlineUppercase?

3. typography-showcase
   - Large letterform typography poster
   - Fields: letter (single char), fontName, fontVariant?, showCharset?

4. hot-take-poster
   - Contrarian statement for strong opinions
   - Fields: prefix?, statement, author, hashtag?

5. announcement-poster
   - Article/launch announcement
   - Fields: label, title, teaser?, url?, author

6. opera-poster
   - Classic Swiss venue poster with geometric accent squares
   - Fields: venueName, eventTitle, subtitle?, metadataColumns?, footerText?

7. season-poster
   - Red background poster with multiple event listings
   - Fields: venueName, seasonTitle, events[{title, date, time, status?, credits?}]

8. feature-showcase
   - Giant keyword poster with info sections
   - Fields: keyword, subtitle?, topRight?, bottomLeft?, bottomRight?, lowercase?

Available Themes:
swiss-red, klein-blue, monochrome, vignelli-gold, vignelli-cream, neue-teal,
orange-energy, midnight-gold, forest-contrast, brutalist-concrete, tech-terminal,
paper-ink, swiss-red-inverted

Available Canvas Sizes:
linkedin-portrait (1080x1350), linkedin-square (1080x1080), linkedin-landscape (1200x627),
twitter (1200x675), instagram-square (1080x1080), instagram-portrait (1080x1350)
`.trim();
}
