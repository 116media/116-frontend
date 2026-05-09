# Typography

## Font Families

The 116 platform uses three font families. The UI uses a sans-serif, but article content uses serif fonts for a magazine-style reading experience. This matches exactly how the dashboard renders article previews in `ArticlePreview/index.module.scss`.

### Outfit (UI Font)

**Outfit** is the primary font for navigation, cards, buttons, labels, and everything that is not article content. It is a geometric sans-serif used across all 116 apps (dashboard, frontend, mobile).

### Playfair Display (Article Titles)

**Playfair Display** is used for article titles only. It is a high-contrast serif with a strong editorial feel. The dashboard uses it in the article preview with `font-family: "Playfair Display", Georgia, serif` on the title.

### Merriweather (Article Body and Headline)

**Merriweather** is used for article body text and the headline summary. It is a serif font optimized for screen reading with generous x-height and open letterforms. The dashboard uses it for both the headline (styled with a left border and brand-colored background) and the full body content.

### Where This Comes From

In the dashboard, `ArticlePreview/index.module.scss` defines:

```scss
// Article title: editorial serif
.articlePreview__title {
    font-family: "Playfair Display", Georgia, serif;
}

// Article headline: readable serif with brand accent
.articlePreview__headline {
    font-family: "Merriweather", Georgia, serif;
    font-size: 12pt;
    line-height: 1.8;
    border-left: 8px solid $primary;
    background-color: rgba($primary, 0.05);
}

// Article body: same readable serif
.articlePreview__body {
    font-family: "Merriweather", Georgia, serif;
}
```

The frontend must replicate this exact typographic hierarchy so articles look consistent whether viewed in the dashboard preview or on the public site.

### Loading in Next.js

Use `next/font/google` for all three fonts. This self-hosts the fonts (no external Google Fonts requests), eliminates layout shift, and optimizes loading:

```typescript
// app/layout.tsx
import { Outfit, Playfair_Display, Merriweather } from "next/font/google";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif-display",
    display: "swap",
    weight: ["400", "500", "700"],
});

const merriweather = Merriweather({
    subsets: ["latin"],
    variable: "--font-serif-body",
    display: "swap",
    weight: ["300", "400", "700", "900"],
});

export default function RootLayout({ children }) {
    return (
        <html
            lang="fr"
            className={`${outfit.variable} ${playfairDisplay.variable} ${merriweather.variable}`}
        >
            <body>{children}</body>
        </html>
    );
}
```

### Tailwind Integration

Map the CSS variables to Tailwind utility classes:

```css
@theme {
    --font-family-sans: var(--font-sans);
    --font-family-serif-display: var(--font-serif-display);
    --font-family-serif-body: var(--font-serif-body);
}
```

Then use in components:

```html
<!-- UI elements use sans (default) -->
<nav class="font-sans">...</nav>

<!-- Article title uses Playfair Display -->
<h1 class="font-serif-display text-4xl font-bold">Fally Ipupa Interview</h1>

<!-- Article headline uses Merriweather with brand accent -->
<p class="font-serif-body text-base leading-loose border-l-8 border-brand-primary bg-brand-primary/5 px-4 py-3">
    An exclusive behind-the-scenes interview...
</p>

<!-- Article body uses Merriweather -->
<article class="font-serif-body prose prose-lg">
    ...
</article>
```

### Monospace

For code blocks and technical content, use JetBrains Mono:

```typescript
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});
```

## Type Scale

Use Tailwind's default type scale with these guidelines:

| Element | Class | Size | Weight | Usage |
| --- | --- | --- | --- | --- |
| Page Title | `text-3xl md:text-4xl font-bold` | 30px / 36px | 700 | Article title, video title |
| Section Heading | `text-2xl font-semibold` | 24px | 600 | Section titles on home page |
| Card Title | `text-lg font-semibold` | 18px | 600 | Article card, video card |
| Body | `text-base` | 16px | 400 | Article body, descriptions |
| Small | `text-sm` | 14px | 400 | Metadata, timestamps, captions |
| Caption | `text-xs text-muted-foreground` | 12px | 400 | Tags, view counts, badges |

## Article Body Typography

Article body content comes as raw HTML from the backend (produced by TipTap in the dashboard). The article detail page must use the serif fonts and the `prose` plugin together:

```html
<!-- Article title: Playfair Display -->
<h1 class="font-serif-display text-3xl md:text-4xl font-bold">
    {article.title}
</h1>

<!-- Headline summary: Merriweather with brand accent -->
<p class="font-serif-body text-base leading-loose border-l-8 border-brand-primary bg-brand-primary/5 px-4 py-3 text-muted-foreground">
    {article.headline}
</p>

<!-- Body: Merriweather with prose plugin for HTML styling -->
<article class="font-serif-body prose prose-lg prose-neutral dark:prose-invert max-w-none">
    <div dangerouslySetInnerHTML={{ __html: article.body }} />
</article>
```

The `prose` classes handle:

- Paragraph spacing
- Heading hierarchy (h1 through h6)
- Link styling with brand color
- List styling (ordered and unordered)
- Blockquote styling
- Code block styling
- Image margins and captions
- Table styling

### Customizing Prose

Override specific prose elements to match the 116 brand and ensure the article body uses Merriweather:

```css
@layer base {
    .prose {
        --tw-prose-links: rgb(var(--brand-primary));
        --tw-prose-headings: rgb(var(--foreground));
        --tw-prose-body: rgb(var(--foreground));
        --tw-prose-bold: rgb(var(--foreground));
    }

    /* Images inside article body: full width, rounded */
    .prose img {
        width: 100%;
        object-fit: cover;
        border-radius: 0.5rem;
    }

    /* YouTube embeds inside article body: responsive */
    .prose div[data-youtube-video] iframe {
        width: 100% !important;
        aspect-ratio: 16 / 9;
        border-radius: 0.5rem;
    }
}
```

These overrides match the dashboard's `ArticlePreview` styles: full-width images with rounded corners and responsive YouTube embeds.

## Language Considerations

The platform content is primarily in French. French text tends to be 15-20% longer than English. Account for this in:

- Button labels: leave room for longer French words
- Card titles: use `line-clamp-2` instead of `line-clamp-1`
- Navigation items: test with actual French labels, not English placeholders

Set the HTML lang attribute:

```html
<html lang="fr">
```

This tells browsers and screen readers to use French language rules for hyphenation, quotes, and pronunciation.
