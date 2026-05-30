# Tailwind CSS 4 Setup

## Current Configuration

The frontend uses Tailwind CSS v4 via `@tailwindcss/postcss`. Unlike Tailwind v3 which used a `tailwind.config.js` file, v4 moves configuration into CSS using `@theme` directives.

### PostCSS Config

```javascript
// postcss.config.mjs
const config = {
    plugins: {
        "@tailwindcss/postcss": {},
    },
};

export default config;
```

### CSS Entry Point

All Tailwind configuration happens in the global CSS file:

```css
/* src/shared/presentation/styles/globals.css */
@import "tailwindcss";

@layer base {
    :root {
        /* Design tokens (see theming.md) */
    }

    .dark {
        /* Dark mode overrides */
    }
}

@theme {
    /* Map CSS variables to Tailwind utilities */
    --color-brand-primary: rgb(var(--brand-primary));
    --color-brand-secondary: rgb(var(--brand-secondary));
    /* ... */
}
```

### Import in Root Layout

```typescript
// app/layout.tsx
import "@/shared/presentation/styles/globals.css";
```

## Tailwind v4 vs v3

The dashboard does NOT use Tailwind. It uses SCSS modules + Ant Design's ConfigProvider for theming. Tailwind is only used on the frontend. If you have used Tailwind v3 on other projects, here are the key differences in v4:

| Feature | Tailwind v3 | Tailwind v4 |
| --- | --- | --- |
| Config | `tailwind.config.js` | `@theme` in CSS |
| Plugins | `require()` in config | `@plugin` in CSS |
| Custom colors | `theme.extend.colors` | `@theme { --color-*: ... }` |
| Content scanning | `content: ['./src/**/*.tsx']` | Automatic detection |
| CSS imports | `@tailwind base/components/utilities` | `@import "tailwindcss"` |

## Plugins

### Typography Plugin

The dashboard uses a TipTap rich text editor to create article and video content. TipTap outputs raw HTML with standard tags (`<h1>`, `<h2>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`, `<a>`, `<img>`, `<iframe>` for YouTube embeds, etc.). The backend stores this HTML as-is in the `body` column. No markdown, no custom format, just plain HTML.

On the frontend, when you render this HTML (via `dangerouslySetInnerHTML` or a sanitized parser), the tags have no styling because Tailwind's preflight resets all default browser styles. A `<h1>` looks the same size as a `<p>`. Lists have no bullets. Links have no color.

The `@tailwindcss/typography` plugin solves this. It provides a `prose` class that applies sensible typographic defaults to vanilla HTML content: heading sizes, paragraph spacing, list markers, link colors, blockquote styling, code blocks, image margins, and table formatting. You wrap the article body in `<div class="prose">` and everything looks like a properly formatted article without writing any custom CSS.

```bash
yarn add @tailwindcss/typography
```

```css
@plugin "@tailwindcss/typography";
```

Usage:

```html
<article class="prose prose-lg prose-neutral dark:prose-invert max-w-none">
    <div dangerouslySetInnerHTML={{ __html: article.body }} />
</article>
```

### Container Queries (if needed)

```bash
yarn add @tailwindcss/container-queries
```

## Biome Integration

The `biome.json` includes Tailwind directive support:

```json
"css": {
    "parser": {
        "cssModules": true,
        "tailwindDirectives": true
    }
}
```

This prevents Biome from flagging `@import "tailwindcss"`, `@theme`, and `@layer` as errors.
