# Swiss Content Generator - AI Instructions

## Project Purpose

Generate Swiss-style LinkedIn post illustrations using a declarative visual language. The system provides composable primitives that can be combined to create various poster layouts.

## Project Structure

```
social-post-image/
├── app/
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Global styles
│   ├── providers.tsx         # SessionProvider + DesignProvider
│   ├── page.tsx              # Main app (protected)
│   ├── login/
│   │   └── page.tsx          # Login form
│   └── api/auth/[...nextauth]/
│       └── route.ts          # NextAuth handler
├── components/
│   ├── primitives/           # Text, Box, Stack, Grid, etc.
│   ├── composer/
│   │   ├── Canvas.tsx
│   │   ├── LayoutRenderer.tsx
│   │   └── presets/          # 8 preset functions
│   └── ui/
│       ├── Sidebar/
│       ├── Editor/
│       └── LivePreview/
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── tokens/               # colors, typography, spacing
│   ├── themes/               # 13 theme definitions
│   └── types.ts              # PosterDefinition, etc.
├── context/
│   └── DesignContext.tsx     # State management
├── hooks/
│   └── useExport.ts          # html-to-image export
├── schemas/
│   └── presetSchemas.ts      # Form field definitions
├── middleware.ts             # Route protection
├── output/                   # Generated images
└── references/               # Visual reference images
```

## Key Concepts

### Declarative Language

Posters are defined as JSON structures (`PosterDefinition`) using primitives:

```typescript
const poster: PosterDefinition = {
  canvas: { preset: 'linkedin-portrait' },
  theme: { preset: 'swiss-red' },
  root: {
    type: 'stack',
    direction: 'vertical',
    gap: 6,
    children: [
      { type: 'text', content: 'HEADLINE', variant: 'hero', color: 'accent' },
      { type: 'text', content: 'Subheadline text', variant: 'subhead' },
      { type: 'spacer', size: 'flex' },
      { type: 'divider' },
      { type: 'footer', author: 'Name', seriesNumber: 1 }
    ]
  }
};
```

### Primitive Types

| Type | Description | Key Props |
|------|-------------|-----------|
| `text` | Typography | `content`, `variant`, `color`, `uppercase`, `italic` |
| `box` | Container | `color`, `padding`, `border`, `children` |
| `stack` | Flex layout | `direction`, `gap`, `align`, `justify`, `children` |
| `grid` | CSS Grid | `columns`, `rows`, `gap`, `areas`, `children` |
| `divider` | Horizontal rule | `color`, `thickness` |
| `spacer` | Empty space | `size` (token or 'flex') |
| `seriesNumber` | Large number | `number`, `size`, `color` |
| `seriesDots` | Dot indicators | `filled`, `total`, `color` |

### Text Variants

| Variant | Size | Weight | Use Case |
|---------|------|--------|----------|
| `hero` | 120px | black | Main headlines, uppercase |
| `display` | 90px | black | Large display text |
| `headline` | 67px | black | Headlines |
| `title` | 50px | bold | Titles |
| `subhead` | 38px | regular | Subheadlines |
| `body` | 21px | regular | Body text |
| `label` | 16px | bold | Labels, uppercase |
| `meta` | 12px | regular | Metadata, captions |
| `number` | 72px | regular | Series numbers |

### Available Themes

| Theme ID | Description | Background | Accent |
|----------|-------------|------------|--------|
| `swiss-red` | Classic Swiss | Light gray | Red |
| `klein-blue` | International style | White | Klein blue |
| `monochrome` | Pure B&W | White | Black |
| `vignelli-gold` | Vignelli tribute | Dark | Gold |
| `vignelli-cream` | Vignelli light | Cream | Crimson |
| `neue-teal` | Typography style | Teal | Coral |
| `orange-energy` | Vibrant | Warm white | Orange |
| `midnight-gold` | Dark luxury | Dark | Gold |
| `forest-contrast` | Nature theme | Forest green | Coral |
| `brutalist-concrete` | Brutalist | Concrete gray | Orange |
| `tech-terminal` | Tech/hacker | Dark | Green |
| `paper-ink` | Editorial | Paper | Ink |
| `swiss-red-inverted` | Inverted Swiss | Red | White |

### Canvas Presets

| Preset | Dimensions | Use Case |
|--------|------------|----------|
| `linkedin-portrait` | 1080x1350 | LinkedIn posts (4:5) |
| `linkedin-square` | 1080x1080 | LinkedIn square |
| `instagram-portrait` | 1080x1350 | Instagram portrait |
| `instagram-square` | 1080x1080 | Instagram square |
| `twitter` | 1200x675 | Twitter cards (16:9) |

### Color Tokens

Colors can be specified as:
- **Token**: `'foreground'`, `'background'`, `'accent'`, `'accentAlt'`, `'muted'`
- **Direct hex**: `'#FF0000'`, `'#1A1A1A'`

## Swiss Design Rules (MUST FOLLOW)

1. **Text alignment**: ALWAYS left-aligned (never centered except single words)
2. **Headlines**: Usually uppercase with tight letter-spacing (-0.04em)
3. **Color limit**: Maximum 3 colors per design (background, foreground, accent)
4. **Padding**: Generous padding (60px minimum from edges)
5. **No decorations**: No rounded corners, shadows, or gradients
6. **Typography hierarchy**: Strong size contrast between levels
7. **Grid-based**: Elements align to 12-column grid

## Available Presets

### `createStatementPoster(options)`
Simple headline poster
```typescript
createStatementPoster({
  headline: 'Main headline',
  subheadline: 'Supporting text',
  author: 'Author',
  topic: 'Topic',
  theme: 'swiss-red'
})
```

### `createVignelliQuote(options)`
Quote poster with emphasis phrase (Massimo Vignelli style)
```typescript
createVignelliQuote({
  quote: 'Full quote text',
  emphasisPhrase: 'Key phrase to emphasize',
  author: 'Author Name',
  authorMeta: 'Additional info',
  seriesNumber: 2,
  theme: 'vignelli-gold'
})
```

### `createTypographyShowcase(options)`
Large letterform typography poster
```typescript
createTypographyShowcase({
  letter: 'G',
  fontName: 'Neue Haas',
  fontVariant: 'Grotesk',
  titleWords: ['swiss', 'typography'],
  theme: 'neue-teal'
})
```

### `createHotTakePoster(options)`
Contrarian statement poster
```typescript
createHotTakePoster({
  prefix: 'UNPOPULAR OPINION:',
  statement: 'Your hot take here',
  author: 'nexo.sh',
  hashtag: '#Tech',
  theme: 'swiss-red'
})
```

### `createAnnouncementPoster(options)`
Article or launch announcement
```typescript
createAnnouncementPoster({
  label: 'NEW POST',
  title: 'Article title',
  teaser: 'Hook line',
  url: 'nexo.sh/article',
  author: 'nexo.sh',
  theme: 'klein-blue'
})
```

### `createShowcasePoster(options)`
Bold poster with primary/secondary headings and info columns
```typescript
createShowcasePoster({
  primaryHeading: 'DESIGN SYSTEMS',
  secondaryHeading: 'Building for Scale',
  supportingText: 'A systematic approach',
  infoColumns: [{ heading: 'Benefits', items: ['Consistency', 'Speed'] }],
  showAccentSquares: true,
  theme: 'vignelli-cream'
})
```

### `createContentGridPoster(options)`
Content blocks in 2-column grid layout
```typescript
createContentGridPoster({
  brandName: 'DESIGN TIPS',
  sectionTitle: 'Best Practices',
  contentBlocks: [
    { title: 'Typography First', shortLabel: 'TIP 01', description: 'Choose typeface first' }
  ],
  theme: 'swiss-red-inverted'
})
```

### `createFeatureShowcase(options)`
Giant keyword poster
```typescript
createFeatureShowcase({
  keyword: 'GRIDS',
  subtitle: 'Unlock the Power of Grids',
  lowercase: false,
  showBottomBar: true,
  theme: 'orange-energy'
})
```

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local` with:
```
AUTH_PASSWORD=your-secret-password
AUTH_SECRET=run-openssl-rand-base64-32
```

## Authentication

The app is protected by password authentication:
- Set `AUTH_PASSWORD` in environment variables
- Users enter password at `/login`
- Session persists for 30 days via JWT cookie
- Protected by Next.js middleware

## Important Files

- `lib/types.ts` - Full declarative language schema
- `lib/themes/` - Theme definitions
- `lib/tokens/` - Design tokens
- `components/composer/presets/` - Preset template functions
- `context/DesignContext.tsx` - UI state management

## Tips for AI Usage

1. **Always use the declarative schema** - Define posters as `PosterDefinition` objects
2. **Reference existing presets** - Use `createVignelliQuote`, `createStatementPoster`, etc. as starting points
3. **Respect Swiss design rules** - Left-aligned text, limited colors, strong hierarchy
4. **Use spacing tokens** - Gap values are keys like `4`, `6`, `8` (maps to 16px, 24px, 32px)
5. **Theme tokens for colors** - Use `'foreground'`, `'accent'` rather than hardcoded hex when possible
