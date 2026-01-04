/**
 * Preset Field Schemas
 * Defines editable fields for each preset type
 */

/**
 * Field types supported by the editor
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'toggle'
  | 'array'
  | 'stringArray'
  | 'object';

/**
 * Schema for a single editable field
 */
export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  /** For 'select' type */
  options?: Array<{ value: string; label: string }>;
  /** For 'array' type - schema for each item */
  itemSchema?: FieldSchema[];
  /** For 'object' type - schema for nested properties */
  properties?: FieldSchema[];
}

/**
 * Schema for a preset type
 */
export interface PresetSchema {
  id: string;
  name: string;
  description: string;
  fields: FieldSchema[];
  defaultOptions: Record<string, unknown>;
}

/**
 * All preset schemas
 */
export const presetSchemas: Record<string, PresetSchema> = {
  'vignelli-quote': {
    id: 'vignelli-quote',
    name: 'Vignelli Quote',
    description: 'Quote poster with emphasis phrase',
    fields: [
      {
        key: 'quote',
        label: 'Quote',
        type: 'textarea',
        required: true,
        placeholder: 'Enter the full quote text...',
        helpText: 'The complete quote that will be displayed',
      },
      {
        key: 'emphasisPhrase',
        label: 'Emphasis Phrase',
        type: 'text',
        required: true,
        placeholder: 'Key phrase to emphasize',
        helpText: 'This phrase will be displayed larger below the quote',
      },
      {
        key: 'author',
        label: 'Author',
        type: 'text',
        required: true,
        placeholder: 'Author name',
      },
      {
        key: 'authorMeta',
        label: 'Author Info',
        type: 'text',
        placeholder: 'e.g., Born 1931 in Milan, Italy',
        helpText: 'Additional info about the author',
      },
      {
        key: 'seriesTitle',
        label: 'Series Title',
        type: 'text',
        defaultValue: 'Five phrases to live by:',
      },
      {
        key: 'seriesNumber',
        label: 'Series Number',
        type: 'number',
        defaultValue: 1,
      },
      {
        key: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'e.g., Design Philosophy',
      },
      {
        key: 'metaColumns',
        label: 'Metadata Columns',
        type: 'stringArray',
        placeholder: 'Column text',
        helpText: 'Additional metadata displayed as columns (max 4)',
      },
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
    description: 'Simple headline poster',
    fields: [
      {
        key: 'headline',
        label: 'Headline',
        type: 'textarea',
        required: true,
        placeholder: 'Enter headline text...',
        helpText: 'Use line breaks for multi-line headlines',
      },
      {
        key: 'subheadline',
        label: 'Subheadline',
        type: 'text',
        placeholder: 'Optional supporting text',
      },
      {
        key: 'postNumber',
        label: 'Post Number',
        type: 'text',
        placeholder: 'e.g., 01 or Part 1',
        helpText: 'Series/post number displayed as label',
      },
      {
        key: 'author',
        label: 'Author',
        type: 'text',
        placeholder: 'Your name',
      },
      {
        key: 'topic',
        label: 'Topic',
        type: 'text',
        placeholder: 'e.g., Design Principles',
      },
      {
        key: 'headlineUppercase',
        label: 'Uppercase Headline',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Transform headline to uppercase',
      },
      {
        key: 'accentBox',
        label: 'Accent Box',
        type: 'object',
        helpText: 'Optional highlighted value box',
        properties: [
          {
            key: 'value',
            label: 'Value',
            type: 'text',
            placeholder: 'e.g., 42%',
          },
          {
            key: 'label',
            label: 'Label',
            type: 'text',
            placeholder: 'e.g., Success Rate',
          },
        ],
      },
    ],
    defaultOptions: {
      headline: 'Design is\nthinking\nmade visual',
      subheadline: 'Create beautiful Swiss-style posters',
      postNumber: '',
      author: 'Designer',
      topic: 'Design',
      headlineUppercase: true,
      accentBox: { value: '', label: '' },
    },
  },

  'typography-showcase': {
    id: 'typography-showcase',
    name: 'Typography',
    description: 'Large letterform showcase',
    fields: [
      {
        key: 'letter',
        label: 'Featured Letter',
        type: 'text',
        required: true,
        placeholder: 'Single character',
        helpText: 'The letter displayed as hero element',
      },
      {
        key: 'fontName',
        label: 'Font Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Neue Haas',
      },
      {
        key: 'fontVariant',
        label: 'Font Variant',
        type: 'text',
        placeholder: 'e.g., Grotesk',
      },
      {
        key: 'tagline',
        label: 'Tagline',
        type: 'text',
        defaultValue: 'swiss style',
      },
      {
        key: 'titleWords',
        label: 'Title Words',
        type: 'stringArray',
        placeholder: 'Word',
        helpText: 'Stacked title words displayed vertically',
      },
      {
        key: 'bodyText',
        label: 'Body Text',
        type: 'textarea',
        placeholder: 'Description text in left column',
        helpText: 'Optional body text displayed below font info',
      },
      {
        key: 'showCharset',
        label: 'Show Character Set',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Display alphabet and numbers',
      },
    ],
    defaultOptions: {
      letter: 'G',
      fontName: 'Neue Haas',
      fontVariant: 'Grotesk',
      tagline: 'swiss style',
      titleWords: ['swiss', 'typography', 'swiss'],
      bodyText: '',
      showCharset: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // NEW TEMPLATES
  // ═══════════════════════════════════════════════════════════════

  'hot-take-poster': {
    id: 'hot-take-poster',
    name: 'Hot Take',
    description: 'Contrarian statement for strong opinions',
    fields: [
      {
        key: 'prefix',
        label: 'Prefix',
        type: 'text',
        placeholder: 'e.g., UNPOPULAR OPINION:',
        defaultValue: 'UNPOPULAR OPINION:',
        helpText: 'Label shown above the statement',
      },
      {
        key: 'statement',
        label: 'Statement',
        type: 'textarea',
        required: true,
        placeholder: 'Your hot take...',
        helpText: 'The main controversial statement',
      },
      {
        key: 'author',
        label: 'Author',
        type: 'text',
        required: true,
        placeholder: 'Your handle',
      },
      {
        key: 'hashtag',
        label: 'Hashtag',
        type: 'text',
        placeholder: 'e.g., #Tech',
      },
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
      {
        key: 'label',
        label: 'Label',
        type: 'text',
        required: true,
        placeholder: 'e.g., NEW POST',
        defaultValue: 'NEW POST',
      },
      {
        key: 'title',
        label: 'Title',
        type: 'textarea',
        required: true,
        placeholder: 'Article or launch title',
      },
      {
        key: 'teaser',
        label: 'Teaser',
        type: 'textarea',
        placeholder: 'Key insight that hooks readers',
      },
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        placeholder: 'e.g., nexo.sh/microservices',
      },
      {
        key: 'author',
        label: 'Author',
        type: 'text',
        required: true,
        placeholder: 'Your handle',
      },
    ],
    defaultOptions: {
      label: 'NEW POST',
      title: 'Why Microservices Are a Tax on Your Startup',
      teaser: 'The hidden costs nobody talks about until it\'s too late',
      url: 'nexo.sh/microservices',
      author: 'nexo.sh',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // REFS2 TEMPLATES
  // ═══════════════════════════════════════════════════════════════

  'opera-poster': {
    id: 'opera-poster',
    name: 'Opera/Venue',
    description: 'Classic Swiss venue poster with geometric accents',
    fields: [
      {
        key: 'venueName',
        label: 'Venue Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Opernhaus Zürich',
      },
      {
        key: 'eventTitle',
        label: 'Event Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Die Zauberflöte',
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'e.g., Oper von Wolfgang Amadeus Mozart',
      },
      {
        key: 'showAccentSquares',
        label: 'Show Accent Squares',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Geometric squares flanking the title',
      },
      {
        key: 'footerText',
        label: 'Footer Text',
        type: 'text',
        placeholder: 'e.g., Premiere: 15. März 2024',
      },
      {
        key: 'metadataColumns',
        label: 'Metadata Columns',
        type: 'array',
        helpText: 'Information columns displayed in header (max 4)',
        itemSchema: [
          {
            key: 'label',
            label: 'Label',
            type: 'text',
            placeholder: 'Column label',
          },
          {
            key: 'items',
            label: 'Items',
            type: 'stringArray',
            placeholder: 'Item text',
          },
        ],
      },
    ],
    defaultOptions: {
      venueName: 'Opernhaus Zürich',
      eventTitle: 'Die Zauberflöte',
      subtitle: 'Oper von Wolfgang Amadeus Mozart',
      showAccentSquares: true,
      footerText: 'Premiere: 15. März 2024',
      metadataColumns: [],
    },
  },

  'season-poster': {
    id: 'season-poster',
    name: 'Season Program',
    description: 'Red background poster with multiple event listings',
    fields: [
      {
        key: 'venueName',
        label: 'Venue Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Opernhaus Zürich',
      },
      {
        key: 'seasonTitle',
        label: 'Season Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Eröffnung der Spielzeit 1966/67',
      },
      {
        key: 'footerText',
        label: 'Footer Text',
        type: 'text',
        placeholder: 'Optional footer text',
      },
      {
        key: 'events',
        label: 'Events',
        type: 'array',
        helpText: 'List of events in the season program',
        itemSchema: [
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            required: true,
            placeholder: 'Event title',
          },
          {
            key: 'date',
            label: 'Date',
            type: 'text',
            required: true,
            placeholder: 'e.g., Samstag, 3. September',
          },
          {
            key: 'time',
            label: 'Time',
            type: 'text',
            required: true,
            placeholder: 'e.g., 19.00 Uhr',
          },
          {
            key: 'status',
            label: 'Status',
            type: 'text',
            placeholder: 'e.g., Neuinszenierung',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Event description',
          },
        ],
      },
    ],
    defaultOptions: {
      venueName: 'Opernhaus Zürich',
      seasonTitle: 'Eröffnung der Spielzeit 1966/67',
      events: [
        {
          title: 'Tannhäuser',
          date: 'Samstag, 3. September',
          time: '19.00 Uhr',
          status: 'Neuinszenierung',
          description: 'Romantische Oper von Richard Wagner',
          credits: [
            { role: 'Musikalische Leitung', name: 'Christian Vöchting' },
            { role: 'Inszenierung', name: 'Hans Hotter' },
          ],
        },
        {
          title: 'Bluthochzeit',
          date: 'Mittwoch, 7. September',
          time: '20.00 Uhr',
          status: 'Erstaufführung',
          description: 'Lyrische Tragödie von Federico García Lorca',
        },
      ],
    },
  },

  'feature-showcase': {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    description: 'Giant keyword poster with info sections',
    fields: [
      {
        key: 'keyword',
        label: 'Keyword',
        type: 'text',
        required: true,
        placeholder: 'e.g., GRIDS',
        helpText: 'The giant featured word',
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        type: 'textarea',
        placeholder: 'e.g., Unlock the Power of Grids',
      },
      {
        key: 'lowercase',
        label: 'Lowercase Keyword',
        type: 'toggle',
        defaultValue: false,
        helpText: 'Display keyword in lowercase',
      },
      {
        key: 'showBottomBar',
        label: 'Show Bottom Bar',
        type: 'toggle',
        defaultValue: true,
        helpText: 'Accent bar at the bottom',
      },
      {
        key: 'topRight',
        label: 'Top Right Section',
        type: 'object',
        helpText: 'Info section displayed in top right',
        properties: [
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: [
              { value: 'triangle', label: 'Triangle' },
              { value: 'double-triangle', label: 'Double Triangle' },
              { value: 'L', label: 'L Shape' },
              { value: 'square', label: 'Square' },
              { value: 'circle', label: 'Circle' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Section title',
          },
          {
            key: 'body',
            label: 'Body',
            type: 'textarea',
            placeholder: 'Section body text',
          },
        ],
      },
      {
        key: 'bottomLeft',
        label: 'Bottom Left Section',
        type: 'object',
        helpText: 'Info section displayed in bottom left',
        properties: [
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: [
              { value: 'triangle', label: 'Triangle' },
              { value: 'double-triangle', label: 'Double Triangle' },
              { value: 'L', label: 'L Shape' },
              { value: 'square', label: 'Square' },
              { value: 'circle', label: 'Circle' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Section title',
          },
          {
            key: 'body',
            label: 'Body',
            type: 'textarea',
            placeholder: 'Section body text',
          },
        ],
      },
      {
        key: 'bottomRight',
        label: 'Bottom Right Section',
        type: 'object',
        helpText: 'Info section displayed in bottom right',
        properties: [
          {
            key: 'icon',
            label: 'Icon',
            type: 'select',
            options: [
              { value: 'triangle', label: 'Triangle' },
              { value: 'double-triangle', label: 'Double Triangle' },
              { value: 'L', label: 'L Shape' },
              { value: 'square', label: 'Square' },
              { value: 'circle', label: 'Circle' },
              { value: 'none', label: 'None' },
            ],
          },
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Section title',
          },
          {
            key: 'body',
            label: 'Body',
            type: 'textarea',
            placeholder: 'Section body text',
          },
        ],
      },
    ],
    defaultOptions: {
      keyword: 'GRIDS',
      subtitle: 'Unlock the Power of Grids: Structure Meets Creativity',
      lowercase: false,
      showBottomBar: true,
      topRight: {
        icon: 'triangle',
        title: 'GET INSPIRED',
        body: 'Explore how grids can elevate your work and inspire innovation across disciplines.',
      },
      bottomLeft: {
        icon: 'L',
        title: 'APPLICATIONS EVERYWHERE',
        body: 'Whether you are crafting a brand, designing an app, or building a city, grids keep things aligned.',
      },
      bottomRight: {
        icon: 'double-triangle',
        title: 'WHY GRIDS MATTER?',
        body: 'They guide your creativity without limiting it, ensuring precision and harmony in every project.',
      },
    },
  },
};

/**
 * Get schema for a preset
 */
export function getPresetSchema(presetId: string): PresetSchema | undefined {
  return presetSchemas[presetId];
}

/**
 * Get all preset IDs
 */
export function getPresetIds(): string[] {
  return Object.keys(presetSchemas);
}
