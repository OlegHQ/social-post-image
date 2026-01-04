/**
 * Swiss Design System - Layout Presets
 *
 * Pre-built poster generators based on classic Swiss design patterns
 */

// Existing presets
export { createVignelliQuote, type VignelliQuoteOptions } from './vignelli-quote';
export { createTypographyShowcase, type TypographyShowcaseOptions } from './typography-showcase';
export { createStatementPoster, type StatementPosterOptions } from './statement-poster';

// New presets
export { createHotTakePoster, type HotTakeOptions } from './hot-take-poster';
export { createAnnouncementPoster, type AnnouncementOptions } from './announcement-poster';

// refs2 templates
export { createOperaPoster, type OperaPosterOptions } from './opera-poster';
export { createSeasonPoster, type SeasonPosterOptions, type EventBlock, type CreditEntry } from './season-poster';
export { createFeatureShowcase, type FeatureShowcaseOptions, type InfoSection, type MarkerIcon } from './feature-showcase';
