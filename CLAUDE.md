# Swiss Content Generator - AI Instructions

## Project Purpose

Generate Swiss-style LinkedIn post illustrations using a declarative visual language. The system provides composable primitives that can be combined to create various poster layouts.

## Project Structure

```
social-post-image/
├── packages/
│   ├── primitives/      # @swiss/primitives - Design tokens & atomic components
│   ├── composer/        # @swiss/composer - Layout composition & presets
│   ├── renderer/        # @swiss/renderer - Puppeteer PNG generation
│   └── cli/             # @swiss/cli - Command-line interface
├── apps/
│   └── ui/              # React SPA for interactive design
├── output/              # Generated images
└── references/          # Visual reference images
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
| `header` | Compound header | `title`, `subtitle`, `columns` |
| `footer` | Compound footer | `author`, `seriesNumber`, `showDots` |

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

## Preset Functions

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

### `createEventPoster(options)`
Event information with slash separators
```typescript
createEventPoster({
  title: 'Event Name',
  date: 'FEB 21ST',
  venue: 'Venue Name',
  timeSlots: [{ label: 'Doors', time: '6PM' }],
  priceTiers: [{ label: 'Members', price: 'FREE' }],
  theme: 'monochrome'
})
```

## Commands

```bash
# Install dependencies
pnpm install

# Start UI development server
pnpm dev

# Generate image from CLI
pnpm generate --preset vignelli-quote --quote "Your quote" --emphasis "Key phrase" --author "Name" -o poster.png

# List available presets and themes
pnpm --filter @swiss/cli list

# Build all packages
pnpm build
```

## Creating Custom Definitions

For complex layouts, create a JSON file:

```json
{
  "canvas": { "preset": "linkedin-portrait" },
  "theme": { "preset": "swiss-red", "overrides": { "accent": "#FF5500" } },
  "root": {
    "type": "stack",
    "direction": "vertical",
    "gap": 8,
    "children": [
      {
        "type": "text",
        "content": "CUSTOM HEADLINE",
        "variant": "hero",
        "color": "accent"
      },
      { "type": "spacer", "size": "flex" },
      { "type": "divider" },
      {
        "type": "footer",
        "author": "Designer Name",
        "seriesNumber": 1
      }
    ]
  }
}
```

Then generate:
```bash
pnpm generate -i poster.json -o output.png
```

## Important Files

- `packages/composer/src/types.ts` - Full declarative language schema
- `packages/primitives/src/themes/` - Theme definitions
- `packages/primitives/src/tokens/` - Design tokens
- `packages/composer/src/presets/` - Preset template functions
- `apps/ui/src/context/DesignContext.tsx` - UI state management

## Tips for AI Usage

1. **Always use the declarative schema** - Define posters as `PosterDefinition` objects
2. **Reference existing presets** - Use `createVignelliQuote`, `createStatementPoster`, etc. as starting points
3. **Respect Swiss design rules** - Left-aligned text, limited colors, strong hierarchy
4. **Use spacing tokens** - Gap values are keys like `4`, `6`, `8` (maps to 16px, 24px, 32px)
5. **Theme tokens for colors** - Use `'foreground'`, `'accent'` rather than hardcoded hex when possible
