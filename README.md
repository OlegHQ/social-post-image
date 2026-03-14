# social-post-image

Generate beautiful Swiss-style social media images for LinkedIn, Twitter, Instagram, and blog posts. Built with Next.js, powered by a declarative visual language.

**[Live Demo →](https://social-post-image.vercel.app)**

## Features

- **8 Poster Presets** — Statement, Quote (Vignelli), Typography Showcase, Hot Take, Announcement, Showcase, Content Grid, Feature
- **13 Themes** — Swiss Red, Klein Blue, Monochrome, Vignelli Gold, Midnight Gold, Brutalist Concrete, Tech Terminal, and more
- **5 Canvas Sizes** — LinkedIn portrait/square, Instagram portrait/square, Twitter cards
- **Declarative API** — Define posters as composable JSON structures using primitives (text, box, stack, grid, divider, spacer)
- **Live Preview** — Real-time editing with sidebar controls
- **One-Click Export** — Download as PNG via `html-to-image`
- **Swiss Design Rules** — Left-aligned typography, limited color palettes, strong hierarchy, grid-based layouts

## Quick Start

```bash
# Install
pnpm install

# Set up env
cp .env.local.example .env.local
# Edit .env.local with your AUTH_PASSWORD and AUTH_SECRET

# Run
pnpm dev
```

## Presets

| Preset | Description |
|--------|-------------|
| `createStatementPoster` | Simple bold headline poster |
| `createVignelliQuote` | Quote with emphasis phrase, Massimo Vignelli style |
| `createTypographyShowcase` | Large letterform typography poster |
| `createHotTakePoster` | Contrarian statement / unpopular opinion |
| `createAnnouncementPoster` | Article or launch announcement |
| `createShowcasePoster` | Primary/secondary headings with info columns |
| `createContentGridPoster` | Content blocks in 2-column grid layout |
| `createFeatureShowcase` | Giant keyword poster |

## Declarative Language

Posters are defined as `PosterDefinition` objects using composable primitives:

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
      { type: 'text', content: 'Supporting text', variant: 'subhead' },
      { type: 'spacer', size: 'flex' },
      { type: 'divider' },
      { type: 'footer', author: 'Name', seriesNumber: 1 }
    ]
  }
};
```

### Primitives

| Type | Description |
|------|-------------|
| `text` | Typography with variants (hero, display, headline, title, subhead, body, label, meta) |
| `box` | Container with padding, border, background color |
| `stack` | Flexbox layout (vertical/horizontal) |
| `grid` | CSS Grid with columns, rows, areas |
| `divider` | Horizontal rule |
| `spacer` | Empty space (fixed or flex) |

## Themes

| Theme | Style |
|-------|-------|
| `swiss-red` | Classic Swiss — light gray bg, red accent |
| `klein-blue` | International style — white bg, Klein blue |
| `monochrome` | Pure black & white |
| `vignelli-gold` | Dark bg, gold accent |
| `vignelli-cream` | Cream bg, crimson accent |
| `neue-teal` | Teal bg, coral accent |
| `orange-energy` | Warm white bg, orange accent |
| `midnight-gold` | Dark luxury |
| `forest-contrast` | Forest green bg, coral accent |
| `brutalist-concrete` | Concrete gray bg, orange accent |
| `tech-terminal` | Dark bg, green accent |
| `paper-ink` | Editorial paper feel |
| `swiss-red-inverted` | Red bg, white accent |

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **html-to-image** for PNG export
- **NextAuth** for password-protected access
- **Zod** for schema validation

## Requirements

- Node.js >= 18

## License

MIT
