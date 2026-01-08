/**
 * Template Specifications for LLM Configuration Generation
 *
 * This file provides comprehensive documentation for each poster template,
 * enabling LLMs to generate proper JSON configurations for LinkedIn posts.
 *
 * Each spec includes:
 * - Template purpose and best use cases
 * - Field descriptions with character limits
 * - Example configurations
 * - Tips for optimal content
 */

import type { ThemePreset } from '@/lib/types';

// =============================================================================
// Type Definitions
// =============================================================================

export interface FieldGuide {
  description: string;
  maxChars?: number;
  minChars?: number;
  examples?: string[];
  tips?: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: unknown;
}

export interface TemplateSpec {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  linkedInContext: string;
  fieldGuides: Record<string, FieldGuide>;
  exampleConfig: Record<string, unknown>;
  designNotes: string[];
}

// =============================================================================
// Available Themes Reference
// =============================================================================

export const themeReference: Record<ThemePreset, { description: string; mood: string }> = {
  'swiss-red': { description: 'Classic Swiss design with red accent on light gray', mood: 'professional, bold' },
  'swiss-red-inverted': { description: 'Red background with light text', mood: 'urgent, attention-grabbing' },
  'klein-blue': { description: 'International style with Yves Klein blue', mood: 'creative, artistic' },
  'monochrome': { description: 'Pure black and white', mood: 'minimal, serious' },
  'vignelli-gold': { description: 'Dark background with gold accent (Vignelli tribute)', mood: 'premium, wisdom' },
  'vignelli-cream': { description: 'Cream background with crimson accent', mood: 'elegant, classic' },
  'neue-teal': { description: 'Teal background with coral accent', mood: 'modern, typographic' },
  'orange-energy': { description: 'Warm white with vibrant orange', mood: 'energetic, innovative' },
  'rams-warm': { description: 'Warm cream with brown tones (Dieter Rams style)', mood: 'functional, timeless' },
  'rams-brown': { description: 'Brown/tan with orange accent', mood: 'editorial, classic' },
  'neon-green': { description: 'Dark background with neon green', mood: 'tech, modern' },
  'tufte-blue': { description: 'Deep blue with white accent', mood: 'intellectual, refined' },
  'empatia-mint': { description: 'Mint green with dark text', mood: 'fresh, playful' },
};

// =============================================================================
// Template Specifications
// =============================================================================

export const templateSpecs: Record<string, TemplateSpec> = {
  // ---------------------------------------------------------------------------
  // Statement Poster
  // ---------------------------------------------------------------------------
  'statement-poster': {
    id: 'statement-poster',
    name: 'Statement Poster',
    description: 'A bold, simple poster featuring a powerful headline with optional supporting text. The headline dominates the design, making it ideal for strong statements and thought leadership.',
    bestFor: [
      'Bold professional statements',
      'Thought leadership content',
      'Key takeaways from articles',
      'Announcement headlines',
      'Motivational messages',
    ],
    linkedInContext: 'Use when you want to make a single powerful point that stops the scroll. Works well for sharing insights, lessons learned, or professional opinions that can be expressed in one impactful sentence.',
    fieldGuides: {
      headline: {
        description: 'The main statement text. Use \\n for line breaks to control text flow.',
        minChars: 10,
        maxChars: 80,
        examples: [
          'THE BEST CODE\\nIS NO CODE',
          'SHIP FAST\\nLEARN FASTER',
          'DESIGN IS\\nNOT ART',
        ],
        tips: 'Break into 2-3 lines for visual impact. Each line should be 3-5 words max. Use strong, active verbs.',
        required: true,
        type: 'string',
      },
      subheadline: {
        description: 'Supporting text that adds context or elaborates on the headline.',
        maxChars: 120,
        examples: [
          'Every line of code is a liability. Focus on solving problems, not writing code.',
          'The best products are built by teams who embrace failure as learning.',
        ],
        tips: 'Keep it conversational. This is where you can add nuance to your bold headline.',
        required: false,
        type: 'string',
      },
      postNumber: {
        description: 'Series identifier displayed at the top.',
        maxChars: 15,
        examples: ['001', 'NO. 12', 'PART 3/5'],
        tips: 'Use for content series to build anticipation.',
        required: false,
        type: 'string',
      },
      author: {
        description: 'Your name or handle displayed in the footer.',
        maxChars: 30,
        examples: ['John Smith', '@designlead', 'Sarah Chen, CEO'],
        required: false,
        type: 'string',
      },
      topic: {
        description: 'Topic label displayed opposite the author.',
        maxChars: 25,
        examples: ['LEADERSHIP', 'DESIGN', 'ENGINEERING', 'CAREER'],
        tips: 'Use a single word or short phrase. Will be displayed in muted color.',
        required: false,
        type: 'string',
      },
      accentBox: {
        description: 'Colored box in bottom-right with label and value. Great for stats or CTAs.',
        type: 'object',
        examples: [
          '{ "label": "LEARN MORE", "value": "link.to/post" }',
          '{ "value": "READ →" }',
          '{ "label": "IMPACT", "value": "10X" }',
        ],
        tips: 'Use sparingly. The value should be short and punchy (1-4 chars for numbers, 10-20 chars for text).',
        required: false,
      },
      showAccentBox: {
        description: 'Whether to display the accent box (only if accentBox data is provided).',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      headlineVariant: {
        description: 'Typography size for headline.',
        examples: ['hero', 'display', 'headline'],
        defaultValue: 'hero',
        tips: 'Use "hero" (120px) for short headlines, "display" (90px) for longer ones.',
        required: false,
        type: 'string',
      },
      headlineUppercase: {
        description: 'Whether headline should be uppercase.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      theme: {
        description: 'Color theme for the poster.',
        examples: ['swiss-red', 'monochrome', 'klein-blue'],
        defaultValue: 'swiss-red',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      headline: 'SIMPLICITY\\nIS THE\\nULTIMATE\\nSOPHISTICATION',
      subheadline: 'The best solutions look obvious in hindsight.',
      author: '@designlead',
      topic: 'DESIGN',
      theme: 'swiss-red',
    },
    designNotes: [
      'Headline should be the hero - keep supporting text minimal',
      'Use line breaks strategically for rhythm and impact',
      'The accentBox works best for single stats or short CTAs',
    ],
  },

  // ---------------------------------------------------------------------------
  // Vignelli Quote
  // ---------------------------------------------------------------------------
  'vignelli-quote': {
    id: 'vignelli-quote',
    name: 'Vignelli Quote',
    description: 'A quote poster inspired by Massimo Vignelli\'s design philosophy. Features a full quote with one phrase emphasized in large accent text. Perfect for sharing wisdom and attributed sayings.',
    bestFor: [
      'Sharing quotes from experts or thought leaders',
      'Highlighting wisdom from books or talks',
      'Attributed professional insights',
      'Content series with numbered entries',
      'Design or philosophy quotes',
    ],
    linkedInContext: 'Ideal for sharing memorable quotes from conferences, books, mentors, or your own insights. The emphasis phrase draws attention to the key takeaway.',
    fieldGuides: {
      quote: {
        description: 'The full quote text. Should contain the emphasisPhrase as a substring.',
        minChars: 50,
        maxChars: 250,
        examples: [
          'The life of a designer is a life of fight: fight against the ugliness. Just like a doctor fights against disease.',
          'Good design is a language, not a style. It speaks to people in ways they understand instinctively.',
        ],
        tips: 'Include the emphasis phrase naturally within the quote. The full quote provides context.',
        required: true,
        type: 'string',
      },
      emphasisPhrase: {
        description: 'Key phrase to emphasize in large accent text. MUST be an exact substring of the quote.',
        minChars: 15,
        maxChars: 60,
        examples: [
          'fight against the ugliness',
          'a language, not a style',
        ],
        tips: 'Pick the most memorable or impactful part. This will be displayed prominently.',
        required: true,
        type: 'string',
      },
      author: {
        description: 'Name of the person being quoted.',
        maxChars: 40,
        examples: ['Massimo Vignelli', 'Steve Jobs', 'Dieter Rams'],
        required: true,
        type: 'string',
      },
      authorMeta: {
        description: 'Additional info about the author.',
        maxChars: 50,
        examples: ['Designer, 1931-2014', 'Apple Co-founder', 'Industrial Designer'],
        required: false,
        type: 'string',
      },
      seriesTitle: {
        description: 'Title text for series (displayed above quote).',
        maxChars: 40,
        examples: ['Five phrases to live by:', 'Design wisdom:', 'Leadership lessons:'],
        defaultValue: 'Five phrases to live by:',
        required: false,
        type: 'string',
      },
      seriesNumber: {
        description: 'Number in the series (1-99).',
        examples: ['1', '2', '5'],
        defaultValue: 1,
        required: false,
        type: 'number',
      },
      metaColumns: {
        description: 'Array of short text items displayed in columns below the header.',
        examples: [
          '["Typography", "Grid Systems", "Color Theory"]',
          '["1957", "Helvetica", "Swiss"]',
        ],
        tips: 'Use 2-4 items. Each should be 15-25 characters.',
        required: false,
        type: 'array',
      },
      topic: {
        description: 'Topic label for the footer.',
        maxChars: 20,
        examples: ['DESIGN', 'LEADERSHIP', 'CREATIVITY'],
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. vignelli-gold works best for quotes.',
        examples: ['vignelli-gold', 'vignelli-cream', 'monochrome'],
        defaultValue: 'vignelli-gold',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      quote: 'The life of a designer is a life of fight: fight against the ugliness. Just like a doctor fights against disease.',
      emphasisPhrase: 'fight against the ugliness',
      author: 'Massimo Vignelli',
      authorMeta: 'Designer, 1931-2014',
      seriesTitle: 'Design wisdom:',
      seriesNumber: 3,
      topic: 'DESIGN',
      theme: 'vignelli-gold',
    },
    designNotes: [
      'The emphasisPhrase MUST be an exact substring of the quote',
      'Gold theme creates a premium, wisdom-focused feel',
      'Use series numbering to create anticipation for more content',
    ],
  },

  // ---------------------------------------------------------------------------
  // Hot Take Poster
  // ---------------------------------------------------------------------------
  'hot-take-poster': {
    id: 'hot-take-poster',
    name: 'Hot Take Poster',
    description: 'A contrarian statement poster designed for strong opinions. Features a bold prefix and statement that challenges conventional thinking.',
    bestFor: [
      'Controversial professional opinions',
      'Industry hot takes',
      'Contrarian insights',
      'Engagement-driving statements',
      'Challenging the status quo',
    ],
    linkedInContext: 'Use when you want to spark discussion. Hot takes generate engagement but use thoughtfully - the opinion should be defensible and professional. Great for industry perspectives that challenge common wisdom.',
    fieldGuides: {
      prefix: {
        description: 'Label that appears before the statement.',
        maxChars: 25,
        examples: [
          'UNPOPULAR OPINION:',
          'HOT TAKE:',
          'CONTROVERSIAL TAKE:',
          'REALITY CHECK:',
        ],
        defaultValue: 'UNPOPULAR OPINION:',
        required: false,
        type: 'string',
      },
      statement: {
        description: 'Your contrarian statement. Bold, direct, and thought-provoking.',
        minChars: 30,
        maxChars: 120,
        examples: [
          'MOST MEETINGS SHOULD BE EMAILS',
          'CODE REVIEWS SLOW YOU DOWN MORE THAN THEY HELP',
          'YOUR STARTUP DOESN\'T NEED A CTO',
        ],
        tips: 'Be bold but professional. The statement should invite discussion, not alienate.',
        required: true,
        type: 'string',
      },
      author: {
        description: 'Your name or handle (displayed as @author).',
        maxChars: 25,
        examples: ['johndoe', 'sarah_design', 'themikechang'],
        tips: 'Do not include the @ symbol - it will be added automatically.',
        required: true,
        type: 'string',
      },
      hashtag: {
        description: 'Optional hashtag displayed in the corner.',
        maxChars: 25,
        examples: ['#leadership', '#design', '#tech', '#unpopularopinion'],
        tips: 'Use a single relevant hashtag.',
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. swiss-red emphasizes the bold nature.',
        examples: ['swiss-red', 'monochrome', 'klein-blue'],
        defaultValue: 'swiss-red',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      prefix: 'UNPOPULAR OPINION:',
      statement: 'MOST TEAM MEETINGS SHOULD BE ASYNC UPDATES',
      author: 'productlead',
      hashtag: '#productivity',
      theme: 'swiss-red',
    },
    designNotes: [
      'The statement is uppercase by default for maximum impact',
      'Keep the statement punchy - one clear idea',
      'Avoid being offensive - be contrarian, not controversial',
    ],
  },

  // ---------------------------------------------------------------------------
  // Announcement Poster
  // ---------------------------------------------------------------------------
  'announcement-poster': {
    id: 'announcement-poster',
    name: 'Announcement Poster',
    description: 'An article or launch announcement poster. Perfect for promoting blog posts, new features, or company news.',
    bestFor: [
      'Blog post promotions',
      'Product launches',
      'Feature announcements',
      'Article teasers',
      'Company news',
    ],
    linkedInContext: 'Use when sharing a link to content you\'ve created. The label, title, and teaser work together to entice clicks while maintaining professional Swiss design aesthetics.',
    fieldGuides: {
      label: {
        description: 'Category or type label displayed as a colored badge.',
        maxChars: 20,
        examples: ['NEW POST', 'LAUNCH', 'CASE STUDY', 'ANNOUNCEMENT', 'GUIDE'],
        tips: 'Keep it short - 1-2 words. Will be displayed uppercase.',
        required: true,
        type: 'string',
      },
      title: {
        description: 'The main headline of what you\'re announcing.',
        minChars: 20,
        maxChars: 80,
        examples: [
          'BUILDING DESIGN SYSTEMS THAT SCALE',
          'WE RAISED $10M TO CHANGE HOW TEAMS COLLABORATE',
          'THE COMPLETE GUIDE TO PRODUCT-LED GROWTH',
        ],
        tips: 'Use strong, descriptive language. Title case or uppercase both work.',
        required: true,
        type: 'string',
      },
      teaser: {
        description: 'Hook text that entices readers to click.',
        maxChars: 100,
        examples: [
          'Everything we learned building our component library',
          'Why we bet everything on async-first',
        ],
        tips: 'Create curiosity. Start with "How", "Why", or a number.',
        required: false,
        type: 'string',
      },
      teaserPrefix: {
        description: 'Symbol or text before the teaser.',
        maxChars: 5,
        examples: ['→', '•', '—', '>'],
        defaultValue: '→',
        required: false,
        type: 'string',
      },
      url: {
        description: 'Link displayed in the footer.',
        maxChars: 40,
        examples: ['blog.company.com/post', 'company.com/launch', 'link.to/guide'],
        tips: 'Use a short, memorable URL. Remove https:// prefix.',
        required: false,
        type: 'string',
      },
      author: {
        description: 'Author name or handle.',
        maxChars: 25,
        examples: ['Sarah Chen', 'design_lead', 'Alex from Product'],
        required: true,
        type: 'string',
      },
      authorPrefix: {
        description: 'Prefix before author name.',
        maxChars: 5,
        examples: ['@', 'by ', '—'],
        defaultValue: '@',
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme for the poster.',
        examples: ['swiss-red', 'klein-blue', 'orange-energy'],
        defaultValue: 'swiss-red',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      label: 'NEW POST',
      title: 'BUILDING DESIGN SYSTEMS THAT ACTUALLY SCALE',
      teaser: 'Everything we learned building our component library from 10 to 100+ components',
      teaserPrefix: '→',
      url: 'blog.acme.com/design-systems',
      author: 'designlead',
      authorPrefix: '@',
      theme: 'swiss-red',
    },
    designNotes: [
      'The label badge provides immediate context',
      'Title should be the strongest element',
      'Teaser creates curiosity without giving everything away',
    ],
  },

  // ---------------------------------------------------------------------------
  // Typography Showcase
  // ---------------------------------------------------------------------------
  'typography-showcase': {
    id: 'typography-showcase',
    name: 'Typography Showcase',
    description: 'A poster featuring a large letterform with font information. Celebrates typography with a Swiss design aesthetic.',
    bestFor: [
      'Font and typeface appreciation',
      'Design-focused content',
      'Typography education',
      'Brand identity posts',
      'Creative design content',
    ],
    linkedInContext: 'Use when sharing typography-related content or when you want a highly visual, design-forward post. Great for designers and creative professionals showcasing their aesthetic sensibility.',
    fieldGuides: {
      letter: {
        description: 'The large letterform displayed as the main visual element.',
        maxChars: 2,
        examples: ['G', 'A', 'R', '&', '?'],
        tips: 'Single characters work best. Choose letters with interesting forms.',
        required: true,
        type: 'string',
      },
      fontName: {
        description: 'Name of the font being showcased.',
        maxChars: 25,
        examples: ['Neue Haas', 'Helvetica', 'Futura', 'Akzidenz'],
        required: true,
        type: 'string',
      },
      fontVariant: {
        description: 'Font weight or variant name.',
        maxChars: 20,
        examples: ['Grotesk', 'Bold', 'Medium', 'Display'],
        defaultValue: 'Grotesk',
        required: false,
        type: 'string',
      },
      tagline: {
        description: 'Repeated tagline text for visual rhythm.',
        maxChars: 25,
        examples: ['swiss style', 'modern typography', 'type matters'],
        defaultValue: 'swiss style',
        required: false,
        type: 'string',
      },
      titleWords: {
        description: 'Array of words displayed vertically as title stack.',
        examples: [
          '["swiss", "typography", "swiss"]',
          '["type", "design", "matters"]',
        ],
        tips: '2-4 words. First word gets accent color.',
        required: false,
        type: 'array',
      },
      bodyText: {
        description: 'Supporting body text that reinforces the main message or theme.',
        maxChars: 150,
        examples: [
          'Great design is invisible. It works so well you never notice it.',
          'The details are not the details. They make the design.',
        ],
        tips: 'Extract a key insight or supporting statement from the post content. Avoid placeholder text.',
        required: false,
        type: 'string',
      },
      showCharset: {
        description: 'Whether to show the character set panel.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      uppercaseChars: {
        description: 'Uppercase characters to display. Use \\n for line break.',
        examples: ['ABCDEFGHIJKLMNOP\\nQRSTUVWXYZ'],
        defaultValue: 'ABCDEFGHIJKLMNOP\\nQRSTUVWXYZ',
        required: false,
        type: 'string',
      },
      lowercaseChars: {
        description: 'Lowercase characters to display. Use \\n for line break.',
        examples: ['abcdefghijklmnopqr\\nstuvwxyz'],
        defaultValue: 'abcdefghijklmnopqr\\nstuvwxyz',
        required: false,
        type: 'string',
      },
      symbolChars: {
        description: 'Symbols and numbers to display. Use \\n for line break.',
        examples: ['1234567890$?\\n&%@!*()='],
        defaultValue: '1234567890$?\\n&%@!*()=',
        required: false,
        type: 'string',
      },
      footerLeftPrimary: {
        description: 'Primary footer text (left side, accent color).',
        maxChars: 20,
        examples: ['typografie', 'typography', 'design'],
        defaultValue: 'typografie',
        required: false,
        type: 'string',
      },
      footerLeftSecondary: {
        description: 'Secondary footer text (left side, muted).',
        maxChars: 20,
        examples: ['schweizer', 'swiss', 'international'],
        defaultValue: 'schweizer',
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. neue-teal is ideal for typography content.',
        examples: ['neue-teal', 'monochrome', 'klein-blue'],
        defaultValue: 'neue-teal',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      letter: 'G',
      fontName: 'Neue Haas',
      fontVariant: 'Grotesk',
      tagline: 'swiss style',
      titleWords: ['swiss', 'typography', 'design'],
      showCharset: true,
      theme: 'neue-teal',
    },
    designNotes: [
      'The large letter is the hero - choose one with visual interest',
      'This template celebrates the craft of typography',
      'Works best with the neue-teal theme',
    ],
  },

  // ---------------------------------------------------------------------------
  // Feature Showcase
  // ---------------------------------------------------------------------------
  'feature-showcase': {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    description: 'A poster with a giant keyword and optional info sections in the corners. Perfect for highlighting a single concept or feature with supporting details.',
    bestFor: [
      'Feature highlights',
      'Product capability showcases',
      'Concept introductions',
      'Single-word emphasis',
      'Marketing messages',
    ],
    linkedInContext: 'Use when you want to highlight a single concept, feature, or value proposition. The corner info sections can provide supporting details or benefits.',
    fieldGuides: {
      keyword: {
        description: 'The main keyword displayed in giant text.',
        minChars: 3,
        maxChars: 12,
        examples: ['SIMPLICITY', 'SPEED', 'SCALE', 'DESIGN', 'CLARITY'],
        tips: 'Single words work best. 4-10 characters is optimal.',
        required: true,
        type: 'string',
      },
      subtitle: {
        description: 'Subtitle text displayed below the keyword.',
        maxChars: 60,
        examples: [
          'Built for teams that move fast',
          'Design systems made simple',
        ],
        required: false,
        type: 'string',
      },
      topRight: {
        description: 'Info section in top-right corner.',
        type: 'object',
        examples: [
          '{ "icon": "triangle", "title": "FEATURE", "body": "Built-in components for rapid development" }',
        ],
        tips: 'icon options: triangle, double-triangle, L, square, circle, none',
        required: false,
      },
      bottomLeft: {
        description: 'Info section in bottom-left corner.',
        type: 'object',
        examples: [
          '{ "icon": "square", "title": "BENEFIT", "body": "Ship 10x faster with less code" }',
        ],
        required: false,
      },
      bottomRight: {
        description: 'Info section in bottom-right corner.',
        type: 'object',
        examples: [
          '{ "icon": "circle", "title": "RESULT", "body": "Focus on what matters most" }',
        ],
        required: false,
      },
      lowercase: {
        description: 'Display keyword in lowercase (default true).',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      keywordSize: {
        description: 'Font size for the keyword.',
        examples: ['200px', '180px', '150px'],
        defaultValue: '200px',
        tips: 'Reduce for longer keywords.',
        required: false,
        type: 'string',
      },
      showBottomBar: {
        description: 'Show colored bar at bottom.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      theme: {
        description: 'Color theme. orange-energy provides high energy.',
        examples: ['orange-energy', 'swiss-red', 'klein-blue'],
        defaultValue: 'orange-energy',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      keyword: 'SPEED',
      subtitle: 'Build faster, ship sooner',
      topRight: {
        icon: 'triangle',
        title: 'PERFORMANCE',
        body: 'Sub-second response times across all operations',
      },
      bottomLeft: {
        icon: 'square',
        title: 'EFFICIENCY',
        body: 'Reduce development time by 10x',
      },
      bottomRight: {
        icon: 'circle',
        title: 'RELIABILITY',
        body: '99.99% uptime guaranteed SLA',
      },
      lowercase: true,
      theme: 'orange-energy',
    },
    designNotes: [
      'The keyword is the hero - make it count',
      'Corner sections provide supporting evidence or details',
      'Use different icons to differentiate section types',
      'InfoSection titles: max 15 chars, body: max 60 chars',
    ],
  },

  // ---------------------------------------------------------------------------
  // Showcase Poster
  // ---------------------------------------------------------------------------
  'showcase-poster': {
    id: 'showcase-poster',
    name: 'Showcase Poster',
    description: 'A bold poster with primary and secondary headings, optional info columns, and geometric accent squares. Left-aligned Swiss design style.',
    bestFor: [
      'Key announcements',
      'Feature highlights',
      'Multi-point summaries',
      'Professional presentations',
      'Topic overviews',
    ],
    linkedInContext: 'Use when highlighting multiple key points or features with a bold visual hierarchy. The info columns allow for organized supporting details.',
    fieldGuides: {
      primaryHeading: {
        description: 'Main hero text displayed at top in large typography.',
        minChars: 5,
        maxChars: 40,
        examples: ['KEY INSIGHTS', 'THE BREAKDOWN', 'WHAT I LEARNED'],
        tips: 'This is displayed in hero typography. Keep it punchy and bold.',
        required: true,
        type: 'string',
      },
      secondaryHeading: {
        description: 'Prominent subtitle that expands on the primary heading.',
        minChars: 10,
        maxChars: 50,
        examples: [
          'Three principles for better design',
          'What the data actually shows',
          'The real takeaways',
        ],
        required: true,
        type: 'string',
      },
      supportingText: {
        description: 'Additional body text below the secondary heading.',
        maxChars: 60,
        examples: [
          'A deep dive into what really matters',
          'Insights from 10 years of experience',
        ],
        required: false,
        type: 'string',
      },
      infoColumns: {
        description: 'Array of column objects with heading and items for organized details.',
        type: 'array',
        examples: [
          '[{ "heading": "Key Points", "items": ["Simplicity wins", "Speed matters"] }, { "heading": "Benefits", "items": ["10x faster", "Lower cost"] }]',
        ],
        tips: 'Use 2-4 columns. Each column has a heading and array of items. Great for listing features, benefits, or key points.',
        required: false,
      },
      showAccentSquares: {
        description: 'Display geometric squares beside the secondary heading.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      squareSize: {
        description: 'Size of accent squares in pixels.',
        examples: ['100', '80', '120'],
        defaultValue: 100,
        required: false,
        type: 'number',
      },
      footerText: {
        description: 'Small text at the bottom.',
        maxChars: 50,
        examples: ['Read more at blog.com', 'Full post in comments'],
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. vignelli-cream provides an elegant look.',
        examples: ['vignelli-cream', 'monochrome', 'swiss-red'],
        defaultValue: 'vignelli-cream',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      primaryHeading: 'KEY INSIGHTS',
      secondaryHeading: 'What I learned building products',
      supportingText: 'Three principles that changed everything',
      infoColumns: [
        { heading: 'Principles', items: ['Start simple', 'Ship fast', 'Listen always'] },
        { heading: 'Results', items: ['10x faster launches', 'Higher retention'] },
        { heading: 'Tools', items: ['Figma', 'Linear', 'Notion'] },
      ],
      showAccentSquares: true,
      footerText: 'Full breakdown in comments',
      theme: 'vignelli-cream',
    },
    designNotes: [
      'The primary heading is the largest element',
      'Info columns organize supporting details cleanly',
      'Accent squares add visual interest without distraction',
      'All text is left-aligned following Swiss design principles',
    ],
  },

  // ---------------------------------------------------------------------------
  // Content Grid Poster
  // ---------------------------------------------------------------------------
  'content-grid-poster': {
    id: 'content-grid-poster',
    name: 'Content Grid Poster',
    description: 'A bold poster with content blocks in a 2-column grid layout. Perfect for key points, tips, features, or multi-item summaries.',
    bestFor: [
      'Key points summaries',
      'Tips and best practices',
      'Feature breakdowns',
      'Step-by-step guides',
      'Multi-item lists',
    ],
    linkedInContext: 'Use when presenting multiple key points or items with supporting details. The 2-column layout keeps content organized and scannable.',
    fieldGuides: {
      brandName: {
        description: 'Brand or series name displayed at the top.',
        maxChars: 35,
        examples: ['KEY TAKEAWAYS', 'TOP TIPS', 'THE ESSENTIALS'],
        required: true,
        type: 'string',
      },
      sectionTitle: {
        description: 'Section or topic title.',
        maxChars: 30,
        examples: ['What Really Matters', 'Best Practices', 'Core Principles'],
        required: true,
        type: 'string',
      },
      contentBlocks: {
        description: 'Array of content block objects with title and optional details.',
        type: 'array',
        examples: [
          '[{ "title": "Start Simple", "shortLabel": "TIP 01", "description": "Complexity kills momentum" }]',
        ],
        tips: 'Include 2-5 blocks. Each can have: title (required), shortLabel (left column), subLabel, badge, description (right column), attribution.',
        required: true,
      },
      footerText: {
        description: 'Footer text for the poster.',
        maxChars: 50,
        examples: ['Full post in comments', 'More at blog.com'],
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. swiss-red-inverted provides the classic red background.',
        examples: ['swiss-red-inverted', 'swiss-red'],
        defaultValue: 'swiss-red-inverted',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      brandName: 'KEY TAKEAWAYS',
      sectionTitle: 'What I Learned',
      contentBlocks: [
        {
          title: 'Start With Why',
          shortLabel: 'TIP 01',
          description: 'Always know the problem before building the solution',
          attribution: 'From "Start with Why" by Simon Sinek',
        },
        {
          title: 'Ship Early, Ship Often',
          shortLabel: 'TIP 02',
          description: 'Feedback loops beat perfection every time',
        },
        {
          title: 'Measure What Matters',
          shortLabel: 'TIP 03',
          badge: 'Essential',
          description: 'Track the metrics that drive real outcomes',
        },
      ],
      footerText: 'Full breakdown in comments',
      theme: 'swiss-red-inverted',
    },
    designNotes: [
      'The red inverted theme makes this distinctive and bold',
      'Content blocks use 2-column grid: shortLabel/subLabel on left, description on right',
      'shortLabel is great for numbering (TIP 01) or categories',
      'Block fields: title (40 chars), shortLabel (10 chars), subLabel (15 chars), badge (20 chars), description (50 chars)',
    ],
  },

  // ---------------------------------------------------------------------------
  // Minimal Quote (Dieter Rams style)
  // ---------------------------------------------------------------------------
  'minimal-quote': {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    description: 'A simple, clean quote poster with explanation paragraph. Inspired by Dieter Rams\' design philosophy of "less but better".',
    bestFor: [
      'Design philosophy quotes',
      'Minimalist statements',
      'Product design wisdom',
      'Simple, focused messages',
      'Dieter Rams tributes',
    ],
    linkedInContext: 'Use when sharing timeless design wisdom or simple truths. The clean layout emphasizes the quote without distraction.',
    fieldGuides: {
      quote: {
        description: 'The main quote text.',
        minChars: 20,
        maxChars: 100,
        examples: [
          'Good design is as little design as possible.',
          'Less, but better.',
        ],
        tips: 'Keep it concise. The power is in simplicity.',
        required: true,
        type: 'string',
      },
      explanation: {
        description: 'Explanation or context for the quote.',
        maxChars: 200,
        examples: [
          'Less, but better – because it concentrates on the essential aspects.',
        ],
        required: false,
        type: 'string',
      },
      tagline: {
        description: 'Additional tagline text.',
        maxChars: 60,
        examples: ['Back to purity, Back to simplicity.'],
        required: false,
        type: 'string',
      },
      author: {
        description: 'Quote author name.',
        maxChars: 40,
        examples: ['Dieter Rams', 'Jony Ive'],
        required: true,
        type: 'string',
      },
      authorPrefix: {
        description: 'Prefix before author name.',
        maxChars: 5,
        defaultValue: '~',
        examples: ['~', '—', '-'],
        required: false,
        type: 'string',
      },
      brand: {
        description: 'Footer brand name.',
        maxChars: 30,
        required: false,
        type: 'string',
      },
      showIcon: {
        description: 'Show decorative icon (Braun radio style).',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      theme: {
        description: 'Color theme.',
        examples: ['rams-warm', 'monochrome'],
        defaultValue: 'rams-warm',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      quote: 'Good design is as little design as possible.',
      explanation: 'Less, but better – because it concentrates on the essential aspects, and the products are not burdened with non-essentials.',
      tagline: 'Back to purity, Back to simplicity.',
      author: 'Dieter Rams',
      authorPrefix: '~',
      brand: 'STARTUPVITAMINS',
      showIcon: true,
      theme: 'rams-warm',
    },
    designNotes: [
      'The quote should be the hero - keep it short and impactful',
      'Use the explanation to add context without cluttering',
      'The warm theme evokes Braun/Rams design aesthetic',
    ],
  },

  // ---------------------------------------------------------------------------
  // Paragraph Quote (Müller-Brockmann style)
  // ---------------------------------------------------------------------------
  'paragraph-quote': {
    id: 'paragraph-quote',
    name: 'Paragraph Quote',
    description: 'Multi-paragraph quote poster inspired by Josef Müller-Brockmann\'s grid-based typography. Perfect for longer quotes that need structure.',
    bestFor: [
      'Longer quotes requiring multiple paragraphs',
      'Grid system philosophy',
      'Swiss design tributes',
      'Educational content',
      'Book excerpts',
    ],
    linkedInContext: 'Use when sharing wisdom that requires multiple sentences. The paragraph structure maintains readability while looking sophisticated.',
    fieldGuides: {
      paragraphs: {
        description: 'Array of paragraph texts.',
        examples: [
          '["The grid system is an aid, not a guarantee.", "It permits a number of possible uses.", "One must learn how to use the grid."]',
        ],
        tips: 'Use 2-4 paragraphs. Each should be a complete thought.',
        required: true,
        type: 'array',
      },
      paragraphGap: {
        description: 'Spacing between paragraphs.',
        examples: ['small', 'medium', 'large'],
        defaultValue: 'medium',
        required: false,
        type: 'string',
      },
      author: {
        description: 'Quote author name.',
        maxChars: 50,
        examples: ['Josef Müller-Brockmann'],
        required: true,
        type: 'string',
      },
      authorPrefix: {
        description: 'Prefix before author name.',
        maxChars: 5,
        defaultValue: '—',
        required: false,
        type: 'string',
      },
      cornerText: {
        description: 'Small text in corner.',
        maxChars: 50,
        required: false,
        type: 'string',
      },
      showGridLines: {
        description: 'Show decorative grid overlay.',
        defaultValue: false,
        required: false,
        type: 'boolean',
      },
      theme: {
        description: 'Color theme.',
        examples: ['swiss-red-inverted', 'swiss-red'],
        defaultValue: 'swiss-red-inverted',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      paragraphs: [
        'The grid system is an aid, not a guarantee.',
        'It permits a number of possible uses and each designer can look for a solution appropriate to his personal style.',
        'But one must learn how to use the grid; it is an art that requires practice.',
      ],
      paragraphGap: 'medium',
      author: 'Josef Müller-Brockmann',
      authorPrefix: '—',
      theme: 'swiss-red-inverted',
    },
    designNotes: [
      'Each paragraph should be a distinct thought',
      'The red inverted theme is classic Müller-Brockmann',
      'Keep paragraphs similar in length for visual balance',
    ],
  },

  // ---------------------------------------------------------------------------
  // Split Word (Vignelli tribute)
  // ---------------------------------------------------------------------------
  'split-word': {
    id: 'split-word',
    name: 'Split Word',
    description: 'Giant word split dramatically across two lines, inspired by Vignelli\'s "Forever" poster. Creates strong visual impact.',
    bestFor: [
      'Single powerful words',
      'Brand statements',
      'Vignelli tributes',
      'Dramatic visual impact',
      'Emotional messages',
    ],
    linkedInContext: 'Use when you want maximum visual impact with a single word or concept. The split creates drama and memorability.',
    fieldGuides: {
      url: {
        description: 'URL text displayed at top.',
        maxChars: 40,
        required: false,
        type: 'string',
      },
      wordPart1: {
        description: 'First part of the split word.',
        minChars: 2,
        maxChars: 10,
        examples: ['For', 'To', 'Be'],
        tips: 'Usually 2-4 characters.',
        required: true,
        type: 'string',
      },
      wordPart2: {
        description: 'Second part of the split word.',
        minChars: 2,
        maxChars: 10,
        examples: ['ever.', 'gether.', 'yond.'],
        tips: 'Include punctuation if desired.',
        required: true,
        type: 'string',
      },
      wordColor: {
        description: 'Color of the split word.',
        examples: ['foreground', 'accent'],
        defaultValue: 'accent',
        required: false,
        type: 'string',
      },
      supportingQuote: {
        description: 'Quote below the split word.',
        maxChars: 80,
        examples: ['If you do it right, it will last forever.'],
        required: false,
        type: 'string',
      },
      bioColumns: {
        description: 'Footer bio columns (max 3).',
        type: 'array',
        examples: [
          '[{ "primary": "Massimo Vignelli", "secondary": "1931-2014" }]',
        ],
        required: false,
      },
      theme: {
        description: 'Color theme.',
        examples: ['monochrome', 'swiss-red'],
        defaultValue: 'monochrome',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
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
      theme: 'monochrome',
    },
    designNotes: [
      'The word split should create natural reading rhythm',
      'Red accent on monochrome creates the classic Vignelli look',
      'The supporting quote adds context without competing',
    ],
  },

  // ---------------------------------------------------------------------------
  // Vignelli Enhanced
  // ---------------------------------------------------------------------------
  'vignelli-enhanced': {
    id: 'vignelli-enhanced',
    name: 'Vignelli Enhanced',
    description: 'Advanced Vignelli-style quote poster with 4-column header metadata and customizable footer. More structured than the basic Vignelli quote.',
    bestFor: [
      'Detailed quote attribution',
      'Design series with metadata',
      'Professional portfolios',
      'Structured wisdom sharing',
      'Design history content',
    ],
    linkedInContext: 'Use for comprehensive quote presentations where context and attribution matter. The header columns can include biographical or contextual information.',
    fieldGuides: {
      seriesTitle: {
        description: 'Series title text.',
        maxChars: 50,
        defaultValue: 'Five phrases to live by:',
        required: false,
        type: 'string',
      },
      authorName: {
        description: 'Author name for header.',
        maxChars: 40,
        defaultValue: 'Massimo Vignelli',
        required: false,
        type: 'string',
      },
      headerColumns: {
        description: 'Array of meta text for 4-column header.',
        type: 'array',
        tips: 'Up to 4 columns of contextual information.',
        required: false,
      },
      quote: {
        description: 'The full quote text.',
        minChars: 30,
        maxChars: 200,
        required: true,
        type: 'string',
      },
      emphasisPhrase: {
        description: 'Key phrase to emphasize (must be in quote).',
        minChars: 10,
        maxChars: 60,
        tips: 'Must be exact substring of quote.',
        required: true,
        type: 'string',
      },
      quoteItalic: {
        description: 'Display quote in italic.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      quoteVariant: {
        description: 'Typography size for quote.',
        examples: ['subhead', 'title'],
        defaultValue: 'subhead',
        required: false,
        type: 'string',
      },
      emphasisVariant: {
        description: 'Typography size for emphasis.',
        examples: ['display', 'hero'],
        defaultValue: 'display',
        required: false,
        type: 'string',
      },
      bioColumns: {
        description: 'Footer bio columns.',
        type: 'array',
        required: false,
      },
      seriesNumber: {
        description: 'Number in series (displayed large).',
        defaultValue: 2,
        required: false,
        type: 'number',
      },
      theme: {
        description: 'Color theme.',
        examples: ['vignelli-gold', 'vignelli-cream'],
        defaultValue: 'vignelli-gold',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
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
      seriesNumber: 2,
      theme: 'vignelli-gold',
    },
    designNotes: [
      'The emphasis phrase MUST be an exact substring of the quote',
      'Header columns provide rich context without overwhelming',
      'Gold theme creates premium, wisdom-focused aesthetic',
    ],
  },

  // ---------------------------------------------------------------------------
  // Type Specimen
  // ---------------------------------------------------------------------------
  'type-specimen': {
    id: 'type-specimen',
    name: 'Type Specimen',
    description: 'Font showcase poster with stacked typography lines. Perfect for celebrating typefaces or creating visual rhythm with text.',
    bestFor: [
      'Font announcements',
      'Typography appreciation',
      'Music/album aesthetics',
      'Stacked word compositions',
      'Creative portfolio pieces',
    ],
    linkedInContext: 'Use when highlighting typography or creating visually striking text compositions. Works well for creative professionals.',
    fieldGuides: {
      fontFamily: {
        description: 'Font family name.',
        maxChars: 25,
        examples: ['Last', 'Helvetica', 'Founders'],
        required: true,
        type: 'string',
      },
      fontWeights: {
        description: 'Weight description.',
        maxChars: 30,
        defaultValue: '10 weights + Italics',
        required: false,
        type: 'string',
      },
      charset: {
        description: 'Character set description.',
        maxChars: 30,
        defaultValue: 'Latin Extended-A',
        required: false,
        type: 'string',
      },
      releaseDate: {
        description: 'Release date text.',
        maxChars: 20,
        examples: ['Sept. 2025'],
        required: false,
        type: 'string',
      },
      stackedLines: {
        description: 'Array of text lines to stack.',
        type: 'array',
        examples: ['["RADIANCE", "BASIC CHANNEL", "3 TRACKS", "30 MIN", "1994"]'],
        tips: '3-6 short lines work best.',
        required: true,
      },
      lineSpacing: {
        description: 'Vertical spacing between lines.',
        examples: ['tight', 'normal', 'loose'],
        defaultValue: 'tight',
        required: false,
        type: 'string',
      },
      uppercase: {
        description: 'Display text in uppercase.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      footerColumns: {
        description: 'Footer credit columns.',
        type: 'array',
        required: false,
      },
      centerLogo: {
        description: 'Center brand/logo text.',
        maxChars: 30,
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme.',
        examples: ['neon-green', 'monochrome'],
        defaultValue: 'neon-green',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
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
      theme: 'neon-green',
    },
    designNotes: [
      'Stacked lines create visual rhythm',
      'Tight spacing maximizes impact',
      'Neon green theme gives tech/music aesthetic',
    ],
  },

  // ---------------------------------------------------------------------------
  // Manifesto Quotes
  // ---------------------------------------------------------------------------
  'manifesto-quotes': {
    id: 'manifesto-quotes',
    name: 'Manifesto + Quotes',
    description: 'Bold statement words on the left with supporting quotes in an asymmetric two-column layout. Creates dramatic visual hierarchy.',
    bestFor: [
      'Manifesto statements',
      'Core values',
      'Philosophy with supporting evidence',
      'Dramatic declarations',
      'Mission statements',
    ],
    linkedInContext: 'Use when making bold statements backed by supporting quotes. The asymmetric layout draws attention to your main message.',
    fieldGuides: {
      statementLines: {
        description: 'Array of statement words (one per line).',
        type: 'array',
        examples: ['["Stay", "Simple", "Stay", "True"]'],
        tips: 'Use 2-5 short, impactful words.',
        required: true,
      },
      statementPunctuation: {
        description: 'Punctuation after last word.',
        maxChars: 3,
        defaultValue: '.',
        required: false,
        type: 'string',
      },
      statementVariant: {
        description: 'Typography size.',
        examples: ['hero', 'display', 'headline'],
        defaultValue: 'hero',
        required: false,
        type: 'string',
      },
      supportingQuotes: {
        description: 'Array of supporting quotes with authors.',
        type: 'array',
        examples: ['[{ "quote": "Everything should be made as simple as possible.", "author": "Albert Einstein" }]'],
        tips: 'Use 2-4 quotes that reinforce the statement.',
        required: false,
      },
      brandIcon: {
        description: 'Brand icon character.',
        maxChars: 5,
        examples: ['◼', '●', '▲'],
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme.',
        examples: ['monochrome', 'swiss-red'],
        defaultValue: 'monochrome',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      statementLines: ['Stay', 'Simple', 'Stay', 'True'],
      statementPunctuation: '.',
      statementVariant: 'hero',
      supportingQuotes: [
        { quote: 'Everything should be made as simple as possible, but not simpler.', author: 'Albert Einstein' },
        { quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
        { quote: 'Simply the thing that I am shall make me live.', author: 'William Shakespeare' },
      ],
      brandIcon: '◼',
      theme: 'monochrome',
    },
    designNotes: [
      'Statement words should be single words for maximum impact',
      'Supporting quotes should reinforce the main message',
      'Monochrome keeps focus on the typography',
    ],
  },

  // ---------------------------------------------------------------------------
  // Numbered Principles
  // ---------------------------------------------------------------------------
  'numbered-principles': {
    id: 'numbered-principles',
    name: 'Numbered Principles',
    description: 'Editorial numbered list layout inspired by Dieter Rams\' 10 Principles of Good Design. Perfect for structured wisdom.',
    bestFor: [
      'Design principles',
      'Numbered lists',
      'Rules and guidelines',
      'Educational content',
      'Dieter Rams tributes',
    ],
    linkedInContext: 'Use when sharing structured principles or rules. The numbered format makes content scannable and memorable.',
    fieldGuides: {
      titleBold: {
        description: 'Bold part of title.',
        maxChars: 20,
        examples: ['Good', 'Great', 'Better'],
        required: true,
        type: 'string',
      },
      titleRegular: {
        description: 'Regular weight part of title.',
        maxChars: 30,
        examples: ['design is', 'leaders do', 'teams have'],
        required: true,
        type: 'string',
      },
      subtitle: {
        description: 'Subtitle text.',
        maxChars: 50,
        examples: ['Ten Principles of good design :'],
        required: false,
        type: 'string',
      },
      subtitleMeta: {
        description: 'Attribution text.',
        maxChars: 30,
        examples: ['Dieter Rams', 'Warren Buffett'],
        required: false,
        type: 'string',
      },
      principles: {
        description: 'Array of principles with number, keyword, explanation.',
        type: 'array',
        examples: ['[{ "number": 1, "keyword": "innovate", "explanation": "Good design is innovative." }]'],
        tips: 'Include 3-10 principles. Each needs number, keyword, and explanation.',
        required: true,
      },
      taglineBold: {
        description: 'Bold tagline text.',
        maxChars: 20,
        examples: ['Less'],
        required: false,
        type: 'string',
      },
      taglineAccent: {
        description: 'Accent colored tagline text.',
        maxChars: 20,
        examples: ['and More'],
        required: false,
        type: 'string',
      },
      footerMeta: {
        description: 'Footer credit text.',
        maxChars: 50,
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme.',
        examples: ['rams-brown', 'monochrome'],
        defaultValue: 'rams-brown',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      titleBold: 'Good',
      titleRegular: 'design is',
      subtitle: 'Ten Principles of good design :',
      subtitleMeta: 'Dieter Rams',
      principles: [
        { number: 1, keyword: 'innovate', explanation: 'Good design is innovative. The possibilities for innovation are not exhausted.', translation: '좋은 디자인은 혁신적이다' },
        { number: 2, keyword: 'useful', explanation: 'Good design makes a product useful. A product is bought to be used.', translation: '좋은 디자인은 제품을 유용하게 한다' },
        { number: 3, keyword: 'aesthetic', explanation: 'Good design is aesthetic. The aesthetic quality of a product is integral.', translation: '좋은 디자인은 아름답다' },
      ],
      taglineBold: 'Less',
      taglineAccent: 'and More',
      footerMeta: 'Poster design by Myungjoo Shin',
      theme: 'rams-brown',
    },
    designNotes: [
      'Keywords should be single-word summaries',
      'The 4-column grid creates structured hierarchy',
      'Brown theme evokes Dieter Rams aesthetic',
    ],
  },

  // ---------------------------------------------------------------------------
  // Two-Tone Quote
  // ---------------------------------------------------------------------------
  'two-tone-quote': {
    id: 'two-tone-quote',
    name: 'Two-Tone Quote',
    description: 'Quote with alternating word colors, inspired by Edward Tufte\'s information design. Highlights key words in a different color.',
    bestFor: [
      'Emphasizing specific words',
      'Visual information design',
      'Creative typography',
      'Edward Tufte tributes',
      'Memorable quotes',
    ],
    linkedInContext: 'Use when you want to emphasize specific words within a quote. The color contrast draws attention to key concepts.',
    fieldGuides: {
      quote: {
        description: 'Quote text (use \\n for line breaks).',
        minChars: 20,
        maxChars: 150,
        examples: ['Good design\\nis a lot like\\nclear thinking\\nmade visual.'],
        tips: 'Break into 3-5 lines for visual rhythm.',
        required: true,
        type: 'string',
      },
      highlightedWords: {
        description: 'Array of words to highlight in accent color.',
        type: 'array',
        examples: ['["design", "like", "clear", "visual"]'],
        tips: 'Choose key concept words (4-8 words).',
        required: true,
      },
      author: {
        description: 'Author name.',
        maxChars: 40,
        examples: ['Edward Tufte'],
        required: true,
        type: 'string',
      },
      authorItalic: {
        description: 'Display author in italic.',
        defaultValue: true,
        required: false,
        type: 'boolean',
      },
      edgeText: {
        description: 'Small text at bottom edge.',
        maxChars: 60,
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme.',
        examples: ['tufte-blue', 'monochrome'],
        defaultValue: 'tufte-blue',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      quote: 'Good design\nis a lot like\nclear thinking\nmade visual.',
      highlightedWords: ['design', 'like', 'clear', 'visual'],
      author: 'Edward Tufte',
      authorItalic: true,
      edgeText: '© 2010 Bibliotheca Alexandrina - Graphics Unit',
      theme: 'tufte-blue',
    },
    designNotes: [
      'Highlighted words should be evenly distributed',
      'The blue theme creates an intellectual, refined feel',
      'Line breaks control reading rhythm',
    ],
  },

  // ---------------------------------------------------------------------------
  // Split Statement
  // ---------------------------------------------------------------------------
  'split-statement': {
    id: 'split-statement',
    name: 'Split Statement',
    description: 'Playful diagonal text flow with a framed card layout. Inspired by Empatia\'s bold typographic style.',
    bestFor: [
      'Bold brand statements',
      'Playful messaging',
      'Creative agency style',
      'Call-to-action posts',
      'Design manifestos',
    ],
    linkedInContext: 'Use for bold, attention-grabbing statements. The split layout and colored card create visual interest and memorability.',
    fieldGuides: {
      topLines: {
        description: 'Array of words for top-left (one per line).',
        type: 'array',
        examples: ['["We", "want", "more", "fucking"]'],
        tips: 'Use 3-5 short words building to a punchline.',
        required: true,
      },
      topInlineWord: {
        description: 'Small word after last top line.',
        maxChars: 15,
        examples: ['good'],
        required: false,
        type: 'string',
      },
      bottomWord: {
        description: 'Large word at bottom-right.',
        minChars: 3,
        maxChars: 15,
        examples: ['design.', 'creativity.', 'impact.'],
        tips: 'This is the punchline - make it count.',
        required: true,
        type: 'string',
      },
      brandName: {
        description: 'Brand name for footer.',
        maxChars: 30,
        examples: ['empatía.'],
        required: false,
        type: 'string',
      },
      url: {
        description: 'URL for footer.',
        maxChars: 40,
        examples: ['helloempatia.com'],
        required: false,
        type: 'string',
      },
      framePadding: {
        description: 'Padding around outer frame (px).',
        defaultValue: 40,
        required: false,
        type: 'number',
      },
      cardPadding: {
        description: 'Padding inside card (px).',
        defaultValue: 60,
        required: false,
        type: 'number',
      },
      theme: {
        description: 'Color theme.',
        examples: ['empatia-mint', 'orange-energy'],
        defaultValue: 'empatia-mint',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      topLines: ['We', 'want', 'more', 'fucking'],
      topInlineWord: 'good',
      bottomWord: 'design.',
      brandName: 'empatía.',
      url: 'helloempatia.com',
      framePadding: 40,
      cardPadding: 60,
      theme: 'empatia-mint',
    },
    designNotes: [
      'The diagonal flow creates visual tension',
      'Bottom word is the payoff - choose carefully',
      'Mint theme gives fresh, modern agency feel',
    ],
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get a template spec by ID
 */
export function getTemplateSpec(id: string): TemplateSpec | undefined {
  return templateSpecs[id];
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(templateSpecs);
}

/**
 * Generate a prompt for an LLM to create a template configuration
 */
export function generateLLMPrompt(templateId: string, context: string): string {
  const spec = templateSpecs[templateId];
  if (!spec) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  const requiredFields = Object.entries(spec.fieldGuides)
    .filter(([, guide]) => guide.required)
    .map(([key]) => key);

  return `
Generate a JSON configuration for a "${spec.name}" poster.

TEMPLATE: ${spec.id}
DESCRIPTION: ${spec.description}
BEST FOR: ${spec.bestFor.join(', ')}
LINKEDIN CONTEXT: ${spec.linkedInContext}

USER'S CONTENT:
${context}

REQUIRED FIELDS: ${requiredFields.join(', ')}

FIELD GUIDELINES:
${Object.entries(spec.fieldGuides)
  .map(([key, guide]) => {
    let desc = `- ${key}: ${guide.description}`;
    if (guide.maxChars) desc += ` (max ${guide.maxChars} chars)`;
    if (guide.required) desc += ' [REQUIRED]';
    return desc;
  })
  .join('\n')}

EXAMPLE CONFIG:
${JSON.stringify(spec.exampleConfig, null, 2)}

DESIGN NOTES:
${spec.designNotes.map(n => `- ${n}`).join('\n')}

Please generate a valid JSON configuration object with appropriate content based on the user's input.
`.trim();
}

/**
 * Validate a configuration against a template spec
 */
export function validateConfig(
  templateId: string,
  config: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const spec = templateSpecs[templateId];
  if (!spec) {
    return { valid: false, errors: [`Unknown template: ${templateId}`] };
  }

  const errors: string[] = [];

  // Check required fields
  for (const [key, guide] of Object.entries(spec.fieldGuides)) {
    if (guide.required && !(key in config)) {
      errors.push(`Missing required field: ${key}`);
    }

    if (key in config && typeof config[key] === 'string') {
      const value = config[key] as string;
      if (guide.maxChars && value.length > guide.maxChars) {
        errors.push(`${key} exceeds max length of ${guide.maxChars} chars (got ${value.length})`);
      }
      if (guide.minChars && value.length < guide.minChars) {
        errors.push(`${key} is below min length of ${guide.minChars} chars (got ${value.length})`);
      }
    }
  }

  // Special validation for vignelli-quote
  if (templateId === 'vignelli-quote' && config.quote && config.emphasisPhrase) {
    const quote = config.quote as string;
    const emphasis = config.emphasisPhrase as string;
    if (!quote.includes(emphasis)) {
      errors.push('emphasisPhrase must be an exact substring of quote');
    }
  }

  return { valid: errors.length === 0, errors };
}

export default templateSpecs;
