/**
 * Preset Field Schemas
 * Complete schema definitions for all configurable template options
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'array' | 'stringArray' | 'object';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string }>;
  itemSchema?: FieldSchema[];
  properties?: FieldSchema[];
}

export interface PresetSchema {
  id: string;
  name: string;
  description: string;
  fields: FieldSchema[];
  defaultOptions: Record<string, unknown>;
}

// Icon options for feature-showcase markers
const markerIconOptions = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'double-triangle', label: 'Double Triangle' },
  { value: 'L', label: 'L Shape' },
  { value: 'none', label: 'None' },
];

export const presetSchemas: Record<string, PresetSchema> = {
  'vignelli-quote': {
    id: 'vignelli-quote',
    name: 'Vignelli Quote',
    description: 'Quote poster with emphasis phrase',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, placeholder: 'Enter the full quote text...', helpText: '100-200 characters recommended' },
      { key: 'emphasisPhrase', label: 'Emphasis Phrase', type: 'text', required: true, placeholder: 'Key phrase to emphasize', helpText: 'Must be exact substring of quote' },
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Author name' },
      { key: 'authorMeta', label: 'Author Info', type: 'text', placeholder: 'e.g., Born 1931 in Milan, Italy' },
      { key: 'seriesTitle', label: 'Series Title', type: 'text', defaultValue: 'Five phrases to live by:' },
      { key: 'seriesNumber', label: 'Series Number', type: 'number', defaultValue: 1 },
      { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., Design Philosophy' },
      { key: 'metaColumns', label: 'Metadata Columns', type: 'stringArray', placeholder: 'Additional metadata', helpText: 'Additional info displayed in grid' },
    ],
    defaultOptions: {
      quote: 'We like design to be visually powerful, intellectually elegant, and above all timeless.',
      emphasisPhrase: 'visually powerful, intellectually elegant.',
      author: 'Massimo Vignelli',
      authorMeta: 'Born 1931 in Milan, Italy',
      seriesTitle: 'Five phrases to live by:',
      seriesNumber: 1,
      topic: 'Design',
      metaColumns: [],
    },
  },

  'statement-poster': {
    id: 'statement-poster',
    name: 'Statement',
    description: 'Bold headline poster for thought leadership',
    fields: [
      { key: 'headline', label: 'Headline', type: 'textarea', required: true, placeholder: 'Enter headline text...', helpText: '50-80 characters, use \\n for line breaks' },
      { key: 'subheadline', label: 'Subheadline', type: 'text', placeholder: 'Optional supporting text', helpText: '60-100 characters' },
      { key: 'postNumber', label: 'Post Number', type: 'text', placeholder: 'e.g., 01 or Part 1' },
      { key: 'author', label: 'Author', type: 'text', placeholder: 'Your name' },
      { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g., Design Principles' },
      { key: 'headlineUppercase', label: 'Uppercase Headline', type: 'toggle', defaultValue: true },
      { key: 'headlineVariant', label: 'Headline Size', type: 'select', defaultValue: 'hero', options: [
        { value: 'hero', label: 'Hero (Largest)' },
        { value: 'display', label: 'Display' },
        { value: 'headline', label: 'Headline' },
      ]},
      { key: 'accentBox', label: 'Accent Box', type: 'object', helpText: 'Optional highlighted callout box', properties: [
        { key: 'label', label: 'Label', type: 'text', placeholder: 'e.g., TIP' },
        { key: 'value', label: 'Value', type: 'text', placeholder: 'Box content' },
      ]},
    ],
    defaultOptions: {
      headline: 'Design is\nthinking\nmade visual',
      subheadline: 'Create beautiful Swiss-style posters',
      postNumber: '',
      author: 'Designer',
      topic: 'Design',
      headlineUppercase: true,
      headlineVariant: 'hero',
      accentBox: null,
    },
  },

  'typography-showcase': {
    id: 'typography-showcase',
    name: 'Typography',
    description: 'Large letterform showcase',
    fields: [
      { key: 'letter', label: 'Featured Letter', type: 'text', required: true, placeholder: 'Single character', helpText: 'One character only' },
      { key: 'fontName', label: 'Font Name', type: 'text', required: true, placeholder: 'e.g., Neue Haas' },
      { key: 'fontVariant', label: 'Font Variant', type: 'text', placeholder: 'e.g., Grotesk', defaultValue: 'Grotesk' },
      { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: 'swiss style', helpText: 'Appears in corners' },
      { key: 'titleWords', label: 'Title Words', type: 'stringArray', helpText: 'Words stacked vertically (first word is accent color)', defaultValue: ['swiss', 'typography', 'swiss'] },
      { key: 'bodyText', label: 'Body Text', type: 'textarea', placeholder: 'Description text...', helpText: 'Left column body text' },
      { key: 'showCharset', label: 'Show Character Set', type: 'toggle', defaultValue: true },
      { key: 'uppercaseChars', label: 'Uppercase Characters', type: 'textarea', defaultValue: 'ABCDEFGHIJKLMNOP\nQRSTUVWXYZ', helpText: 'Use \\n for line breaks' },
      { key: 'lowercaseChars', label: 'Lowercase Characters', type: 'textarea', defaultValue: 'abcdefghijklmnopqr\nstuvwxyz' },
      { key: 'symbolChars', label: 'Symbols/Numbers', type: 'textarea', defaultValue: '1234567890$?\n&%@!*()=' },
      { key: 'footerLeftPrimary', label: 'Footer Left Primary', type: 'text', defaultValue: 'typografie', helpText: 'Accent colored text' },
      { key: 'footerLeftSecondary', label: 'Footer Left Secondary', type: 'text', defaultValue: 'schweizer', helpText: 'Muted text' },
    ],
    defaultOptions: {
      letter: 'G',
      fontName: 'Neue Haas',
      fontVariant: 'Grotesk',
      tagline: 'swiss style',
      titleWords: ['swiss', 'typography', 'swiss'],
      bodyText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      showCharset: true,
      uppercaseChars: 'ABCDEFGHIJKLMNOP\nQRSTUVWXYZ',
      lowercaseChars: 'abcdefghijklmnopqr\nstuvwxyz',
      symbolChars: '1234567890$?\n&%@!*()=',
      footerLeftPrimary: 'typografie',
      footerLeftSecondary: 'schweizer',
    },
  },

  'hot-take-poster': {
    id: 'hot-take-poster',
    name: 'Hot Take',
    description: 'Contrarian statement for strong opinions',
    fields: [
      { key: 'prefix', label: 'Prefix', type: 'text', placeholder: 'e.g., UNPOPULAR OPINION:', defaultValue: 'UNPOPULAR OPINION:', helpText: 'Opening label' },
      { key: 'statement', label: 'Statement', type: 'textarea', required: true, placeholder: 'Your hot take...', helpText: '60-120 characters, provocative but professional' },
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Your handle' },
      { key: 'hashtag', label: 'Hashtag', type: 'text', placeholder: 'e.g., #Tech' },
    ],
    defaultOptions: {
      prefix: 'UNPOPULAR OPINION:',
      statement: 'Kubernetes is overkill for 90% of startups',
      author: 'nexo.sh',
      hashtag: '#Tech',
    },
  },

  'announcement-poster': {
    id: 'announcement-poster',
    name: 'Announcement',
    description: 'Article or launch announcement',
    fields: [
      { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'e.g., NEW POST', defaultValue: 'NEW POST' },
      { key: 'title', label: 'Title', type: 'textarea', required: true, placeholder: 'Article or launch title', helpText: '40-80 characters' },
      { key: 'teaser', label: 'Teaser', type: 'textarea', placeholder: 'Key insight that hooks readers', helpText: '50-100 characters' },
      { key: 'teaserPrefix', label: 'Teaser Prefix', type: 'text', defaultValue: '→', helpText: 'Symbol before teaser' },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'e.g., nexo.sh/microservices' },
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Your handle' },
      { key: 'authorPrefix', label: 'Author Prefix', type: 'text', defaultValue: '@', helpText: 'Symbol before author' },
    ],
    defaultOptions: {
      label: 'NEW POST',
      title: 'Why Microservices Are a Tax on Your Startup',
      teaser: "The hidden costs nobody talks about until it's too late",
      teaserPrefix: '→',
      url: 'nexo.sh/microservices',
      author: 'nexo.sh',
      authorPrefix: '@',
    },
  },

  'opera-poster': {
    id: 'opera-poster',
    name: 'Opera/Venue',
    description: 'Classic Swiss venue poster with geometric accents',
    fields: [
      { key: 'venueName', label: 'Venue Name', type: 'text', required: true, placeholder: 'e.g., Opernhaus Zürich' },
      { key: 'eventTitle', label: 'Event Title', type: 'text', required: true, placeholder: 'e.g., Die Zauberflöte', helpText: '20-50 characters' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'e.g., Oper von Wolfgang Amadeus Mozart', helpText: '30-60 characters' },
      { key: 'showAccentSquares', label: 'Show Accent Squares', type: 'toggle', defaultValue: true },
      { key: 'squareSize', label: 'Square Size (px)', type: 'number', defaultValue: 100 },
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: 'e.g., Premiere: 15. März 2024' },
      { key: 'metadataColumns', label: 'Metadata Columns', type: 'array', helpText: 'Additional info sections', itemSchema: [
        { key: 'label', label: 'Column Label', type: 'text', placeholder: 'e.g., Musikalische Leitung' },
        { key: 'items', label: 'Items', type: 'stringArray', placeholder: 'Names/values' },
      ]},
    ],
    defaultOptions: {
      venueName: 'Opernhaus Zürich',
      eventTitle: 'Die Zauberflöte',
      subtitle: 'Oper von Wolfgang Amadeus Mozart',
      showAccentSquares: true,
      squareSize: 100,
      footerText: 'Premiere: 15. März 2024',
      metadataColumns: [],
    },
  },

  'season-poster': {
    id: 'season-poster',
    name: 'Season Program',
    description: 'Red background poster with multiple event listings',
    fields: [
      { key: 'venueName', label: 'Venue Name', type: 'text', required: true, placeholder: 'e.g., Opernhaus Zürich' },
      { key: 'seasonTitle', label: 'Season Title', type: 'text', required: true, placeholder: 'e.g., Spielzeit 2024/25' },
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: 'Optional footer text' },
      { key: 'events', label: 'Events', type: 'array', required: true, helpText: 'Add 2-5 events', itemSchema: [
        { key: 'title', label: 'Event Title', type: 'text', required: true, placeholder: 'e.g., Tannhäuser' },
        { key: 'date', label: 'Date', type: 'text', required: true, placeholder: 'e.g., Samstag, 3. September' },
        { key: 'time', label: 'Time', type: 'text', required: true, placeholder: 'e.g., 19.00 Uhr' },
        { key: 'status', label: 'Status', type: 'text', placeholder: 'e.g., Neuinszenierung' },
        { key: 'description', label: 'Description', type: 'text', placeholder: 'Brief description' },
      ]},
    ],
    defaultOptions: {
      venueName: 'Opernhaus Zürich',
      seasonTitle: 'Eröffnung der Spielzeit 2024/25',
      footerText: '',
      events: [
        { title: 'Tannhäuser', date: 'Samstag, 3. September', time: '19.00 Uhr', status: 'Neuinszenierung', description: 'Richard Wagner' },
        { title: 'La Traviata', date: 'Sonntag, 4. September', time: '18.00 Uhr', status: '', description: 'Giuseppe Verdi' },
      ],
    },
  },

  'feature-showcase': {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    description: 'Giant keyword poster with info sections',
    fields: [
      { key: 'keyword', label: 'Keyword', type: 'text', required: true, placeholder: 'e.g., GRIDS', helpText: '4-10 characters, single impactful word' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'e.g., Unlock the Power of Grids' },
      { key: 'keywordSize', label: 'Keyword Size', type: 'text', defaultValue: '200px', placeholder: 'e.g., 200px or 15vw' },
      { key: 'lowercase', label: 'Lowercase Keyword', type: 'toggle', defaultValue: false },
      { key: 'showBottomBar', label: 'Show Bottom Bar', type: 'toggle', defaultValue: true },
      { key: 'topRight', label: 'Top Right Section', type: 'object', helpText: 'Info block in top-right corner', properties: [
        { key: 'icon', label: 'Icon', type: 'select', options: markerIconOptions, defaultValue: 'square' },
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Section title', helpText: '20-50 characters' },
        { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Section content', helpText: '50-100 characters' },
      ]},
      { key: 'bottomLeft', label: 'Bottom Left Section', type: 'object', helpText: 'Info block in bottom-left corner', properties: [
        { key: 'icon', label: 'Icon', type: 'select', options: markerIconOptions, defaultValue: 'square' },
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Section title' },
        { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Section content' },
      ]},
      { key: 'bottomRight', label: 'Bottom Right Section', type: 'object', helpText: 'Info block in bottom-right corner', properties: [
        { key: 'icon', label: 'Icon', type: 'select', options: markerIconOptions, defaultValue: 'square' },
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Section title' },
        { key: 'body', label: 'Body', type: 'textarea', placeholder: 'Section content' },
      ]},
    ],
    defaultOptions: {
      keyword: 'GRIDS',
      subtitle: 'Unlock the Power of Grids: Structure Meets Creativity',
      keywordSize: '200px',
      lowercase: false,
      showBottomBar: true,
      topRight: { icon: 'square', title: 'PRECISION', body: 'Every element aligned to a mathematical grid system' },
      bottomLeft: { icon: 'triangle', title: 'FLEXIBILITY', body: 'Adaptable layouts for any content type' },
      bottomRight: { icon: 'circle', title: 'HARMONY', body: 'Visual balance through systematic spacing' },
    },
  },
};

export function getPresetSchema(presetId: string): PresetSchema | undefined {
  return presetSchemas[presetId];
}

export function getPresetIds(): string[] {
  return Object.keys(presetSchemas);
}
