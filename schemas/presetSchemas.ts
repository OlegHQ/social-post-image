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
      { key: 'showAccentBox', label: 'Show Accent Box', type: 'toggle', defaultValue: true, helpText: 'Toggle visibility of accent box' },
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
      showAccentBox: true,
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
      bodyText: '',
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

  'showcase-poster': {
    id: 'showcase-poster',
    name: 'Showcase',
    description: 'Bold poster with primary/secondary headings and info columns',
    fields: [
      { key: 'primaryHeading', label: 'Primary Heading', type: 'text', required: true, placeholder: 'e.g., DESIGN SYSTEMS', helpText: 'Large hero text, 20-40 characters' },
      { key: 'secondaryHeading', label: 'Secondary Heading', type: 'text', required: true, placeholder: 'e.g., Building for Scale', helpText: 'Prominent subtitle, 20-50 characters' },
      { key: 'supportingText', label: 'Supporting Text', type: 'text', placeholder: 'Optional body text', helpText: '30-80 characters' },
      { key: 'showAccentSquares', label: 'Show Accent Squares', type: 'toggle', defaultValue: true },
      { key: 'squareSize', label: 'Square Size (px)', type: 'number', defaultValue: 100 },
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: 'Optional footer text' },
      { key: 'infoColumns', label: 'Info Columns', type: 'array', helpText: 'Additional info sections (up to 4)', itemSchema: [
        { key: 'heading', label: 'Column Heading', type: 'text', placeholder: 'e.g., Key Benefits' },
        { key: 'items', label: 'Items', type: 'stringArray', placeholder: 'Bullet points' },
      ]},
    ],
    defaultOptions: {
      primaryHeading: 'DESIGN SYSTEMS',
      secondaryHeading: 'Building for Scale',
      supportingText: 'A systematic approach to product design',
      showAccentSquares: true,
      squareSize: 100,
      footerText: '',
      infoColumns: [],
    },
  },

  'content-grid-poster': {
    id: 'content-grid-poster',
    name: 'Content Grid',
    description: 'Bold poster with content blocks in 2-column grid layout',
    fields: [
      { key: 'brandName', label: 'Brand Name', type: 'text', required: true, placeholder: 'e.g., DESIGN TIPS', helpText: 'Organization or series name' },
      { key: 'sectionTitle', label: 'Section Title', type: 'text', required: true, placeholder: 'e.g., Best Practices', helpText: 'Section header' },
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: 'Optional footer text' },
      { key: 'contentBlocks', label: 'Content Blocks', type: 'array', required: true, helpText: 'Add 2-5 content blocks', itemSchema: [
        { key: 'title', label: 'Block Title', type: 'text', required: true, placeholder: 'e.g., Start with Typography', helpText: '20-40 characters' },
        { key: 'shortLabel', label: 'Short Label', type: 'text', placeholder: 'e.g., TIP 01', helpText: 'Left column short text' },
        { key: 'subLabel', label: 'Sub Label', type: 'text', placeholder: 'e.g., Fundamentals', helpText: 'Left column secondary text' },
        { key: 'badge', label: 'Badge', type: 'text', placeholder: 'e.g., Essential', helpText: 'Optional status badge' },
        { key: 'description', label: 'Description', type: 'text', placeholder: 'Main description text', helpText: 'Right column text, 40-80 characters' },
        { key: 'attribution', label: 'Attribution', type: 'text', placeholder: 'e.g., Swiss Design Fundamentals', helpText: 'Credit or source line' },
      ]},
    ],
    defaultOptions: {
      brandName: 'DESIGN TIPS',
      sectionTitle: 'Best Practices',
      footerText: '',
      contentBlocks: [
        { title: 'Start with Typography', shortLabel: 'TIP 01', description: 'Choose your typeface first, everything else follows', attribution: 'Swiss Design Fundamentals' },
        { title: 'Embrace White Space', shortLabel: 'TIP 02', description: 'Let your content breathe with generous margins', attribution: 'Grid Systems' },
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

  // ============================================
  // New presets from refs3 designs
  // ============================================

  'minimal-quote': {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    description: 'Simple quote with explanation (Dieter Rams style)',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, placeholder: 'Enter the quote text...', helpText: 'Main quote text' },
      { key: 'explanation', label: 'Explanation', type: 'textarea', placeholder: 'Explanation of the quote', helpText: 'Additional context' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g., Back to purity, Back to simplicity.' },
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Author name' },
      { key: 'authorPrefix', label: 'Author Prefix', type: 'text', defaultValue: '~', placeholder: 'e.g., ~ or —' },
      { key: 'brand', label: 'Brand', type: 'text', placeholder: 'Footer brand name' },
      { key: 'showIcon', label: 'Show Icon', type: 'toggle', defaultValue: true, helpText: 'Display decorative icon' },
    ],
    defaultOptions: {
      quote: 'Good design is as little design as possible.',
      explanation: 'Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials.',
      tagline: 'Back to purity, Back to simplicity.',
      author: 'Dieter Rams',
      authorPrefix: '~',
      brand: 'STARTUPVITAMINS',
      showIcon: true,
    },
  },

  'paragraph-quote': {
    id: 'paragraph-quote',
    name: 'Paragraph Quote',
    description: 'Multi-paragraph quote (Müller-Brockmann style)',
    fields: [
      { key: 'paragraphs', label: 'Paragraphs', type: 'stringArray', required: true, placeholder: 'Add quote paragraphs', helpText: 'Each paragraph as separate entry' },
      { key: 'paragraphGap', label: 'Paragraph Gap', type: 'select', defaultValue: 'medium', options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ]},
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Author name' },
      { key: 'authorPrefix', label: 'Author Prefix', type: 'text', defaultValue: '—', placeholder: 'e.g., — or -' },
      { key: 'cornerText', label: 'Corner Text', type: 'text', placeholder: 'Small corner attribution' },
      { key: 'showGridLines', label: 'Show Grid Lines', type: 'toggle', defaultValue: false, helpText: 'Decorative grid overlay' },
    ],
    defaultOptions: {
      paragraphs: [
        'The grid system is an aid, not a guarantee.',
        'It permits a number of possible uses and each designer can look for a solution appropriate to his personal style.',
        'But one must learn how to use the grid; it is an art that requires practice.',
      ],
      paragraphGap: 'medium',
      author: 'Josef Müller-Brockmann',
      authorPrefix: '—',
      cornerText: '',
      showGridLines: false,
    },
  },

  'split-word': {
    id: 'split-word',
    name: 'Split Word',
    description: 'Giant word split across lines (Vignelli tribute)',
    fields: [
      { key: 'url', label: 'URL', type: 'text', placeholder: 'Top URL text' },
      { key: 'wordPart1', label: 'Word Part 1', type: 'text', required: true, placeholder: 'e.g., For' },
      { key: 'wordPart2', label: 'Word Part 2', type: 'text', required: true, placeholder: 'e.g., ever.' },
      { key: 'wordColor', label: 'Word Color', type: 'select', defaultValue: 'accent', options: [
        { value: 'foreground', label: 'Foreground' },
        { value: 'accent', label: 'Accent' },
      ]},
      { key: 'supportingQuote', label: 'Supporting Quote', type: 'textarea', placeholder: 'Quote below the word' },
      { key: 'bioColumns', label: 'Bio Columns', type: 'array', helpText: 'Footer bio columns (max 3)', itemSchema: [
        { key: 'primary', label: 'Primary', type: 'text', required: true },
        { key: 'secondary', label: 'Secondary', type: 'text' },
        { key: 'tertiary', label: 'Tertiary', type: 'text' },
      ]},
    ],
    defaultOptions: {
      url: 'thefutur.com',
      wordPart1: 'For',
      wordPart2: 'ever.',
      wordColor: 'accent',
      supportingQuote: 'If you do it right, it will last forever.',
      bioColumns: [
        { primary: 'Massimo Vignelli', secondary: '1931-2014' },
        { primary: 'Graphic Designer', secondary: 'Industrial Designer', tertiary: 'Architect' },
        { primary: 'Vignelli Associates', secondary: 'Unimark International' },
      ],
    },
  },

  'vignelli-enhanced': {
    id: 'vignelli-enhanced',
    name: 'Vignelli Enhanced',
    description: 'Advanced Vignelli-style quote with header columns and footer',
    fields: [
      { key: 'seriesTitle', label: 'Series Title', type: 'text', defaultValue: 'Five phrases to live by:' },
      { key: 'authorName', label: 'Author Name', type: 'text', defaultValue: 'Massimo Vignelli' },
      { key: 'headerColumns', label: 'Header Columns', type: 'stringArray', helpText: 'Up to 4 meta columns' },
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, placeholder: 'Full quote text' },
      { key: 'emphasisPhrase', label: 'Emphasis Phrase', type: 'text', required: true, placeholder: 'Key phrase to emphasize' },
      { key: 'quoteItalic', label: 'Italic Quote', type: 'toggle', defaultValue: true },
      { key: 'quoteVariant', label: 'Quote Size', type: 'select', defaultValue: 'subhead', options: [
        { value: 'subhead', label: 'Subhead' },
        { value: 'title', label: 'Title' },
      ]},
      { key: 'emphasisVariant', label: 'Emphasis Size', type: 'select', defaultValue: 'display', options: [
        { value: 'display', label: 'Display' },
        { value: 'hero', label: 'Hero' },
      ]},
      { key: 'bioColumns', label: 'Bio Columns', type: 'array', helpText: 'Footer bio columns', itemSchema: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'text', label: 'Text', type: 'text', required: true },
      ]},
      { key: 'seriesNumber', label: 'Series Number', type: 'number', defaultValue: 2 },
    ],
    defaultOptions: {
      seriesTitle: 'Five phrases to live by:',
      authorName: 'Massimo Vignelli',
      headerColumns: [
        'Vignelli-isms Poster series. In recognition of his outstanding contribution to the world of graphic design.',
        'On the evening of Tuesday, March 8, The Architectural League gave its President\'s Medal to Lella and Massimo Vignelli.',
        'In 1971, Massimo founded Vignelli Associates with his wife, Lella.',
        'Vignelli was involved with filmmaker Gary Hustwit in the documentary Helvetica.',
      ],
      quote: 'We like design to be visually powerful, intellectually elegant, and above all timeless.',
      emphasisPhrase: 'visually powerful, intellectually elegant.',
      quoteItalic: true,
      quoteVariant: 'subhead',
      emphasisVariant: 'display',
      bioColumns: [
        { title: 'Massimo Vignelli', text: 'Born 1931 in Milan, Italy. Vignelli Associates, co founded with wife Lella.' },
        { text: 'Vignelli works firmly within the Modernist tradition, and focuses on simplicity through the use of basic geometric forms in all of his work.' },
      ],
      seriesNumber: 2,
    },
  },

  'type-specimen': {
    id: 'type-specimen',
    name: 'Type Specimen',
    description: 'Font showcase with stacked typography',
    fields: [
      { key: 'fontFamily', label: 'Font Family', type: 'text', required: true, placeholder: 'e.g., Last' },
      { key: 'fontWeights', label: 'Font Weights', type: 'text', defaultValue: '10 weights + Italics' },
      { key: 'charset', label: 'Character Set', type: 'text', defaultValue: 'Latin Extended-A' },
      { key: 'releaseDate', label: 'Release Date', type: 'text', placeholder: 'e.g., Sept. 2025' },
      { key: 'stackedLines', label: 'Stacked Lines', type: 'stringArray', required: true, helpText: 'Typography showcase lines' },
      { key: 'lineSpacing', label: 'Line Spacing', type: 'select', defaultValue: 'tight', options: [
        { value: 'tight', label: 'Tight' },
        { value: 'normal', label: 'Normal' },
        { value: 'loose', label: 'Loose' },
      ]},
      { key: 'uppercase', label: 'Uppercase', type: 'toggle', defaultValue: true },
      { key: 'footerColumns', label: 'Footer Columns', type: 'array', itemSchema: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Value', type: 'text' },
      ]},
      { key: 'centerLogo', label: 'Center Logo', type: 'text', placeholder: 'Brand/logo text' },
    ],
    defaultOptions: {
      fontFamily: 'Last',
      fontWeights: '10 weights + Italics',
      charset: 'Latin Extended-A',
      releaseDate: 'Sept. 2025',
      stackedLines: ['RADIANCE', 'BASIC CHANNEL', '3 TRACKS', '30 MIN', '1994'],
      lineSpacing: 'tight',
      uppercase: true,
      footerColumns: [
        { label: 'Designed', value: 'by Tim Vanhille' },
        { label: 'Produced', value: 'by Overtype' },
      ],
      centerLogo: 'overtype',
    },
  },

  'manifesto-quotes': {
    id: 'manifesto-quotes',
    name: 'Manifesto + Quotes',
    description: 'Statement with supporting quotes grid',
    fields: [
      { key: 'statementLines', label: 'Statement Lines', type: 'stringArray', required: true, helpText: 'Each line of the statement' },
      { key: 'statementPunctuation', label: 'Punctuation', type: 'text', defaultValue: '.', placeholder: 'e.g., . or !' },
      { key: 'statementVariant', label: 'Statement Size', type: 'select', defaultValue: 'hero', options: [
        { value: 'hero', label: 'Hero' },
        { value: 'display', label: 'Display' },
        { value: 'headline', label: 'Headline' },
      ]},
      { key: 'supportingQuotes', label: 'Supporting Quotes', type: 'array', helpText: 'Quotes with attributions', itemSchema: [
        { key: 'quote', label: 'Quote', type: 'textarea', required: true },
        { key: 'author', label: 'Author', type: 'text', required: true },
      ]},
      { key: 'brandIcon', label: 'Brand Icon', type: 'text', placeholder: 'Icon character or symbol' },
    ],
    defaultOptions: {
      statementLines: ['Stay', 'Simple', 'Stay', 'True'],
      statementPunctuation: '.',
      statementVariant: 'hero',
      supportingQuotes: [
        { quote: 'Everything should be made as simple as possible, but not simpler.', author: 'Albert Einstein' },
        { quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
        { quote: 'Simply the thing that I am shall make me live.', author: 'William Shakespeare' },
      ],
      brandIcon: '◼',
    },
  },

  'numbered-principles': {
    id: 'numbered-principles',
    name: 'Numbered Principles',
    description: 'Editorial numbered list (Dieter Rams style)',
    fields: [
      { key: 'titleBold', label: 'Title Bold', type: 'text', required: true, placeholder: 'e.g., Good' },
      { key: 'titleRegular', label: 'Title Regular', type: 'text', required: true, placeholder: 'e.g., design is' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'e.g., Ten Principles of good design :' },
      { key: 'subtitleMeta', label: 'Subtitle Meta', type: 'text', placeholder: 'e.g., From Dieter Rams' },
      { key: 'principles', label: 'Principles', type: 'array', required: true, helpText: 'Numbered principles list', itemSchema: [
        { key: 'number', label: 'Number', type: 'number', required: true },
        { key: 'keyword', label: 'Keyword', type: 'text', required: true },
        { key: 'explanation', label: 'Explanation', type: 'textarea', required: true },
        { key: 'translation', label: 'Translation', type: 'text' },
      ]},
      { key: 'taglineBold', label: 'Tagline Bold', type: 'text', placeholder: 'e.g., Less' },
      { key: 'taglineAccent', label: 'Tagline Accent', type: 'text', placeholder: 'e.g., and More' },
      { key: 'footerMeta', label: 'Footer Meta', type: 'text', placeholder: 'Designer credit' },
    ],
    defaultOptions: {
      titleBold: 'Good',
      titleRegular: 'design is',
      subtitle: 'Ten Principles of good design :',
      subtitleMeta: 'From Dieter Rams',
      principles: [
        { number: 1, keyword: 'innovate', explanation: 'Good design is innovative. The possibilities for innovation are not exhausted.', translation: '좋은 디자인은 혁신적이다' },
        { number: 2, keyword: 'useful', explanation: 'Good design makes a product useful. A product is bought to be used.', translation: '좋은 디자인은 제품을 유용하게 한다' },
        { number: 3, keyword: 'aesthetic', explanation: 'Good design is aesthetic. The aesthetic quality of a product is integral.', translation: '좋은 디자인은 아름답다' },
      ],
      taglineBold: 'Less',
      taglineAccent: 'and More',
      footerMeta: 'Poster design by Myungjoo Shin',
    },
  },

  'two-tone-quote': {
    id: 'two-tone-quote',
    name: 'Two-Tone Quote',
    description: 'Quote with alternating word colors (Tufte style)',
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, placeholder: 'Enter quote text (use line breaks)', helpText: 'Use Enter/newline to break lines' },
      { key: 'highlightedWords', label: 'Highlighted Words', type: 'stringArray', required: true, helpText: 'Words to display in accent color (white)' },
      { key: 'author', label: 'Author', type: 'text', required: true, placeholder: 'Author name' },
      { key: 'authorItalic', label: 'Author Italic', type: 'toggle', defaultValue: true },
      { key: 'edgeText', label: 'Edge Text', type: 'text', placeholder: 'Small text at bottom' },
    ],
    defaultOptions: {
      quote: 'Good design\nis a lot like\nclear thinking\nmade visual.',
      highlightedWords: ['design', 'like', 'clear', 'visual'],
      author: 'Edward Tufte',
      authorItalic: true,
      edgeText: '© 2010 Bibliotheca Alexandrina - Graphics Unit',
    },
  },

  'split-statement': {
    id: 'split-statement',
    name: 'Split Statement',
    description: 'Diagonal text flow with framed card (Empatia style)',
    fields: [
      { key: 'topLines', label: 'Top Lines', type: 'stringArray', required: true, helpText: 'Lines in top-left corner' },
      { key: 'topInlineWord', label: 'Top Inline Word', type: 'text', placeholder: 'Small word after last line' },
      { key: 'bottomWord', label: 'Bottom Word', type: 'text', required: true, placeholder: 'Large word bottom-right' },
      { key: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'Footer brand' },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'Footer URL' },
      { key: 'framePadding', label: 'Frame Padding', type: 'number', defaultValue: 40 },
      { key: 'cardPadding', label: 'Card Padding', type: 'number', defaultValue: 60 },
    ],
    defaultOptions: {
      topLines: ['We', 'want', 'more', 'fucking'],
      topInlineWord: 'good',
      bottomWord: 'design.',
      brandName: 'empatía.',
      url: 'helloempatia.com',
      framePadding: 40,
      cardPadding: 60,
    },
  },
};

export function getPresetSchema(presetId: string): PresetSchema | undefined {
  return presetSchemas[presetId];
}

export function getPresetIds(): string[] {
  return Object.keys(presetSchemas);
}
