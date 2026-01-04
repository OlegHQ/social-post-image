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
        description: 'Descriptive body text about the typography.',
        maxChars: 150,
        examples: [
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
        ],
        tips: 'Use placeholder Latin or descriptive text about the typeface.',
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
  // Opera Poster
  // ---------------------------------------------------------------------------
  'opera-poster': {
    id: 'opera-poster',
    name: 'Opera Poster',
    description: 'A classic Swiss-style venue poster with optional geometric accent squares. Ideal for formal events and venue-based announcements.',
    bestFor: [
      'Conference announcements',
      'Event promotions',
      'Venue-based content',
      'Formal announcements',
      'Webinar promotions',
    ],
    linkedInContext: 'Use for formal event announcements, conferences, or webinars. The structured layout conveys professionalism and attention to detail.',
    fieldGuides: {
      venueName: {
        description: 'Organization or venue name displayed at top.',
        minChars: 5,
        maxChars: 40,
        examples: ['DESIGN WEEK', 'TECHCONF 2024', 'PRODUCT SUMMIT'],
        tips: 'This is displayed in hero typography at the top.',
        required: true,
        type: 'string',
      },
      eventTitle: {
        description: 'Name of the specific event.',
        minChars: 10,
        maxChars: 50,
        examples: [
          'The Future of AI in Design',
          'Building Scalable Products',
          'Leadership Workshop',
        ],
        required: true,
        type: 'string',
      },
      subtitle: {
        description: 'Secondary event description.',
        maxChars: 60,
        examples: [
          'A deep dive into machine learning for designers',
          'Featuring industry leaders and innovators',
        ],
        required: false,
        type: 'string',
      },
      metadataColumns: {
        description: 'Array of labeled lists for event details.',
        type: 'array',
        examples: [
          '[{ "label": "Speakers", "items": ["Sarah Chen", "Mike Johnson"] }, { "label": "When", "items": ["March 15, 2024", "9:00 AM PST"] }]',
        ],
        tips: 'Use 2-4 columns. Each column has a label and array of items.',
        required: false,
      },
      showAccentSquares: {
        description: 'Display geometric squares flanking the title.',
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
        examples: ['Register at event.com', 'Free for members'],
        required: false,
        type: 'string',
      },
      theme: {
        description: 'Color theme. vignelli-cream suits formal events.',
        examples: ['vignelli-cream', 'monochrome', 'swiss-red'],
        defaultValue: 'vignelli-cream',
        required: false,
        type: 'string',
      },
    },
    exampleConfig: {
      venueName: 'DESIGN SUMMIT',
      eventTitle: 'The Future of Product Design',
      subtitle: 'An exploration of emerging design trends',
      metadataColumns: [
        { label: 'Speakers', items: ['Sarah Chen', 'Mike Ross', 'Alex Kim'] },
        { label: 'Date', items: ['March 15, 2024', '9:00 AM - 5:00 PM'] },
        { label: 'Location', items: ['San Francisco', 'Moscone Center'] },
      ],
      showAccentSquares: true,
      footerText: 'Register at designsummit.com',
      theme: 'vignelli-cream',
    },
    designNotes: [
      'The venue name is the largest element',
      'Metadata columns organize event details cleanly',
      'Accent squares add visual interest without distraction',
    ],
  },

  // ---------------------------------------------------------------------------
  // Season Poster
  // ---------------------------------------------------------------------------
  'season-poster': {
    id: 'season-poster',
    name: 'Season Poster',
    description: 'A red background poster for multiple event listings. Perfect for program schedules, content series, or multi-part announcements.',
    bestFor: [
      'Content series announcements',
      'Multi-event programs',
      'Webinar series',
      'Course modules',
      'Quarterly updates',
    ],
    linkedInContext: 'Use when announcing multiple related events or a content series. The list format clearly communicates dates and details for each item.',
    fieldGuides: {
      venueName: {
        description: 'Organization or series name.',
        maxChars: 35,
        examples: ['DESIGN ACADEMY', 'PRODUCT TALKS', 'TECH SERIES'],
        required: true,
        type: 'string',
      },
      seasonTitle: {
        description: 'Season or program title.',
        maxChars: 30,
        examples: ['Q1 2024 Program', 'Spring Series', 'Learning Path'],
        required: true,
        type: 'string',
      },
      events: {
        description: 'Array of event objects with details.',
        type: 'array',
        examples: [
          '[{ "title": "Intro to Design Systems", "date": "JAN 15", "time": "2:00 PM PST", "status": "Registration Open" }]',
        ],
        tips: 'Include 2-5 events. Each event can have title, date, time, status, description, and credits.',
        required: true,
      },
      footerText: {
        description: 'Footer text for the poster.',
        maxChars: 50,
        examples: ['Register at academy.com', 'All sessions recorded'],
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
      venueName: 'DESIGN ACADEMY',
      seasonTitle: 'Q1 2024 Program',
      events: [
        {
          title: 'Design Systems Fundamentals',
          date: 'JAN 15',
          time: '2:00 PM PST',
          status: 'Registration Open',
          description: 'Building scalable component libraries',
          credits: [
            { role: 'Speaker', name: 'Sarah Chen' },
          ],
        },
        {
          title: 'Advanced Prototyping',
          date: 'FEB 1',
          time: '2:00 PM PST',
          status: 'Coming Soon',
          description: 'From concept to high-fidelity',
          credits: [
            { role: 'Speaker', name: 'Mike Ross' },
          ],
        },
        {
          title: 'Design Leadership',
          date: 'FEB 15',
          time: '2:00 PM PST',
          description: 'Managing design teams effectively',
        },
      ],
      footerText: 'Register at designacademy.com',
      theme: 'swiss-red-inverted',
    },
    designNotes: [
      'The inverted theme (red background) makes this distinctive',
      'Each event block includes date, time, and optional status',
      'Credits array allows listing speakers, hosts, etc.',
      'Event fields: title (40 chars), date (10 chars), time (15 chars), status (20 chars), description (50 chars)',
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
