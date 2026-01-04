/**
 * Zod Validation Schemas for Template Options
 *
 * These schemas validate JSON input from CLI or external AI tools
 * before generating poster definitions.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════════════════

export const ThemePresetSchema = z.enum([
  'swiss-red',
  'klein-blue',
  'monochrome',
  'vignelli-gold',
  'vignelli-cream',
  'neue-teal',
  'orange-energy',
  // New themes
  'midnight-gold',
  'forest-contrast',
  'brutalist-concrete',
  'tech-terminal',
  'paper-ink',
  'swiss-red-inverted',
]);

export const CanvasPresetSchema = z.enum([
  'linkedin-portrait',
  'linkedin-square',
  'linkedin-landscape',
  'twitter',
  'instagram-square',
  'instagram-portrait',
]);

export const PresetIdSchema = z.enum([
  'vignelli-quote',
  'statement-poster',
  'typography-showcase',
  'hot-take-poster',
  'announcement-poster',
  // refs2 templates
  'opera-poster',
  'season-poster',
  'feature-showcase',
]);

// ═══════════════════════════════════════════════════════════════════════════
// EXISTING PRESET SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const VignelliQuoteOptionsSchema = z.object({
  preset: z.literal('vignelli-quote'),
  quote: z.string().min(1).max(500),
  emphasisPhrase: z.string().min(1).max(100),
  author: z.string().min(1).max(50),
  authorMeta: z.string().max(100).optional(),
  seriesTitle: z.string().max(50).optional(),
  seriesNumber: z.number().int().positive().max(99).optional(),
  metaColumns: z.array(z.string().max(50)).max(4).optional(),
  topic: z.string().max(50).optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

export const StatementPosterOptionsSchema = z.object({
  preset: z.literal('statement-poster'),
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(200).optional(),
  author: z.string().max(50).optional(),
  topic: z.string().max(50).optional(),
  headlineUppercase: z.boolean().optional(),
  postNumber: z.number().int().positive().max(999).optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

export const TypographyShowcaseOptionsSchema = z.object({
  preset: z.literal('typography-showcase'),
  letter: z.string().length(1),
  fontName: z.string().min(1).max(50),
  fontVariant: z.string().max(50).optional(),
  tagline: z.string().max(50).optional(),
  titleWords: z.array(z.string().max(30)).max(5).optional(),
  bodyText: z.string().max(300).optional(),
  showCharset: z.boolean().optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// NEW PRESET SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const HotTakeOptionsSchema = z.object({
  preset: z.literal('hot-take-poster'),
  prefix: z.string().max(30).optional(),
  statement: z.string().min(1).max(200),
  author: z.string().min(1).max(50),
  hashtag: z.string().max(20).optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

export const AnnouncementOptionsSchema = z.object({
  preset: z.literal('announcement-poster'),
  label: z.string().min(1).max(20),
  title: z.string().min(1).max(100),
  teaser: z.string().max(200).optional(),
  url: z.string().max(50).optional(),
  author: z.string().min(1).max(50),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// REFS2 TEMPLATE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const MetadataColumnSchema = z.object({
  label: z.string().min(1).max(50),
  items: z.array(z.string().max(100)).min(1).max(10),
});

export const OperaPosterOptionsSchema = z.object({
  preset: z.literal('opera-poster'),
  venueName: z.string().min(1).max(100),
  eventTitle: z.string().min(1).max(100),
  subtitle: z.string().max(100).optional(),
  metadataColumns: z.array(MetadataColumnSchema).max(4).optional(),
  showAccentSquares: z.boolean().optional(),
  squareSize: z.number().int().positive().max(200).optional(),
  footerText: z.string().max(100).optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

export const CreditEntrySchema = z.object({
  role: z.string().min(1).max(50),
  name: z.string().min(1).max(50),
});

export const EventBlockSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.string().min(1).max(50),
  time: z.string().min(1).max(20),
  status: z.string().max(50).optional(),
  description: z.string().max(200).optional(),
  credits: z.array(CreditEntrySchema).max(10).optional(),
});

export const SeasonPosterOptionsSchema = z.object({
  preset: z.literal('season-poster'),
  venueName: z.string().min(1).max(100),
  seasonTitle: z.string().min(1).max(100),
  events: z.array(EventBlockSchema).min(1).max(5),
  footerText: z.string().max(100).optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

export const MarkerIconSchema = z.enum(['triangle', 'double-triangle', 'L', 'square', 'circle', 'none']);

export const InfoSectionSchema = z.object({
  icon: MarkerIconSchema.optional(),
  title: z.string().min(1).max(50),
  body: z.string().min(1).max(300),
});

export const FeatureShowcaseOptionsSchema = z.object({
  preset: z.literal('feature-showcase'),
  keyword: z.string().min(1).max(20),
  subtitle: z.string().max(100).optional(),
  topRight: InfoSectionSchema.optional(),
  bottomLeft: InfoSectionSchema.optional(),
  bottomRight: InfoSectionSchema.optional(),
  lowercase: z.boolean().optional(),
  keywordSize: z.string().max(20).optional(),
  showBottomBar: z.boolean().optional(),
  theme: ThemePresetSchema.optional(),
  canvas: CanvasPresetSchema.optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// UNION & HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export const PresetOptionsSchema = z.discriminatedUnion('preset', [
  VignelliQuoteOptionsSchema,
  StatementPosterOptionsSchema,
  TypographyShowcaseOptionsSchema,
  HotTakeOptionsSchema,
  AnnouncementOptionsSchema,
  // refs2 templates
  OperaPosterOptionsSchema,
  SeasonPosterOptionsSchema,
  FeatureShowcaseOptionsSchema,
]);

// Type exports (only for the union type - individual options types come from presets)
export type PresetOptions = z.infer<typeof PresetOptionsSchema>;

// Schema registry by preset ID
const schemaRegistry: Record<string, z.ZodType> = {
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
 * Get Zod schema for a preset by ID
 */
export function getSchemaForPreset(presetId: string): z.ZodType | undefined {
  return schemaRegistry[presetId];
}

/**
 * Validate options for a preset
 * Returns { valid: true, data } or { valid: false, errors }
 */
export function validatePresetOptions(
  presetId: string,
  options: unknown
): { valid: true; data: PresetOptions } | { valid: false; errors: string[] } {
  const schema = schemaRegistry[presetId];
  if (!schema) {
    return { valid: false, errors: [`Unknown preset: ${presetId}`] };
  }

  const result = schema.safeParse({ ...options as object, preset: presetId });
  if (result.success) {
    return { valid: true, data: result.data as PresetOptions };
  }

  return {
    valid: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ),
  };
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): string[] {
  return Object.keys(schemaRegistry);
}
